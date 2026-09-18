#!/usr/bin/env python3
"""Render the review-only social composition with installed Chrome, no packages."""
import argparse
import os
import signal
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import shutil
import struct
import subprocess
import tempfile
import threading

ROOT = Path(__file__).resolve().parent.parent


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--chrome", default=shutil.which("google-chrome") or
                        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
    args = parser.parse_args()
    output = ROOT / "images/social/hello-world-italy-v1.png"
    server = ThreadingHTTPServer(("127.0.0.1", 0), partial(QuietHandler, directory=str(ROOT)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    try:
        with tempfile.TemporaryDirectory(prefix="hello-world-social-") as profile:
            capture = Path(profile) / "capture.png"
            process = subprocess.Popen([
                args.chrome, "--headless", "--disable-gpu", "--hide-scrollbars",
                "--no-first-run", "--no-default-browser-check",
                "--disable-extensions", "--disable-background-networking", "--no-proxy-server",
                "--timeout=10000",
                f"--user-data-dir={profile}", "--force-device-scale-factor=1",
                "--window-size=1200,630", "--virtual-time-budget=5000",
                "--run-all-compositor-stages-before-draw", "--dump-dom",
                f"--screenshot={capture}",
                f"http://127.0.0.1:{server.server_port}/images/social/preview.html",
            ], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, start_new_session=True)
            try:
                stdout, stderr = process.communicate(timeout=20)
            except subprocess.TimeoutExpired:
                # Some Chrome builds finish headless capture but hang at shutdown.
                os.killpg(process.pid, signal.SIGTERM)
                stdout, stderr = process.communicate(timeout=5)
            if 'data-capture-ready="true"' not in stdout:
                raise RuntimeError("Composition did not finish loading: " + stdout[:500] + stderr[-1000:])
            data = capture.read_bytes()
            if struct.unpack(">II", data[16:24]) != (1200, 630):
                raise RuntimeError("Unexpected PNG dimensions")
            output.write_bytes(data)
    finally:
        server.shutdown()
        server.server_close()
    print(output)
    # Optional review copies on macOS; the original is the sole deliverable.
    if shutil.which("sips"):
        for width, height in [(600, 315), (300, 158)]:
            thumbnail = output.with_name(f"hello-world-italy-v1-{width}.png")
            subprocess.run(["sips", "-z", str(height), str(width), str(output),
                            "--out", str(thumbnail)], check=True, capture_output=True)
            print(thumbnail)


if __name__ == "__main__":
    main()
