function hexToRgb(hex) {
  if (hex.substr(0, 1) === '#') {
    // eslint-disable-next-line no-param-reassign
    hex = hex.substr(1);
  }

  let r;
  let g;
  let b;

  r = hex.substr(0, 2);
  g = hex.substr(2, 2);
  b = hex.substr(4, 2);

  r = parseInt(r, 16);
  g = parseInt(g, 16);
  b = parseInt(b, 16);
  const a = 255;

  return {
    r, g, b, a,
  };
}

function drawLine(x1, y1, x2, y2, color, ctx, toolSize) {
  const delX = Math.abs(x2 - x1);
  const delY = Math.abs(y2 - y1);
  const signForX = x1 < x2 ? 1 : -1;
  const signForY = y1 < y2 ? 1 : -1;
  let error = delX - delY;

  function setPixel(rgb, x, y) {
    const imgData = ctx.createImageData(toolSize, toolSize);
    const rgbKeys = Object.keys(rgb);
    for (let i = 0; i < imgData.data.length; i += 1) {
      imgData.data[i] = rgb[rgbKeys[i % 4]];
    }
    ctx.putImageData(imgData, x, y);
  }
  setPixel(color, x2, y2, ctx, toolSize);

  while (x1 !== x2 || y1 !== y2) {
    setPixel(color, x1, y1, ctx, toolSize);
    const error2 = error * 2;
    if (error2 > -delY) {
      error -= delY;
      // eslint-disable-next-line no-param-reassign
      x1 += signForX;
    }
    if (error2 < delX) {
      error += delX;
      // eslint-disable-next-line no-param-reassign
      y1 += signForY;
    }
  }
}

function circle(X1, Y1, R, color, ctx, canvas) {
  let x = 0;
  let y = R;
  let delta = 1 - 2 * R;
  let error = 0;
  const imageData = ctx.createImageData(canvas.width, canvas.height);
  const C = hexToRgb(color);
  const putPixel = (xx, yy, c) => {
    const index = (yy * imageData.width + xx) * 4;
    imageData.data[index + 0] = c.r;
    imageData.data[index + 1] = c.g;
    imageData.data[index + 2] = c.b;
    imageData.data[index + 3] = c.a;
  };
  while (y >= 0) {
    putPixel(X1 + x, Y1 + y, C);
    putPixel(X1 + x, Y1 - y, C);
    putPixel(X1 - x, Y1 + y, C);
    putPixel(X1 - x, Y1 - y, C);
    error = 2 * (delta + y) - 1;
    if (delta < 0 && error <= 0) {
      // eslint-disable-next-line no-plusplus
      delta += 2 * ++x + 1;
      // eslint-disable-next-line no-continue
      continue;
    }
    error = 2 * (delta - x) - 1;
    if (delta > 0 && error > 0) {
      // eslint-disable-next-line no-plusplus
      delta += 1 - 2 * --y;
      // eslint-disable-next-line no-continue
      continue;
    }
    x += 1;
    delta += 2 * (x - y);
    y -= 1;
  }
  ctx.putImageData(imageData, 0, 0);
}


function getCoord(elem) {
  const canv = document.getElementById('canvas-overlay');
  const canvWidth = +getComputedStyle(canv).width.slice(0, -2);
  const canvasK = canvWidth / canv.width;
  const x = Math.floor(elem.offsetX / canvasK);
  const y = Math.floor(elem.offsetY / canvasK);
  return {
    x,
    y,
  };
}

function rgbToHex(r, g, b) {
  // eslint-disable-next-line no-bitwise
  return ((r << 16) | (g << 8) | b).toString(16);
}


function getCtx(id) {
  const canv = document.getElementById(id);
  const ctx = canv.getContext('2d');
  return {
    canv, ctx,
  };
}

export {
  getCoord,
  rgbToHex,
  getCtx,
  drawLine,
  hexToRgb,
  circle,
};
