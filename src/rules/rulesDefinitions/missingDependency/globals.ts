import { CallExpression, Node } from "ts-morph";

const GLOBALS = new Set<string>([
  "AbortController",
  "Array",
  "ArrayBuffer",
  "Atomics",
  "axios",
  "BigInt",
  "BigInt64Array",
  "BigUint64Array",
  "Blob",
  "Boolean",
  "ByteLengthQueuingStrategy",
  "Cache",
  "CacheStorage",
  "clearImmediate",
  "clearInterval",
  "clearTimeout",
  "ClientRect",
  "Clipboard",
  "ClipboardEvent",
  "CloseEvent",
  "console",
  "CountQueuingStrategy",
  "Crypto",
  "crypto",
  "CustomEvent",
  "DataView",
  "Date",
  "decodeURI",
  "decodeURIComponent",
  "Document",
  "DOMException",
  "Element",
  "encodeURI",
  "encodeURIComponent",
  "Error",
  "escape",
  "Event",
  "EventTarget",
  "fetch",
  "File",
  "FileList",
  "FileReader",
  "finalizationRegistry",
  "Float32Array",
  "Float64Array",
  "FormData",
  "Function",
  "Headers",
  "Image",
  "ImageBitmap",
  "ImageData",
  "Infinity",
  "Int16Array",
  "Int32Array",
  "Int8Array",
  "Intl",
  "isFinite",
  "isNaN",
  "JSON",
  "location",
  "Map",
  "Math",
  "MessageChannel",
  "MessageEvent",
  "MessagePort",
  "MimeType",
  "MutationObserver",
  "NaN",
  "navigator",
  "Node",
  "NodeList",
  "Notification",
  "Number",
  "Object",
  "OffscreenCanvas",
  "onmessage",
  "parseFloat",
  "parseInt",
  "performance",
  "PermissionStatus",
  "postMessage",
  "Promise",
  "Proxy",
  "QueueMicrotask",
  "ReadableStream",
  "Reflect",
  "RegExp",
  "requestAnimationFrame",
  "Request",
  "Response",
  "screen",
  "self",
  "setImmediate",
  "setInterval",
  "setTimeout",
  "SharedArrayBuffer",
  "Storage",
  "String",
  "StructuredClone",
  "SubtleCrypto",
  "Symbol",
  "TextDecoder",
  "TextEncoder",
  "TextTrack",
  "TextTrackCue",
  "TextTrackList",
  "ThisType",
  "throw",
  "TimeRanges",
  "toggleAttribute",
  "TouchEvent",
  "TransformStream",
  "TypeError",
  "Uint16Array",
  "Uint32Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "undefined",
  "unescape",
  "URL",
  "URLSearchParams",
  "use",
  "UserActivation",
  "VideoTrack",
  "VideoTrackList",
  "WeakMap",
  "WeakRef",
  "WeakSet",
  "WebAssembly",
  "window",
  "Worker",
  "XMLHttpRequest",
]);

/**
 * Given a hook call (like useEffect(...)), return the list of external variables
 * used inside the callback but declared outside its scope (i.e. should be in deps array).
 */
export function getExternalDependenciesFromHook(
  call: CallExpression
): string[] {
  const [callback] = call.getArguments();
  if (!Node.isArrowFunction(callback) || !Node.isBlock(callback.getBody()))
    return [];

  const callbackStart = callback.getStart();
  const paramNames = new Set(callback.getParameters().map((p) => p.getName()));
  const used = new Set<string>();

  callback.getBody().forEachDescendant((node) => {
    if (!Node.isIdentifier(node)) return;

    const name = node.getText();
    if (paramNames.has(name) || GLOBALS.has(name)) return;

    const parent = node.getParent();
    const isPropAccess =
      Node.isPropertyAccessExpression(parent) && parent.getNameNode() === node;
    if (isPropAccess) return;

    const decl = node.getDefinitionNodes?.()[0];
    if (!decl || decl.getStart() < callbackStart) {
      used.add(name);
    }
  });

  return [...used].filter((name) => !GLOBALS.has(name)).sort();
}
