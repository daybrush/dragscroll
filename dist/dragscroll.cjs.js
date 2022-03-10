/*
Copyright (c) 2019 Daybrush
name: @scena/dragscroll
license: MIT
author: Daybrush
repository: git+https://github.com/daybrush/dragscroll.git
version: 1.1.1
*/
'use strict';

var EventEmitter = require('@scena/event-emitter');
var utils = require('@daybrush/utils');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

/* global Reflect, Promise */
var extendStatics = function (d, b) {
  extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
  };

  return extendStatics(d, b);
};

function __extends(d, b) {
  extendStatics(d, b);

  function __() {
    this.constructor = d;
  }

  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var __assign = function () {
  __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

function getDefaultScrollPosition(e) {
  var container = e.container;

  if (container === document.body) {
    return [container.scrollLeft || document.documentElement.scrollLeft, container.scrollTop || document.documentElement.scrollTop];
  }

  return [container.scrollLeft, container.scrollTop];
}

var DragScroll =
/*#__PURE__*/
function (_super) {
  __extends(DragScroll, _super);

  function DragScroll() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this._startRect = null;
    _this._startPos = [];
    _this._prevTime = 0;
    _this._timer = 0;
    _this._prevScrollPos = [0, 0];
    _this._isWait = false;
    return _this;
  }

  var __proto = DragScroll.prototype;

  __proto.dragStart = function (e, options) {
    var container = options.container;
    var top = 0;
    var left = 0;
    var width = 0;
    var height = 0;

    if (container === document.body) {
      width = window.innerWidth;
      height = window.innerHeight;
    } else {
      var rect = container.getBoundingClientRect();
      top = rect.top;
      left = rect.left;
      width = rect.width;
      height = rect.height;
    }

    this._startPos = [e.clientX, e.clientY];
    this._startRect = {
      top: top,
      left: left,
      width: width,
      height: height
    };
    this._prevScrollPos = this._getScrollPosition([0, 0], options);
  };

  __proto.drag = function (e, options) {
    var clientX = e.clientX,
        clientY = e.clientY;
    var _a = options.threshold,
        threshold = _a === void 0 ? 0 : _a;

    var _b = this,
        _startRect = _b._startRect,
        _startPos = _b._startPos;

    var direction = [0, 0];

    if (_startRect.top > clientY - threshold) {
      if (_startPos[1] > _startRect.top || clientY < _startPos[1]) {
        direction[1] = -1;
      }
    } else if (_startRect.top + _startRect.height < clientY + threshold) {
      if (_startPos[1] < _startRect.top + _startRect.height || clientY > _startPos[1]) {
        direction[1] = 1;
      }
    }

    if (_startRect.left > clientX - threshold) {
      if (_startPos[0] > _startRect.left || clientX < _startPos[0]) {
        direction[0] = -1;
      }
    } else if (_startRect.left + _startRect.width < clientX + threshold) {
      if (_startPos[0] < _startRect.left + _startRect.width || clientX > _startPos[0]) {
        direction[0] = 1;
      }
    }

    clearTimeout(this._timer);

    if (!direction[0] && !direction[1]) {
      return false;
    }

    return this._continueDrag(__assign(__assign({}, options), {
      direction: direction,
      inputEvent: e,
      isDrag: true
    }));
  };

  __proto.checkScroll = function (options) {
    var _this = this;

    if (this._isWait) {
      return false;
    }

    var _a = options.prevScrollPos,
        prevScrollPos = _a === void 0 ? this._prevScrollPos : _a,
        direction = options.direction,
        _b = options.throttleTime,
        throttleTime = _b === void 0 ? 0 : _b,
        inputEvent = options.inputEvent,
        isDrag = options.isDrag;

    var nextScrollPos = this._getScrollPosition(direction || [0, 0], options);

    var offsetX = nextScrollPos[0] - prevScrollPos[0];
    var offsetY = nextScrollPos[1] - prevScrollPos[1];
    var nextDirection = direction || [offsetX ? Math.abs(offsetX) / offsetX : 0, offsetY ? Math.abs(offsetY) / offsetY : 0];
    this._prevScrollPos = nextScrollPos;

    if (!offsetX && !offsetY) {
      return false;
    }

    this.trigger("move", {
      offsetX: nextDirection[0] ? offsetX : 0,
      offsetY: nextDirection[1] ? offsetY : 0,
      inputEvent: inputEvent
    });

    if (throttleTime && isDrag) {
      this._timer = window.setTimeout(function () {
        _this._continueDrag(options);
      }, throttleTime);
    }

    return true;
  };

  __proto.dragEnd = function () {
    clearTimeout(this._timer);
  };

  __proto._getScrollPosition = function (direction, options) {
    var container = options.container,
        _a = options.getScrollPosition,
        getScrollPosition = _a === void 0 ? getDefaultScrollPosition : _a;
    return getScrollPosition({
      container: container,
      direction: direction
    });
  };

  __proto._continueDrag = function (options) {
    var _this = this;

    var container = options.container,
        direction = options.direction,
        throttleTime = options.throttleTime,
        useScroll = options.useScroll,
        isDrag = options.isDrag,
        inputEvent = options.inputEvent;

    if (isDrag && this._isWait) {
      return;
    }

    var nowTime = utils.now();
    var distTime = Math.max(throttleTime + this._prevTime - nowTime, 0);

    if (distTime > 0) {
      this._timer = window.setTimeout(function () {
        _this._continueDrag(options);
      }, distTime);
      return false;
    }

    this._prevTime = nowTime;

    var prevScrollPos = this._getScrollPosition(direction, options);

    this._prevScrollPos = prevScrollPos;

    if (isDrag) {
      this._isWait = true;
    }

    this.trigger("scroll", {
      container: container,
      direction: direction,
      inputEvent: inputEvent
    });
    this._isWait = false;
    return useScroll || this.checkScroll(__assign(__assign({}, options), {
      prevScrollPos: prevScrollPos,
      direction: direction,
      inputEvent: inputEvent
    }));
  };

  return DragScroll;
}(EventEmitter);

module.exports = DragScroll;
//# sourceMappingURL=dragscroll.cjs.js.map
