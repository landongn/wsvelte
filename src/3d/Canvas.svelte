<script lang="ts">
	import Scene from '@3d/scenes/Root.svelte';
	import { Canvas } from '@threlte/core';
</script>

<Canvas size={{ width: window.innerWidth, height: window.innerHeight }}>
	<Scene />
</Canvas>
