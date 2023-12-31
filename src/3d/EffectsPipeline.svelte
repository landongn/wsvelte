<script lang="ts">
	import { useRender, useThrelte } from '@threlte/core';
	import {
		EffectComposer,
		EffectPass,
		FXAAEffect,
		KernelSize,
		RenderPass,
		SelectiveBloomEffect
	} from 'postprocessing';
	import type { Camera } from 'three';

	const { scene, renderer, camera } = useThrelte();

	// To use the EffectComposer we need to pass arguments to the
	// default WebGLRenderer: https://github.com/pmndrs/postprocessing#usage
	const composer = new EffectComposer(renderer);

	const setupEffectComposer = (camera: Camera) => {
		composer.removeAllPasses();
		composer.addPass(new RenderPass(scene, camera));
		composer.addPass(new EffectPass(camera, new FXAAEffect()));
		composer.addPass(new EffectPass(camera));
		composer.addPass(
			new EffectPass(
				camera,
				new SelectiveBloomEffect(scene, camera, {
					intensity: 0.2,
					luminanceThreshold: 0.15,
					height: 512,
					width: 512,
					luminanceSmoothing: 0.08,
					mipmapBlur: true,
					kernelSize: KernelSize.SMALL
				})
			)
		);
	};

	// We need to set up the passes according to the camera in use
	$: setupEffectComposer($camera);

	useRender((_, delta) => {
		composer.render(delta);
	});
</script>
