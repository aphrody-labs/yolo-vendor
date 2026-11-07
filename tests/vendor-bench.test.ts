import { describe, expect, test } from "bun:test";
import { VENDOR_REGISTRY, syncVendorRepos } from "../scripts/vendor-sync";

describe("YOLO Vendor Upstream Registry", () => {
  test("registry includes all mandatory core categories", () => {
    const categories = new Set(VENDOR_REGISTRY.map((r) => r.category));
    expect(categories.has("mcp")).toBe(true);
    expect(categories.has("wasm")).toBe(true);
    expect(categories.has("webgpu")).toBe(true);
    expect(categories.has("standards")).toBe(true);
    expect(categories.has("graphics")).toBe(true);
    expect(categories.has("protocols")).toBe(true);
    expect(categories.has("compat")).toBe(true);
    expect(categories.has("runtime")).toBe(true);
    expect(categories.has("posix")).toBe(true);
  });

  test("registry contains MCP specifications", () => {
    const mcpSpec = VENDOR_REGISTRY.find((r) => r.id === "mcp-spec");
    expect(mcpSpec).toBeDefined();
    expect(mcpSpec?.org).toBe("modelcontextprotocol");
    expect(mcpSpec?.repo).toBe("specification");
  });

  test("registry contains WebAssembly and Component Model", () => {
    const wasmSpec = VENDOR_REGISTRY.find((r) => r.id === "wasm-spec");
    const wasmCm = VENDOR_REGISTRY.find((r) => r.id === "wasm-component-model");
    expect(wasmSpec).toBeDefined();
    expect(wasmCm).toBeDefined();
  });

  test("registry contains WebGPU & WGSL specs", () => {
    const webgpu = VENDOR_REGISTRY.find((r) => r.id === "webgpu");
    expect(webgpu).toBeDefined();
    expect(webgpu?.org).toBe("gpuweb");
  });

  test("registry contains WHATWG HTML & TC39 ECMA-262", () => {
    const html = VENDOR_REGISTRY.find((r) => r.id === "whatwg-html");
    const ecma = VENDOR_REGISTRY.find((r) => r.id === "tc39-ecma262");
    expect(html).toBeDefined();
    expect(ecma).toBeDefined();
  });

  test("registry contains Khronos Vulkan & OpenGL", () => {
    const vulkan = VENDOR_REGISTRY.find((r) => r.id === "khronos-vulkan");
    const opengl = VENDOR_REGISTRY.find((r) => r.id === "khronos-opengl");
    expect(vulkan).toBeDefined();
    expect(opengl).toBeDefined();
  });

  test("registry contains Wayland protocols & MDN compat", () => {
    const wayland = VENDOR_REGISTRY.find((r) => r.id === "wayland-protocols");
    const mdn = VENDOR_REGISTRY.find((r) => r.id === "mdn-compat");
    expect(wayland).toBeDefined();
    expect(mdn).toBeDefined();
  });

  test("registry contains Bun and Rust forks", () => {
    const bun = VENDOR_REGISTRY.find((r) => r.id === "bun-fork");
    const rust = VENDOR_REGISTRY.find((r) => r.id === "rust-lang");
    expect(bun).toBeDefined();
    expect(rust).toBeDefined();
  });

  test("registry contains uutils/coreutils and bytecodealliance/rustix POSIX specs", () => {
    const coreutils = VENDOR_REGISTRY.find((r) => r.id === "uutils-coreutils");
    const rustix = VENDOR_REGISTRY.find((r) => r.id === "rustix");
    expect(coreutils).toBeDefined();
    expect(coreutils?.org).toBe("uutils");
    expect(coreutils?.repo).toBe("coreutils");
    expect(coreutils?.category).toBe("posix");

    expect(rustix).toBeDefined();
    expect(rustix?.org).toBe("bytecodealliance");
    expect(rustix?.repo).toBe("rustix");
    expect(rustix?.category).toBe("posix");
  });

  test("registry contains oven-sh/bun, google/styleguide, google/skills, google/material-color-utilities, chromium, and aosp", () => {
    const bun = VENDOR_REGISTRY.find((r) => r.id === "bun-fork");
    expect(bun?.org).toBe("oven-sh");
    expect(bun?.repo).toBe("bun");

    const styleguide = VENDOR_REGISTRY.find((r) => r.id === "google-styleguide");
    expect(styleguide).toBeDefined();
    expect(styleguide?.org).toBe("google");
    expect(styleguide?.repo).toBe("styleguide");

    const skills = VENDOR_REGISTRY.find((r) => r.id === "google-skills");
    expect(skills).toBeDefined();
    expect(skills?.org).toBe("google");
    expect(skills?.repo).toBe("skills");

    const mcu = VENDOR_REGISTRY.find((r) => r.id === "google-material-color-utilities");
    expect(mcu).toBeDefined();
    expect(mcu?.repo).toBe("material-color-utilities");

    const chromium = VENDOR_REGISTRY.find((r) => r.id === "chromium");
    expect(chromium).toBeDefined();

    const aosp = VENDOR_REGISTRY.find((r) => r.id === "aosp");
    expect(aosp).toBeDefined();
  });

  test("dry-run sync planner executes within benchmark performance budget", async () => {
    const start = performance.now();
    const manifest = await syncVendorRepos({ dryRun: true });
    const duration = performance.now() - start;

    expect(manifest.length).toBe(VENDOR_REGISTRY.length);
    for (const item of manifest) {
      expect(item.status).toBe("dry-run-planned");
    }
    // High-performance planning must complete under 50ms
    expect(duration).toBeLessThan(50);
  });
});
