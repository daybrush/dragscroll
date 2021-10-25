/*
Copyright (c) 2019 Daybrush
name: @scena/dragscroll
license: MIT
author: Daybrush
repository: git+https://github.com/daybrush/dragscroll.git
version: 1.0.3
*/
import EventEmitter from '@scena/event-emitter';
import { now } from '@daybrush/utils';

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

    _this.startRect = null;
    _this.startPos = [];
    _this.prevTime = 0;
    _this.timer = 0;
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

    this.startPos = [e.clientX, e.clientY];
    this.startRect = {
      top: top,
      left: left,
      width: width,
      height: height
    };
  };

  __proto.drag = function (e, options) {
    var _this = this;

    var clientX = e.clientX,
        clientY = e.clientY;
    var container = options.container,
        _a = options.threshold,
        threshold = _a === void 0 ? 0 : _a,
        _b = options.throttleTime,
        throttleTime = _b === void 0 ? 0 : _b,
        _c = options.getScrollPosition,
        getScrollPosition = _c === void 0 ? getDefaultScrollPosition : _c;

    var _d = this,
        startRect = _d.startRect,
        startPos = _d.startPos;

    var nowTime = now();
    var distTime = Math.max(throttleTime + this.prevTime - nowTime, 0);
    var direction = [0, 0];

    if (startRect.top > clientY - threshold) {
      if (startPos[1] > startRect.top || clientY < startPos[1]) {
        direction[1] = -1;
      }
    } else if (startRect.top + startRect.height < clientY + threshold) {
      if (startPos[1] < startRect.top + startRect.height || clientY > startPos[1]) {
        direction[1] = 1;
      }
    }

    if (startRect.left > clientX - threshold) {
      if (startPos[0] > startRect.left || clientX < startPos[0]) {
        direction[0] = -1;
      }
    } else if (startRect.left + startRect.width < clientX + threshold) {
      if (startPos[0] < startRect.left + startRect.width || clientX > startPos[0]) {
        direction[0] = 1;
      }
    }

    clearTimeout(this.timer);

    if (!direction[0] && !direction[1]) {
      return false;
    }

    if (distTime > 0) {
      this.timer = window.setTimeout(function () {
        _this.drag(e, options);
      }, distTime);
      return false;
    }

    this.prevTime = nowTime;
    var prevPos = getScrollPosition({
      container: container,
      direction: direction
    });
    this.trigger("scroll", {
      container: container,
      direction: direction,
      inputEvent: e
    });
    var nextPos = getScrollPosition({
      container: container,
      direction: direction
    });
    var offsetX = nextPos[0] - prevPos[0];
    var offsetY = nextPos[1] - prevPos[1];

    if (!offsetX && !offsetY) {
      return false;
    }

    this.trigger("move", {
      offsetX: direction[0] ? offsetX : 0,
      offsetY: direction[1] ? offsetY : 0,
      inputEvent: e
    });

    if (throttleTime) {
      this.timer = window.setTimeout(function () {
        _this.drag(e, options);
      }, throttleTime);
    }

    return true;
  };

  __proto.dragEnd = function () {
    clearTimeout(this.timer);
  };

  return DragScroll;
}(EventEmitter);

export default DragScroll;
//# sourceMappingURL=dragscroll.esm.js.map
