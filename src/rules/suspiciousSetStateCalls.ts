/**
 * List of suspicious setState calls
 */
export const suspiciousSetStateCalls = [
  // generics
  "setState",
  "setValue",
  "setData",
  "setContext",

  // frequently used
  "setUser",
  "setAuth",
  "setSession",
  "setTheme",
  "setLocale",
  "setLanguage",
  "setSettings",
  "setConfig",
  "setPermissions",
  "setProfile",

  // redux/zustand/atoms
  "dispatch",
  "updateStore",
  "setAtom",
  "useSetRecoilState",
  "useStore.setState",
  "store.setState",
  "setGlobalState",
];
