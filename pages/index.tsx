import Link from 'next/link';
import { format } from 'date-fns';

import Layout from '../components/Layout';
import { getAllPosts } from '../utils/posts';
import Post from '../types/post';

type Props = {
  posts: Post[];
};

const IndexPage = ({ posts }: Props) => {
  return (
    <Layout>
      <div
        style={{
          display: 'flex',
          margin: '2rem auto',
        }}
      >
        <img
          src="/images/profile.jpg"
          width="100"
          height="100"
          alt="Profile Picture"
          style={{
            marginLeft: '1rem',
          }}
        />
        <div style={{ paddingLeft: 25 }}>
          <p>
            Hi, I'm <b>Lakhan Samani</b>! I am independent Software Developer
            and Consultant based in India. I am passionate about building
            products and dev tools. You can know more about my work by following
            me on{' '}
            <a
              href={`https://twitter.com/lakhansamani`}
              target="_blank"
              rel="noreferrer"
            >
              Twitter
            </a>{' '}
            and{' '}
            <a
              href="https://github.com/lakhansamani"
              target="_blank"
              rel="noreferrer"
            >
              Github
            </a>
          </p>
        </div>
      </div>
      <hr />
      <ul style={{ padding: 0 }}>
        {posts.map((post) => (
          <li className="post">
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            <p>{post.excerpt}</p>
            <p className="meta">{format(new Date(post.date), 'MMMM dd, yy')}</p>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default IndexPage;

export const getStaticProps = async () => {
  const allPosts = getAllPosts(['title', 'date', 'slug', 'author', 'excerpt']);

  return {
    props: { posts: allPosts },
  };
};
