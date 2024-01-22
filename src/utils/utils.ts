export const getDistance = (
  p1: { x: number; y: number },
  p2: { x: number; y: number }
) => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  return Math.sqrt(dx * dx + dy * dy);
};

export const getAngle = (
  p1: { x: number; y: number },
  p2: { x: number; y: number }
) => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  return Math.atan2(dy, dx);
};

export const getScrupedPercent = (
  ctx: CanvasRenderingContext2D | null,
  width: number,
  height: number
) => {
  const pixels = ctx?.getImageData(0, 0, width, height);
  if (!pixels) return 0;
  const gap = 32;
  const total = pixels.data.length / gap;
  let count = 0;

  for (let i = 0; i < pixels.data.length - 3; i += gap) {
    if (pixels.data[i + 3] === 0) count++;
  }
  return Math.round((count / total) * 100);
};

export const drawImageCenter = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D | null,
  image: HTMLImageElement
) => {
  const cw = canvas.width;
  const ch = canvas.height;

  const iw = image.width;
  const ih = image.height;

  const ir = ih / iw;
  const cr = ch / cw;

  let sx, sy, sw, sh;

  if (ir >= cr) {
    sw = iw;
    sh = sw * (ch / cw);
  } else {
    sh = ih;
    sw = sh * (cw / ch);
  }
  sx = iw / 2 - sw / 2;
  sy = ih / 2 - sh / 2;

  ctx?.drawImage(image, sx, sy, sw, sh, 0, 0, cw, ch);
};
