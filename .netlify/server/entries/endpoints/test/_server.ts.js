import { j as json } from "../../../chunks/index.js";
const GET = async ({ url, locals }) => {
  if (locals.wss) {
    locals.wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(`Hello from the GET handler at ${(/* @__PURE__ */ new Date()).toLocaleString()}`);
      }
    });
  }
  return json({ success: true, message: "Hello world from GET handler", url });
};
export {
  GET
};
