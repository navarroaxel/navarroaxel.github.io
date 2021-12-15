# You can't create a constant using useMemo in React

There are 3 possible options to create a constant in React: `useState`, `useMemo` and `useRef`. We're going to see which one is the best way to create real constants (not constant-like values).

I talked about the [`useConst`](https://github.com/chakra-ui/chakra-ui/blob/main/packages/hooks/src/use-const.ts) hook from [chakra-ui](https://chakra-ui.com/docs/hooks/use-const) in a [previous post](https://dev.to/cloudx/chakra-ui-the-hidden-treasures-1gl9), and I recently found the same hook in [Fluent UI](https://www.npmjs.com/package/@fluentui/react-hooks#useconst) so we are going to see why they've implemented it.

## Remember useMemo

The first thing I think of when I look for a constant in a render function is the use of [`useMemo`](https://reactjs.org/docs/hooks-reference.html#usememo) hook. This is a good option, but only if your "constant" value shouldn't change based on the dependencies.

```javascript
const memoizedValue = useMemo(
  () => computeExpensiveValue(a, b),
  [a, b]
);
```

There is no guarantee that the returned value of `useMemo` is always the same even when the dependencies didn't change. For this reason React runs the factory function if the tool believes that the value should be re created.

🧠 The official documentation says:

> Write your code so that it still works without `useMemo` — and then add it to optimize performance.

## The useState option

If a state doesn't change, then it's a constant.

```javascript
const [value] = useState(initialValue);
```

Yeah, we can create a constant with [`useState`](https://reactjs.org/docs/hooks-reference.html#usestate) but it's expensive due to reducer handling which we don't need.

🧙‍♂️ If you want to learn how React handles its hooks inside the Fiber reconciler, you should read the [Fiber hooks](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.new.js) code.

## A useRef approach

The [`useRef`](https://reactjs.org/docs/hooks-reference.html#useref) hook can hold a value, and it neither has an internal reducer nor checks on the dependencies array. Also, React doesn't re-create the value for performance reasons.

```javascript
const useConst = (initialValue) => {
  const ref = React.useRef();
  if (ref.current === undefined) {
    ref.current = typeof initialValue === 'function' ? initialValue() : initialValue;
  }
  return ref.current;
}
```

💡 This is the cheapest way to create a constant value over the lifecycle of a component.

## Conclusion

❌ Don't use `useState` to create constants because it's expensive.

🥸 If you need a constant-like value based on some dependencies then `useMemo` is for you (but your code should still work without this hook).

✅ If you need a real constant over the lifecycle of a component, `useRef` is the solution that you need, and remember that some libraries like Chakra UI or Fluent UI provides a built-in `useConst` for this.
