import { init } from '../serverless.js';

export const handler = init((() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.a41a1917.js","app":"_app/immutable/entry/app.17fc8661.js","imports":["_app/immutable/entry/start.a41a1917.js","_app/immutable/chunks/scheduler.dcbea5c6.js","_app/immutable/chunks/singletons.520ba546.js","_app/immutable/chunks/index.3b116a99.js","_app/immutable/entry/app.17fc8661.js","_app/immutable/chunks/scheduler.dcbea5c6.js","_app/immutable/chunks/index.54bf86ca.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('../server/nodes/0.js')),
			__memo(() => import('../server/nodes/1.js')),
			__memo(() => import('../server/nodes/3.js'))
		],
		routes: [
			{
				id: "/test",
				pattern: /^\/test\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: __memo(() => import('../server/entries/endpoints/test/_server.ts.js'))
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})());
