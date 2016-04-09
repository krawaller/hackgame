/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _iso = __webpack_require__(1);

	var _iso2 = _interopRequireDefault(_iso);

	var _battlement = __webpack_require__(10);

	var _battlement2 = _interopRequireDefault(_battlement);

	var _player = __webpack_require__(13);

	var _player2 = _interopRequireDefault(_player);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Point = _iso2.default.Point;

	var canvas = document.getElementById("canvas");

	var boardwidth = 5;
	var boardlength = 10;

	var plrx = 0;
	var plry = 2;

	var render = function render() {
		canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
		var iso = new _iso2.default(canvas);
		iso.add((0, _battlement2.default)(Point(0, 0, 0), boardlength, boardwidth));
		iso.add((0, _player2.default)(Point(plrx, plry, 0)));
	};

	window.addEventListener("keydown", function (e) {
		var code = e.which || e.keyCode;
		switch (e.which || e.keyCode) {
			case 37:
				plry = Math.min(plry + 1, boardwidth - 1);break; // left
			case 38:
				plrx = Math.min(plrx + 1, boardlength - 1);break; // up
			case 39:
				plry = Math.max(plry - 1, 0);break; // right
			case 40:
				plrx = Math.max(plrx - 1, 0);break; // down
		}
		console.log("CODE", code);
		render();
	});

	render();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Collection = exports.Vector = exports.Canvas = exports.Color = exports.Path = exports.Shape = exports.Point = undefined;

	var _isomer = __webpack_require__(2);

	var _isomer2 = _interopRequireDefault(_isomer);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// add Collection class
	_isomer2.default.Collection = function (shapes) {
		this.shapes = shapes || [];
	};
	_isomer2.default.Collection.prototype.add = function (shape) {
		this.shapes = this.shapes.concat(shape);
	};

	// Allow merging of shapes
	_isomer2.default.Shape.prototype.merge = function (otherShape) {
		this.paths = this.paths.concat(otherShape.paths);
	};

	// Hack add to respect shape and path colors, and support Collection
	_isomer2.default.prototype.add = function (item, baseColor) {
		if (Object.prototype.toString.call(item) == '[object Array]') {
			for (var i = 0; i < item.length; i++) {
				this.add(item[i], baseColor);
			}
		} else if (item instanceof _isomer2.default.Path) {
			this._addPath(item, item.color || baseColor);
		} else if (item instanceof _isomer2.default.Collection) {
			this.add(item.shapes);
		} else if (item instanceof _isomer2.default.Shape) {
			/* Fetch paths ordered by distance to prevent overlaps */
			var paths = item.orderedPaths();
			for (var j = 0; j < paths.length; j++) {
				this._addPath(paths[j], item.color || baseColor);
			}
		}
	};

	var Point = _isomer2.default.Point;
	var Shape = _isomer2.default.Shape;
	var Path = _isomer2.default.Path;
	var Color = _isomer2.default.Color;
	var Canvas = _isomer2.default.Canvas;
	var Vector = _isomer2.default.Vector;
	var Collection = _isomer2.default.Collection;
	exports.Point = Point;
	exports.Shape = Shape;
	exports.Path = Path;
	exports.Color = Color;
	exports.Canvas = Canvas;
	exports.Vector = Vector;
	exports.Collection = Collection;
	exports.default = _isomer2.default;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Entry point for the Isomer API
	 */
	module.exports = __webpack_require__(3);

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Canvas = __webpack_require__(4);
	var Color = __webpack_require__(5);
	var Path = __webpack_require__(6);
	var Point = __webpack_require__(7);
	var Shape = __webpack_require__(8);
	var Vector = __webpack_require__(9);

	/**
	 * The Isomer class
	 *
	 * This file contains the Isomer base definition
	 */
	function Isomer(canvasId, options) {
	  options = options || {};

	  this.canvas = new Canvas(canvasId);
	  this.angle = Math.PI / 6;

	  this.scale = options.scale || 70;

	  this._calculateTransformation();

	  this.originX = options.originX || this.canvas.width / 2;
	  this.originY = options.originY || this.canvas.height * 0.9;

	  /**
	   * Light source as defined as the angle from
	   * the object to the source.
	   *
	   * We'll define somewhat arbitrarily for now.
	   */
	  this.lightPosition = options.lightPosition || new Vector(2, -1, 3);
	  this.lightAngle = this.lightPosition.normalize();

	  /**
	   * The maximum color difference from shading
	   */
	  this.colorDifference = 0.20;
	  this.lightColor = options.lightColor || new Color(255, 255, 255);
	}

	/**
	 * Sets the light position for drawing.
	 */
	Isomer.prototype.setLightPosition = function (x, y, z) {
	  this.lightPosition = new Vector(x, y, z);
	  this.lightAngle = this.lightPosition.normalize();
	};

	Isomer.prototype._translatePoint = function (point) {
	  /**
	   * X rides along the angle extended from the origin
	   * Y rides perpendicular to this angle (in isometric view: PI - angle)
	   * Z affects the y coordinate of the drawn point
	   */
	  var xMap = new Point(point.x * this.transformation[0][0], point.x * this.transformation[0][1]);

	  var yMap = new Point(point.y * this.transformation[1][0], point.y * this.transformation[1][1]);

	  var x = this.originX + xMap.x + yMap.x;
	  var y = this.originY - xMap.y - yMap.y - point.z * this.scale;
	  return new Point(x, y);
	};

	/**
	 * Adds a shape or path to the scene
	 *
	 * This method also accepts arrays
	 */
	Isomer.prototype.add = function (item, baseColor) {
	  if (Object.prototype.toString.call(item) == '[object Array]') {
	    for (var i = 0; i < item.length; i++) {
	      this.add(item[i], baseColor);
	    }
	  } else if (item instanceof Path) {
	    this._addPath(item, baseColor);
	  } else if (item instanceof Shape) {
	    /* Fetch paths ordered by distance to prevent overlaps */
	    var paths = item.orderedPaths();
	    for (var i in paths) {
	      if (paths.hasOwnProperty(i)) {
	        this._addPath(paths[i], baseColor);
	      }
	    }
	  }
	};

	/**
	 * Adds a path to the scene
	 */
	Isomer.prototype._addPath = function (path, baseColor) {
	  /* Default baseColor */
	  baseColor = baseColor || new Color(120, 120, 120);

	  /* Compute color */
	  var v1 = Vector.fromTwoPoints(path.points[1], path.points[0]);
	  var v2 = Vector.fromTwoPoints(path.points[2], path.points[1]);

	  var normal = Vector.crossProduct(v1, v2).normalize();

	  /**
	   * Brightness is between -1 and 1 and is computed based
	   * on the dot product between the light source vector and normal.
	   */
	  var brightness = Vector.dotProduct(normal, this.lightAngle);
	  var color = baseColor.lighten(brightness * this.colorDifference, this.lightColor);

	  this.canvas.path(path.points.map(this._translatePoint.bind(this)), color);
	};

	/**
	 * Precalculates transformation values based on the current angle and scale
	 * which in theory reduces costly cos and sin calls
	 */
	Isomer.prototype._calculateTransformation = function () {
	  this.transformation = [[this.scale * Math.cos(this.angle), this.scale * Math.sin(this.angle)], [this.scale * Math.cos(Math.PI - this.angle), this.scale * Math.sin(Math.PI - this.angle)]];
	};

	/* Namespace our primitives */
	Isomer.Canvas = Canvas;
	Isomer.Color = Color;
	Isomer.Path = Path;
	Isomer.Point = Point;
	Isomer.Shape = Shape;
	Isomer.Vector = Vector;

	/* Expose Isomer API */
	module.exports = Isomer;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	function Canvas(elem) {
	  this.elem = elem;
	  this.ctx = this.elem.getContext('2d');

	  this.width = elem.width;
	  this.height = elem.height;
	}

	Canvas.prototype.clear = function () {
	  this.ctx.clearRect(0, 0, this.width, this.height);
	};

	Canvas.prototype.path = function (points, color) {
	  this.ctx.beginPath();
	  this.ctx.moveTo(points[0].x, points[0].y);

	  for (var i = 1; i < points.length; i++) {
	    this.ctx.lineTo(points[i].x, points[i].y);
	  }

	  this.ctx.closePath();

	  /* Set the strokeStyle and fillStyle */
	  this.ctx.save();

	  this.ctx.globalAlpha = color.a;
	  this.ctx.fillStyle = this.ctx.strokeStyle = color.toHex();
	  this.ctx.stroke();
	  this.ctx.fill();
	  this.ctx.restore();
	};

	module.exports = Canvas;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * A color instantiated with RGB between 0-255
	 *
	 * Also holds HSL values
	 */
	function Color(r, g, b, a) {
	  this.r = parseInt(r || 0);
	  this.g = parseInt(g || 0);
	  this.b = parseInt(b || 0);
	  this.a = parseFloat(Math.round(a * 100) / 100 || 1);

	  this.loadHSL();
	};

	Color.prototype.toHex = function () {
	  // Pad with 0s
	  var hex = (this.r * 256 * 256 + this.g * 256 + this.b).toString(16);

	  if (hex.length < 6) {
	    hex = new Array(6 - hex.length + 1).join('0') + hex;
	  }

	  return '#' + hex;
	};

	/**
	 * Returns a lightened color based on a given percentage and an optional
	 * light color
	 */
	Color.prototype.lighten = function (percentage, lightColor) {
	  lightColor = lightColor || new Color(255, 255, 255);

	  var newColor = new Color(lightColor.r / 255 * this.r, lightColor.g / 255 * this.g, lightColor.b / 255 * this.b, this.a);

	  newColor.l = Math.min(newColor.l + percentage, 1);

	  newColor.loadRGB();
	  return newColor;
	};

	/**
	 * Loads HSL values using the current RGB values
	 * Converted from:
	 * http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
	 */
	Color.prototype.loadHSL = function () {
	  var r = this.r / 255;
	  var g = this.g / 255;
	  var b = this.b / 255;

	  var max = Math.max(r, g, b);
	  var min = Math.min(r, g, b);

	  var h,
	      s,
	      l = (max + min) / 2;

	  if (max === min) {
	    h = s = 0; // achromatic
	  } else {
	      var d = max - min;
	      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
	      switch (max) {
	        case r:
	          h = (g - b) / d + (g < b ? 6 : 0);break;
	        case g:
	          h = (b - r) / d + 2;break;
	        case b:
	          h = (r - g) / d + 4;break;
	      }

	      h /= 6;
	    }

	  this.h = h;
	  this.s = s;
	  this.l = l;
	};

	/**
	 * Reloads RGB using HSL values
	 * Converted from:
	 * http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
	 */
	Color.prototype.loadRGB = function () {
	  var r, g, b;
	  var h = this.h;
	  var s = this.s;
	  var l = this.l;

	  if (s === 0) {
	    r = g = b = l; // achromatic
	  } else {
	      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	      var p = 2 * l - q;
	      r = this._hue2rgb(p, q, h + 1 / 3);
	      g = this._hue2rgb(p, q, h);
	      b = this._hue2rgb(p, q, h - 1 / 3);
	    }

	  this.r = parseInt(r * 255);
	  this.g = parseInt(g * 255);
	  this.b = parseInt(b * 255);
	};

	/**
	 * Helper function to convert hue to rgb
	 * Taken from:
	 * http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
	 */
	Color.prototype._hue2rgb = function (p, q, t) {
	  if (t < 0) t += 1;
	  if (t > 1) t -= 1;
	  if (t < 1 / 6) return p + (q - p) * 6 * t;
	  if (t < 1 / 2) return q;
	  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
	  return p;
	};

	module.exports = Color;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Point = __webpack_require__(7);

	/**
	 * Path utility class
	 *
	 * An Isomer.Path consists of a list of Isomer.Point's
	 */
	function Path(points) {
	  if (Object.prototype.toString.call(points) === '[object Array]') {
	    this.points = points;
	  } else {
	    this.points = Array.prototype.slice.call(arguments);
	  }
	}

	/**
	 * Pushes a point onto the end of the path
	 */
	Path.prototype.push = function (point) {
	  this.points.push(point);
	};

	/**
	 * Returns a new path with the points in reverse order
	 */
	Path.prototype.reverse = function () {
	  var points = Array.prototype.slice.call(this.points);

	  return new Path(points.reverse());
	};

	/**
	 * Translates a given path
	 *
	 * Simply a forward to Point#translate
	 */
	Path.prototype.translate = function () {
	  var args = arguments;

	  return new Path(this.points.map(function (point) {
	    return point.translate.apply(point, args);
	  }));
	};

	/**
	 * Returns a new path rotated along the X axis by a given origin
	 *
	 * Simply a forward to Point#rotateX
	 */
	Path.prototype.rotateX = function () {
	  var args = arguments;

	  return new Path(this.points.map(function (point) {
	    return point.rotateX.apply(point, args);
	  }));
	};

	/**
	 * Returns a new path rotated along the Y axis by a given origin
	 *
	 * Simply a forward to Point#rotateY
	 */
	Path.prototype.rotateY = function () {
	  var args = arguments;

	  return new Path(this.points.map(function (point) {
	    return point.rotateY.apply(point, args);
	  }));
	};

	/**
	 * Returns a new path rotated along the Z axis by a given origin
	 *
	 * Simply a forward to Point#rotateZ
	 */
	Path.prototype.rotateZ = function () {
	  var args = arguments;

	  return new Path(this.points.map(function (point) {
	    return point.rotateZ.apply(point, args);
	  }));
	};

	/**
	 * Scales a path about a given origin
	 *
	 * Simply a forward to Point#scale
	 */
	Path.prototype.scale = function () {
	  var args = arguments;

	  return new Path(this.points.map(function (point) {
	    return point.scale.apply(point, args);
	  }));
	};

	/**
	 * The estimated depth of a path as defined by the average depth
	 * of its points
	 */
	Path.prototype.depth = function () {
	  var i,
	      total = 0;
	  for (i = 0; i < this.points.length; i++) {
	    total += this.points[i].depth();
	  }

	  return total / (this.points.length || 1);
	};

	/**
	 * Some paths to play with
	 */

	/**
	 * A rectangle with the bottom-left corner in the origin
	 */
	Path.Rectangle = function (origin, width, height) {
	  if (width === undefined) width = 1;
	  if (height === undefined) height = 1;

	  var path = new Path([origin, new Point(origin.x + width, origin.y, origin.z), new Point(origin.x + width, origin.y + height, origin.z), new Point(origin.x, origin.y + height, origin.z)]);

	  return path;
	};

	/**
	 * A circle centered at origin with a given radius and number of vertices
	 */
	Path.Circle = function (origin, radius, vertices) {
	  vertices = vertices || 20;
	  var i,
	      path = new Path();

	  for (i = 0; i < vertices; i++) {
	    path.push(new Point(radius * Math.cos(i * 2 * Math.PI / vertices), radius * Math.sin(i * 2 * Math.PI / vertices), 0));
	  }

	  return path.translate(origin.x, origin.y, origin.z);
	};

	/**
	 * A star centered at origin with a given outer radius, inner
	 * radius, and number of points
	 *
	 * Buggy - concave polygons are difficult to draw with our method
	 */
	Path.Star = function (origin, outerRadius, innerRadius, points) {
	  var i,
	      r,
	      path = new Path();

	  for (i = 0; i < points * 2; i++) {
	    r = i % 2 === 0 ? outerRadius : innerRadius;

	    path.push(new Point(r * Math.cos(i * Math.PI / points), r * Math.sin(i * Math.PI / points), 0));
	  }

	  return path.translate(origin.x, origin.y, origin.z);
	};

	/* Expose the Path constructor */
	module.exports = Path;

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	function Point(x, y, z) {
	  if (this instanceof Point) {
	    this.x = typeof x === 'number' ? x : 0;
	    this.y = typeof y === 'number' ? y : 0;
	    this.z = typeof z === 'number' ? z : 0;
	  } else {
	    return new Point(x, y, z);
	  }
	}

	Point.ORIGIN = new Point(0, 0, 0);

	/**
	 * Translate a point from a given dx, dy, and dz
	 */
	Point.prototype.translate = function (dx, dy, dz) {
	  return new Point(this.x + dx, this.y + dy, this.z + dz);
	};

	/**
	 * Scale a point about a given origin
	 */
	Point.prototype.scale = function (origin, dx, dy, dz) {
	  var p = this.translate(-origin.x, -origin.y, -origin.z);

	  if (dy === undefined && dz === undefined) {
	    /* If both dy and dz are left out, scale all coordinates equally */
	    dy = dz = dx;
	    /* If just dz is missing, set it equal to 1 */
	  } else {
	      dz = typeof dz === 'number' ? dz : 1;
	    }

	  p.x *= dx;
	  p.y *= dy;
	  p.z *= dz;

	  return p.translate(origin.x, origin.y, origin.z);
	};

	/**
	 * Rotate about origin on the X axis
	 */
	Point.prototype.rotateX = function (origin, angle) {
	  var p = this.translate(-origin.x, -origin.y, -origin.z);

	  var z = p.z * Math.cos(angle) - p.y * Math.sin(angle);
	  var y = p.z * Math.sin(angle) + p.y * Math.cos(angle);
	  p.z = z;
	  p.y = y;

	  return p.translate(origin.x, origin.y, origin.z);
	};

	/**
	 * Rotate about origin on the Y axis
	 */
	Point.prototype.rotateY = function (origin, angle) {
	  var p = this.translate(-origin.x, -origin.y, -origin.z);

	  var x = p.x * Math.cos(angle) - p.z * Math.sin(angle);
	  var z = p.x * Math.sin(angle) + p.z * Math.cos(angle);
	  p.x = x;
	  p.z = z;

	  return p.translate(origin.x, origin.y, origin.z);
	};

	/**
	 * Rotate about origin on the Z axis
	 */
	Point.prototype.rotateZ = function (origin, angle) {
	  var p = this.translate(-origin.x, -origin.y, -origin.z);

	  var x = p.x * Math.cos(angle) - p.y * Math.sin(angle);
	  var y = p.x * Math.sin(angle) + p.y * Math.cos(angle);
	  p.x = x;
	  p.y = y;

	  return p.translate(origin.x, origin.y, origin.z);
	};

	/**
	 * The depth of a point in the isometric plane
	 */
	Point.prototype.depth = function () {
	  /* z is weighted slightly to accomodate |_ arrangements */
	  return this.x + this.y - 2 * this.z;
	};

	/**
	 * Distance between two points
	 */
	Point.distance = function (p1, p2) {
	  var dx = p2.x - p1.x;
	  var dy = p2.y - p1.y;
	  var dz = p2.z - p1.z;

	  return Math.sqrt(dx * dx + dy * dy + dz * dz);
	};

	module.exports = Point;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Path = __webpack_require__(6);
	var Point = __webpack_require__(7);

	/**
	 * Shape utility class
	 *
	 * An Isomer.Shape consists of a list of Isomer.Path's
	 */
	function Shape(paths) {
	  if (Object.prototype.toString.call(paths) === '[object Array]') {
	    this.paths = paths;
	  } else {
	    this.paths = Array.prototype.slice.call(arguments);
	  }
	}

	/**
	 * Pushes a path onto the end of the Shape
	 */
	Shape.prototype.push = function (path) {
	  this.paths.push(path);
	};

	/**
	 * Translates a given shape
	 *
	 * Simply a forward to Path#translate
	 */
	Shape.prototype.translate = function () {
	  var args = arguments;

	  return new Shape(this.paths.map(function (path) {
	    return path.translate.apply(path, args);
	  }));
	};

	/**
	 * Rotates a given shape along the X axis around a given origin
	 *
	 * Simply a forward to Path#rotateX
	 */
	Shape.prototype.rotateX = function () {
	  var args = arguments;

	  return new Shape(this.paths.map(function (path) {
	    return path.rotateX.apply(path, args);
	  }));
	};

	/**
	 * Rotates a given shape along the Y axis around a given origin
	 *
	 * Simply a forward to Path#rotateY
	 */
	Shape.prototype.rotateY = function () {
	  var args = arguments;

	  return new Shape(this.paths.map(function (path) {
	    return path.rotateY.apply(path, args);
	  }));
	};

	/**
	 * Rotates a given shape along the Z axis around a given origin
	 *
	 * Simply a forward to Path#rotateZ
	 */
	Shape.prototype.rotateZ = function () {
	  var args = arguments;

	  return new Shape(this.paths.map(function (path) {
	    return path.rotateZ.apply(path, args);
	  }));
	};

	/**
	 * Scales a path about a given origin
	 *
	 * Simply a forward to Point#scale
	 */
	Shape.prototype.scale = function () {
	  var args = arguments;

	  return new Shape(this.paths.map(function (path) {
	    return path.scale.apply(path, args);
	  }));
	};

	/**
	 * Produces a list of the shape's paths ordered by distance to
	 * prevent overlaps when drawing
	 */
	Shape.prototype.orderedPaths = function () {
	  var paths = this.paths.slice();

	  /**
	   * Sort the list of faces by distance then map the entries, returning
	   * only the path and not the added "further point" from earlier.
	   */
	  return paths.sort(function (pathA, pathB) {
	    return pathB.depth() - pathA.depth();
	  });
	};

	/**
	 * Utility function to create a 3D object by raising a 2D path
	 * along the z-axis
	 */
	Shape.extrude = function (path, height) {
	  height = typeof height === 'number' ? height : 1;

	  var i,
	      topPath = path.translate(0, 0, height);
	  var shape = new Shape();

	  /* Push the top and bottom faces, top face must be oriented correctly */
	  shape.push(path.reverse());
	  shape.push(topPath);

	  /* Push each side face */
	  for (i = 0; i < path.points.length; i++) {
	    shape.push(new Path([topPath.points[i], path.points[i], path.points[(i + 1) % path.points.length], topPath.points[(i + 1) % topPath.points.length]]));
	  }

	  return shape;
	};

	/**
	 * Some shapes to play with
	 */

	/**
	 * A prism located at origin with dimensions dx, dy, dz
	 */
	Shape.Prism = function (origin, dx, dy, dz) {
	  dx = typeof dx === 'number' ? dx : 1;
	  dy = typeof dy === 'number' ? dy : 1;
	  dz = typeof dz === 'number' ? dz : 1;

	  /* The shape we will return */
	  var prism = new Shape();

	  /* Squares parallel to the x-axis */
	  var face1 = new Path([origin, new Point(origin.x + dx, origin.y, origin.z), new Point(origin.x + dx, origin.y, origin.z + dz), new Point(origin.x, origin.y, origin.z + dz)]);

	  /* Push this face and its opposite */
	  prism.push(face1);
	  prism.push(face1.reverse().translate(0, dy, 0));

	  /* Square parallel to the y-axis */
	  var face2 = new Path([origin, new Point(origin.x, origin.y, origin.z + dz), new Point(origin.x, origin.y + dy, origin.z + dz), new Point(origin.x, origin.y + dy, origin.z)]);
	  prism.push(face2);
	  prism.push(face2.reverse().translate(dx, 0, 0));

	  /* Square parallel to the xy-plane */
	  var face3 = new Path([origin, new Point(origin.x + dx, origin.y, origin.z), new Point(origin.x + dx, origin.y + dy, origin.z), new Point(origin.x, origin.y + dy, origin.z)]);
	  /* This surface is oriented backwards, so we need to reverse the points */
	  prism.push(face3.reverse());
	  prism.push(face3.translate(0, 0, dz));

	  return prism;
	};

	Shape.Pyramid = function (origin, dx, dy, dz) {
	  dx = typeof dx === 'number' ? dx : 1;
	  dy = typeof dy === 'number' ? dy : 1;
	  dz = typeof dz === 'number' ? dz : 1;

	  var pyramid = new Shape();

	  /* Path parallel to the x-axis */
	  var face1 = new Path([origin, new Point(origin.x + dx, origin.y, origin.z), new Point(origin.x + dx / 2, origin.y + dy / 2, origin.z + dz)]);
	  /* Push the face, and its opposite face, by rotating around the Z-axis */
	  pyramid.push(face1);
	  pyramid.push(face1.rotateZ(origin.translate(dx / 2, dy / 2), Math.PI));

	  /* Path parallel to the y-axis */
	  var face2 = new Path([origin, new Point(origin.x + dx / 2, origin.y + dy / 2, origin.z + dz), new Point(origin.x, origin.y + dy, origin.z)]);
	  pyramid.push(face2);
	  pyramid.push(face2.rotateZ(origin.translate(dx / 2, dy / 2), Math.PI));

	  return pyramid;
	};

	Shape.Cylinder = function (origin, radius, vertices, height) {
	  radius = typeof radius === 'number' ? radius : 1;

	  var circle = Path.Circle(origin, radius, vertices);
	  var cylinder = Shape.extrude(circle, height);

	  return cylinder;
	};

	module.exports = Shape;

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	function Vector(i, j, k) {
	  this.i = typeof i === 'number' ? i : 0;
	  this.j = typeof j === 'number' ? j : 0;
	  this.k = typeof k === 'number' ? k : 0;
	}

	/**
	 * Alternate constructor
	 */
	Vector.fromTwoPoints = function (p1, p2) {
	  return new Vector(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z);
	};

	Vector.crossProduct = function (v1, v2) {
	  var i = v1.j * v2.k - v2.j * v1.k;
	  var j = -1 * (v1.i * v2.k - v2.i * v1.k);
	  var k = v1.i * v2.j - v2.i * v1.j;

	  return new Vector(i, j, k);
	};

	Vector.dotProduct = function (v1, v2) {
	  return v1.i * v2.i + v1.j * v2.j + v1.k * v2.k;
	};

	Vector.prototype.magnitude = function () {
	  return Math.sqrt(this.i * this.i + this.j * this.j + this.k * this.k);
	};

	Vector.prototype.normalize = function () {
	  var magnitude = this.magnitude();
	  /**
	   * If the magnitude is 0 then return the zero vector instead of dividing by 0
	   */
	  if (magnitude === 0) {
	    return new Vector(0, 0, 0);
	  }
	  return new Vector(this.i / magnitude, this.j / magnitude, this.k / magnitude);
	};

	module.exports = Vector;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _iso = __webpack_require__(1);

	var _grid = __webpack_require__(11);

	var _grid2 = _interopRequireDefault(_grid);

	var _stairs = __webpack_require__(12);

	var _stairs2 = _interopRequireDefault(_stairs);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Prism = _iso.Shape.Prism;

	var Battlement = function Battlement(origin, length, width) {
		var ret = new _iso.Collection();
		ret.add(Prism(origin.translate(0, width, -1), length, 1, 2));
		ret.add(Prism(origin.translate(0, 0, -1), length, width, 1));
		ret.add((0, _grid2.default)(origin, length, width));
		ret.add((0, _stairs2.default)(origin.translate(-1, 3, -1)));
		for (var i = 0; i < length; i = i + 2) {
			ret.add(Prism(origin.translate(i, width, 1), 1, 1, 1));
		}
		return ret;
	};

	exports.default = Battlement;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _iso = __webpack_require__(1);

	var Grid = function Grid(origin, maxx, maxy, color) {
	  var lines = [],
	      x = void 0,
	      y = void 0,
	      clr = color || new _iso.Color(255, 0, 0);
	  for (x = 0; x <= maxx; x++) {
	    lines.push(new _iso.Path([new _iso.Point(x, 0, 0), new _iso.Point(x, maxy, 0), new _iso.Point(x, 0, 0)]));
	  }
	  for (y = 0; y <= maxy; y++) {
	    lines.push(new _iso.Path([new _iso.Point(0, y, 0), new _iso.Point(maxx, y, 0), new _iso.Point(0, y, 0)]));
	  }
	  var grid = new _iso.Shape(lines).translate(origin.x, origin.y, origin.z);
	  grid.color = clr;
	  return grid;
	};

	exports.default = Grid;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _iso = __webpack_require__(1);

	var Stairs = function Stairs(origin) {
	  var STEP_COUNT = 5;

	  /* Create a zig-zag */
	  var zigzag = new _iso.Path(origin);
	  var steps = [],
	      i;

	  /* Shape to return */
	  var stairs = new _iso.Shape();

	  for (i = 0; i < STEP_COUNT; i++) {
	    /**
	     *  2
	     * __
	     *   | 1
	     */

	    var stepCorner = origin.translate(0, i / STEP_COUNT, (i + 1) / STEP_COUNT);
	    /* Draw two planes */
	    steps.push(new _iso.Path([stepCorner, stepCorner.translate(0, 0, -1 / STEP_COUNT), stepCorner.translate(1, 0, -1 / STEP_COUNT), stepCorner.translate(1, 0, 0)]));

	    steps.push(new _iso.Path([stepCorner, stepCorner.translate(1, 0, 0), stepCorner.translate(1, 1 / STEP_COUNT, 0), stepCorner.translate(0, 1 / STEP_COUNT, 0)]));

	    zigzag.push(stepCorner);
	    zigzag.push(stepCorner.translate(0, 1 / STEP_COUNT, 0));
	  }

	  zigzag.push(origin.translate(0, 1, 0));

	  for (i = 0; i < steps.length; i++) {
	    stairs.push(steps[i]);
	  }
	  stairs.push(zigzag);
	  stairs.push(zigzag.reverse().translate(1, 0, 0));

	  return stairs.rotateZ(origin, -Math.PI / 2);
	};

	exports.default = Stairs;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _iso = __webpack_require__(1);

	var _pillar = __webpack_require__(14);

	var _pillar2 = _interopRequireDefault(_pillar);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Player = function Player(origin) {
		var ret = new _iso.Shape.Cylinder(origin.translate(0.5, 0.5, 0), 0.5, 0, 3);
		ret.color = new _iso.Color(0, 255, 0);
		return ret;
	};

	exports.default = Player;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _iso = __webpack_require__(1);

	var Pillar = function Pillar(origin, height) {
		return new _iso.Shape.Cylinder(origin.translate(0.5, 0.5, 0), 0.5, 0, height);
	};

	exports.default = Pillar;

/***/ }
/******/ ]);