# AGENTS.md - YOLO Vendor & Upstream Forks Specialist

## Mission & Scope
The `yolo-vendor` repository hosts mirrors, specifications, headers, and upstream synchronization scripts for the YOLO ecosystem.

### Tracked Upstreams:
1. **MCP (Model Context Protocol)**: `modelcontextprotocol/specification`, `modelcontextprotocol/typescript-sdk`
2. **WebAssembly**: `WebAssembly/spec`, `WebAssembly/component-model`
3. **WebGPU**: `gpuweb/gpuweb`
4. **W3C Standards & WHATWG**: `whatwg/html`, `tc39/ecma262`
5. **KhronosGroup**: `KhronosGroup/Vulkan-Headers`, `KhronosGroup/OpenGL-Registry`
6. **Wayland**: `wayland/wayland-protocols`
7. **Mozilla / MDN**: `mdn/browser-compat-data`
8. **Bun & Rust Ecosystem Forks**: `oven-sh/bun`, `rust-lang/rust`

## Operating Guidelines
- Upstreams are defined declaratively in `scripts/vendor-sync.ts`.
- Shallow clones (`--depth 1 --filter=blob:none`) or API manifest queries are used to minimize disk usage while preserving full spec/header availability.
- All automation must run via Bun v1.4.4+.
- Run `just test` or `bun test` to verify integrity and benchmarks.
