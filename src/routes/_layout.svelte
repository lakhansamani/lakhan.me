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
	.content-container {
		padding-top: 70px;
	}
</style>


<div class="content">
	<Nav {segment}/>
	<div class="content-container">
		<slot></slot>
	</div>
</div>
