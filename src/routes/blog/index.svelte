<script context="module">
	export function preload() {
		return this.fetch(`https://dev.to/api/articles?username=lakhansamani`).then(r => r.json()).then(posts => {
			return { posts };
		});
	}
</script>

<script>
	export let posts;
</script>

<style>
	ul {
		margin: 0 0 1em 0;
		line-height: 1.5;
	}
</style>

<svelte:head>
	<meta property="og:url" content="https://www.lakhan.me/blog/" />
	<meta property="og:type" content="article" />
	<meta property="og:title" content="Blog | Lakhan Samani" />
	<meta name="Description" content="Lakhan Samani's blog posts" />
	<meta property="og:description" content="Lakhan Samani's blog posts" />
	<meta property="og:image" content="https://www.lakhan.me/images/profile.jpg" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:creator" content="https://twitter.com/lakhansamani/" />
	<meta name="twitter:title" content="Blog | Lakhan Samani" />
	<meta name="twitter:description" content="Lakhan Samani's blog posts" />
	<meta name="twitter:image" content="https://www.lakhan.me/images/profile.jpg" />
</svelte:head>

<ul>
	{#each posts as post}
		<!-- we're using the non-standard `rel=prefetch` attribute to
				tell Sapper to load the data for the page as soon as
				the user hovers over the link or taps it, instead of
				waiting for the 'click' event -->
		<li class="mb-10 border-yellow-300 rounded-md p-5 border-2">
			<a rel="prefetch" href="blog/{post.slug}">
				<h2 class="text-xl font-bold text-yellow-500">{post.title}</h2>
				<p class="text-lg mt-1 mb-5">
					{post.description}
				</p>
				<ul class="flex flex-wrap">
					{#each post.tag_list as tag}
						<li class="mr-3 mb-1 bg-yellow-300 p-1 text-gray-900 rounded-md text-sm"><code>#{tag}</code></li>
					{/each}
				</ul>
			</a>
		</li>
	{/each}
</ul>
