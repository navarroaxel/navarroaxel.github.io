# Chakra UI: the hidden treasures

I found [Chakra UI](https://github.com/chakra-ui/chakra-ui) (by [Sage](https://github.com/readme/segun-adebayo)) a few months ago, and I learned a lot of things from it.

I've been coding in React since 2017, and I used Less, Sass, `styled-components`, even StyleSheet in `react-native`. But this time I found something more fluent.

## A little Introduction

Have you ever used `styled-components`? Chakra UI moved all the CSS strings to props, like the following `Box`, a `div` wrapper:

```jsx
<Box height={4} width="20rem" bg="blue.100" />
```

And this is awesome. 🤩

Also the default theme is flexible and you can overwrite whatever you want, and also create custom components to extend the built-in Chakra components.

And if you are a TypeScript lover: the types are very consistent.

But this post is not an introduction...

## And where is the treasure?

Like every treasure, this one is not in the surface, you'll need to go deeper. I cloned the source code of Chakra UI and I found a lot of stuff.

### The project structure

Chakra is built using packages for each module 👌; some are internals and others are public and exported by the main package [@chakra-ui/react](https://www.npmjs.com/package/@chakra-ui/react). You can learn how to use `lerna` and how to build this system package by package. 📦

### The hooks

The first package I dove into was the [@chakra-ui/hooks](https://github.com/chakra-ui/chakra-ui/tree/main/packages/hooks) and I found the first treasure:

The [useOutsideClick](https://chakra-ui.com/docs/hooks/use-outside-click) is a common one to hide popovers when the user clicks outside them. And then there is the [useMergeRefs](https://chakra-ui.com/docs/hooks/use-merge-refs) when you need to merge several React refs into one. I contributed with doc pages for both hooks. 😁

You can find more [useful](https://github.com/chakra-ui/chakra-ui/blob/main/packages/hooks/src/use-const.ts) [hooks](https://github.com/chakra-ui/chakra-ui/blob/main/packages/hooks/src/use-why-update.ts).

Like this special one: the [usePopper](https://github.com/chakra-ui/chakra-ui/blob/main/packages/popper/README.md), a wrapper for the [popper.js](https://popper.js.org/) 🍿 library, converting it into a magic hook. This is an internal hook and it's not documented in the website, but is still exported and you can use it, the downside is that ⚠️ it's not covered by [semver](https://semver.org/). 🙀

### The utils

Another internal package is the [@chakra-ui/utils](https://github.com/chakra-ui/chakra-ui/tree/main/packages/utils).

Here you can find functions for [arrays](https://github.com/chakra-ui/chakra-ui/blob/main/packages/utils/src/array.ts) that remembers to the Lodash library. Also to manage [functions](https://github.com/chakra-ui/chakra-ui/blob/main/packages/utils/src/function.ts) and parse [numbers](https://github.com/chakra-ui/chakra-ui/blob/main/packages/utils/src/number.ts).

Another one to work with [objects](https://github.com/chakra-ui/chakra-ui/blob/main/packages/utils/src/object.ts) with [`lodash.mergewith`](https://www.npmjs.com/package/lodash.mergewith) as a dependency.

You can use [`addDomEvent`](https://github.com/chakra-ui/chakra-ui/blob/main/packages/utils/src/dom.ts#L41) to add global event listeners without leaks.

```jsx
import {addDomEvent} from '@chakra-ui/utils';

const MyNiceFeature = () => {
  const [height, setHeight] = useState(window.innerHeight - 50);
  useEffect(
    () =>
      addDomEvent(window, 'resize', () =>
        setHeight(window.innerHeight - 50),
      ),
    [],
  );
  ...
};
```

If these helpers are already loaded in your bundle, why would you repeat the code instead of reusing it?

### The React code

I found myself reading the code by [Sage](https://github.com/readme/segun-adebayo) and the contributors and learning another way to handle heavy UI components, like the [@chakra-ui/menu](https://github.com/chakra-ui/chakra-ui/tree/main/packages/menu). Using hooks and event handlers to handle the user interactions in a fluent way. 🤯

## Conclusion

I found a nice and beautiful UI library where I can handle CSS inside the React components without string templates. But I also found a source to learn new stuff:

* How to handle UI behavior with reusable hooks and functions.
* A hidden toolbox that I can use for my own components too.
* The path to use Lerna in a monorepo.
* A guideline to pass from `px` to `rem` units in CSS.

Cons

* Some tweaks that you'll need to customize the theme is not explicitly documented.
* The community is growing but not so big like `styled-components.
* The documentation is a work in progress, there are some functionalities that you'll have to understand by reading the source code.

I hope you fall in love with Chakra UI too and the power of the Open Source Software. 🥰 *#ShareTheKnowledge*
