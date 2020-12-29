# New React Router

## Components

- `<Router routes={} base={} id={} />`
- `<SubRouter base={} id={} />` // TODO
- `<Link href={} />`
- `<Stack manageTransitions={} />`

## Hooks

- `useRouter` : retourne l'instance du router courant
- `useLocation` : retourne dynamiquement `[currentRoute.path + setLocationFn()]`
- `useRoutes` : retourne dynamiquement `{ previousRoute, currentRoute }`
- `useStack` : permet d'enregister un composant dans la page avec ses transitions

## Credits

- [wouter](https://github.com/molefrog/wouter)
- [router solidify](https://github.com/solid-js/solidify/blob/master/navigation/Router.ts)
- [vue router](https://router.vuejs.org/)
