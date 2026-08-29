(function (root, factory) {
  "use strict";

  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GEOGRAFI_MAP_VIEW = Object.freeze(api);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value));
  }

  function parseViewBox(viewBox) {
    const [x, y, width, height] = viewBox.trim().split(/\s+/).map(Number);
    return { x, y, width, height };
  }

  function serializeViewBox(viewBox) {
    return [viewBox.x, viewBox.y, viewBox.width, viewBox.height].join(" ");
  }

  function viewBoxesEqual(first, second, tolerance = 0.01) {
    return ["x", "y", "width", "height"].every(
      (key) => Math.abs(first[key] - second[key]) < tolerance,
    );
  }

  function fitViewBoxToAspect(base, aspectRatio) {
    if (!Number.isFinite(aspectRatio) || aspectRatio <= 0) return { ...base };
    let width = base.width;
    let height = base.height;
    if (width / height < aspectRatio) {
      width = height * aspectRatio;
    } else {
      height = width / aspectRatio;
    }
    const centerX = base.x + base.width / 2;
    const centerY = base.y + base.height / 2;
    return {
      x: centerX - width / 2,
      y: centerY - height / 2,
      width,
      height,
    };
  }

  function zoomForViewport(viewport) {
    return viewport ? viewport.base.width / viewport.view.width : 1;
  }

  function clampView(view, base, maximumZoom) {
    const width = clamp(view.width, base.width / maximumZoom, base.width);
    const height = clamp(view.height, base.height / maximumZoom, base.height);
    return {
      x: clamp(view.x, base.x, base.x + base.width - width),
      y: clamp(view.y, base.y, base.y + base.height - height),
      width,
      height,
    };
  }

  function nearbyViewBox(
    base,
    targetBounds,
    extent = base,
    { padding = 3, maximumZoom = 8 } = {},
  ) {
    const targetWidth = Math.max(Number(targetBounds?.width) || 0, 0);
    const targetHeight = Math.max(Number(targetBounds?.height) || 0, 0);
    const scale = clamp(
      Math.max(
        (targetWidth * padding) / base.width,
        (targetHeight * padding) / base.height,
        1 / maximumZoom,
      ),
      1 / maximumZoom,
      1,
    );
    if (scale >= 1) return { ...base };

    const width = base.width * scale;
    const height = base.height * scale;
    const centerX = (Number(targetBounds?.x) || 0) + targetWidth / 2;
    const centerY = (Number(targetBounds?.y) || 0) + targetHeight / 2;
    const clampExtent =
      extent.width >= width && extent.height >= height ? extent : base;
    return {
      x: clamp(
        centerX - width / 2,
        clampExtent.x,
        clampExtent.x + clampExtent.width - width,
      ),
      y: clamp(
        centerY - height / 2,
        clampExtent.y,
        clampExtent.y + clampExtent.height - height,
      ),
      width,
      height,
    };
  }

  function midpoint(first, second) {
    return {
      x: (first.x + second.x) / 2,
      y: (first.y + second.y) / 2,
    };
  }

  function distance(first, second) {
    return Math.hypot(second.x - first.x, second.y - first.y);
  }

  function transformPoint(point, matrix) {
    return {
      x: point.x * matrix.a + point.y * matrix.c + matrix.e,
      y: point.x * matrix.b + point.y * matrix.d + matrix.f,
    };
  }

  return Object.freeze({
    clamp,
    clampView,
    distance,
    fitViewBoxToAspect,
    midpoint,
    nearbyViewBox,
    parseViewBox,
    serializeViewBox,
    transformPoint,
    viewBoxesEqual,
    zoomForViewport,
  });
});
