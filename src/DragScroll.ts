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
    private prevPos: number[] = [];
    public dragStart(container: HTMLElement) {
        const {
            top,
            left,
            width,
            height,
        } = container.getBoundingClientRect();

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
        } = this;

        const direction = [0, 0];

        if (startRect.top > clientY - threshold) {
            direction[1] = -1;
        } else if (startRect.top + startRect.height < clientY + threshold) {
            direction[1] = 1;
        }
        if (startRect.left > clientX - threshold) {
            direction[0] = -1;
        } else if (startRect.left + startRect.width < clientX + threshold) {
            direction[0] = 1;
        }
        if (!direction[0] && !direction[1]) {
            return false;
        }

        this.prevDirection = direction;
        this.prevPos = getScrollPosition({ container, direction });

        this.trigger("scroll", {
            container,
            direction,
        });
        return true;

    }
    public dragAfter(options: DragScrollOptions) {
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
        });
        return true;
    }
}
