import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import Head from 'next/head';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// /* Use `…/dist/cjs/…` if you’re not in ESM! */
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import rehypeRaw from 'rehype-raw';

import { getPostBySlug, getAllPosts } from '../../utils/posts';
import Layout from '../../components/Layout';
import PostType from '../../types/post';

const components = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <SyntaxHighlighter
        style={tomorrow}
        language={match[1]}
        PreTag="div"
        children={String(children).replace(/\n$/, '')}
        showLineNumbers
        {...props}
      />
    ) : (
      <code className="inline-code" {...props}>
        {children}
      </code>
    );
  },
};

type Props = {
  post: PostType;
  morePosts: PostType[];
  preview?: boolean;
};

const Post = ({ post, morePosts, preview }: Props) => {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <Layout title={post.title}>
      <h3>
        <Link href="/">← Lakhan Samani | Digital Garden</Link>
      </h3>
      {router.isFallback ? (
        <h1>Loading…</h1>
      ) : (
        <>
          <article className="blog">
            <Head>
              <title>{post.title}</title>
              <meta property="og:image" content={post.ogImage.url} />
              <meta name="description" content={post.excerpt} />
            </Head>
            <h1>{post.title}</h1>
            {/** @ts-ignore */}
            <ReactMarkdown components={components} rehypePlugins={[rehypeRaw]}>
              {post.content}
            </ReactMarkdown>
          </article>
        </>
      )}
    </Layout>
  );
};

export default Post;

type Params = {
  params: {
    slug: string;
  };
};

export async function getStaticProps({ params }: Params) {
  const post = getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'author',
    'content',
    'ogImage',
    'coverImage',
    'excerpt',
  ]);

  return {
    props: {
      post,
    },
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts(['slug']);

  return {
    paths: posts.map((posts) => {
      return {
        params: {
          slug: posts.slug,
        },
      };
    }),
    fallback: false,
  };
}
