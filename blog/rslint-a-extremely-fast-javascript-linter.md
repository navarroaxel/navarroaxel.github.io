# RSLint - An extremely fast JavaScript linter

ESLint is a de facto solution for [linting](https://en.wikipedia.org/wiki/Lint_%28software%29) JavaScript code. Also, `C` is the first thing that comes to our minds when we talk about compile some code of every kind. I know that a lot of compilers are compiled using the language that they compile 😕. But when we talk about parsers, abstract syntax trees (AST), and compile to binary: `C` comes to our minds. Maybe I'm old, I don't know. 🤔

And, in this post I'll talk about other linters for JavaScript that are growing around nowadays.

## The Deno alternative

Deno has re-thought the Node.js world with a lot of really great decisions: a built-in bundler, documentation generator, a code formatter, and 🥁... [deno_lint](https://github.com/denoland/deno_lint), a linter made in Rust 🦾.

Why Rust 🦀? Well, it's a powerful language: thread-safe and memory safe without a garbage collector. We can expect better speed than a statically typed language with a performance similar to `C`. And this includes more speed than JavaScript for an intensive CPU usage task: to parse and analyze code.

### deno lint

The `deno_lint` tries to support the recommended set of rules from ESLint and TypeScript out of the box. But, this still doesn't [support JSX code](https://github.com/denoland/deno_lint/issues/148), so it's not easy to use with our React projects. 😞

You can try it by using `npm install @node-rs/deno-lint` in your nodejs project.

## RSLint

Another linter appeared and is called [RSLint](https://github.com/RDambrosio016/RSLint), but it's only for JavaScript 🙃. This project is still in early development, that means it isn't ready for production yet.

RSLint uses [rowan](https://docs.rs/rowan/latest/rowan), a Rust library for syntax trees that was developed for [Rust analyzer](https://github.com/rust-analyzer/rust-analyzer). Rowan models trees are immutable syntax trees, instead of mutable AST that are expensive to clone.

`RSLint` only implements around 25 rules nowadays, but the implementation of ESLint recommended rules and support for JSX is in the roadmap.

Additionally, `RSLint` will be available as an npm package with a pre-built binary as well.

### Can we say this is better?

Not at the moment but, due to the immutability of the trees, the highly parallelization is a fact: «files linted in parallel, rules run in parallel, nodes could be traversed in parallel in the future» said the README.

The Rust like errors is a big different with the ESLint output, sometimes is not very friendly and you should web search which means the violation of a specific rule. If `RSLint` parse this code:

```javascript
if true {
  /* */
} else {
  /* */
}
```

We can get this output:

```
error[SyntaxError]: Expected token `L_PAREN` but instead found `TRUE_KW`
  ┌─ tests\main.js:1:4
  │
1 │ if true {
  │    ^^^^ Unexpected

error[SyntaxError]: Expected token `R_PAREN` but instead found `L_CURLY`
  ┌─ tests\main.js:1:9
  │
1 │ if true {
  │         ^ Unexpected

error[no-constant-condition]: Unexpected constant condition
  ┌─ tests\main.js:1:4
  │  
1 │   if true {
  │      ^^^^ this condition is always truthy...
2 │     /* */
3 │   } else {
  │ ┌────────'
4 │ │   /* */
5 │ │ }
  │ └─' ...which makes this unreachable
```

💡 Wait, can RSLint parse JavaScript with invalid syntax? Yes!

> The error recovery capabilities of `RSLint` refers to a parser being able to take in incorrect source code, and still parse a mostly correct AST out of it. Most linters do not attempt this at all. For example, ESLint and deno_lint's parsers make no attempt at recovery. When the parsers encounter an error they return an error result and quit parsing, producing no AST.

> This means it's impossible for the linters to lint wrong code, which is an amazing feature for on-the-fly linting in things such as IDEs.

And this could be the most amazing feature that `RSLint` can bring to us. 🎉
