import type { ExtendedWebSocketServer } from '$lib/server';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			wss?: ExtendedWebSocketServer;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
