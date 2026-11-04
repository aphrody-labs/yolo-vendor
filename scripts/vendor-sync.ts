#!/usr/bin/env bun
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export interface VendorRepo {
  id: string;
  name: string;
  org: string;
  repo: string;
  category: "mcp" | "wasm" | "webgpu" | "standards" | "graphics" | "protocols" | "compat" | "runtime";
  defaultBranch: string;
  subpathFilter?: string[];
  description: string;
}

export const VENDOR_REGISTRY: VendorRepo[] = [
  {
    id: "mcp-spec",
    name: "Model Context Protocol Spec",
    org: "modelcontextprotocol",
    repo: "specification",
    category: "mcp",
    defaultBranch: "main",
    description: "Official Model Context Protocol Specification",
  },
  {
    id: "mcp-sdk",
    name: "MCP TypeScript SDK",
    org: "modelcontextprotocol",
    repo: "typescript-sdk",
    category: "mcp",
    defaultBranch: "main",
    description: "Reference TypeScript SDK for MCP",
  },
  {
    id: "wasm-spec",
    name: "WebAssembly Spec",
    org: "WebAssembly",
    repo: "spec",
    category: "wasm",
    defaultBranch: "main",
    description: "WebAssembly core formal specification",
  },
  {
    id: "wasm-component-model",
    name: "Wasm Component Model",
    org: "WebAssembly",
    repo: "component-model",
    category: "wasm",
    defaultBranch: "main",
    description: "WebAssembly component model definitions and WIT standards",
  },
  {
    id: "webgpu",
    name: "WebGPU Specification",
    org: "gpuweb",
    repo: "gpuweb",
    category: "webgpu",
    defaultBranch: "main",
    description: "W3C WebGPU specification and shading language (WGSL)",
  },
  {
    id: "whatwg-html",
    name: "HTML Living Standard",
    org: "whatwg",
    repo: "html",
    category: "standards",
    defaultBranch: "main",
    description: "WHATWG HTML living standard source",
  },
  {
    id: "tc39-ecma262",
    name: "ECMAScript 262",
    org: "tc39",
    repo: "ecma262",
    category: "standards",
    defaultBranch: "main",
    description: "ECMAScript Language Specification",
  },
  {
    id: "khronos-vulkan",
    name: "Vulkan Headers",
    org: "KhronosGroup",
    repo: "Vulkan-Headers",
    category: "graphics",
    defaultBranch: "main",
    description: "Vulkan header files and API XML registry",
  },
  {
    id: "khronos-opengl",
    name: "OpenGL Registry",
    org: "KhronosGroup",
    repo: "OpenGL-Registry",
    category: "graphics",
    defaultBranch: "main",
    description: "Khronos OpenGL, OpenGL ES, and EGL Registry",
  },
  {
    id: "wayland-protocols",
    name: "Wayland Protocols",
    org: "wayland",
    repo: "wayland-protocols",
    category: "protocols",
    defaultBranch: "master",
    description: "Wayland protocol specifications and extensions XML",
  },
  {
    id: "mdn-compat",
    name: "MDN Browser Compat Data",
    org: "mdn",
    repo: "browser-compat-data",
    category: "compat",
    defaultBranch: "main",
    description: "Data metrics on web features and browser compatibility",
  },
  {
    id: "bun-fork",
    name: "Bun Runtime",
    org: "oven-sh",
    repo: "bun",
    category: "runtime",
    defaultBranch: "main",
    description: "Fast JavaScript runtime & Zig / WebKit native upstream",
  },
  {
    id: "rust-lang",
    name: "Rust Compiler",
    org: "rust-lang",
    repo: "rust",
    category: "runtime",
    defaultBranch: "master",
    description: "Empowering everyone to build reliable and efficient software",
  },
];

export interface SyncOptions {
  dryRun?: boolean;
  targetDir?: string;
  vendorId?: string;
}

export async function syncVendorRepos(options: SyncOptions = {}) {
  const isDryRun = options.dryRun ?? false;
  const targetDir = options.targetDir ?? join(process.cwd(), "mirrors");

  console.log(`[yolo-vendor] Starting sync (dryRun: ${isDryRun})...`);
  console.log(`[yolo-vendor] Target directory: ${targetDir}`);

  if (!existsSync(targetDir) && !isDryRun) {
    mkdirSync(targetDir, { recursive: true });
  }

  const manifest: Array<{ id: string; repo: string; status: string; timestamp: string }> = [];

  const targets = options.vendorId
    ? VENDOR_REGISTRY.filter((v) => v.id === options.vendorId)
    : VENDOR_REGISTRY;

  for (const vendor of targets) {
    const gitUrl = `https://github.com/${vendor.org}/${vendor.repo}.git`;
    const repoDir = join(targetDir, vendor.id);

    console.log(`-> [${vendor.category.toUpperCase()}] ${vendor.name} (${gitUrl})`);

    if (isDryRun) {
      manifest.push({
        id: vendor.id,
        repo: `${vendor.org}/${vendor.repo}`,
        status: "dry-run-planned",
        timestamp: new Date().toISOString(),
      });
      continue;
    }

    if (existsSync(repoDir)) {
      console.log(`   Already exists at ${repoDir}. Running git remote update...`);
      const proc = Bun.spawn(["git", "-C", repoDir, "remote", "update"], {
        stdout: "pipe",
        stderr: "pipe",
      });
      await proc.exited;
      manifest.push({
        id: vendor.id,
        repo: `${vendor.org}/${vendor.repo}`,
        status: "updated",
        timestamp: new Date().toISOString(),
      });
    } else {
      console.log(`   Cloning shallow mirror into ${repoDir}...`);
      const proc = Bun.spawn(
        [
          "git",
          "clone",
          "--depth",
          "1",
          "--filter=blob:none",
          "--no-checkout",
          gitUrl,
          repoDir,
        ],
        { stdout: "pipe", stderr: "pipe" }
      );
      const code = await proc.exited;
      manifest.push({
        id: vendor.id,
        repo: `${vendor.org}/${vendor.repo}`,
        status: code === 0 ? "cloned" : `failed(${code})`,
        timestamp: new Date().toISOString(),
      });
    }
  }

  const manifestPath = join(targetDir, "manifest.json");
  if (!isDryRun) {
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`[yolo-vendor] Manifest written to ${manifestPath}`);
  }

  console.log(`[yolo-vendor] Synchronization pass completed for ${targets.length} upstreams.`);
  return manifest;
}

if (import.meta.main) {
  const dryRun = process.argv.includes("--dry-run");
  await syncVendorRepos({ dryRun });
}
