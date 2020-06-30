//
//
// /**
//  *  - lecture de route (parser une URL)
//  *  - intanciation du composant
//  *
//  *  - instance de router
//  *
//  *  - event emitter pour savoir quand une route change
//  *  - BONUS event emitter pour savoir quand une route n'existe pas (si on match sur aucune des routes)
//  *
//  *  - connaitre l'ancienne page / la page courante
//  *  - gestion des
//  *
//  *  - hook useRouteTransition : passer les transitions playIn playOut de la page courante + promiseReady
//  *  - hook useRoute
//  *      const { match, params, currentRoute, previousRoute } = useRoute();
//  *
//  */
// import {ReactNode} from "react";
//
//
// export interface IRouteData {
//     path: string,
//     component: ReactNode,
//     props: { [x:any]: any }
//     parser: PathParser
// }
//
// export interface IRoute {
//     path: string,
//     component: ReactNode,
//     props: { [x:any]: any }
// }
//
//
// class Router {
//     // base url
//     public baseURL:string;
//     // routes list
//     protected _routes:IRoute[];
//
//     constructor({base = "/", routes = null}: {base:string, routes:IRoute[]}) {
//         this.baseURL = base;
//         if (routes !== null) {
//             routes.forEach((el)=> {
//                 this.add(el)
//             })
//         }
//     }
//
//     /**
//      * Add new route to routes array
//      */
//     public add(path:string, component, props) {
//
//
//         const routeParams:IRouteData = {
//             path,
//             component,
//             props,
//             parser: new PathParser(path)
//         };
//
//         //
//         this.routes.push(routeParams)
//     }
//
//     /**
//      * Use middleWare
//      */
//     public use() {}
//
//     /**
//      https://www.npmjs.com/package/path-parser
//      */
//     protected getRouteFromUrl(url:string) {
//
//         for (let i = 0;  i < this.routes.length; i++ )
//         {
//             const match = this.routes[i].PathParser.test;
//             if ( match) {
//                 return {
//                     route: this.routes[i]
//                     params: match
//                 };
//             }
//         }
//     }
//
//     /**
//      *
//      */
//     protected handleUrlChange ()
//     {
//         const route = this.getRouteFromUrl(window.location.url);
//
//         if (!route) {
//             throw new Error("Error, there is no route.");
//         }
//
//         const component = "";
//
//     }
//
//
//
//
// }
//
//
//
//
//
// //
// const prepareRoutes = [
//     {
//         path: "",
//         component: "",
//         props: {
//         }
//     },
//     {
//         path: "",
//         component: "",
//         props: {
//
//         }
//     }
// ]
//
//
// //
// const router = new Router({ base: "/", routes: [] });
//
//
// // config par rapport aux locales (récupérée depuis le back)
// LanguageService.locales(...);
//
// // middlewares
// // patcher toutes les routes avec la locale courante
// // afficher la locale par default ou pas
// // ex: si une route est définie sans langue, il faut pouvoir la retourner avec langue
// const languageMiddleWare = new LanguageMiddleWare({...})
// router.use(languageMiddleWare);
//
//
// // déclaration des routes
// router.add("/", Home, );
// router.add("/blog", Blog);
// router.add("/blog/:id", Article);
//
//
// // fallback
// router.add("*", () => <Error />);
//
//
//
//
