# 🚃 react router

## IMPORTANT: This project as been copied and continues on [cher-ami/router repository](https://github.com/cher-ami/router)

----

React router API is inspired by [wouter](https://github.com/molefrog/wouter),
[solidify router](https://github.com/solid-js/solidify/blob/master/navigation/Router.ts) and
[vue router](https://router.vuejs.org/) API.

## Why another react router?

Because manage routes transitions with React is always complicated, this router is build to allow transitions flexibility.
It provides Stack component who render previous and current page component when route change.

This router loads [history](https://github.com/ReactTraining/history), [path-parser](https://github.com/troch/path-parser) and [debug](https://github.com/visionmedia/debug) as dependencies.

## API

Components:

- [`<Router />`](#Router) Wrap Link and stack component
- [`<Link />`](#Link) Trig current stack
- [`<Stack />`](#Stack) Wrap previous and current page

Hooks:

- [`useRouter`](#useRouter) Get router instance from any component
- [`useLocation`](#useLocation) Get current location and set new location
- [`useRoute`](#useRoute) Get previous and current route
- [`useStack`](#useStack) Register page component in stack
- [`useRouteCounter`](#useRouteCounter) Get route counter + isFirstRoute state
- [`useHistory`](#useHistory) Handle history changed and get global router history

## Installation

TODO

## Simple usage

```jsx
// create a route object
const routesList = [
  { path: "/foo", component: FooPage },
  { path: "/bar", component: BarPage },
];

// wrap render with <Router /> component
function App() {
  return (
    <Router routes={routesList} base={"/"}>
      <nav>
        <Link href={"/foo"} />
        <Link href={"/bar"} />
      </nav>
      <Stack manageTransitions={manageTransitions} />
    </Router>
  );
}

// manage transitions function is a Stack props
const manageTransitions = ({ previousPage, currentPage }) =>
  new Promise(async (resolve) => {
    if (previousPage) await previousPage.playOut();
    if (currentPage) await currentPage.playIn();
    resolve();
  });
```

Page component need to be wrap by `React.forwardRef`. The `handleRef` lets hold transitions, ref, etc. used by `<Stack />` component.

```jsx
const FooPage = forwardRef((props, handleRef) => {
  const componentName = "FooPage";
  const rootRef = useRef(null);

  // create custom page transitions (example with GSAP)
  const playIn = () => {
    return new Promise((resolve) => {
      gsap.from(rootRef.current, { autoAlpha: 0, onComplete: resolve });
    });
  };
  const playOut = () => {
    return new Promise((resolve) => {
      gsap.to(rootRef.current, { autoAlpha: 0, onComplete: resolve });
    });
  };

  // register page transition properties used by Stack component
  useStack({ componentName, handleRef, rootRef, playIn, playOut });

  return (
    <div className={componentName} ref={rootRef}>
      {componentName}
    </div>
  );
});
```

## Nested Router

TODO

## Manage transition examples

TODO

- isReadyPromise example
- crossed transition example

## <a name="Router"></a>Router

Router component create a new router instance.

```jsx
<Router routes={} base={} id={}>
  {/* can now use <Link /> and <Stack /> component */}
</Router>
```

**Props:**

- **routes** `TRoute[]` Routes list
- **base** `string` Base URL - default: `"/"`
- **id** `number | string` _(optional)_ Router instance ID - default: `1`

## <a name="Link"></a>Link

Trig new route.

```jsx
<Link to={} className={} />
```

**Props:**

- **to** `string` Path ex: "/foo". Can Be absolute `/path/foo` or relative `path/foo`
- **className** `string` _(optional)_ Class name added to component root DOM element

## <a name="Stack"></a>Stack

Render previous and current page component.

```jsx
<Stack manageTransitions={} className={} />
```

**Props:**

- **manageTransitions** `(T:TManageTransitions) => Promise<void>`
  This function allow to create the transition scenario.
- **className** `string` _(optional)_ className added to component root DOM element

```ts
type TManageTransitions = {
  previousPage: IRouteStack;
  currentPage: IRouteStack;
  unmountPreviousPage: () => void;
};

interface IRouteStack {
  componentName: string;
  playIn: () => Promise<any>;
  playOut: () => Promise<any>;
  isReady: boolean;
  $element: HTMLElement;
  isReadyPromise: () => Promise<void>;
}
```

## <a name="useRouter"></a>useRouter

Get current router instance.

```jsx
const router = useRouter();
```

## <a name="useLocation"></a>useLocation

Allow the router to change location.

```jsx
const [location, setLocation] = useLocation();
// give URL
setLocation("/bar");
// or an object
setLocation({ name: "FooPage", param: { id: "2" } });
```

**Returns:**

An array with these properties:

- **location** `string` Get current pathname location
- **setLocation** `(path:string | TOpenRouteParams) => void` Open new route

```ts
type TOpenRouteParams = {
  name: string;
  params?: { [x: string]: any };
};
```

## <a name="useRoute"></a>useRoute

Get previous and current route properties (TRoute)

```jsx
const { currentRoute, previousRoute } = useRoute();
```

**Returns:**

An object with these properties:

- **currentRoute** `(TRoute)` Current route object
- **previousRoute** `(TRoute)` Previous route object

```ts
type TRoute = {
  path: string;
  component: React.ComponentType<any>;
  props?: { [x: string]: any };
  parser?: Path;
  children?: TRoute[];
  matchUrl?: string;
  fullUrl?: string;
};
```

## <a name="useStack"></a>useStack

Prepare page component for Stack.

```js
useStack({ componentName, handleRef, rootRef, playIn, playOut, isReady });
```

**Parameters:**

- **componentName** `string` Name of current component
- **handleRef** `MutableRefObject<any>` Ref handled by parent component
- **rootRef** `MutableRefObject<any>` Ref on root component element
- **playIn** `() => Promise<any>` _(optional)_ Play in transition - default: `new Promise.resolve()`
- **playOut** `() => Promise<any>` _(optional)_ Play out transition - default: `new Promise.resolve()`
- **isReady** `boolean` _(optional)_ Is ready state - default: `true`

**Returns:**

nothing

## <a name="useRouteCounter"></a>useRouteCounter

Returns route counter

```js
const { routeCounter, isFirstRoute, resetCounter } = useRouteCounter();
```

**Parameters:**

nothing

**Returns:**

An object with these properties:

- **routerCounter** `number` Current route number - default: `1`
- **isFirstRoute** `boolean` Check if is first route - default: `true`
- **resetCounter** `() => void` Reset routerCounter & isFirstRoute states

## <a name="useHistory"></a>useHistory

Allow to get the global router history and execute a callback each time history change.

```js
const history = useHistory((e) => {
  // do something
});
```

**Parameters:**

- **callback** `(event) => void` Callback function to execute each time the history change

**Returns:**

- **history** `location[]` : Location array of history API

---

## Example

Install dependencies

```shell
$ npm i
```

Start dev server

```shell
$ npm run dev
```

## Credits

Willy Brauner
