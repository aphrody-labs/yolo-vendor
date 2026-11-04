# yolo-vendor

Upstream specifications, standards, and vendor mirrors manager for YOLO.

## Tracked Repositories

| Domain | Repository | Purpose |
|---|---|---|
| **MCP** | `modelcontextprotocol/specification` | Official MCP Protocol Spec |
| **MCP** | `modelcontextprotocol/typescript-sdk` | Reference TS SDK |
| **WebAssembly** | `WebAssembly/spec` | Wasm Core Specification |
| **WebAssembly** | `WebAssembly/component-model` | Wasm Component Model Spec |
| **WebGPU** | `gpuweb/gpuweb` | WebGPU Specification & WGSL |
| **WHATWG** | `whatwg/html` | HTML Living Standard |
| **TC39** | `tc39/ecma262` | ECMAScript Language Spec |
| **Khronos** | `KhronosGroup/Vulkan-Headers` | Vulkan API Headers & Registry |
| **Khronos** | `KhronosGroup/OpenGL-Registry` | OpenGL / EGL Registry XMLs |
| **Wayland** | `wayland/wayland-protocols` | Wayland Compositor Protocols |
| **MDN** | `mdn/browser-compat-data` | Browser API Compatibility Data |
| **Bun** | `oven-sh/bun` | Bun Runtime & Native bindings |
| **Rust** | `rust-lang/rust` | Rust Compiler & Standard Library |

## Usage

```bash
# Sync vendor repositories (dry-run)
bun run sync:dry

# Execute sync
bun run sync

# Run tests and benchmarks
bun test
```
