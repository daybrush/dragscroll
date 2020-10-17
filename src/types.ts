export interface DragScrollOptions {
    container: HTMLElement;
    threshold?: number;
    getScrollPosition?: (param: { container: HTMLElement, direction: number[] }) => number[];
    throttleTime?: number;
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
