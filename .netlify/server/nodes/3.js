

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/test/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.b3e344ba.js","_app/immutable/chunks/scheduler.dcbea5c6.js","_app/immutable/chunks/index.54bf86ca.js"];
export const stylesheets = [];
export const fonts = [];
