import {
  createBatch,
  createGameLoop,
  createStage,
  createViewport,
  createViewportAwareInputHandler,
  createWhiteTexture,
  drawLine,
  drawPolygon
} from 'gdxjs';
import VisibilityPolygon from './visibility';
import './index.css';

const width = 500;
const height = 500;

const setup = (polygons, segments) => {
  polygons.push([
    [-1, -1],
    [width + 1, -1],
    [width + 1, height + 1],
    [-1, height + 1]
  ]);
  polygons.push([
    [240, 240],
    [260, 240],
    [260, 260],
    [240, 260]
  ]);
  polygons.push([
    [240, 260],
    [260, 260],
    [260, 280],
    [240, 280]
  ]);
  polygons.push([
    [260, 240],
    [280, 240],
    [280, 260],
    [260, 260]
  ]);
  polygons.push([
    [440, 240],
    [460, 240],
    [460, 260],
    [440, 260]
  ]);
  polygons.push([
    [250, 100],
    [260, 140],
    [240, 140]
  ]);
  polygons.push([
    [280, 100],
    [290, 60],
    [270, 60]
  ]);
  polygons.push([
    [310, 100],
    [320, 140],
    [300, 140]
  ]);
  polygons.push([
    [50, 450],
    [60, 370],
    [70, 450]
  ]);
  polygons.push([
    [450, 450],
    [460, 370],
    [470, 450]
  ]);
  polygons.push([
    [50, 50],
    [60, 30],
    [70, 50]
  ]);
  polygons.push([
    [450, 50],
    [460, 30],
    [470, 50]
  ]);
  polygons.push([
    [140, 340],
    [160, 240],
    [180, 340],
    [360, 340],
    [360, 360],
    [250, 390],
    [140, 360]
  ]);
  polygons.push([
    [140, 140],
    [150, 130],
    [150, 145],
    [165, 150],
    [160, 160],
    [140, 160]
  ]);
  for (var i = 0; i < 20; ++i) {
    polygons.push([
      [240, 410 + i * 4],
      [245, 410 + i * 4],
      [245, 411 + i * 4],
      [240, 411 + i * 4]
    ]);
  }
  segments = VisibilityPolygon.convertToSegments(polygons);
  segments.push([
    [100, 150],
    [100, 100]
  ]);
  segments.push([
    [50, 125],
    [100, 125]
  ]); // intersects
  segments.push([
    [450, 100],
    [400, 150]
  ]);
  segments.push([
    [450, 150],
    [400, 100]
  ]); // intersects
  segments.push([
    [50, 250],
    [100, 250]
  ]);
  segments.push([
    [50, 250],
    [100, 250]
  ]); // duplicate
  segments.push([
    [140, 40],
    [140, 60]
  ]);
  segments.push([
    [140, 60],
    [160, 60]
  ]);
  segments.push([
    [160, 60],
    [160, 40]
  ]);
  segments.push([
    [160, 40],
    [140, 40]
  ]);
  segments = VisibilityPolygon.breakIntersections(segments);
  return segments;
};

const init = () => {
  const stage = createStage();
  const canvas = stage.getCanvas();

  const viewport = createViewport(canvas, width, height);
  const gl = viewport.getContext();
  const camera = viewport.getCamera();

  const inputHandler = createViewportAwareInputHandler(canvas, viewport);

  const batch = createBatch(gl);
  const whiteTex = createWhiteTexture(gl);

  const polygons = [];
  let segments = [];

  segments = setup(polygons, segments);

  gl.clearColor(0, 0, 0, 1);
  const verts = [];
  createGameLoop(delta => {
    gl.clear(gl.COLOR_BUFFER_BIT);
    batch.setProjection(camera.combined);
    batch.begin();

    // for (let polygon of polygons) {
    //   verts.length = 0;
    //   for (let pair of polygon) {
    //     verts.push(pair[0], pair[1]);
    //   }
    //   drawPolygon(batch, whiteTex, verts, 2, 1, 0, 0);
    // }

    for (let segment of segments) {
      drawLine(
        batch,
        whiteTex,
        segment[0][0],
        segment[0][1],
        segment[1][0],
        segment[1][1],
        1,
        1,
        1,
        1
      );
    }

    const { x, y } = inputHandler.getTouchedWorldCoord();
    const visibility = VisibilityPolygon.computeViewport(
      [x, y],
      segments,
      [x - 200, y - 200],
      [x + 200, y + 200]
    );
    verts.length = 0;
    for (let i = 1; i < visibility.length; i++) {
      const v0 = visibility[i - 1];
      const v1 = visibility[i];
      verts.push(x, y, v0[0], v0[1], v1[0], v1[1]);
      drawPolygon(batch, whiteTex, verts, 1, 0, 1, 0);
    }
    // drawPolygon(batch, whiteTex, verts, 5, 0, 1, 0);

    batch.end();
  });
};

init();
