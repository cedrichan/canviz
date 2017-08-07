export class MockCanvasRenderingContext2d implements CanvasRenderingContext2D {
  canvas: HTMLCanvasElement;

  fillStyle: string | CanvasGradient | CanvasPattern;
  font: string;
  globalAlpha: number;
  globalCompositeOperation: string;
  lineCap: string;
  lineDashOffset: number;
  lineJoin: string;
  lineWidth: number;
  miterLimit: number;
  msFillRule: CanvasFillRule;
  msImageSmoothingEnabled: boolean;
  shadowBlur: number;
  shadowColor: string;
  shadowOffsetX: number;
  shadowOffsetY: number;
  strokeStyle: string | CanvasGradient | CanvasPattern;
  textAlign: string;
  textBaseline: string;
  mozImageSmoothingEnabled: boolean;
  webkitImageSmoothingEnabled: boolean;
  oImageSmoothingEnabled: boolean;
  imageSmoothingEnabled: boolean;

  constructor(canvas: MockCanvas) {
    this.canvas = canvas as HTMLCanvasElement;
  }

  beginPath(): void {}
  clearRect(x: number, y: number, w: number, h: number): void {}
  clip(fillRule?: string): void {}
  createImageData(imageDataOrSw: number | ImageData, sh?: number): ImageData {
    throw new Error('Not implemented');
  }
  createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient {
    throw new Error('Not implemented');
  }
  createPattern(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, repetition: string): CanvasPattern {
    throw new Error('Not implemented');
  }
  createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient {
    throw new Error('Not implemented');
  }
  drawImage(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, offsetX: number, offsetY: number, width?: number, height?: number, canvasOffsetX?: number, canvasOffsetY?: number, canvasImageWidth?: number, canvasImageHeight?: number): void {}
  fill(fillRule?: string): void {}
  fillRect(x: number, y: number, w: number, h: number): void {}
  fillText(text: string, x: number, y: number, maxWidth?: number): void {}
  getImageData(sx: number, sy: number, sw: number, sh: number): ImageData {
    throw new Error('Not implemented');
  }
  getLineDash(): number[] {
    throw new Error('Not implemented');
  }
  isPointInPath(x: number, y: number, fillRule?: string): boolean {
    throw new Error('Not implemented');
  }
  measureText(text: string): TextMetrics {
    throw new Error('Not implemented');
  }
  putImageData(imagedata: ImageData, dx: number, dy: number, dirtyX?: number, dirtyY?: number, dirtyWidth?: number, dirtyHeight?: number): void {}
  restore(): void {}
  rotate(angle: number): void {}
  save(): void {}
  scale(x: number, y: number): void {}
  setLineDash(segments: number[]): void {}
  setTransform(m11: number, m12: number, m21: number, m22: number, dx: number, dy: number): void {}
  stroke(): void {}
  strokeRect(x: number, y: number, w: number, h: number): void {}
  strokeText(text: string, x: number, y: number, maxWidth?: number): void {}
  transform(m11: number, m12: number, m21: number, m22: number, dx: number, dy: number): void {}
  translate(x: number, y: number): void {}

  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void {}
  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void {}
  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void {}
  closePath(): void {}
  ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void {}
  lineTo(x: number, y: number): void {}
  moveTo(x: number, y: number): void {}
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void {}
  rect(x: number, y: number, w: number, h: number): void {}

  drawFocusIfNeeded() {}
}

export default class MockCanvas {
  height: number;
  width: number;

  getContext(contextId: "2d", contextAttributes?: Canvas2DContextAttributes): CanvasRenderingContext2D | null;
  getContext(contextId: "webgl" | "experimental-webgl", contextAttributes?: WebGLContextAttributes): WebGLRenderingContext | null;
  getContext(contextId: string, contextAttributes?: {}): CanvasRenderingContext2D | WebGLRenderingContext | null {
    if (contextId === '2d') {
      return new MockCanvasRenderingContext2d(this);
    } else {
      throw new Error('MockCanvas only supports 2d contexts');
    }
  }

  toDataURL(type?: string, ...args: any[]): string {
    throw new Error('Not implemented');
  }

  toBlob(callback: (result: Blob | null) => void, ...args: any []): void {
    throw new Error('Not implemented');
  }
}
