<script context="module">
	export async function preload({ params }) {
		// the `slug` parameter is available because
		// this file is called [slug].svelte
		const res = await this.fetch(`https://dev.to/api/articles/lakhansamani/${params.slug}`);
		const data = await res.json();

		if (res.status === 200) {
			return { post: data };
		} else {
			this.error(res.status, data.message);
		}
	}
</script>

<script>
	export let post;
</script>

<style>
	/*
		By default, CSS is locally scoped to the component,
		and any unused styles are dead-code-eliminated.
		In this page, Svelte can't know which elements are
		going to appear inside the {{{post.html}}} block,
		so we have to use the :global(...) modifier to target
		all elements inside .content
	*/

	.content :global(pre) {
		margin: 1.25rem 0;
	}

	.content :global(p) {
		margin-bottom: 2.5rem;
	}

	.content :global(a) {
		color: var(--text-link);
	}

	.content :global(h3) {
		font-size: 1.5rem;
		margin-bottom: 5px;
		font-weight: bolder;
	}

	.content :global(h2) {
		font-size: 1.8rem;
		margin-bottom: 5px;
		font-weight: bolder;
	}

	.content :global(pre) {
		background-color: #133b5c;
		box-shadow: inset 1px 1px 5px rgba(0, 0, 0, 0.05);
		padding: 0.5em;
		border-radius: 2px;
		overflow-x: auto;
	}

	.content :global(pre) :global(code) {
		background-color: transparent;
		padding: 0;
	}

	.content :global(ul) {
		line-height: 1.5;
	}

	.content :global(li) {
		margin: 0 0 0.5em 0;
	}
</style>

<svelte:head>
	<title>{post.title} | Lakhan Samani</title>
	<meta property="og:url" content={`https://www.lakhan.me/blog/${post.slug}`} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={post.title} />
	<meta name="Description" content={post.description} />
	<meta property="og:description" content={post.description} />
	<meta property="og:image" content="https://www.lakhan.me/images/profile.jpg" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:creator" content="https://twitter.com/lakhansamani/" />
	<meta name="twitter:title" content={post.title} />
	<meta name="twitter:description" content={post.description} />
	<meta name="twitter:image" content="https://www.lakhan.me/images/profile.jpg" />
</svelte:head>

<h1 class="text-center text-4xl lg:text-5xl font-bold text-yellow-500 mb-5">{post.title}</h1>
<ul class="flex flex-wrap">
	{#each post.tags as tag}
		<li class="mr-3 mb-1 bg-yellow-300 p-1 text-gray-900 rounded-md text-sm"><code>#{tag}</code></li>
	{/each}
</ul>
<div class="content text-xl">
	{@html post.body_html}
</div>
