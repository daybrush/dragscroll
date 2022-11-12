/**
 * @typedef
 */
export interface DragScrollOptions {
    /**
     * The area to detect scrolling through dragging. scroll container
     */
    container: string | (() => HTMLElement) | HTMLElement | { current?: HTMLElement | null } | { value?: HTMLElement | null };
    /**
     * Distance at which to start scrolling from the start or end points
     * @default 0
     */
    threshold?: number;
    /**
     * How to get scrollPosition
     * @default [container.scrollLeft, container.scrollTop]
     */
    getScrollPosition?: (param: { container: HTMLElement, direction: number[] }) => number[];
    /**
     * Request if there is a need to be scrolled through drag.
     * Only use one of the scroll event or requestScroll options.
     * @default null
     */
    requestScroll?: ((param: OnScroll) => void) | null;
    /**
     * How often to re-scroll when the drag stays at the start or end.
     * If 0, it does not occur.
     * @default 0
     */
    throttleTime?: number;
    /**
     * Set to true if only scrolling is enabled.
     * Set to false if re-scroll check is required
     * @default false
     */
    useScroll?: boolean;
}
/**
 * @typedef
 */
export interface CheckScrollOptions extends DragScrollOptions {
    isDrag?: boolean;
    inputEvent?: any;
    prevScrollPos?: number[];
    direction?: number[];
}
/**
 * @typedef
 */
export interface Rect {
    left: number;
    top: number;
    width: number;
    height: number;
}
/**
 * @typedef
 */
export interface OnScroll {
    container: HTMLElement;
    direction: number[];
    inputEvent: any;
}
/**
 * @typedef
 */
export interface OnMove {
    offsetX: number;
    offsetY: number;
    inputEvent: any;
}

/**
 * @typedef
 */
export interface DragScrollEvents {
    scroll: OnScroll;
    move: OnMove;
}
