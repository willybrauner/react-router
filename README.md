# New React Router

# TODO

## Fixer

- [ ] popstate ne fonctionne pas à la nav sans click
- [ ] multi stack ne fonctionne pas : prob d'imbrication d'URLs...

## Features

- [ ] permettre l'ajout de middleware comme language service
- [ ] permettre le fake mode (jeu entre pop / push / replace state)

## Low level

sortir du router les fonctions non essentielles au routing

- [ ] sortir page count (surtout si il y a multistack)
- [ ] sortir is first page (surtout si il y a multistack)
- [ ] rendre la stack optionnelle en créant un composant `<Route path />` ?

## useStack

- [x] renommer le hook `useStack` ? car le hook est intrasecment lié à <Stack />
- [x] déplacer pageTransition.list dans l'instance router en cours
- [ ] manageTransitions : comme la suppression de la previous page, permettre la creation de la current page.
- [ ] rendre optionnel l'utilisation du hook ? (comment faire pour récupérer la ref de la page ?)

## Hooks

- `useRouter` : retourne l'instance du router courant
- `useLocation` : retourne dynamiquement `[path courant + change location function]`
- `useRoutes` : retourne dynamiquement `{ previousRoute, currentRoute }`
- `useStack` : permet d'enregister un composant dans la page avec ses transitions

## Credits

- [wouter](https://github.com/molefrog/wouter)
- [router solidify](https://github.com/solid-js/solidify/blob/master/navigation/Router.ts)
- [vue router](https://router.vuejs.org/)
