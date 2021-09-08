# Corepack: the Node.js' manager of package managers

Corepack is the new built-in tool for preparing the required package manager for our projects. We're going to see what comes with this new package for packagers. 📦

## Installation

We're in track to get the new Node.js LTS v16 at the end of October, without a fancy name assigned yet, and we're getting [Corepack](https://github.com/nodejs/corepack) preinstalled in the default Node.js configuration since [v16.9.0](https://github.com/nodejs/node/releases/tag/v16.9.0). 👌

If we want to use this tool with previous versions we just need to install it as a global package:

```bash
$ npm install -g corepack
```

🧠 Remember that, until now, Corepack v0.9.0 was only supporting `pnpm`, `npm` and `yarn`.

## Basic usage

We can use the same package manager that we always use in any machine without worring if it's installed or not, using:

```bash
$ corepack pnpm install
```

Corepack will take care of that the required manager is ready to process your request.

### Specific versions

The included `npm` version with Node.js LTS v16 is v7, so what if we need `npm@6` for one project and `npm@7` for another?

Well, in this scenario you'll will find `corepack` very similar to [`nvm`](https://github.com/nvm-sh/nvm).

```bash
$ corepack prepare npm@6.14.15 --activate
$ node -v
v16.9.0
$ npm -v
7.21.1
$ corepack npm -v
6.14.15
```

🤯 So with `corepack prepare` you'll setup `npm@6`, and you can use it every time you need just by prefixing your `npm` usage with Corepack, e.g. `corepack npm ci`.

And your global `npm` command will continue untouched being `npm@7`.

🤔 But what is that `--activate` flag? Corepack will keep a cache of used versions of a packager, so you should activate the specific version that you want to use; otherwise you will still be using `npm@7` when you use `corepack npm -v`.

## Global package managers 🌎

What if I want `pnpm` as a global command in my terminal? You can enable Corepack to handle `pnpm` and automatically install it when is used for the first time:

```bash
corepack enable
```

Corepack will install the handlers in the node directory because it's in the `$PATH`, but you can use the destination of your choice:

```bash
corepack enable --install-directory path/to/bins_folder
```

And, it's done you can use `pnpm` or `yarn` directly:

```bash
$ pnpm -v
6.11.0
```

## Docker images

At the moment, the official Node.js images in Docker comes with `npm` and `yarn` preinstalled, but this may change in a near future. (no more `npm` and `yarn` preinstalled in the Docker image is possible! 🤯)

Previously, if you use `pnpm` in a Dockerfile you need to install it using `npm` or `curl`:

```bash
RUN npm install -g pnpm && pnpm install
```

Now, Corepack is here to make this easier to you:

```bash
RUN corepack pnpm install
```

Or maybe you need a specific version like this:

```bash
RUN corepack prepare npm@6.14.15 --activate && corepack npm ci
```

## Conclusion

With Corepack we can have more control about which package manager we're using and we don't need to check if Node.js upgrades `npm` and we don't notice. Because, if that happens, until we realize that our application is on fire. 🔥

Also, `npm` is part of GitHub, Inc. and it's not part of the Node.js governance, so it's a good decision if the Node.js project becomes agnostic and as developers we can use the package manager that we need without wasting space in our Docker images for packagers that we won't use.
