<script context="module" lang="ts">
	import CameraControls from 'camera-controls';
	import {
		Box3,
		MathUtils,
		Matrix4,
		PerspectiveCamera,
		Quaternion,
		Raycaster,
		Sphere,
		Spherical,
		Vector2,
		Vector3,
		Vector4
	} from 'three';

	const subsetOfTHREE = {
		Vector2: Vector2,
		Vector3: Vector3,
		Vector4: Vector4,
		Quaternion: Quaternion,
		Matrix4: Matrix4,
		Spherical: Spherical,
		Box3: Box3,
		Sphere: Sphere,
		Raycaster: Raycaster
	};

	CameraControls.install({ THREE: subsetOfTHREE });
</script>

<script lang="ts">
	import { T, currentWritable, useRender, useThrelte } from '@threlte/core';
	import { GLTF, Grid, useGltfAnimations } from '@threlte/extras';
	import CustomRenderer from '../EffectsPipeline.svelte';
	const { renderer, frameloop } = useThrelte();
	frameloop.set('always');
	const { gltf, actions } = useGltfAnimations();

	let MainCamera: CameraControls;
	let pCam: PerspectiveCamera;
	let camLoaded = false;
	function cameraCreated({ ref }: { ref: PerspectiveCamera }) {
		if (camLoaded) {
			return;
		}
		pCam = ref;

		camLoaded = true;
		console.log(renderer.domElement);
		MainCamera = new CameraControls(ref, renderer.domElement);

		MainCamera.addEventListener('controlstart', (event) => {
			console.log('controlstart camera update', event);
		});

		MainCamera.addEventListener('control', (event) => {
			console.log('control camera update', event);
		});

		MainCamera.addEventListener('controlend', (event) => {
			console.log('controlend camera update', event);
		});

		MainCamera.addEventListener('transitionstart', (event) => {
			console.log('transitionstart camera update', event);
		});

		MainCamera.addEventListener('wake', (event) => {
			console.log('wake camera update', event);
		});

		// MainCamera.moveTo(0, -10, 0);
		// MainCamera.lookInDirectionOf(0, 0, 0, true);
		MainCamera.rotateAzimuthTo(10 * MathUtils.DEG2RAD, true);
		MainCamera.rotatePolarTo(35 * MathUtils.DEG2RAD, true);
	}

	useRender((ctx, delta) => {
		dayNightUpdateValue.set(dayNightUpdate(delta));
		MainCamera.update(delta);
	});

	const dayNightUpdateValue = currentWritable(0);
	function dayNightUpdate(delta: number) {
		const result =
			(-2 * Math.abs(gameHours * 3600 + gameMinutes * 60 + seconds - 12 * 3600)) / 3600 + 1;
	}

	$: $actions['idle']?.play();
</script>

<T.PerspectiveCamera
	position={[0, 10, 0]}
	name="mainCamera"
	makeDefault
	fov={50}
	on:create={cameraCreated}
/>

<GLTF bind:gltf={$gltf} url="/castle/banner.glb" />

<T.DirectionalLight intensity={1.8} position.x={5} position.y={$dayNightUpdateValue} />
<T.AmbientLight />

<Grid
	gridSize={24}
	position={[0, 0, 0]}
	cellColor="#ffffff"
	sectionColor="#ffffff"
	sectionThickness={0}
	fadeDistance={25}
/>

<CustomRenderer />
