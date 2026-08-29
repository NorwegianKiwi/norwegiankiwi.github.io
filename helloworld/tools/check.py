#!/usr/bin/env python3
"""Run the dependency-free maintenance checks for Hello World!."""

from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent


def fail(message: str) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(1)


def check_repository_hygiene() -> None:
    duplicate_names = sorted(
        path.relative_to(ROOT)
        for path in ROOT.rglob("* 2*")
        if path.is_file() and ".git" not in path.parts
    )
    if duplicate_names:
        names = "\n  ".join(str(path) for path in duplicate_names)
        fail(f"Possible duplicate files found:\n  {names}")
    print("OK: repository hygiene")


def run(command: list[str], label: str) -> None:
    print(f"\n== {label} ==", flush=True)
    result = subprocess.run(command, cwd=ROOT, check=False)
    if result.returncode != 0:
        raise SystemExit(result.returncode)


def main() -> None:
    check_repository_hygiene()

    node = shutil.which("node")
    if node is None:
        fail("Node.js is required to run the unit tests but was not found on PATH.")

    tests = sorted(str(path.relative_to(ROOT)) for path in (ROOT / "tests").glob("*.test.js"))
    if not tests:
        fail("No unit tests were found in tests/.")

    run([node, "--test", *tests], "JavaScript unit tests")
    run(
        [sys.executable, "tools/map_maintenance.py", "validate"],
        "Map, country, and generated-asset validation",
    )
    print("\nAll checks passed.")


if __name__ == "__main__":
    main()
