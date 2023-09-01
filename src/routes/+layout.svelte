<script lang="ts">
	import Root from '@3d/scenes/Root.svelte';
	import { Canvas } from '@threlte/core';
	import { onMount } from 'svelte';

	let webSocketEstablished = false;
	let ws: WebSocket | null = null;
	let log: string[] = [];

	const logEvent = (str: string) => {
		log = [...log, str];
	};

	onMount(() => {
		console.log($$slots);
	});

	const establishWebSocket = () => {
		if (webSocketEstablished) return;
		const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
		ws = new WebSocket(`${protocol}//${window.location.host}/websocket`);
		ws.addEventListener('open', (event) => {
			webSocketEstablished = true;
			console.log('[websocket] connection open', event);
			logEvent('[websocket] connection open');
		});
		ws.addEventListener('close', (event) => {
			console.log('[websocket] connection closed', event);
			logEvent('[websocket] connection closed');
		});
		ws.addEventListener('message', (event) => {
			console.log('[websocket] message received', event);
			logEvent(`[websocket] message received: ${event.data}`);
		});
	};
</script>

<div>
	<Canvas size={{ width: window.innerWidth, height: window.innerHeight }}>
		<Root>
			<slot />
		</Root>
	</Canvas>
</div>

<style>
	:global(body) {
		margin: 0;
	}

	div {
		position: fixed;
		z-index: 0;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgb(13, 19, 32);
		background: linear-gradient(180deg, rgba(13, 19, 32, 1) 0%, rgba(8, 12, 21, 1) 100%);
	}
</style>
