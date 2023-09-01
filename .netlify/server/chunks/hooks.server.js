import { d as building } from "./internal.js";
import "url";
import "ws";
const GlobalThisWSS = Symbol.for("sveltekit.wss");
let wssInitialized = false;
const startupWebsocketServer = () => {
  if (wssInitialized)
    return;
  console.log("[wss:kit] setup");
  const wss = globalThis[GlobalThisWSS];
  if (wss !== void 0) {
    wss.on("connection", (ws, _request) => {
      console.log(`[wss:kit] client connected (${ws.socketId})`);
      ws.send(`Hello from SvelteKit ${(/* @__PURE__ */ new Date()).toLocaleString()} (${ws.socketId})]`);
      ws.on("close", () => {
        console.log(`[wss:kit] client disconnected (${ws.socketId})`);
      });
    });
    wssInitialized = true;
  }
};
const handle = async ({ event, resolve }) => {
  startupWebsocketServer();
  if (!building) {
    const wss = globalThis[GlobalThisWSS];
    if (wss !== void 0) {
      event.locals.wss = wss;
    }
  }
  const response = await resolve(event, {
    filterSerializedResponseHeaders: (name) => name === "content-type"
  });
  return response;
};
export {
  handle
};
