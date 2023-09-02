<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { Debug, World } from '@threlte/rapier';

	import Root from '@3d/scenes/Root.svelte';
</script>

<Canvas
	frameloop="always"
	rendererParameters={{
		// don't change! these are required for postprocessing to work properly

		powerPreference: 'high-performance',
		antialias: false,
		stencil: false,
		depth: false
	}}
>
	<World>
		<Debug />
		<Root />
	</World>
</Canvas>

<style>
	:global(body) {
		margin: 0;
		background: rgb(13, 19, 32);
	}

	:global(canvas) {
		display: flex;
		flex-direction: column;
		height: 100vh;
		left: 0;
		margin: 0;
		min-height: 100vh;
		padding: 0;
		position: fixed;
		top: 0;
		width: 100vw;
	}
</style>
