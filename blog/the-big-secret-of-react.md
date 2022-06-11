# The big secret of React

Did you wonder how React compares the `deps` array used by the hooks in every render? Let's check the magic that decides when run the `useEffect` hook.

## Introduction

As a curious developer, I was wondering how React checks the array of dependencies, called `deps`, that I pass to the `useEffect`, `useCallback` and `useMemo` hooks. I didn't find the answer anywhere.

```javascript
useEffect(() => {
  console.log('Hook was executed');
}, [someValue]);
```

So, my unique option was to check the React's code itself to find the magic, and I found more than I expected.

## The comparison

React don't use `==` or `===` operators, it uses the [`Object.is()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) method. This method provides the [`SameValue` algorithm](https://262.ecma-international.org/5.1/#sec-9.12) since ES2015.

We all knew the difference between Abstract Equality Comparison (`==`) and Strict Equality Comparison (`===`), but what comes with this new comparison?

💡 You can quickly check the difference between these equality comparisons in [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#a_model_for_understanding_equality_comparisons).

We can affirm that the difference between `===` and `Object.is` are:

1. `+0`, `-0` and `0` are the same value for `===`, but different for `Object.is`. «And that's a point to `is` for being that's mathematically correct.» ✅
2. `NaN === NaN` is `false` for `===` 😒, but `true` for the SameValue algorithm. «Another point to `Object.is`.»

I think now it's clear why React chose a little-known comparison method.

## Show me the code

If you're a developer, I guess you want to see where is the code for `Object.is` 😁. The answer is in a function called `areHookInputsEqual` in the `ReactFiberHooks.new.js` file: <https://github.com/facebook/react/blob/v18.1.0/packages/react-reconciler/src/ReactFiberHooks.new.js#L323>.

💡 I used the latest tag because the code can change.

It's cool to see how this check is completely ignored if you're in a hot reload process, and how the checks for the programmer are removed in the `production` build of React.

## Conclusion

IMO the most important issue here is that React doesn't make a deep comparison between objects, it only checks if it's the same object.

💡 If you don't know what this means check this page of Redux about [the benefits of immutability](https://redux.js.org/faq/immutable-data#what-are-the-benefits-of-immutability).

🧠 Remember that an object variable is just a memory reference (pointer) to where the object is, that's what `===` and `Object.is` use when you compare two objects.

I hope you enjoyed this dive into the React's source code. 🤿
