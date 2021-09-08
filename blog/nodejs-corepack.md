# Corepack the Node.js' manager of package managers

Corepack is the new built-in tool to prepare the required package manager for our projects. We're going to see what comes with this new package for packagers. 📦

## Installation

We're in track to get the new Node.js LTS v16 at the end of October, without a fancy name assigned yet, and we'll get [Corepack](https://github.com/nodejs/corepack) preinstalled in the default Node.js configuration since the [v16.9.0](https://github.com/nodejs/node/releases/tag/v16.9.0). 👌

If we want this tool for previous versions we just need to install it as a global package:

```bash
$ npm install -g corepack
```

🧠 Remember that until now, the Corepack v0.9.0 only supports `pnpm`, `npm` and `yarn`.

## Basic usage

We can use use the package manager that we always use in any machine without worry if it is installed or not using by example:

```bash
$ corepack pnpm install
```

Corepack will take care that the required manager is ready to process your request.

### Specific versions

The included `npm` version with Node.js LTS v16 is v7, so what if we need `npm@6` for one project and `npm@7` for other?

Well, you will find `corepack` very similar to `nvm` in this scenario.

```bash
$ corepack prepare npm@6.14.15 --activate
$ node -v
v16.9.0
$ npm -v
7.21.1
$ corepack npm -v
6.14.15
```

🤯 So, with `corepack prepare` you'll setup `npm@6`, and you can use it every time you need just prefixing your `npm` usage with Corepack, e.g. `corepack npm ci`.

And your global `npm` command will continue untouched being `npm@7`.

🤔 But what is that `--activate` flag? Corepack will keep a cache of used versions of a packager, so you should activate which version you want to use, otherwise you're still using `npm@7` when you use `corepack npm -v`.

## Global package managers 🌎

What if I want `pnpm` as a global command in my terminal? You can enable Corepack to handle `pnpm` and automatically install it when is used for the first time:

```bash
corepack enable
```

Corepack will install the handlers in the node directory because it's in the `$PATH`, but you can use the destination of your choice:

```bash
corepack enable --install-directory path/to/bins_folder
```

And, it's done, you can use `pnpm` or `yarn` directly:

```bash
$ pnpm -v
6.11.0
```

## Docker images

At the moment, the official Node.js images in Docker comes with `npm` and `yarn` preinstalled, but maybe this can change in a near future. (no more `npm` and `yarn` preinstalled in the Docker image it's possible! 🤯)

Previously, if you use `pnpm` in a Dockerfile you need to install it using `npm` or `curl`:

```bash
RUN npm install -g pnpm && pnpm install
```

Now, Corepack is here to make this easier to you:

```bash
RUN corepack pnpm install
```

Or, maybe you need a specific version like this:

```bash
RUN corepack prepare npm@6.14.15 --activate && corepack npm ci
```

## Conclusion

With Corepack we can have more control about which package manager we're using and we don't need to check if Node.js upgrades `npm` to v8 and we didn't notice that event. Until we notice that our application is on fire. 🔥

Also, `npm` is part of GitHub, Inc. and it's not part of the Node.js governance, it's a good decision if the Node.js project becomes agnostic and as developers can use the package manager that we need without waste space in our Docker images for packagers that we won't use.
