import EventEmitter from "@scena/event-emitter";
import { isFunction, isString, now } from "@daybrush/utils";
import { CheckScrollOptions, DragScrollEvents, DragScrollOptions, Rect } from "./types";

function getDefaultScrollPosition(e: { container: HTMLElement, direction: number[] }) {
    let container = e.container;

    if (container === document.body) {
        return [
            container.scrollLeft || document.documentElement.scrollLeft,
            container.scrollTop || document.documentElement.scrollTop,
        ];
    }
    return [
        container.scrollLeft,
        container.scrollTop,
    ];
}

function getContainerElement(container: DragScrollOptions["container"]): HTMLElement {
    if (!container) {
        return null;
    } else if (isString(container)) {
        return document.querySelector<HTMLElement>(container);
    } if (isFunction(container)) {
        return container();
    } else if (container instanceof Element) {
        return container;
    } else if ("current" in container) {
        return container.current;
    } else if ("value" in container) {
        return container.value;
    }
}
export default class DragScroll extends EventEmitter<DragScrollEvents> {
    private _startRect: Rect | null = null;
    private _startPos: number[] = [];
    private _prevTime: number = 0;
    private _timer: number = 0;
    private _prevScrollPos: number[] = [0, 0];
    private _isWait = false;
    private _flag = false;

    public dragStart(e: any, options: DragScrollOptions) {
        const container = getContainerElement(options.container);

        if (!container) {
            this._flag = false;
            return;
        }
        let top = 0;
        let left = 0;
        let width = 0;
        let height = 0;

        if (container === document.body) {
            width = window.innerWidth;
            height = window.innerHeight;
        } else {
            const rect = container.getBoundingClientRect();

            top = rect.top;
            left = rect.left;
            width = rect.width;
            height = rect.height;
        }

        this._flag = true;
        this._startPos = [e.clientX, e.clientY];
        this._startRect = { top, left, width, height };
        this._prevScrollPos = this._getScrollPosition([0, 0], options);
    }
    public drag(e: any, options: DragScrollOptions) {
        if (!this._flag) {
            return;
        }
        const {
            clientX,
            clientY,
        } = e;
        const {
            threshold = 0,
        } = options;
        const {
            _startRect,
            _startPos,
        } = this;

        const direction = [0, 0];

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
        return this._continueDrag({
            ...options,
            direction,
            inputEvent: e,
            isDrag: true,
        });
    }
    public checkScroll(options: CheckScrollOptions) {
        if (this._isWait) {
            return false;
        }
        const {
            prevScrollPos = this._prevScrollPos,
            direction,
            throttleTime = 0,
            inputEvent,
            isDrag,
        } = options;
        const nextScrollPos = this._getScrollPosition(direction || [0, 0], options);
        const offsetX = nextScrollPos[0] - prevScrollPos[0];
        const offsetY = nextScrollPos[1] - prevScrollPos[1];

        const nextDirection = direction || [
            offsetX ? Math.abs(offsetX) / offsetX : 0,
            offsetY ? Math.abs(offsetY) / offsetY : 0,
        ];
        this._prevScrollPos = nextScrollPos;

        if (!offsetX && !offsetY) {
            return false;
        }
        this.trigger("move", {
            offsetX: nextDirection[0] ? offsetX : 0,
            offsetY: nextDirection[1] ? offsetY : 0,
            inputEvent,
        });

        if (throttleTime && isDrag) {
            this._timer = window.setTimeout(() => {
                this._continueDrag(options);
            }, throttleTime);
        }
        return true;
    }
    public dragEnd() {
        clearTimeout(this._timer);
    }
    private _getScrollPosition(direction: number[], options: DragScrollOptions) {
        const {
            container,
            getScrollPosition = getDefaultScrollPosition,
        } = options;
        return getScrollPosition({ container: getContainerElement(container), direction });
    }
    private _continueDrag(options: CheckScrollOptions) {
        const {
            container,
            direction,
            throttleTime,
            useScroll,
            isDrag,
            inputEvent,
        } = options;

        if (isDrag && this._isWait) {
            return;
        }
        const nowTime = now();
        const distTime = Math.max(throttleTime + this._prevTime - nowTime, 0);

        if (distTime > 0) {
            this._timer = window.setTimeout(() => {
                this._continueDrag(options);
            }, distTime);

            return false;
        }

        this._prevTime = nowTime;
        const prevScrollPos = this._getScrollPosition(direction, options);

        this._prevScrollPos = prevScrollPos;

        if (isDrag) {
            this._isWait = true;
        }
        this.trigger("scroll", {
            container: getContainerElement(container),
            direction,
            inputEvent,
        });

        this._isWait = false;
        return useScroll || this.checkScroll({
            ...options,
            prevScrollPos,
            direction,
            inputEvent,
        });
    }
}
