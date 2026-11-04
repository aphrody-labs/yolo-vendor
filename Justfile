# Default recipe
default:
    @just --list

# Synchronize vendor repositories (sparse / shallow mirror or metadata)
sync:
    bun run scripts/vendor-sync.ts

# Dry run sync
sync-dry:
    bun run scripts/vendor-sync.ts --dry-run

# Run test suite
test:
    bun test

# Run vendor benchmarks
bench:
    bun test tests/vendor-bench.test.ts
