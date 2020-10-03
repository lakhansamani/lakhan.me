<script>
	import GoogleAnalytics from "sapper-google-analytics/GoogleAnalytics.svelte"
	import { stores } from "@sapper/app"
	import Nav from '../components/Nav.svelte';
	import Footer from '../components/Footer.svelte';

	export let segment;
	let ga_measurment_id = "UA-179539758-1"
</script>

<style>
	.content {
		padding: 70px 0;
	}
</style>

<GoogleAnalytics {stores} id={ga_measurment_id}/>


<div class="app-container">
	<Nav {segment}/>
	<div class="content">
		<slot></slot>
	</div>
</div>

<Footer />
