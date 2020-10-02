<script>
	import Nav from '../components/Nav.svelte';
	import Footer from '../components/Footer.svelte';

	export let segment;
</script>

<style>
	.content {
		padding: 70px 0;
	}
</style>


<div class="app-container">
	<Nav {segment}/>
	<div class="content">
		<slot></slot>
	</div>
</div>

<Footer />
