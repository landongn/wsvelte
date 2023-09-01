import { n as noop, b as set_current_component, r as run_all, d as current_component, g as getContext, c as create_ssr_component, a as subscribe, s as setContext, o as onDestroy, v as validate_component, f as get_current_component, h as compute_rest_props, i as get_store_value, j as add_attribute, k as assign, l as identity, p as each, e as escape } from "../../chunks/ssr.js";
import { w as writable, d as derived, r as readable } from "../../chunks/index2.js";
import * as THREE from "three";
import { REVISION, PerspectiveCamera, Clock, Scene, WebGLRenderer, PCFSoftShadowMap, ColorManagement, sRGBEncoding, LinearEncoding, ACESFilmicToneMapping, Vector3, Color, ShaderMaterial, DoubleSide, Matrix4, Mesh } from "three";
import { OrbitControls as OrbitControls$1 } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer, RenderPass, OutlineEffect, BlendFunction, EffectPass } from "postprocessing";
const is_client = typeof window !== "undefined";
let now = is_client ? () => window.performance.now() : () => Date.now();
let raf = is_client ? (cb) => requestAnimationFrame(cb) : noop;
const tasks = /* @__PURE__ */ new Set();
function run_tasks(now2) {
  tasks.forEach((task) => {
    if (!task.c(now2)) {
      tasks.delete(task);
      task.f();
    }
  });
  if (tasks.size !== 0)
    raf(run_tasks);
}
function loop(callback) {
  let task;
  if (tasks.size === 0)
    raf(run_tasks);
  return {
    promise: new Promise((fulfill) => {
      tasks.add(task = { c: callback, f: fulfill });
    }),
    abort() {
      tasks.delete(task);
    }
  };
}
const dirty_components = [];
const binding_callbacks = [];
let render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = /* @__PURE__ */ Promise.resolve();
let update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function tick() {
  schedule_update();
  return resolved_promise;
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
const seen_callbacks = /* @__PURE__ */ new Set();
let flushidx = 0;
function flush() {
  if (flushidx !== 0) {
    return;
  }
  const saved_component = current_component;
  do {
    try {
      while (flushidx < dirty_components.length) {
        const component = dirty_components[flushidx];
        flushidx++;
        set_current_component(component);
        update(component.$$);
      }
    } catch (e) {
      dirty_components.length = 0;
      flushidx = 0;
      throw e;
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
const useThrelteInternal = () => {
  return getContext("threlte-internal-context");
};
const contextName = "threlte-disposable-object-context";
const DisposableObject = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $mergedDispose, $$unsubscribe_mergedDispose;
  let $parentDispose, $$unsubscribe_parentDispose;
  const { collectDisposableObjects, addDisposableObjects, removeDisposableObjects } = useThrelteInternal();
  let { object = void 0 } = $$props;
  let previousObject = object;
  let { dispose = void 0 } = $$props;
  const parentDispose = getContext(contextName);
  $$unsubscribe_parentDispose = subscribe(parentDispose, (value) => $parentDispose = value);
  const mergedDispose = writable(dispose ?? $parentDispose ?? true);
  $$unsubscribe_mergedDispose = subscribe(mergedDispose, (value) => $mergedDispose = value);
  setContext(contextName, mergedDispose);
  let disposables = $mergedDispose ? collectDisposableObjects(object) : [];
  addDisposableObjects(disposables);
  onDestroy(() => {
    removeDisposableObjects(disposables);
  });
  if ($$props.object === void 0 && $$bindings.object && object !== void 0)
    $$bindings.object(object);
  if ($$props.dispose === void 0 && $$bindings.dispose && dispose !== void 0)
    $$bindings.dispose(dispose);
  {
    mergedDispose.set(dispose ?? $parentDispose ?? true);
  }
  {
    {
      if (object !== previousObject) {
        removeDisposableObjects(disposables);
        disposables = $mergedDispose ? collectDisposableObjects(object) : [];
        addDisposableObjects(disposables);
        previousObject = object;
      }
    }
  }
  $$unsubscribe_mergedDispose();
  $$unsubscribe_parentDispose();
  return `${slots.default ? slots.default({}) : ``}`;
});
function createObjectStore(object, onChange) {
  const objectStore = writable(object);
  let unwrappedObject = object;
  const unsubscribeObjectStore = objectStore.subscribe((o) => unwrappedObject = o);
  onDestroy(unsubscribeObjectStore);
  const set = (newObject) => {
    if (newObject?.uuid === unwrappedObject?.uuid)
      return;
    const oldObject = unwrappedObject;
    objectStore.set(newObject);
    onChange?.(newObject, oldObject);
  };
  const update2 = (callback) => {
    const newObject = callback(unwrappedObject);
    if (newObject?.uuid === unwrappedObject?.uuid)
      return;
    const oldObject = unwrappedObject;
    objectStore.set(newObject);
    onChange?.(newObject, oldObject);
  };
  return {
    ...objectStore,
    set,
    update: update2
  };
}
const useThrelte = () => {
  const context = getContext("threlte");
  if (context === void 0) {
    throw new Error("No Threlte context found, are you using this hook inside of <Canvas>?");
  }
  return context;
};
const useParent = () => {
  return getContext("threlte-hierarchical-parent-context");
};
const useHierarchicalObject = () => {
  return {
    onChildMount: getContext("threlte-hierarchical-object-on-mount"),
    onChildDestroy: getContext("threlte-hierarchical-object-on-destroy")
  };
};
const HierarchicalObject = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $parentStore, $$unsubscribe_parentStore;
  let { object = void 0 } = $$props;
  let { children = [] } = $$props;
  let { onChildMount = void 0 } = $$props;
  const onChildMountProxy = (child) => {
    children.push(child);
    children = children;
    onChildMount?.(child);
  };
  let { onChildDestroy = void 0 } = $$props;
  const onChildDestroyProxy = (child) => {
    const index = children.findIndex((c) => c.uuid === child.uuid);
    if (index !== -1)
      children.splice(index, 1);
    children = children;
    onChildDestroy?.(child);
  };
  const { invalidate } = useThrelte();
  const parentStore = useParent();
  $$unsubscribe_parentStore = subscribe(parentStore, (value) => $parentStore = value);
  let { parent = $parentStore } = $$props;
  const parentCallbacks = useHierarchicalObject();
  if (object) {
    parentCallbacks.onChildMount?.(object);
    invalidate("HierarchicalObject: object added");
  }
  const objectStore = createObjectStore(object, (newObject, oldObject) => {
    if (oldObject) {
      parentCallbacks.onChildDestroy?.(oldObject);
      invalidate("HierarchicalObject: object added");
    }
    if (newObject) {
      parentCallbacks.onChildMount?.(newObject);
      invalidate("HierarchicalObject: object removed");
    }
  });
  onDestroy(() => {
    if (object) {
      parentCallbacks.onChildDestroy?.(object);
      invalidate("HierarchicalObject: object removed");
    }
  });
  setContext("threlte-hierarchical-object-on-mount", onChildMountProxy);
  setContext("threlte-hierarchical-object-on-destroy", onChildDestroyProxy);
  setContext("threlte-hierarchical-parent-context", objectStore);
  if ($$props.object === void 0 && $$bindings.object && object !== void 0)
    $$bindings.object(object);
  if ($$props.children === void 0 && $$bindings.children && children !== void 0)
    $$bindings.children(children);
  if ($$props.onChildMount === void 0 && $$bindings.onChildMount && onChildMount !== void 0)
    $$bindings.onChildMount(onChildMount);
  if ($$props.onChildDestroy === void 0 && $$bindings.onChildDestroy && onChildDestroy !== void 0)
    $$bindings.onChildDestroy(onChildDestroy);
  if ($$props.parent === void 0 && $$bindings.parent && parent !== void 0)
    $$bindings.parent(parent);
  parent = $parentStore;
  {
    objectStore.set(object);
  }
  $$unsubscribe_parentStore();
  return `   ${slots.default ? slots.default({}) : ``}`;
});
const SceneGraphObject = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { object } = $$props;
  if ($$props.object === void 0 && $$bindings.object && object !== void 0)
    $$bindings.object(object);
  return `${validate_component(HierarchicalObject, "HierarchicalObject").$$render(
    $$result,
    {
      object,
      onChildMount: (child) => object.add(child),
      onChildDestroy: (child) => object.remove(child)
    },
    {},
    {
      default: () => {
        return `${slots.default ? slots.default({}) : ``}`;
      }
    }
  )}`;
});
const resolvePropertyPath = (target, propertyPath) => {
  if (propertyPath.includes(".")) {
    const path = propertyPath.split(".");
    const key = path.pop();
    for (let i = 0; i < path.length; i += 1) {
      target = target[path[i]];
    }
    return {
      target,
      key
    };
  } else {
    return {
      target,
      key: propertyPath
    };
  }
};
const initialValueBeforeAttach = Symbol("initialValueBeforeAttach");
const useAttach = () => {
  const { invalidate } = useThrelte();
  let isAttached = false;
  let valueBeforeAttach = initialValueBeforeAttach;
  let detachFn;
  let attachedTo;
  let attachedKey;
  const update2 = (instance, parent, attach) => {
    detach();
    if (!attach) {
      const i = instance;
      const isMaterial = i?.isMaterial || false;
      if (isMaterial) {
        attach = "material";
      }
      const isGeometry = i?.isBufferGeometry || i?.isGeometry || false;
      if (isGeometry) {
        attach = "geometry";
      }
    }
    if (!attach)
      return;
    if (typeof attach === "function") {
      detachFn = attach(parent, instance);
    } else {
      const { target, key } = resolvePropertyPath(parent, attach);
      valueBeforeAttach = target[key];
      target[key] = instance;
      attachedTo = target;
      attachedKey = key;
    }
    isAttached = true;
    invalidate();
  };
  const detach = () => {
    if (!isAttached)
      return;
    if (detachFn) {
      detachFn();
      detachFn = void 0;
    } else if (attachedTo && attachedKey && valueBeforeAttach !== initialValueBeforeAttach) {
      attachedTo[attachedKey] = valueBeforeAttach;
      valueBeforeAttach = initialValueBeforeAttach;
      attachedTo = void 0;
      attachedKey = void 0;
    }
    isAttached = false;
    invalidate();
  };
  onDestroy(() => {
    detach();
  });
  return {
    update: update2
  };
};
const isCamera = (value) => {
  return value && value.isCamera;
};
const isOrthographicCamera = (value) => {
  return value && value.isOrthographicCamera;
};
const isPerspectiveCamera = (value) => {
  return value && value.isPerspectiveCamera;
};
const isPerspectiveCameraOrOrthographicCamera = (value) => {
  return isPerspectiveCamera(value) || isOrthographicCamera(value);
};
const useCamera = () => {
  const { invalidate, size, camera } = useThrelte();
  let currentInstance;
  let unsubscribe = void 0;
  onDestroy(() => {
    unsubscribe?.();
  });
  const subscriber = (size2) => {
    if (!currentInstance)
      return;
    if (isOrthographicCamera(currentInstance)) {
      currentInstance.left = size2.width / -2;
      currentInstance.right = size2.width / 2;
      currentInstance.top = size2.height / 2;
      currentInstance.bottom = size2.height / -2;
      currentInstance.updateProjectionMatrix();
      currentInstance.updateMatrixWorld();
      invalidate();
    } else if (isPerspectiveCamera(currentInstance)) {
      currentInstance.aspect = size2.width / size2.height;
      currentInstance.updateProjectionMatrix();
      currentInstance.updateMatrixWorld();
      invalidate();
    }
  };
  const update2 = (instance, manual) => {
    unsubscribe?.();
    if (manual || !isPerspectiveCameraOrOrthographicCamera(instance)) {
      currentInstance = void 0;
      return;
    }
    currentInstance = instance;
    unsubscribe = size.subscribe(subscriber);
  };
  const makeDefaultCamera = (instance, makeDefault) => {
    if (!isCamera(instance) || !makeDefault)
      return;
    camera.set(instance);
    invalidate();
  };
  return {
    update: update2,
    makeDefaultCamera
  };
};
const createRawEventDispatcher = () => {
  const component = get_current_component();
  const dispatchRawEvent = (type, value) => {
    const callbacks = component.$$.callbacks[type];
    if (callbacks) {
      callbacks.forEach((fn) => {
        fn(value);
      });
    }
  };
  const hasEventListener = (type) => {
    return Boolean(component.$$.callbacks[type]);
  };
  Object.defineProperty(dispatchRawEvent, "hasEventListener", {
    value: hasEventListener,
    enumerable: true
  });
  return dispatchRawEvent;
};
const useCreateEvent = () => {
  createRawEventDispatcher();
  const cleanupFunctions = [];
  const updateRef = (newRef) => {
    return;
  };
  onDestroy(() => {
    cleanupFunctions.forEach((cleanup) => cleanup());
  });
  return {
    updateRef
  };
};
const isEventDispatcher = (value) => {
  return !!value?.addEventListener;
};
const useEvents = () => {
  const dispatch = createRawEventDispatcher();
  get_current_component();
  const eventHandlerProxy = (event) => {
    if (event?.type) {
      dispatch(event.type, event);
    }
  };
  const cleanupEventListeners = (ref2, events) => {
    if (isEventDispatcher(ref2)) {
      events.forEach((eventName) => {
        ref2.removeEventListener(eventName, eventHandlerProxy);
      });
    }
  };
  const addEventListeners = (ref2, events) => {
    if (isEventDispatcher(ref2)) {
      events.forEach((eventName) => {
        ref2.addEventListener(eventName, eventHandlerProxy);
      });
    }
  };
  let currentEventNames = [];
  let currentRef;
  const eventNames = writable([]);
  const unsubscribeEventNames = eventNames.subscribe((eventNames2) => {
    cleanupEventListeners(currentRef, currentEventNames);
    addEventListeners(currentRef, eventNames2);
    currentEventNames = eventNames2;
  });
  onDestroy(unsubscribeEventNames);
  const ref = writable();
  const unsubscribeRef = ref.subscribe((value) => {
    cleanupEventListeners(currentRef, currentEventNames);
    addEventListeners(value, currentEventNames);
    currentRef = value;
  });
  onDestroy(unsubscribeRef);
  onDestroy(() => {
    cleanupEventListeners(currentRef, currentEventNames);
  });
  const updateRef = (newRef) => {
    ref.set(newRef);
  };
  return {
    updateRef
  };
};
const usePlugins = (params) => {
  const pluginContextName = "threlte-plugin-context";
  const plugins = getContext(pluginContextName);
  if (!plugins)
    return;
  const pluginsReturns = Object.values(plugins).map((plugin) => plugin(params)).filter(Boolean);
  const pluginsProps = pluginsReturns.flatMap((callback) => callback.pluginProps ?? []);
  let refCleanupCallbacks = [];
  onDestroy(() => {
    refCleanupCallbacks.forEach((callback) => callback());
  });
  const updateRef = (ref) => {
    refCleanupCallbacks.forEach((callback) => callback());
    refCleanupCallbacks = [];
    pluginsReturns.forEach((callback) => {
      const cleanupCallback = callback.onRefChange?.(ref);
      if (cleanupCallback) {
        refCleanupCallbacks.push(cleanupCallback);
      }
    });
  };
  const updateProps = (props) => {
    pluginsReturns.forEach((callback) => {
      callback.onPropsChange?.(props);
    });
  };
  const updateRestProps = (restProps) => {
    pluginsReturns.forEach((callback) => {
      callback.onRestPropsChange?.(restProps);
    });
  };
  return {
    updateRef,
    updateProps,
    updateRestProps,
    pluginsProps
  };
};
const ignoredProps = /* @__PURE__ */ new Set(["$$scope", "$$slots", "type", "args", "attach", "instance"]);
const updateProjectionMatrixKeys = /* @__PURE__ */ new Set([
  "fov",
  "aspect",
  "near",
  "far",
  "left",
  "right",
  "top",
  "bottom",
  "zoom"
]);
const memoizeProp = (value) => {
  if (typeof value === "string")
    return true;
  if (typeof value === "number")
    return true;
  if (typeof value === "boolean")
    return true;
  if (typeof value === "undefined")
    return true;
  if (value === null)
    return true;
  return false;
};
const useProps = () => {
  const { invalidate } = useThrelte();
  const memoizedProps = /* @__PURE__ */ new Map();
  const setProp = (instance, propertyPath, value, options) => {
    if (memoizeProp(value)) {
      const memoizedProp = memoizedProps.get(propertyPath);
      if (memoizedProp && memoizedProp.instance === instance && memoizedProp.value === value) {
        return;
      }
      memoizedProps.set(propertyPath, {
        instance,
        value
      });
    }
    const { key, target } = resolvePropertyPath(instance, propertyPath);
    if (!Array.isArray(value) && typeof value === "number" && typeof target[key]?.setScalar === "function") {
      target[key].setScalar(value);
    } else {
      if (typeof target[key]?.set === "function") {
        if (Array.isArray(value)) {
          target[key].set(...value);
        } else {
          target[key].set(value);
        }
      } else {
        target[key] = value;
        if (options.manualCamera)
          return;
        if (updateProjectionMatrixKeys.has(key) && (target.isPerspectiveCamera || target.isOrthographicCamera)) {
          target.updateProjectionMatrix();
        }
      }
    }
  };
  const updateProps = (instance, props, options) => {
    for (const key in props) {
      if (!ignoredProps.has(key) && !options.pluginsProps?.includes(key)) {
        setProp(instance, key, props[key], options);
      }
      invalidate();
    }
  };
  return {
    updateProps
  };
};
const T$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["is", "args", "attach", "manual", "makeDefault", "dispose", "ref"]);
  let $parent, $$unsubscribe_parent;
  let { is } = $$props;
  let { args = void 0 } = $$props;
  let { attach = void 0 } = $$props;
  let { manual = void 0 } = $$props;
  let { makeDefault = void 0 } = $$props;
  let { dispose = void 0 } = $$props;
  const parent = getContext("threlte-hierarchical-parent-context");
  $$unsubscribe_parent = subscribe(parent, (value) => $parent = value);
  const isClass = (type) => {
    return typeof type === "function" && /^\s*class\s+/.test(type.toString());
  };
  const argsIsConstructorParameters = (args2) => {
    return Array.isArray(args2);
  };
  const createEvent = useCreateEvent();
  let ref = isClass(is) && argsIsConstructorParameters(args) ? new is(...args) : isClass(
    is
  ) ? new is() : is;
  createEvent.updateRef(ref);
  let initialized = false;
  const maybeSetRef = () => {
    if (!initialized) {
      initialized = true;
      return;
    }
    ref = isClass(is) && argsIsConstructorParameters(args) ? new is(...args) : isClass(
      is
    ) ? new is() : is;
    createEvent.updateRef(ref);
  };
  let { ref: publicRef = ref } = $$props;
  const refStore = writable(ref);
  setContext("threlte-hierarchical-parent-context", refStore);
  const plugins = usePlugins({ ref, props: $$props });
  const pluginsProps = plugins?.pluginsProps ?? [];
  const props = useProps();
  const camera = useCamera();
  const attachment = useAttach();
  const events = useEvents();
  const extendsObject3D = (object) => {
    return !!object.isObject3D;
  };
  const isDisposableObject = (object) => {
    return object.dispose !== void 0;
  };
  if ($$props.is === void 0 && $$bindings.is && is !== void 0)
    $$bindings.is(is);
  if ($$props.args === void 0 && $$bindings.args && args !== void 0)
    $$bindings.args(args);
  if ($$props.attach === void 0 && $$bindings.attach && attach !== void 0)
    $$bindings.attach(attach);
  if ($$props.manual === void 0 && $$bindings.manual && manual !== void 0)
    $$bindings.manual(manual);
  if ($$props.makeDefault === void 0 && $$bindings.makeDefault && makeDefault !== void 0)
    $$bindings.makeDefault(makeDefault);
  if ($$props.dispose === void 0 && $$bindings.dispose && dispose !== void 0)
    $$bindings.dispose(dispose);
  if ($$props.ref === void 0 && $$bindings.ref && publicRef !== void 0)
    $$bindings.ref(publicRef);
  {
    maybeSetRef();
  }
  publicRef = ref;
  {
    refStore.set(ref);
  }
  {
    props.updateProps(ref, $$restProps, { manualCamera: manual, pluginsProps });
  }
  {
    camera.update(ref, manual);
  }
  {
    camera.makeDefaultCamera(ref, makeDefault);
  }
  {
    attachment.update(ref, $parent, attach);
  }
  {
    events.updateRef(ref);
  }
  {
    plugins?.updateRef(ref);
  }
  {
    plugins?.updateProps($$props);
  }
  {
    plugins?.updateRestProps($$restProps);
  }
  $$unsubscribe_parent();
  return `${isDisposableObject(ref) ? `${validate_component(DisposableObject, "DisposableObject").$$render($$result, { object: ref, dispose }, {}, {})}` : ``} ${extendsObject3D(ref) ? `${validate_component(SceneGraphObject, "SceneGraphObject").$$render($$result, { object: ref }, {}, {
    default: () => {
      return `${slots.default ? slots.default({ ref }) : ``}`;
    }
  })}` : `${slots.default ? slots.default({ ref }) : ``}`}`;
});
const browser = typeof window !== "undefined";
const useParentSize = () => {
  const parentSize = writable({ width: 0, height: 0 });
  if (!browser) {
    return {
      parentSize,
      parentSizeAction: () => {
      }
    };
  }
  const mutationOptions = { childList: true, subtree: false, attributes: false };
  let el;
  const observeParent = (parent) => {
    resizeObserver.disconnect();
    mutationObserver.disconnect();
    resizeObserver.observe(parent);
    mutationObserver.observe(parent, mutationOptions);
  };
  const resizeObserver = new ResizeObserver(([entry]) => {
    const { contentRect } = entry;
    parentSize.set({
      width: contentRect.width,
      height: contentRect.height
    });
  });
  const mutationObserver = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      for (const node of mutation.removedNodes) {
        if (el === node && el.parentElement) {
          observeParent(el.parentElement);
          return;
        }
      }
    }
  });
  const parentSizeAction = (node) => {
    el = node;
    if (!el.parentElement)
      return;
    observeParent(el.parentElement);
  };
  onDestroy(() => {
    resizeObserver.disconnect();
    mutationObserver.disconnect();
  });
  return {
    parentSize,
    parentSizeAction
  };
};
const revision = Number.parseInt(REVISION.replace("dev", ""));
const createCache = () => {
  setContext("threlte-cache", []);
};
const getThrelteUserData = (object) => {
  return object.userData;
};
const watch = (stores, callback) => {
  const d = derived(stores, (values) => {
    return values;
  });
  let cleanupFn;
  const unsubscribe = d.subscribe(async (values) => {
    if (cleanupFn)
      cleanupFn();
    const fn = await callback(values);
    if (fn)
      cleanupFn = fn;
  });
  onDestroy(() => {
    unsubscribe();
    if (cleanupFn)
      cleanupFn();
  });
};
const currentWritable = (value) => {
  const store = writable(value);
  const extendedWritable = {
    set: (value2) => {
      extendedWritable.current = value2;
      store.set(value2);
    },
    subscribe: store.subscribe,
    update: (fn) => {
      const newValue = fn(extendedWritable.current);
      extendedWritable.current = newValue;
      store.set(newValue);
    },
    current: value
  };
  return extendedWritable;
};
const createDefaultCamera = () => {
  const defaultCamera = new PerspectiveCamera(75, 0, 0.1, 1e3);
  getThrelteUserData(defaultCamera).threlteDefaultCamera = true;
  defaultCamera.position.z = 5;
  defaultCamera.lookAt(0, 0, 0);
  return defaultCamera;
};
const setDefaultCameraAspectOnSizeChange = (ctx) => {
  watch(ctx.size, (size) => {
    if (getThrelteUserData(get_store_value(ctx.camera)).threlteDefaultCamera) {
      ctx.camera.update((c) => {
        const cam = c;
        cam.aspect = size.width / size.height;
        cam.updateProjectionMatrix();
        ctx.invalidate("Default camera: aspect ratio changed");
        return cam;
      });
    }
  });
};
const createContexts = (options) => {
  const internalCtx = {
    debugFrameloop: options.debugFrameloop,
    frame: 0,
    frameInvalidated: true,
    invalidations: {},
    manualFrameHandlers: /* @__PURE__ */ new Set(),
    autoFrameHandlers: /* @__PURE__ */ new Set(),
    allFrameHandlers: /* @__PURE__ */ new Set(),
    allFrameHandlersNeedSortCheck: false,
    renderHandlers: /* @__PURE__ */ new Set(),
    renderHandlersNeedSortCheck: false,
    advance: false,
    dispose: async (force = false) => {
      await tick();
      if (!internalCtx.shouldDispose && !force)
        return;
      internalCtx.disposableObjects.forEach((mounted, object) => {
        if (mounted === 0 || force) {
          object?.dispose?.();
          internalCtx.disposableObjects.delete(object);
        }
      });
      internalCtx.shouldDispose = false;
    },
    collectDisposableObjects: (object, objects) => {
      const disposables = objects ?? [];
      if (!object)
        return disposables;
      if (object?.dispose && typeof object.dispose === "function" && object.type !== "Scene") {
        disposables.push(object);
      }
      Object.entries(object).forEach(([propKey, propValue]) => {
        if (propKey === "parent" || propKey === "children" || typeof propValue !== "object")
          return;
        const value = propValue;
        if (value?.dispose) {
          internalCtx.collectDisposableObjects(value, disposables);
        }
      });
      return disposables;
    },
    addDisposableObjects: (objects) => {
      objects.forEach((obj) => {
        const currentValue = internalCtx.disposableObjects.get(obj);
        if (currentValue) {
          internalCtx.disposableObjects.set(obj, currentValue + 1);
        } else {
          internalCtx.disposableObjects.set(obj, 1);
        }
      });
    },
    removeDisposableObjects: (objects) => {
      if (objects.length === 0)
        return;
      objects.forEach((obj) => {
        const currentValue = internalCtx.disposableObjects.get(obj);
        if (currentValue && currentValue > 0) {
          internalCtx.disposableObjects.set(obj, currentValue - 1);
        }
      });
      internalCtx.shouldDispose = true;
    },
    disposableObjects: /* @__PURE__ */ new Map(),
    shouldDispose: false
  };
  const ctx = {
    size: derived([options.userSize, options.parentSize], ([uSize, pSize]) => {
      return uSize ? uSize : pSize;
    }),
    clock: new Clock(),
    camera: currentWritable(createDefaultCamera()),
    scene: new Scene(),
    renderer: void 0,
    invalidate: (debugFrameloopMessage) => {
      internalCtx.frameInvalidated = true;
      if (internalCtx.debugFrameloop && debugFrameloopMessage) {
        internalCtx.invalidations[debugFrameloopMessage] = internalCtx.invalidations[debugFrameloopMessage] ? internalCtx.invalidations[debugFrameloopMessage] + 1 : 1;
      }
    },
    advance: () => {
      internalCtx.advance = true;
    },
    colorSpace: currentWritable(options.colorSpace),
    toneMapping: currentWritable(options.toneMapping),
    dpr: currentWritable(options.dpr),
    useLegacyLights: currentWritable(options.useLegacyLights),
    shadows: currentWritable(options.shadows),
    colorManagementEnabled: currentWritable(options.colorManagementEnabled),
    frameloop: currentWritable(options.frameloop)
  };
  const userCtx = currentWritable({});
  setContext("threlte", ctx);
  setContext("threlte-internal-context", internalCtx);
  setContext("threlte-user-context", userCtx);
  const getCtx = () => ctx;
  const getInternalCtx = () => internalCtx;
  return {
    ctx,
    internalCtx,
    getCtx,
    getInternalCtx
  };
};
const colorSpaceToEncoding = {
  srgb: sRGBEncoding,
  "srgb-linear": LinearEncoding,
  "": LinearEncoding
};
const rendererHasOutputColorSpaceProperty = (renderer) => {
  return renderer.outputColorSpace !== void 0;
};
const useRenderer = (ctx) => {
  const renderer = writable(void 0);
  const createRenderer = (canvas, rendererParameters) => {
    ctx.renderer = new WebGLRenderer({
      powerPreference: "high-performance",
      canvas,
      antialias: true,
      alpha: true,
      ...rendererParameters
    });
    renderer.set(ctx.renderer);
  };
  watch([
    renderer,
    ctx.size,
    ctx.toneMapping,
    ctx.colorSpace,
    ctx.dpr,
    ctx.shadows,
    ctx.colorManagementEnabled,
    ctx.useLegacyLights
  ], ([renderer2, size, toneMapping, colorSpace, dpr, shadows, colorManagementEnabled, useLegacyLights]) => {
    if (!renderer2)
      return;
    renderer2.setSize(size.width, size.height);
    renderer2.setPixelRatio(dpr);
    if (rendererHasOutputColorSpaceProperty(renderer2)) {
      renderer2.outputColorSpace = colorSpace;
    } else {
      const encoding = colorSpaceToEncoding[colorSpace];
      if (!encoding) {
        console.warn("No encoding found for colorSpace", colorSpace);
      } else {
        renderer2.outputEncoding = encoding;
      }
    }
    renderer2.toneMapping = toneMapping;
    renderer2.shadowMap.enabled = !!shadows;
    if (shadows && shadows !== true) {
      renderer2.shadowMap.type = shadows;
    } else if (shadows === true) {
      renderer2.shadowMap.type = PCFSoftShadowMap;
    }
    const cm = ColorManagement;
    if (revision >= 150) {
      cm.enabled = colorManagementEnabled;
    } else {
      cm.legacyMode = !colorManagementEnabled;
    }
    const anyRenderer = renderer2;
    if (revision >= 150 && useLegacyLights) {
      anyRenderer.useLegacyLights = useLegacyLights;
    } else if (revision < 150) {
      anyRenderer.physicallyCorrectLights = !useLegacyLights;
    }
  });
  return {
    createRenderer
  };
};
const Canvas_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: "canvas.svelte-o3oskp{display:block}",
  map: null
};
const invalidationHandlers = /* @__PURE__ */ new Set();
const Canvas = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { dpr = browser ? window.devicePixelRatio : 1 } = $$props;
  let { toneMapping = ACESFilmicToneMapping } = $$props;
  let { colorSpace = "srgb" } = $$props;
  let { frameloop = "demand" } = $$props;
  let { debugFrameloop = false } = $$props;
  let { shadows = PCFSoftShadowMap } = $$props;
  let { size = void 0 } = $$props;
  let { rendererParameters = void 0 } = $$props;
  let { colorManagementEnabled = true } = $$props;
  let { useLegacyLights = revision >= 155 ? false : true } = $$props;
  let canvas;
  const userSize = writable(size);
  const { parentSize, parentSizeAction } = useParentSize();
  const contexts = createContexts({
    colorSpace,
    toneMapping,
    dpr,
    userSize,
    parentSize,
    debugFrameloop,
    frameloop,
    shadows,
    colorManagementEnabled,
    useLegacyLights
  });
  createCache();
  const ctx = contexts.ctx;
  setDefaultCameraAspectOnSizeChange(ctx);
  invalidationHandlers.add(ctx.invalidate);
  onDestroy(() => {
    invalidationHandlers.delete(ctx.invalidate);
  });
  useRenderer(ctx);
  onDestroy(() => {
    contexts.internalCtx.dispose(true);
    contexts.ctx.renderer?.dispose();
  });
  if ($$props.dpr === void 0 && $$bindings.dpr && dpr !== void 0)
    $$bindings.dpr(dpr);
  if ($$props.toneMapping === void 0 && $$bindings.toneMapping && toneMapping !== void 0)
    $$bindings.toneMapping(toneMapping);
  if ($$props.colorSpace === void 0 && $$bindings.colorSpace && colorSpace !== void 0)
    $$bindings.colorSpace(colorSpace);
  if ($$props.frameloop === void 0 && $$bindings.frameloop && frameloop !== void 0)
    $$bindings.frameloop(frameloop);
  if ($$props.debugFrameloop === void 0 && $$bindings.debugFrameloop && debugFrameloop !== void 0)
    $$bindings.debugFrameloop(debugFrameloop);
  if ($$props.shadows === void 0 && $$bindings.shadows && shadows !== void 0)
    $$bindings.shadows(shadows);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.rendererParameters === void 0 && $$bindings.rendererParameters && rendererParameters !== void 0)
    $$bindings.rendererParameters(rendererParameters);
  if ($$props.colorManagementEnabled === void 0 && $$bindings.colorManagementEnabled && colorManagementEnabled !== void 0)
    $$bindings.colorManagementEnabled(colorManagementEnabled);
  if ($$props.useLegacyLights === void 0 && $$bindings.useLegacyLights && useLegacyLights !== void 0)
    $$bindings.useLegacyLights(useLegacyLights);
  if ($$props.ctx === void 0 && $$bindings.ctx && ctx !== void 0)
    $$bindings.ctx(ctx);
  $$result.css.add(css$1);
  {
    userSize.set(size);
  }
  return `<canvas class="svelte-o3oskp"${add_attribute("this", canvas, 0)}>${``} </canvas>`;
});
const catalogue = {};
const augmentConstructorArgs = (args, is) => {
  const module = catalogue[is] || THREE[is];
  if (!module) {
    throw new Error(`No Three.js module found for ${is}. Did you forget to extend the catalogue?`);
  }
  return {
    ...args,
    props: {
      ...args.props,
      is: module
    }
  };
};
const proxyTConstructor = (is) => {
  return new Proxy(class {
  }, {
    construct(_, [args]) {
      const castedArgs = args;
      return new T$1(augmentConstructorArgs(castedArgs, is));
    }
  });
};
const T = new Proxy(class {
}, {
  construct(_, [args]) {
    const castedArgs = args;
    return new T$1(castedArgs);
  },
  get(_, is) {
    return proxyTConstructor(is);
  }
});
const useFrame = (fn, options) => {
  if (!browser) {
    return {
      start: () => void 0,
      stop: () => void 0,
      started: readable(false)
    };
  }
  const invalidate = options?.invalidate ?? true;
  const renderCtx = getContext("threlte-internal-context");
  const handler = {
    fn,
    order: options?.order,
    debugFrameloopMessage: options?.debugFrameloopMessage,
    invalidate
  };
  const started = writable(false);
  const stop = () => {
    if (invalidate) {
      renderCtx.autoFrameHandlers.delete(handler);
    } else {
      renderCtx.manualFrameHandlers.delete(handler);
    }
    renderCtx.allFrameHandlers.delete(handler);
    started.set(false);
  };
  const start = () => {
    if (invalidate) {
      renderCtx.autoFrameHandlers.add(handler);
    } else {
      renderCtx.manualFrameHandlers.add(handler);
    }
    renderCtx.allFrameHandlers.add(handler);
    renderCtx.allFrameHandlersNeedSortCheck = true;
    started.set(true);
  };
  if (options?.autostart ?? true) {
    start();
  }
  onDestroy(() => {
    stop();
  });
  return {
    start,
    stop,
    started: {
      subscribe: started.subscribe
    }
  };
};
const useRender = (fn, options) => {
  if (!browser) {
    return;
  }
  const renderCtx = getContext("threlte-internal-context");
  const handler = {
    fn,
    order: options?.order
  };
  renderCtx.renderHandlers.add(handler);
  renderCtx.renderHandlersNeedSortCheck = true;
  onDestroy(() => {
    renderCtx.renderHandlers.delete(handler);
  });
};
function useThrelteUserContext(namespace, value, options) {
  const userCtxStore = getContext("threlte-user-context");
  if (!userCtxStore) {
    throw new Error("No user context store found, did you invoke this function outside of your main <Canvas> component?");
  }
  if (!namespace) {
    return {
      subscribe: userCtxStore.subscribe
    };
  }
  if (namespace && !value) {
    return derived(userCtxStore, (ctx) => ctx[namespace]);
  }
  userCtxStore.update((ctx) => {
    if (namespace in ctx) {
      if (!options || options.existing === "skip")
        return ctx;
      if (options.existing === "merge") {
        Object.assign(ctx[namespace], value);
        return ctx;
      }
    }
    ctx[namespace] = value;
    return ctx;
  });
  return userCtxStore.current[namespace];
}
const forwardEventHandlers = () => {
  const component = get_current_component();
  const dispatchingComponent = writable(void 0);
  watch(dispatchingComponent, (dispatchingComponent2) => {
    if (!dispatchingComponent2)
      return;
    Object.entries(component.$$.callbacks).forEach((callback) => {
      const [key, value] = callback;
      if (key in dispatchingComponent2.$$.callbacks && Array.isArray(dispatchingComponent2.$$.callbacks[key])) {
        dispatchingComponent2.$$.callbacks[key].push(...value);
      } else {
        dispatchingComponent2.$$.callbacks[key] = value;
      }
    });
  });
  return dispatchingComponent;
};
function quadInOut(t) {
  t /= 0.5;
  if (t < 1)
    return 0.5 * t * t;
  t--;
  return -0.5 * (t * (t - 2) - 1);
}
function is_date(obj) {
  return Object.prototype.toString.call(obj) === "[object Date]";
}
function get_interpolator(a, b) {
  if (a === b || a !== a)
    return () => a;
  const type = typeof a;
  if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
    throw new Error("Cannot interpolate values of different type");
  }
  if (Array.isArray(a)) {
    const arr = b.map((bi, i) => {
      return get_interpolator(a[i], bi);
    });
    return (t) => arr.map((fn) => fn(t));
  }
  if (type === "object") {
    if (!a || !b)
      throw new Error("Object cannot be null");
    if (is_date(a) && is_date(b)) {
      a = a.getTime();
      b = b.getTime();
      const delta = b - a;
      return (t) => new Date(a + t * delta);
    }
    const keys = Object.keys(b);
    const interpolators = {};
    keys.forEach((key) => {
      interpolators[key] = get_interpolator(a[key], b[key]);
    });
    return (t) => {
      const result = {};
      keys.forEach((key) => {
        result[key] = interpolators[key](t);
      });
      return result;
    };
  }
  if (type === "number") {
    const delta = b - a;
    return (t) => a + t * delta;
  }
  throw new Error(`Cannot interpolate ${type} values`);
}
function tweened(value, defaults = {}) {
  const store = writable(value);
  let task;
  let target_value = value;
  function set(new_value, opts) {
    if (value == null) {
      store.set(value = new_value);
      return Promise.resolve();
    }
    target_value = new_value;
    let previous_task = task;
    let started = false;
    let {
      delay = 0,
      duration = 400,
      easing = identity,
      interpolate = get_interpolator
    } = assign(assign({}, defaults), opts);
    if (duration === 0) {
      if (previous_task) {
        previous_task.abort();
        previous_task = null;
      }
      store.set(value = target_value);
      return Promise.resolve();
    }
    const start = now() + delay;
    let fn;
    task = loop((now2) => {
      if (now2 < start)
        return true;
      if (!started) {
        fn = interpolate(value, new_value);
        if (typeof duration === "function")
          duration = duration(value, new_value);
        started = true;
      }
      if (previous_task) {
        previous_task.abort();
        previous_task = null;
      }
      const elapsed = now2 - start;
      if (elapsed > /** @type {number} */
      duration) {
        store.set(value = new_value);
        return false;
      }
      store.set(value = fn(easing(elapsed / duration)));
      return true;
    });
    return task.promise;
  }
  return {
    set,
    update: (fn, opts) => set(fn(target_value, value), opts),
    subscribe: store.subscribe
  };
}
new Vector3();
new Vector3();
new Vector3();
const Grid = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let material;
  let $$restProps = compute_rest_props($$props, [
    "cellColor",
    "sectionColor",
    "cellSize",
    "sectionSize",
    "axes",
    "gridSize",
    "followCamera",
    "infiniteGrid",
    "fadeDistance",
    "fadeStrength",
    "cellThickness",
    "sectionThickness",
    "ref"
  ]);
  let $component, $$unsubscribe_component;
  let { cellColor = "#000000" } = $$props;
  let { sectionColor = "#0000ee" } = $$props;
  let { cellSize = 1 } = $$props;
  let { sectionSize = 10 } = $$props;
  let { axes = "xzy" } = $$props;
  let { gridSize = [20, 20] } = $$props;
  let { followCamera = false } = $$props;
  let { infiniteGrid = false } = $$props;
  let { fadeDistance = 100 } = $$props;
  let { fadeStrength = 1 } = $$props;
  let { cellThickness = 1 } = $$props;
  let { sectionThickness = 2 } = $$props;
  let { ref } = $$props;
  const { invalidate } = useThrelte();
  const makeGridMaterial = (axes2) => {
    return new ShaderMaterial({
      side: DoubleSide,
      uniforms: {
        uSize1: { value: cellSize },
        uSize2: { value: sectionSize },
        uColor1: { value: new Color(cellColor) },
        uColor2: { value: new Color(sectionColor) },
        uFadeDistance: { value: fadeDistance },
        uFadeStrength: { value: fadeStrength },
        uThickness1: { value: 1 },
        uThickness2: { value: 1 },
        uInfiniteGrid: { value: infiniteGrid ? 1 : 0 },
        uFollowCamera: { value: 0 }
      },
      transparent: true,
      vertexShader: `
      varying vec3 worldPosition;
      uniform float uFadeDistance;
      uniform float uInfiniteGrid;
      uniform float uFollowCamera;

      void main() {

        vec3 pos = position.${axes2} * (1. + uFadeDistance * uInfiniteGrid);
        pos.${axes2.slice(0, 2)} += (cameraPosition.${axes2.slice(0, 2)} * uFollowCamera);

        worldPosition = pos;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

      }`,
      fragmentShader: `
      varying vec3 worldPosition;
      uniform float uSize1;
      uniform float uSize2;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform float uFadeDistance;
      uniform float uFadeStrength;
      uniform float uThickness1;
      uniform float uThickness2;
      uniform float uInfiniteGrid;

      float getGrid(float size, float thickness) {

        vec2 r = worldPosition.${axes2.slice(0, 2)} / size;

        vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);
        float line = min(grid.x, grid.y) + 1. - thickness;

        return 1.0 - min(line, 1.);
      }

      void main() {

        float g1 = getGrid(uSize1, uThickness1);
        float g2 = getGrid(uSize2, uThickness2);

        float d = 1.0 - min(distance(cameraPosition.${axes2.slice(0, 2)}, worldPosition.${axes2.slice(0, 2)}) / uFadeDistance, 1.);
        vec3 color = mix(uColor1, uColor2, min(1.,uThickness2*g2));

        gl_FragColor = vec4(color, (g1 + g2) * pow(d,uFadeStrength));
        gl_FragColor.a = mix(0.75 * gl_FragColor.a, gl_FragColor.a, g2);

        if(gl_FragColor.a <= 0.0)
          discard;
        #include <tonemapping_fragment>
        #include <encodings_fragment>
      }
       `,
      extensions: { derivatives: true }
    });
  };
  const component = forwardEventHandlers();
  $$unsubscribe_component = subscribe(component, (value) => $component = value);
  if ($$props.cellColor === void 0 && $$bindings.cellColor && cellColor !== void 0)
    $$bindings.cellColor(cellColor);
  if ($$props.sectionColor === void 0 && $$bindings.sectionColor && sectionColor !== void 0)
    $$bindings.sectionColor(sectionColor);
  if ($$props.cellSize === void 0 && $$bindings.cellSize && cellSize !== void 0)
    $$bindings.cellSize(cellSize);
  if ($$props.sectionSize === void 0 && $$bindings.sectionSize && sectionSize !== void 0)
    $$bindings.sectionSize(sectionSize);
  if ($$props.axes === void 0 && $$bindings.axes && axes !== void 0)
    $$bindings.axes(axes);
  if ($$props.gridSize === void 0 && $$bindings.gridSize && gridSize !== void 0)
    $$bindings.gridSize(gridSize);
  if ($$props.followCamera === void 0 && $$bindings.followCamera && followCamera !== void 0)
    $$bindings.followCamera(followCamera);
  if ($$props.infiniteGrid === void 0 && $$bindings.infiniteGrid && infiniteGrid !== void 0)
    $$bindings.infiniteGrid(infiniteGrid);
  if ($$props.fadeDistance === void 0 && $$bindings.fadeDistance && fadeDistance !== void 0)
    $$bindings.fadeDistance(fadeDistance);
  if ($$props.fadeStrength === void 0 && $$bindings.fadeStrength && fadeStrength !== void 0)
    $$bindings.fadeStrength(fadeStrength);
  if ($$props.cellThickness === void 0 && $$bindings.cellThickness && cellThickness !== void 0)
    $$bindings.cellThickness(cellThickness);
  if ($$props.sectionThickness === void 0 && $$bindings.sectionThickness && sectionThickness !== void 0)
    $$bindings.sectionThickness(sectionThickness);
  if ($$props.ref === void 0 && $$bindings.ref && ref !== void 0)
    $$bindings.ref(ref);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    material = makeGridMaterial(axes);
    {
      {
        material.uniforms.uSize1 = { value: cellSize };
        material.uniforms.uSize2 = { value: sectionSize };
        material.uniforms.uColor1 = { value: new Color(cellColor) };
        material.uniforms.uColor2 = { value: new Color(sectionColor) };
        material.uniforms.uFadeDistance = { value: fadeDistance };
        material.uniforms.uFadeStrength = { value: fadeStrength };
        material.uniforms.uThickness1 = { value: cellThickness };
        material.uniforms.uThickness2 = { value: sectionThickness };
        material.uniforms.uFollowCamera = { value: followCamera ? 1 : 0 };
        material.uniforms.uInfiniteGrid = { value: infiniteGrid ? 1 : 0 };
        invalidate("Grid uniforms changed");
      }
    }
    material && invalidate("Grid axes changed");
    $$rendered = `  ${validate_component(T.Mesh, "T.Mesh").$$render(
      $$result,
      Object.assign({}, { material }, { frustumCulled: false }, $$restProps, { this: $component }, { ref }),
      {
        this: ($$value) => {
          $component = $$value;
          $$settled = false;
        },
        ref: ($$value) => {
          ref = $$value;
          $$settled = false;
        }
      },
      {
        default: ({ ref: ref2 }) => {
          return `${validate_component(T.PlaneGeometry, "T.PlaneGeometry").$$render(
            $$result,
            {
              args: typeof gridSize == "number" ? [gridSize, gridSize] : gridSize
            },
            {},
            {}
          )} ${slots.default ? slots.default({ ref: ref2 }) : ``}`;
        }
      }
    )}`;
  } while (!$$settled);
  $$unsubscribe_component();
  return $$rendered;
});
const useControlsContext = () => {
  return useThrelteUserContext("threlte-controls", {
    orbitControls: writable(void 0)
  });
};
const OrbitControls = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["ref"]);
  let $parent, $$unsubscribe_parent;
  let $component, $$unsubscribe_component;
  const parent = useParent();
  $$unsubscribe_parent = subscribe(parent, (value) => $parent = value);
  const isCamera2 = (p) => {
    return p.isCamera;
  };
  const { renderer, invalidate } = useThrelte();
  if (!isCamera2($parent)) {
    throw new Error("Parent missing: <OrbitControls> need to be a child of a <Camera>");
  }
  const ref = new OrbitControls$1($parent, renderer.domElement);
  const { start, stop } = useFrame(() => ref.update(), {
    autostart: false,
    debugFrameloopMessage: "OrbitControls: updating controls"
  });
  const component = forwardEventHandlers();
  $$unsubscribe_component = subscribe(component, (value) => $component = value);
  useControlsContext();
  if ($$props.ref === void 0 && $$bindings.ref && ref !== void 0)
    $$bindings.ref(ref);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      {
        if ($$restProps.autoRotate || $$restProps.enableDamping)
          start();
        else
          stop();
      }
    }
    $$rendered = `${validate_component(T, "T").$$render(
      $$result,
      Object.assign({}, { is: ref }, $$restProps, { this: $component }),
      {
        this: ($$value) => {
          $component = $$value;
          $$settled = false;
        }
      },
      {
        default: ({ ref: ref2 }) => {
          return `${slots.default ? slots.default({ ref: ref2 }) : ``}`;
        }
      }
    )}`;
  } while (!$$settled);
  $$unsubscribe_parent();
  $$unsubscribe_component();
  return $$rendered;
});
new Matrix4();
new Matrix4();
new Mesh();
const EffectsPipeline = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $size, $$unsubscribe_size;
  let $camera, $$unsubscribe_camera;
  let { selectedMesh } = $$props;
  const { scene, renderer, camera, size } = useThrelte();
  $$unsubscribe_camera = subscribe(camera, (value) => $camera = value);
  $$unsubscribe_size = subscribe(size, (value) => $size = value);
  const composer = new EffectComposer(renderer);
  const setupEffectComposer = (camera2, selectedMesh2) => {
    composer.removeAllPasses();
    composer.addPass(new RenderPass(scene, camera2));
    const outlineEffect = new OutlineEffect(
      scene,
      camera2,
      {
        blendFunction: BlendFunction.ALPHA,
        edgeStrength: 100,
        pulseSpeed: 0,
        visibleEdgeColor: 16777215,
        hiddenEdgeColor: 10027263,
        xRay: true,
        blur: true
      }
    );
    if (selectedMesh2 !== void 0) {
      outlineEffect.selection.add(selectedMesh2);
    }
    composer.addPass(new EffectPass(camera2, outlineEffect));
  };
  useRender((_, delta) => {
    composer.render(delta);
  });
  if ($$props.selectedMesh === void 0 && $$bindings.selectedMesh && selectedMesh !== void 0)
    $$bindings.selectedMesh(selectedMesh);
  {
    setupEffectComposer($camera, selectedMesh);
  }
  {
    composer.setSize($size.width, $size.height);
  }
  $$unsubscribe_size();
  $$unsubscribe_camera();
  return ``;
});
const Maze = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(T.Mesh, "T.Mesh").$$render(
    $$result,
    {
      position: [6, 2, 4],
      "rotation.y": Math.PI / 2
    },
    {},
    {
      default: () => {
        return `${validate_component(T.MeshStandardMaterial, "T.MeshStandardMaterial").$$render($$result, { color: "silver" }, {}, {})} ${validate_component(T.BoxGeometry, "T.BoxGeometry").$$render($$result, { args: [7, 4, 1] }, {}, {})}`;
      }
    }
  )} ${validate_component(T.Mesh, "T.Mesh").$$render(
    $$result,
    {
      position: [-6, 2, 4],
      "rotation.y": Math.PI / 2
    },
    {},
    {
      default: () => {
        return `${validate_component(T.MeshStandardMaterial, "T.MeshStandardMaterial").$$render($$result, { color: "silver" }, {}, {})} ${validate_component(T.BoxGeometry, "T.BoxGeometry").$$render($$result, { args: [7, 4, 1] }, {}, {})}`;
      }
    }
  )} ${validate_component(T.Mesh, "T.Mesh").$$render($$result, { position: [-4, 2, 0] }, {}, {
    default: () => {
      return `${validate_component(T.MeshStandardMaterial, "T.MeshStandardMaterial").$$render($$result, { color: "silver" }, {}, {})} ${validate_component(T.BoxGeometry, "T.BoxGeometry").$$render($$result, { args: [5, 4, 1] }, {}, {})}`;
    }
  })} ${validate_component(T.Mesh, "T.Mesh").$$render($$result, { position: [4, 2, 0] }, {}, {
    default: () => {
      return `${validate_component(T.MeshStandardMaterial, "T.MeshStandardMaterial").$$render($$result, { color: "silver" }, {}, {})} ${validate_component(T.BoxGeometry, "T.BoxGeometry").$$render($$result, { args: [5, 4, 1] }, {}, {})}`;
    }
  })} ${validate_component(T.Mesh, "T.Mesh").$$render($$result, { position: [-3, 2, 7] }, {}, {
    default: () => {
      return `${validate_component(T.MeshStandardMaterial, "T.MeshStandardMaterial").$$render($$result, { color: "silver" }, {}, {})} ${validate_component(T.BoxGeometry, "T.BoxGeometry").$$render($$result, { args: [7, 4, 1] }, {}, {})}`;
    }
  })} ${validate_component(T.Mesh, "T.Mesh").$$render($$result, { position: [5, 2, 7] }, {}, {
    default: () => {
      return `${validate_component(T.MeshStandardMaterial, "T.MeshStandardMaterial").$$render($$result, { color: "silver" }, {}, {})} ${validate_component(T.BoxGeometry, "T.BoxGeometry").$$render($$result, { args: [3, 4, 1] }, {}, {})}`;
    }
  })} ${validate_component(T.Mesh, "T.Mesh").$$render($$result, { position: [-1, 2, 3.5] }, {}, {
    default: () => {
      return `${validate_component(T.MeshStandardMaterial, "T.MeshStandardMaterial").$$render($$result, { color: "silver" }, {}, {})} ${validate_component(T.BoxGeometry, "T.BoxGeometry").$$render($$result, { args: [10, 4, 1] }, {}, {})}`;
    }
  })}`;
});
const Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $cubePosition, $$unsubscribe_cubePosition;
  const route = [
    [0, 1, -3],
    [0, 1, 1.5],
    [4.7, 1, 1.5],
    [4.7, 1, 5],
    [2, 1, 5],
    [2, 1, 9],
    [8, 1, 9],
    [8, 1, -3]
  ];
  let routeIndex = 0;
  let cubePosition = tweened(route[routeIndex], { duration: 400, easing: quadInOut });
  $$unsubscribe_cubePosition = subscribe(cubePosition, (value) => $cubePosition = value);
  let outlinedCube;
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${validate_component(Maze, "Maze").$$render($$result, {}, {}, {})} ${validate_component(T.Mesh, "T.Mesh").$$render(
      $$result,
      {
        position: [$cubePosition[0], $cubePosition[1], $cubePosition[2]],
        ref: outlinedCube
      },
      {
        ref: ($$value) => {
          outlinedCube = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(T.MeshToonMaterial, "T.MeshToonMaterial").$$render($$result, { color: 61183 }, {}, {})} ${validate_component(T.BoxGeometry, "T.BoxGeometry").$$render($$result, {}, {}, {})}`;
        }
      }
    )} ${validate_component(EffectsPipeline, "CustomRenderer").$$render($$result, { selectedMesh: outlinedCube }, {}, {})} ${validate_component(T.PerspectiveCamera, "T.PerspectiveCamera").$$render(
      $$result,
      {
        makeDefault: true,
        position: [0, 6, -10],
        fov: 15,
        zoom: 0.2
      },
      {},
      {
        default: () => {
          return `${validate_component(OrbitControls, "OrbitControls").$$render(
            $$result,
            {
              enableZoom: true,
              enableDamping: true,
              target: [0, 0, 5]
            },
            {},
            {}
          )}`;
        }
      }
    )} ${validate_component(T.DirectionalLight, "T.DirectionalLight").$$render(
      $$result,
      {
        intensity: 0.8,
        "position.x": 5,
        "position.y": 10
      },
      {},
      {}
    )} ${validate_component(T.AmbientLight, "T.AmbientLight").$$render($$result, { intensity: 0.2 }, {}, {})} ${validate_component(Grid, "Grid").$$render(
      $$result,
      {
        gridSize: 18,
        position: [0, -1e-3, 5],
        cellColor: "#ffffff",
        sectionColor: "#ffffff",
        sectionThickness: 0,
        fadeDistance: 25
      },
      {},
      {}
    )}`;
  } while (!$$settled);
  $$unsubscribe_cubePosition();
  return $$rendered;
});
const Canvas_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Canvas, "Canvas").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Root, "Scene").$$render($$result, {}, {}, {})}`;
    }
  })}`;
});
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: "main.svelte-9q72ia{font-family:sans-serif}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let log = [];
  $$result.css.add(css);
  return `<main class="svelte-9q72ia"><h1 data-svelte-h="svelte-12ttzna">SvelteKit with WebSocket Integration</h1> <button ${""}>Establish WebSocket connection</button> <button data-svelte-h="svelte-1ado7o">Request Data from GET endpoint</button> ${validate_component(Canvas_1, "Canvas").$$render($$result, {}, {}, {})} <ul>${each(log, (event) => {
    return `<li>${escape(event)}</li>`;
  })}</ul> </main>`;
});
export {
  Page as default
};
