/*
Copyright (c) 2019 Daybrush
name: @scena/dragscroll
license: MIT
author: Daybrush
repository: git+https://github.com/daybrush/dragscroll.git
version: 0.0.1
*/
'use strict';

var Component = require('@egjs/component');

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
  var scrollContainer = e.scrollContainer;
  return [scrollContainer.scrollLeft, scrollContainer.scrollTop];
}

var DragScroll =
/*#__PURE__*/
function (_super) {
  __extends(DragScroll, _super);

  function DragScroll(container, options) {
    if (options === void 0) {
      options = {};
    }

    var _this = _super.call(this) || this;

    _this.container = container;
    _this.startRect = null;
    _this.prevClientX = 0;
    _this.prevClientY = 0;
    _this.prevDirection = null;
    _this.prevPos = [];
    _this.options = __assign({
      scrollThreshold: 0,
      getScrollPosition: getDefaultScrollPosition
    }, options);
    return _this;
  }

  var __proto = DragScroll.prototype;

  __proto.dragStart = function () {
    var _a = this.container.getBoundingClientRect(),
        top = _a.top,
        left = _a.left,
        width = _a.width,
        height = _a.height;

    this.startRect = {
      top: top,
      left: left,
      width: width,
      height: height
    };
  };

  __proto.drag = function (e) {
    var clientX = e.clientX,
        clientY = e.clientY;
    this.prevDirection = null;
    var _a = this.options,
        _b = _a.scrollThreshold,
        scrollThreshold = _b === void 0 ? 0 : _b,
        _c = _a.getScrollPosition,
        getScrollPosition = _c === void 0 ? getDefaultScrollPosition : _c;

    var _d = this,
        container = _d.container,
        startRect = _d.startRect;

    var direction = [0, 0];

    if (startRect.top > clientY - scrollThreshold) {
      direction[1] = -1;
    } else if (startRect.top + startRect.height < clientY + scrollThreshold) {
      direction[1] = 1;
    }

    if (startRect.left > clientX - scrollThreshold) {
      direction[0] = -1;
    } else if (startRect.left + startRect.width < clientX + scrollThreshold) {
      direction[0] = 1;
    }

    if (!direction[0] && !direction[1]) {
      return false;
    }

    this.prevDirection = direction;
    this.prevPos = getScrollPosition({
      scrollContainer: container,
      direction: direction
    });
    this.trigger("scroll", {
      scrollContainer: container,
      direction: direction
    });
    return true;
  };

  __proto.dragAfter = function () {
    var _a = this,
        prevPos = _a.prevPos,
        direction = _a.prevDirection,
        scrollContainer = _a.container;

    if (!this.prevDirection) {
      return false;
    }

    var getScrollPosition = this.options.getScrollPosition;
    var nextPos = getScrollPosition({
      scrollContainer: scrollContainer,
      direction: direction
    });
    var offsetX = nextPos[0] - prevPos[0];
    var offsetY = nextPos[1] - prevPos[1];

    if (!offsetX && !offsetY) {
      return false;
    }

    this.trigger("move", {
      offsetX: direction[0] ? offsetX : 0,
      offsetY: direction[1] ? offsetY : 0
    });
    return true;
  };

  return DragScroll;
}(Component);

module.exports = DragScroll;
//# sourceMappingURL=dragscroll.cjs.js.map
