import {
  useConsoleLogger,
  useManyDeps,
  useMissingCleanup,
  useMutatesContext,
  useUnsafeFetcher,
} from "./faultyHooks";

useMutatesContext();
useManyDeps(1, 2, 3, 4, 5, 6, 7);
useUnsafeFetcher("123");
useMissingCleanup();
useConsoleLogger();
