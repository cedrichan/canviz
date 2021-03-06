"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var affine_matrix_1 = require("./affine_matrix");
var mock_canvas_1 = require("./mock_canvas");
/**
 * Cross-platform method to create a canvas
 */
function createCanvas() {
    // Browser support
    if (typeof document !== 'undefined') {
        return document.createElement('canvas');
    }
    else {
        // Attempt to use node-canvas
        try {
            // let Canvas = require('canvas').Canvas;
            // return new Canvas();
            throw new Error('Node canvas not supported yet');
            // No node canvas?  No problem! Mock it up.
        }
        catch (err) {
            return new mock_canvas_1.default();
        }
    }
}
var Canvas = (function () {
    function Canvas(element) {
        if (element === undefined) {
            element = createCanvas();
        }
        // Basic setup
        this.el = element;
        this.ctx = element.getContext('2d');
        this._saveCount = 0;
        this._ratio = 0;
        this._transformStack = [new affine_matrix_1.default()];
        // Rendering hints
        {
            // These are node-canvas specific
            var ctx = this.ctx;
            ctx.patternQuality = 'best';
            ctx.textDrawingMode = 'path';
            ctx.antialias = 'subpixel';
            // These aren't
            ctx.webkitImageSmoothingEnabled = true;
        }
    }
    Object.defineProperty(Canvas.prototype, "width", {
        /**
         * Logical width
         */
        get: function () { return this._width; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "height", {
        /**
         * Logical height
         */
        get: function () { return this._height; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "_transform", {
        get: function () {
            return this._transformStack[this._transformStack.length - 1];
        },
        set: function (v) {
            this._transformStack[this._transformStack.length - 1] = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "canvas", {
        /**
         * This exists mostly for parity with the standard CanvasRenderingContext2D
         */
        get: function () {
            return this.el;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets the canvas size and scaling ratio
     */
    Canvas.prototype.size = function (width, height, scaling) {
        if (scaling === void 0) { scaling = 1; }
        this._width = width;
        this._height = height;
        this.scaling = scaling;
        // Our Mock and node-canvas implementations might not have a .style
        if (!this.el.style) {
            this.el.style = {};
        }
        // The element's CSS size doesn't need to worry about pixel ratios,
        // so we can just set it directly.
        this.el.style.width = width * scaling + 'px';
        this.el.style.height = height * scaling + 'px';
        // Calculate our final ratio
        this._ratio = scaling * (typeof window === 'undefined' ? 1 : window.devicePixelRatio);
        // Set the underlying height of the canvas using the proper ratio
        // for the backing store.
        this.el.height = height * this._ratio;
        this.el.width = width * this._ratio;
        // Apply an initial scale to the canvas to account for the scale ratio
        this.ctx.scale(this._ratio, this._ratio);
    };
    /**
     * Clears the canvas as completely as possible.  All content is erased,
     * matrices reset, global property like alpha, composite operations, etc
     * are reset to defaults.
     */
    Canvas.prototype.clear = function () {
        this.resetTransform();
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.textAlign = 'left';
        this.ctx.globalAlpha = 1;
        this.ctx.clearRect(0, 0, this.width, this.height);
    };
    /**
     * Resets the transformation matrix on this canvas.  Polyfilled for
     * browsers without native support.
     */
    Canvas.prototype.resetTransform = function () {
        var ctx = this.ctx; // resetTransform() isn't in the TS defs
        if (ctx.resetTransform) {
            ctx.resetTransform();
        }
        else {
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
        // Re-apply our scaling ratio to keep things sane
        this.ctx.scale(this._ratio, this._ratio);
        // Reset our transform matrix.  Ignore the device pixel ratio and just
        // use the base scaling.
        this._transformStack = [new affine_matrix_1.default().scale(this.scaling, this.scaling)];
    };
    Object.defineProperty(Canvas.prototype, "currentTransform", {
        /**
         * Gets the current transform matrix.  The matrix returned here is a
         * copy, so feel free to go wild and modify it to your heart's content.
         *
         * Polyfill, kinda.
         */
        get: function () {
            return new affine_matrix_1.default(this._transform);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Push state onto the state stack
     */
    Canvas.prototype.save = function () {
        this._saveCount++;
        this._transformStack.push(new affine_matrix_1.default(this._transform));
        this.ctx.save();
    };
    /**
     * Pop state from the state stack
     */
    Canvas.prototype.restore = function () {
        if (this._saveCount > 0) {
            this.ctx.restore();
            this._transformStack.pop();
            this._saveCount--;
        }
    };
    // These transform functions are delegated to the underlying CanvasRenderingContext2D,
    // but we also copy their actions to our stored transform matrix.
    Canvas.prototype.scale = function (x, y) {
        if (y === undefined) {
            y = x;
        }
        this._transform = this._transform.scale(x, y);
        this.ctx.scale(x, y);
    };
    Canvas.prototype.rotate = function (rad) {
        this._transform = this._transform.rotate(rad);
        this.ctx.rotate(rad);
    };
    Canvas.prototype.translate = function (x, y) {
        this._transform = this._transform.translate(x, y);
        this.ctx.translate(x, y);
    };
    Canvas.prototype.transform = function (a, b, c, d, e, f) {
        this._transform = this._transform.multiply(new affine_matrix_1.default(a, b, c, d, e, f));
        this.ctx.transform(a, b, c, d, e, f);
    };
    Canvas.prototype.setTransform = function (a, b, c, d, e, f) {
        this._transform = new affine_matrix_1.default().scale(this.scaling, this.scaling).multiply(new affine_matrix_1.default(a, b, c, d, e, f));
        this.ctx.setTransform(a, b, c, d, e, f);
    };
    Object.defineProperty(Canvas.prototype, "globalAlpha", {
        get: function () { return this.ctx.globalAlpha; },
        // The rest here is directly delegated to the CanvasRenderingContext2D
        // Compositing
        set: function (v) { this.ctx.globalAlpha = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "globalCompositeOperation", {
        get: function () { return this.ctx.globalCompositeOperation; },
        set: function (op) { this.ctx.globalCompositeOperation = op; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "strokeStyle", {
        get: function () { return this.ctx.strokeStyle; },
        // Colors and styles
        set: function (v) { this.ctx.strokeStyle = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "fillStyle", {
        get: function () { return this.ctx.fillStyle; },
        set: function (v) { this.ctx.fillStyle = v; },
        enumerable: true,
        configurable: true
    });
    Canvas.prototype.createLinearGradient = function (x0, y0, x1, y1) { return this.ctx.createLinearGradient(x0, y0, x1, y1); };
    Canvas.prototype.createRadialGradient = function (x0, y0, r0, x1, y1, r1) { return this.ctx.createRadialGradient(x0, y0, r0, x1, y1, r1); };
    Canvas.prototype.createPattern = function (image, repetition) { return this.ctx.createPattern(image, repetition); };
    Object.defineProperty(Canvas.prototype, "shadowOffsetX", {
        get: function () { return this.ctx.shadowOffsetX; },
        // Shadows
        set: function (v) { this.ctx.shadowOffsetX = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "shadowOffsetY", {
        get: function () { return this.ctx.shadowOffsetY; },
        set: function (v) { this.ctx.shadowOffsetY = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "shadowColor", {
        get: function () { return this.ctx.shadowColor; },
        set: function (v) { this.ctx.shadowColor = v; },
        enumerable: true,
        configurable: true
    });
    // Rects
    Canvas.prototype.clearRect = function (x, y, w, h) { this.ctx.clearRect(x, y, w, h); };
    Canvas.prototype.fillRect = function (x, y, w, h) { this.ctx.fillRect(x, y, w, h); };
    Canvas.prototype.strokeRect = function (x, y, w, h) { this.ctx.strokeRect(x, y, w, h); };
    // Path API
    Canvas.prototype.beginPath = function () { this.ctx.beginPath(); };
    Canvas.prototype.fill = function () { this.ctx.fill(); };
    Canvas.prototype.stroke = function () { this.ctx.stroke(); };
    Canvas.prototype.drawFocusIfNeeded = function (element) { this.drawFocusIfNeeded(element); };
    Canvas.prototype.clip = function () { this.ctx.clip(); };
    Canvas.prototype.isPointInPath = function (x, y) { return this.ctx.isPointInPath(x, y); };
    // Text
    Canvas.prototype.fillText = function (text, x, y, maxWidth) { this.ctx.fillText(text, x, y, maxWidth); };
    Canvas.prototype.strokeText = function (text, x, y, maxWidth) { this.ctx.strokeText(text, x, y, maxWidth); };
    Canvas.prototype.measureText = function (text) { return this.ctx.measureText(text); };
    Canvas.prototype.drawImage = function (image, offsetX, offsetY, width, height, canvasOffsetWidth, canvasOffsetHeight, canvasImageWidth, canvasImageHeight) {
        if (arguments.length === 3) {
            this.ctx.drawImage(image, offsetX, offsetY);
        }
        else if (arguments.length == 5) {
            this.ctx.drawImage(image, offsetX, offsetY, width, height);
        }
        else if (arguments.length === 9) {
            this.ctx.drawImage(image, offsetX, offsetY, width, height, canvasOffsetWidth, canvasOffsetHeight, canvasImageHeight, canvasImageWidth);
        }
    };
    // Pixel manipulation
    Canvas.prototype.createImageData = function (imageDataOrSw, sh) { return this.ctx.createImageData(imageDataOrSw, sh); };
    Canvas.prototype.getImageData = function (sx, sy, sw, sh) { return this.ctx.getImageData(sx, sy, sw, sh); };
    Canvas.prototype.putImageData = function (imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight) { this.ctx.putImageData(imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight); };
    Object.defineProperty(Canvas.prototype, "lineWidth", {
        get: function () { return this.ctx.lineWidth; },
        // CanvasDrawingStyles
        set: function (v) { this.ctx.lineWidth = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "lineCap", {
        get: function () { return this.ctx.lineCap; },
        set: function (v) { this.ctx.lineCap = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "lineJoin", {
        get: function () { return this.ctx.lineJoin; },
        set: function (v) { this.ctx.lineJoin = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "miterLimit", {
        get: function () { return this.ctx.miterLimit; },
        set: function (v) { this.ctx.miterLimit = v; },
        enumerable: true,
        configurable: true
    });
    Canvas.prototype.setLineDash = function (segments) { this.ctx.setLineDash(segments); };
    Canvas.prototype.getLineDash = function () { return this.ctx.getLineDash(); };
    Object.defineProperty(Canvas.prototype, "lineDashOffset", {
        get: function () { return this.ctx.lineDashOffset; },
        set: function (v) { this.ctx.lineDashOffset = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "font", {
        get: function () { return this.ctx.font; },
        set: function (v) { this.ctx.font = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "textAlign", {
        get: function () { return this.ctx.textAlign; },
        set: function (v) { this.ctx.textAlign = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "textBaseline", {
        get: function () { return this.ctx.textBaseline; },
        set: function (v) { this.ctx.textBaseline = v; },
        enumerable: true,
        configurable: true
    });
    // CanvasPathMethods
    Canvas.prototype.closePath = function () { this.ctx.closePath(); };
    Canvas.prototype.moveTo = function (x, y) { this.ctx.moveTo(x, y); };
    Canvas.prototype.lineTo = function (x, y) { this.ctx.lineTo(x, y); };
    Canvas.prototype.quadraticCurveTo = function (cpx, cpy, x, y) { this.ctx.quadraticCurveTo(cpx, cpy, x, y); };
    Canvas.prototype.bezierCurveTo = function (cp1x, cp1y, cp2x, cp2y, x, y) { this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y); };
    Canvas.prototype.arcTo = function (x1, y1, x2, y2, radius) { this.ctx.arcTo(x1, y1, x2, y2, radius); };
    Canvas.prototype.rect = function (x, y, w, h) { this.ctx.rect(x, y, w, h); };
    Canvas.prototype.arc = function (x, y, radius, startAngle, endAngle, counterClockwise) {
        if (counterClockwise === void 0) { counterClockwise = false; }
        this.ctx.arc(x, y, radius, startAngle, endAngle, counterClockwise);
    };
    return Canvas;
}());
exports.default = Canvas;
