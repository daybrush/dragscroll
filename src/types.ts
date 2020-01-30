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
