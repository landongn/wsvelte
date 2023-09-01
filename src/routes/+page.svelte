<script lang="ts">
	import { useThrelte } from '@threlte/core';
	import { onMount } from 'svelte';

	const ctx = useThrelte();

	onMount(() => {
		console.log('context!', ctx);
	});
</script>

<h1>hi, welcome to wsvelte</h1>
