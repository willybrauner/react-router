import { TRoute } from "./core/RouterManager";
/**
 * useRoutes
 */
export declare const useRoutes: (cb?: () => void, dep?: any[]) => {
    previousRoute: TRoute;
    currentRoute: TRoute;
    setPreviousRoute: import("react").Dispatch<import("react").SetStateAction<TRoute>>;
    setCurrentRoute: import("react").Dispatch<import("react").SetStateAction<TRoute>>;
};
