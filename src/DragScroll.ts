import Component from "@egjs/component";
import { DragScrollOptions, Rect } from "./types";

function getDefaultScrollPosition(e: { scrollContainer: HTMLElement, direction: number[] }) {
    const scrollContainer = e.scrollContainer;

    return [
        scrollContainer.scrollLeft,
        scrollContainer.scrollTop,
    ];
}

export default class DragScroll extends Component {
    public options: DragScrollOptions;
    private startRect: Rect | null = null;
    private prevClientX = 0;
    private prevClientY = 0;
    private prevDirection: number[] | null = null;
    private prevPos: number[] = [];
    constructor(private container: HTMLElement, options: Partial<DragScrollOptions> = {}) {
        super();
        this.options = {
            scrollThreshold: 0,
            getScrollPosition: getDefaultScrollPosition,
            ...options,
        };
    }
    public dragStart() {
        const {
            top,
            left,
            width,
            height,
        } = this.container.getBoundingClientRect();

        this.startRect = { top, left, width, height };
    }
    public drag(e: any) {
        const {
            clientX,
            clientY,
        } = e;
        this.prevDirection = null;

        const {
            scrollThreshold = 0,
            getScrollPosition = getDefaultScrollPosition,
        } = this.options;
        const {
            container,
            startRect,
        } = this;

        const direction = [0, 0];

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
        this.prevPos = getScrollPosition({ scrollContainer: container, direction });

        this.trigger("scroll", {
            scrollContainer: container,
            direction,
        });
        return true;

    }
    public dragAfter() {
        const {
            prevPos,
            prevDirection: direction,
            container: scrollContainer,
        } = this;

        if (!this.prevDirection) {
            return false;
        }
        const {
            getScrollPosition,
        } = this.options;
        const nextPos = getScrollPosition({ scrollContainer, direction });
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
