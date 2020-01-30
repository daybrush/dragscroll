import Component from "@egjs/component";
import { now } from "@daybrush/utils";
import { DragScrollOptions, Rect } from "./types";

function getDefaultScrollPosition(e: { container: HTMLElement, direction: number[] }) {
    const container = e.container;

    return [
        container.scrollLeft,
        container.scrollTop,
    ];
}

export default class DragScroll extends Component {
    private startRect: Rect | null = null;
    private startPos: number[] = [];
    private prevTime: number = 0;
    private timer: number = 0;
    public dragStart(e: any, options: DragScrollOptions) {
        const {
            top,
            left,
            width,
            height,
        } = options.container.getBoundingClientRect();

        this.startPos = [e.clientX, e.clientY];
        this.startRect = { top, left, width, height };
    }
    public drag(e: any, options: DragScrollOptions) {
        const {
            clientX,
            clientY,
        } = e;
        const {
            container,
            threshold = 0,
            throttleTime = 0,
            getScrollPosition = getDefaultScrollPosition,
        } = options;
        const {
            startRect,
            startPos,
        } = this;
        const nowTime = now();
        const distTime = Math.max(throttleTime + this.prevTime - nowTime, 0);

        const direction = [0, 0];

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
            this.timer = window.setTimeout(() => {
                this.drag(e, options);
            }, distTime);

            return false;
        }
        this.prevTime = nowTime;
        const prevPos = getScrollPosition({ container, direction });

        this.trigger("scroll", {
            container,
            direction,
            inputEvent: e,
        });

        const nextPos = getScrollPosition({ container, direction });
        const offsetX = nextPos[0] - prevPos[0];
        const offsetY = nextPos[1] - prevPos[1];

        if (!offsetX && !offsetY) {
            return false;
        }
        this.trigger("move", {
            offsetX: direction[0] ? offsetX : 0,
            offsetY: direction[1] ? offsetY : 0,
            inputEvent: e,
        });

        if (throttleTime) {
            this.timer = window.setTimeout(() => {
                this.drag(e, options);
            }, throttleTime);
        }
        return true;
    }
    public dragEnd() {
        clearTimeout(this.timer);
    }
}
