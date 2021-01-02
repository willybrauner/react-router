import { RouterManager, TRoute } from "./core/RouterManager";
import React, { ReactElement } from "react";
interface IProps {
    base: string;
    routes: TRoute[];
    children: ReactElement;
    fakeMode?: boolean;
    id?: number | string;
}
export declare const RouterContext: React.Context<RouterManager>;
/**
 * Router
 * will wrap Link and Stack components
 */
declare const Router: React.MemoExoticComponent<(props: IProps) => JSX.Element>;
export { Router };
