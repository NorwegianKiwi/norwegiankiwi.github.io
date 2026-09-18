# Social preview

`hello-world-italy-v1.png` is the approved 1200×630 social preview referenced by
the initial HTML's Open Graph and Twitter metadata. Its public URL is
`https://lanceolav.com/helloworld/images/social/hello-world-italy-v1.png`.
The 600px and 300px copies are size checks, not metadata targets.
Preserve the approved PNG unchanged unless a new design is explicitly approved.

For a future approved revision, regenerate from the repository root with installed Google Chrome:

```sh
python3 tools/render_social_preview.py
```

Use `--chrome /path/to/chrome` on other installations. Python uses only its
standard library; no packages, production server, or app build step is needed.
The temporary loopback server and isolated Chrome profile are cleaned up after
capture. On macOS, the installed `sips` utility also creates review thumbnails.

The fixed English composition uses Italy and the real Iberia and the Alps map
quiz alternatives, explicitly ordered Portugal, Spain, Italy, Austria. It
validates that set against the curriculum. It reads the existing Natural Earth
geometry, Nearby calculation, local SVG flags, app CSS colours and system font
stacks. The silhouette inset is omitted because the main shape is sufficient.
Only layout and sizing are specific to the image. No storage or random state
is used. Assets and fonts finish loading before capture readiness is signalled.

The HTML/JS/CSS remain vector/text until Chrome rasterizes the final PNG.
Regeneration is stable with the same source, Chrome and OS fonts; different
platform fonts or browser versions can change pixels. This is an English
sharing artifact, not an additional localized game screen.
