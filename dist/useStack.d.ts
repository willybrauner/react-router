import { MutableRefObject } from "react";
export interface IUseStack extends Omit<IRouteStack, "$element" | "isReadyPromise"> {
    handleRef: MutableRefObject<any>;
    rootRef: MutableRefObject<any>;
}
export interface IRouteStack {
    componentName: string;
    playIn?: () => Promise<any>;
    playOut?: () => Promise<any>;
    isReady?: boolean;
    $element: HTMLElement;
    isReadyPromise?: () => Promise<void>;
}
/**
 * @name useStack
 * @description Allow set page properties in router
 */
export declare const useStack: ({ componentName, playIn, playOut, handleRef, rootRef, isReady, }: IUseStack) => void;
