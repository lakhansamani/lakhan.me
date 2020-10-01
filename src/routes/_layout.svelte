<script>
	import Nav from '../components/Nav.svelte';

	export let segment;
</script>

<style>
	.content {
		max-width: 80ch;
		margin: auto;
		padding: 0 1rem;
	}
</style>

<!-- <Nav {segment}/> -->

<div class="content">
	<slot></slot>
</div>
