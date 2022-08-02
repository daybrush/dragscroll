export interface DragScrollOptions {
    container: string | (() => HTMLElement) | HTMLElement | { current?: HTMLElement | null } | { value?: HTMLElement | null };
    threshold?: number;
    getScrollPosition?: (param: { container: HTMLElement, direction: number[] }) => number[];
    throttleTime?: number;
    useScroll?: boolean;
}
export interface CheckScrollOptions extends DragScrollOptions {
    isDrag?: boolean;
    inputEvent?: any;
    prevScrollPos?: number[];
    direction?: number[];
}
export interface Rect {
    left: number;
    top: number;
    width: number;
    height: number;
}

export interface OnScroll {
    container: HTMLElement;
    direction: number[];
    inputEvent: any;
}
export interface OnMove {
    offsetX: number;
    offsetY: number;
    inputEvent: any;
}
export interface DragScrollEvents {
    scroll: OnScroll;
    move: OnMove;
}
