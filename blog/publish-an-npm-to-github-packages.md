# Publish an npm to GitHub packages

Sometimes in website and backend projects we found common components (React, utils, validations, etc) and, if we follow the DRY concept, we should find a way to create a private package and install it in every project that needs it.

We're going to review how to build and publish JavaScript packages using npm.

## The GitHub solution

GitHub provides the [GitHub Package Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry) to publish private npm packages. We can also use it for Docker images and libraries for other languages like Ruby, but we're going to focus on the npm solution.

### The publish configuration

You should add the `publishConfig` section in the `package.json` file to publish to the GitHub registry.

```json
"publishConfig": {
  "registry": "https://npm.pkg.github.com"
},
```

### The workflow

This workflow will publish a package to the GitHub Registry every time we create a release in the GitHub repository:

```yaml
name: Publish
on:
  release:
    types: [created]
jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 16
      - run: npm install
      - run: npm run build
      - run: |
          echo @lexacode:https://npm.pkg.github.com/ > build/.npmrc
          echo '//npm.pkg.github.com/:_authToken=${NPM_TOKEN}' >> build/.npmrc
      - run: npm publish
        working-directory: ./build
        env:
          NPM_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

The [`permissions`](https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions#permissions) modifies the default permissions granted to the `GITHUB_TOKEN`.

This workflow creates a `.npmrc` file inside the `build/` directory before publishing the package to the registry.

```bash
echo @lexacode:https://npm.pkg.github.com/ > build/.npmrc
echo '//npm.pkg.github.com/:_authToken=${NPM_TOKEN}' >> build/.npmrc
```

🧠 Remember that your organization name, e.g. `lexacode`, should be in `kebab-case`, **no uppercase allowed**.

Then, you should add the `GITHUB_TOKEN` as an environment variable before the `npm publish` command.

```yaml
- run: npm publish
  working-directory: ./build
  env:
    NPM_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Installing the GitHub package

To install the GitHub package locally you should create a PAT (Personal Access Token) in the GitHub [web](https://github.com/settings/tokens/new). Make sure you selected the `read:packages` permission. Then, add the token to your environment:

```bash
export NPM_TOKEN=<YOUR_GITHUB_TOKEN>
```

Create the following `.npmrc` file in the project:

```
@lexacode:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

Now, you can run the `npm install`:

```bash
npm install @lexacode/package-example
```

### In GitHub Actions

To use your package in GitHub actions you should use a code like the following:

```yaml
lint:
  permissions:
      contents: read
      packages: read
  steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
      with:
        node-version: 16
    - run: npm ci
      env:
        NPM_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

👉 You need the explicit `packages: read` permission.

### Packages cross organizations

If you want to use a package from another organization using the GitHub Package Registry, you should set your PAT as a [secret](https://docs.github.com/en/actions/security-guides/encrypted-secrets) in the repository. Edit the YAML file using the new secret instead:

```yaml
- run: npm ci
  env:
    NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

💡 The custom `permissions` section is not required for this scenario.

## Conclusion

You can publish private packages and use it everywhere you want via the GitHub Package Registry.

I left you a full repository with a TypeScript package, already published using the CI action. 🙌

{% github lexacode/package-example %}
