export interface DragScrollOptions {
    getScrollPosition: (param: { scrollContainer: HTMLElement, direction: number[] }) => number[];
    scrollThreshold: number;
}
export interface Rect {
    left: number;
    top: number;
    width: number;
    height: number;
}
