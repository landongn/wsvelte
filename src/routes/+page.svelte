<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { Debug, World } from '@threlte/rapier';

	import { autoRotate, showCollider } from '$lib/settings';
	import { useTweakpane } from '$lib/useTweakpane';
	import Scene from '@3d/scenes/Scene.svelte';
	// add tweakpane to show or hide the terrain collision mesh
	const { action, addButton } = useTweakpane();
	addButton({
		title: 'toggle',
		label: 'Show Collider',
		onClick: () => {
			$showCollider = !$showCollider;
		}
	});
	addButton({
		title: 'toggle',
		label: 'AutoRotate',
		onClick: () => {
			$autoRotate = !$autoRotate;
		}
	});
</script>

<div class="rndr">
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
			<Debug visible={$showCollider} />
			<Scene />
		</World>
	</Canvas>
</div>
<div use:action />

<style>
	:global(body) {
		margin: 0;
		background: rgb(13, 19, 32);
	}

	.rndr {
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
