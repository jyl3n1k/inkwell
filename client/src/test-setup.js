import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

let storageWorks;
try {
  storageWorks =
    typeof globalThis.localStorage?.getItem === "function" &&
    typeof globalThis.localStorage?.setItem === "function";
} catch {
  storageWorks = false;
}

if (!storageWorks) {
  const store = new Map();
  const storage = {
    getItem: (key) => store.get(String(key)) ?? null,
    setItem: (key, value) => store.set(String(key), String(value)),
    removeItem: (key) => store.delete(String(key)),
    clear: () => store.clear(),
  };

  for (const target of new Set([globalThis, window])) {
    Object.defineProperty(target, "localStorage", {
      configurable: true,
      value: storage,
    });
  }
}

afterEach(() => {
  cleanup();
  localStorage.clear();
});
