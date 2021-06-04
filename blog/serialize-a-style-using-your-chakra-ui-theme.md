# Serialize a style using your Chakra UI theme

A time ago I had to build a _subscription form_ using the [Spreedly iFrame API](https://docs.spreedly.com/reference/iframe/v1/) to allow a user to use its credit card in a safe way.

After a while, I found myself into an issue with the card number and the CVV number inputs because Spreedly inserts an `iframe`; therefore the inputs are not under my control (and my CSS).

## The easy solution

Fortunately, Spreedly accepts a style inline string via the [`setStyle`](https://docs.spreedly.com/reference/iframe/v1/#setstyle) function.

```javascript
Spreedly.on("ready", () => {
  Spreedly.setStyle("number", "width:225px;  height:35px;");
});
```

This is a little bit ugly but it's a solution after all. Let's see how to improve this...

## Using the theme with strings

We can use the [`useTheme` hook](https://chakra-ui.com/docs/hooks/use-theme) to get all the tokens we defined in the theme.

```javascript
import {useEffect} from 'react'
import {useTheme} from "@chakra-ui/react"

const buildStyles = theme => `
  border: 2px solid ${theme.colors.gray[300]},
  color: ${theme.colors.black},
  lineHeight: ${theme.sizes[5]}
`

const MyComp = () => {
  const theme = useTheme();
  useEffect(() => {
    Spreedly.on("ready", () => {
      Spreedly.setStyle("number", buildStyles(theme));
    });
  }, []);

  return <>...</>;
};
```

This is similar to `styled-components` because of the string templates usage to create styles.

💡 Tip: remember that your component should be wrapped by a `ChakraProvider` to get the `theme` object.

## Using a CSS object

I looked for a nicer way to handle a CSS object in JavaScript instead of using one big string. Chakra UI uses [emotion](https://emotion.sh/) under the hook to build the CSS classes, so I found this solution:

```javascript
import {css} from "@chakra-ui/react"
import {serializeStyles} from '@emotion/serialize'

const toCSSString = (styles, theme) => serializeStyles([css(styles)(theme)]).styles;
```

The [`serializeStyles` function](https://github.com/emotion-js/emotion/blob/main/packages/serialize/) from `emotion` convert an object into another one built with a `name` attribute for an auto-generated CSS class name; and the `styles` attribute with all the style properties in one string. 😁

The [`css` function](https://github.com/chakra-ui/chakra-ui/blob/main/packages/styled-system/src/css.ts) from Chakra UI normalizes the shortcuts that [Chakra provides](https://chakra-ui.com/docs/features/style-props) like:

```javascript
<Box w="full" h={9} bg="blue.300"/>
```

The `w`, `h` and `bg` are aliases for `width`, `height` and `background` style properties. The `props` for this `Box` component are passed to the `css` getting this output:

```javascript
{
  height: "var(--chakra-sizes-9)",
  background: "var(--chakra-colors-blue-300)",
​  width: "var(--chakra-sizes-full)"
}
```

Here we can't use nice values like `9`, `full` or `blue.300` because Spreedly is inside an `iframe` and our CSS [custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) (a.k.a. CSS variables) are not in the scope of the `iframe`'s stylesheet.

### Building the inline styles from an object

We are going to put them all together to get the final theme values (not the custom properties) and serialize the CSS object into a inline style string using `emotion`.

```javascript
import {css, useTheme} from "@chakra-ui/react"
import {serializeStyles} from '@emotion/serialize'

const buildStyles = theme => ({
  border: `2px solid ${theme.colors.gray[300]}`,
  color: theme.colors.black,
  lineHeight: theme.sizes[5]
});

const toCSSString = (styles, theme) => serializeStyles([css(styles)(theme)]).styles;

const MyComp = () => {
  const theme = useTheme();
  useEffect(() => {
    Spreedly.on("ready", () => {
      Spreedly.setStyle(
        "number",
        toCSSString(buildStyles(theme), theme)
      );
    });
  }, []);

  return <>...</>;
};
```

## Conclusion

I hope these internals functions from Chakra UI and emotion help you when using Spreedly, an iframe, or a UI component where you can't send the styles in the cool way that Chakra provides.
