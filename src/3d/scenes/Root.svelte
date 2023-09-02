<script lang="ts">
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

	import { T, useRender } from '@threlte/core';
	import { interactivity } from '@threlte/extras';

	import { useThrelte } from '@threlte/core';
	import { Grid } from '@threlte/extras';
	const { renderer } = useThrelte();
	interactivity();

	let MainCamera: CameraControls;
	let pCam: PerspectiveCamera;
	let camLoaded = false;
	function cameraCreated({ ref }: { ref: PerspectiveCamera }) {
		if (camLoaded) {
			return;
		}
		pCam = ref;

		camLoaded = true;
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

		MainCamera.rotateAzimuthTo(10 * MathUtils.DEG2RAD, true);
		MainCamera.rotatePolarTo(35 * MathUtils.DEG2RAD, true);
	}

	useRender((ctx, delta) => {
		MainCamera.update(delta);
	});

	function captureEvent(event: any) {
		console.log('input event', event);
	}
</script>

<T.PerspectiveCamera
	name="mainCamera"
	makeDefault
	fov={80}
	on:create={cameraCreated}
	position={[0, 0, 0]}
/>

<T.DirectionalLight position={[3, 10, 7]} />

<Grid
	gridSize={[24, 48]}
	position={[0, 0, 0]}
	cellColor="#ffffff"
	sectionColor="#ffffff"
	sectionThickness={1}
	cellSize={1}
	fadeDistance={250}
/>
