# 🚃 react router _(WIP)_

React router API is inspired by [wouter](https://github.com/molefrog/wouter),
[solidify router](https://github.com/solid-js/solidify/blob/master/navigation/Router.ts) and
[vue router](https://router.vuejs.org/) API.

## Why another react router?

Because manage routes transitions with React is always complicated, this router is build to allow transitions flexibility.
It provides Stack component who render previous and current page component when route change.

This router only loads [path-parser](https://github.com/troch/path-parser) as dependency.

## Components

- [`<Router />`](#router-) Wrap Link and stack component
- [`<Link />`](#link-) Trig current stack
- [`<Stack />`](#stack-) Wrap previous and current page

## Hooks

- [`useRouter`](#useRouter) Get router instance from any component
- [`useLocation`](#useLocation) Get current location and set new location
- [`useRoutes`](#useRoutes) Get previous and current route
- [`useStack`](#useStack) Register page component in stack

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

## API

### `<Router />`

Create a new router instance.

```jsx
<Router routes={} base={} id={} fakeMode={}>
  {/* can now use <Link /> and <Stack /> component */}
</Router>
```

#### Props

- `routes (TRoute[])` Routes list
- `base (string)` base URL - default: `"/"`
- `id (number)` Router instance ID - default: `1`
- `fakeMode (boolean)` Allow to access routes without push in browser history

### `<Link />`

Trig new route.

```jsx
<Link href={} className={} />
```

#### Props

- `href (string)` ex: "/foo"
- `className (?string)` className added to component root DOM element

### `<Stack />`

Returns previous and current page.

```jsx
<Stack manageTransitions={} className={} />
```

#### Props

- `manageTransitions ((T:TManageTransitions) => Promise<void>)`
  This function allow to create the transition scenario.

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

- `className (?string)` className added to component root DOM element

### <a name="useRouter"></a>`useRouter()`

Get current router instance.

```jsx
const router = useRouter();
```

### <a name="useLocation"></a>`useLocation()`

Allow the router to change location.

```jsx
const [location, setLocation] = useLocation();
// give URL
setLocation("/bar");
// or an object
setLocation({ name: "FooPage", param: { id: "2" } });
```

#### Returns

- `location (string)` Get current location
- `setLocation ((path:string | TOpenRoute)=> void)` Open new route

```ts
type TOpenRoute = {
  name: string;
  params?: { [x: string]: any };
};
```

### <a name="useRoutes"></a>`useRoutes()`

```jsx
const { currentRoute, previousRoute } = useRoutes();
```

Get previous and current route properties (TRoute)

#### Returns

- `currentRoute (TRoute)` Current route object
- `previousRoute (TRoute)` Previous route object

```ts
type TRoute = {
  path: string;
  component: React.ComponentType<any>;
  props?: { [x: string]: any };
  parser?: Path;
  children?: TRoute[];
  url?: string;
};
```

### <a name="useStack"></a>`useStack()`

Prepare page component for Stack.

```js
useStack({ componentName, handleRef, rootRef, playIn, playOut, isReady });
```

#### Parameters

- `componentName (string)` Name of current component
- `handleRef (MutableRefObject<any>)` Ref handled by parent component
- `rootRef (MutableRefObject<any>)` Ref on root component element
- `playIn (?() => Promise<any>)` Play in transition - default: `new Promise.resolve()`
- `playOut (?() => Promise<any>)` Play out transition - default: `new Promise.resolve()`
- `isReady (?boolean)` Is ready state - default: `true`

#### Returns

nothing

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
