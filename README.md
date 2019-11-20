# node-sass SEGFAULT reproduction

To reproduce install `npm install` then run `npm run build` in the root. In this repository it doesn't happen 100% of the time so you may have to run it multiple times.

# How to reproduce

This repository uses a method that is very similar to the build process of [TSDX](https://github.com/jaredpalmer/tsdx/). It runs multiple build processes in parallel. TSDX uses a different configuration for each build, but for simplicity sake we use the most minimalistic config for all builds. The entire compilation configuration can be seen in `build.js`. The entire source required to reproduce this is in `src`.

NOTE: On macOS this is also reproducible with only a single build process.

Run `npm run build` to reproduce the issue. You will get one of the following three possible outcomes:

## Possible outcomes

1. **Segmentation fault.** Your stack trace may differ.
```
MartijnHols-MacBook-Pro:node-sass-segfault-repro martijnhols$ npm run build

> node-sass-segfault-repro@0.1.0 build /Users/martijnhols/Workspace/node-sass-segfault-repro
> node build.js

Attempting to build. This will regularly trigger a SIGSEGV (segmentation fault) error. You may need to run this command multiple times to trigger it.
Attempting to build. This will regularly trigger a SIGSEGV (segmentation fault) error. You may need to run this command multiple times to trigger it.
The expected error occurred. Exiting now which may trigger the segmentation fault error in the still running process(es).
PID 21831 received SIGSEGV for address: 0x0
0   segfault-handler.node               0x000000010468f066 _ZL16segfault_handleriP9__siginfoPv + 310
1   libsystem_platform.dylib            0x00007fff6a6b7b1d _sigtramp + 29
2   binding.node                        0x0000000107a8c4cc _ZN4Sass9ExceptionL17def_nesting_limitE + 32764
3   binding.node                        0x00000001079bb540 _ZN4Sass7InspectclEPNS_5ColorE + 1106
4   binding.node                        0x00000001079b853e _ZN4Sass7InspectclEPNS_11DeclarationE + 434
Segmentation fault: 11
```
More common stack trace:
```
MartijnHols-MacBook-Pro:node-sass-segfault-repro martijnhols$ npm run build

> node-sass-segfault-repro@0.1.0 build /Users/martijnhols/Workspace/node-sass-segfault-repro
> node build.js

Attempting to build. This will regularly trigger a SIGSEGV (segmentation fault) error. You may need to run this command multiple times to trigger it.
Attempting to build. This will regularly trigger a SIGSEGV (segmentation fault) error. You may need to run this command multiple times to trigger it.
The expected error occurred. Exiting now which may trigger the segmentation fault error in the still running process(es).
PID 21911 received SIGSEGV for address: 0x300000020
0   segfault-handler.node               0x000000010468f066 _ZL16segfault_handleriP9__siginfoPv + 310
1   libsystem_platform.dylib            0x00007fff6a6b7b1d _sigtramp + 29
2   binding.node                        0x0000000107c8c4cc _ZN4Sass9ExceptionL17def_nesting_limitE + 32764
3   binding.node                        0x0000000107bbb540 _ZN4Sass7InspectclEPNS_5ColorE + 1106
4   binding.node                        0x0000000107bb853e _ZN4Sass7InspectclEPNS_11DeclarationE + 434
5   binding.node                        0x0000000107bca9a9 _ZN4Sass6OutputclEPNS_7RulesetE + 1231
6   binding.node                        0x0000000107bb7ac4 _ZN4Sass7InspectclEPNS_5BlockE + 120
7   binding.node                        0x0000000107b4793c _ZN4Sass7Context6renderENS_10SharedImplINS_5BlockEEE + 44
8   binding.node                        0x0000000107c08b69 sass_compiler_execute + 169
9   binding.node                        0x0000000107c086b9 _ZL20sass_compile_contextP12Sass_ContextPN4Sass7ContextE + 34
10  node                                0x00000001008a95d6 worker + 196
11  libsystem_pthread.dylib             0x00007fff6a6c2d36 _pthread_start + 125
12  libsystem_pthread.dylib             0x00007fff6a6bf58f thread_start + 15
Segmentation fault: 11
```

2. **The build freezes.** You'll see the following in your console, and the script will never stop running.

```
MartijnHols-MacBook-Pro:node-sass-segfault-repro martijnhols$ npm run build

> node-sass-segfault-repro@0.1.0 build /Users/martijnhols/Workspace/node-sass-segfault-repro
> node build.js

Attempting to build. This will regularly trigger a SIGSEGV (segmentation fault) error. You may need to run this command multiple times to trigger it.
Attempting to build. This will regularly trigger a SIGSEGV (segmentation fault) error. You may need to run this command multiple times to trigger it.
The expected error occurred. Exiting now which may trigger the segmentation fault error in the still running process(es).

```

3. **The build succeeds.** You'll get the same output as when the build freezes, except this time it will end properly.

## Observations

On GitHub actions I can only reproduce outcomes 2 and 3 and only when running multiple builds in parallel. I can't get the segmentation fault to occur on GitHub actions, but perhaps the freeze is a result of that?

On my mac I can randomly reproduce outcomes 1 and 3 with only a single build (`MAX_SIMULTANEOUS_BUILDS=1 npm run build`). When running builds in parallel (default), all outcomes are possible.

# Segmentation fault debugging

To get debug information about the SEGFAULT I installed the `segfault-handler` library. This prints a system stack trace when a segmentation fault occurs like so:

```
PID 11003 received SIGSEGV for address: 0x404000020
0   segfault-handler.node               0x000000010458f066 _ZL16segfault_handleriP9__siginfoPv + 310
1   libsystem_platform.dylib            0x00007fff6a6b7b1d _sigtramp + 29
2   binding.node                        0x000000010738c4cc _ZN4Sass9ExceptionL17def_nesting_limitE + 32764
3   binding.node                        0x00000001072bb540 _ZN4Sass7InspectclEPNS_5ColorE + 1106
4   binding.node                        0x00000001072b853e _ZN4Sass7InspectclEPNS_11DeclarationE + 434
5   binding.node                        0x00000001072ca9a9 _ZN4Sass6OutputclEPNS_7RulesetE + 1231
6   binding.node                        0x00000001072b7ac4 _ZN4Sass7InspectclEPNS_5BlockE + 120
7   binding.node                        0x000000010724793c _ZN4Sass7Context6renderENS_10SharedImplINS_5BlockEEE + 44
8   binding.node                        0x0000000107308b69 sass_compiler_execute + 169
9   binding.node                        0x00000001073086b9 _ZL20sass_compile_contextP12Sass_ContextPN4Sass7ContextE + 34
10  node                                0x00000001008a95d6 worker + 196
11  libsystem_pthread.dylib             0x00007fff6a6c2d36 _pthread_start + 125
12  libsystem_pthread.dylib             0x00007fff6a6bf58f thread_start + 15
```
