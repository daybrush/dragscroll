import Component from "@egjs/component";
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
    private prevDirection: number[] | null = null;
    private startPos: number[] = [];
    private prevPos: number[] = [];
    public dragStart(e: any, container: HTMLElement) {
        const {
            top,
            left,
            width,
            height,
        } = container.getBoundingClientRect();

        this.startPos = [e.clientX, e.clientY];
        this.startRect = { top, left, width, height };
    }
    public drag(e: any, options: DragScrollOptions) {
        const {
            clientX,
            clientY,
        } = e;
        this.prevDirection = null;

        const {
            container,
            threshold = 0,
            getScrollPosition = getDefaultScrollPosition,
        } = options;
        const {
            startRect,
            startPos,
        } = this;

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
        if (!direction[0] && !direction[1]) {
            return false;
        }

        this.prevDirection = direction;
        this.prevPos = getScrollPosition({ container, direction });

        this.trigger("scroll", {
            container,
            direction,
            inputEvent: e,
        });
        return true;

    }
    public dragAfter(e: any, options: DragScrollOptions) {
        const {
            prevPos,
            prevDirection: direction,
        } = this;

        if (!this.prevDirection) {
            return false;
        }
        const {
            container,
            getScrollPosition = getDefaultScrollPosition,
        } = options;
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
        return true;
    }
}
