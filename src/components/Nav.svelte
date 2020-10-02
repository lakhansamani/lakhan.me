<script>
	export let segment;
</script>

<style>
	.nav {
		height: 70px;
	}
</style>

<div class="nav z-50 flex flex-no-wrap justify-between items-center w-full" >
	<div class="flex-initial"><a class="font-bold text-lg lg:text-2xl text-yellow-500" href=".">&lt;lakhan.me /&gt;</a></div>
	<ul class="flex-initial list-none flex">
		<li class={segment === undefined ? "text-yellow-500 pr-5" : "pr-5"}><a aria-current="{segment === undefined ? 'page' : undefined}" href=".">Home</a></li>
		<li class={segment === 'about' ? "text-yellow-500 pr-5" : "pr-5"}><a aria-current="{segment === 'about' ? 'page' : undefined}" href="about">About</a></li>

		<!-- for the blog link, we're using rel=prefetch so that Sapper prefetches
		     the blog data when we hover over the link or tap it on a touchscreen -->
		<li class={segment === 'blog' ? "text-yellow-500 pr-5" : "pr-5"}><a rel=prefetch aria-current="{segment === 'blog' ? 'page' : undefined}" href="blog">Blog</a></li>
	</ul>
</div>
