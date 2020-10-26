# A Git repository inside an Arch Linux package

Creating a package from a Git repository can be useful to test the latest source code from the development branch, and catch issues before making a new release using a Git tag. Also you can use another Version Control System (VCS) like SVN, but we're going to focus on Git today.

Some packages in the official Arch Linux repository like `konsole`, have a VCS package version called `konsole-git` in the AUR. The suffix `-git`, `-svn`, `-hg`, etc. is a convention to let the package users know that this is a VCS package.

## The providing and conflicts

In our `PKGBUILD` we can define a `provides` array variable to let `pacman` know which additional or virtual packages are provided by our own package. E.g. `konsole-git` provides `konsole`.

```bash
pkgname=konsole-git
...
provides=('konsole')
```

This doesn't mean a conflict unless we define the `conflicts` variable too.

```bash
conflicts=('konsole')
```

### The implicit conflict

* `nodejs` implicitly provides `nodejs` as the `pkgname` itself.
* `node-lts-erbium` provides `nodejs` and conflicts with `nodejs`.
* `nodejs-lts-dubnium` provides `nodejs` and conflicts with `nodejs`, but does not need to explicitly conflict with `node-lts-erbium` since packages providing the same feature are implicitly in conflict.

## The pkgver as a function

The VCS packages always compile the latest version in the repository. This is achieved by using `pkgver()` function as the following:

```bash
pkgver() {
  cd ${pkgname}
  printf "r%s.%s" "$(git rev-list --count HEAD)" "$(git rev-parse --short HEAD)"
}
```

Like every bash function, the return value is what the function prints to the `stdout` (standard output).

The `git rev-list --count HEAD` command prints the count of commits in the branch, and `git rev-parse --short HEAD` prints the SHA-1 of the latest commit in short format (7 chars). The `printf "r%s.%s"` just formats both values to something like `r155.083ffa8`.

```bash
makepkg
```

The `makepkg` will run the `pkgver()` function and will update the `PKGBUILD` value with the latest commit version value:

```bash
pkgver=r155.083ffa8
```

You can find other ways to define a VCS package version in the [Arch Wiki](https://wiki.archlinux.org/index.php/VCS_package_guidelines#Git).

## The package source

The `source` variable in the `PKGBUILD` just needs to indicate the VCS (`git`) to download the sources, and since we can't validate the checksum for a repository, it should be skipped.

```bash
sources=(git+https://github.com/dandavison/delta.git)
sha256sum=('SKIP')
```

## The build

The build process for a VCS package is the same as for a package based on the latest released.

```bash
pkgname=git-delta-git
_pkgname=delta
pkgver=r319.f89300a
pkgrel=1
pkgdesc="A syntax-highlighting pager for git"
arch=('x86_64')
url="https://github.com/dandavison/delta"
license=('custom')
makedepends=('git' 'rust')
provides=('git-delta')
conflicts=('git-delta')
source=(git+$url.git)
sha256sums=('SKIP')

pkgver() {
  cd "$srcdir/$_pkgname"
  printf "r%s.%s" "$(git rev-list --count HEAD)" "$(git rev-parse --short HEAD)"
}

build() {
  cd "$srcdir/$_pkgname"
  cargo build --release --locked
}

check() {
  cd "$srcdir/$_pkgname"
  cargo test --release --locked
}

package() {
  cd "$srcdir/$_pkgname"

  install -Dm755 "target/release/$_pkgname" -t "$pkgdir/usr/bin"
  install -Dm644 LICENSE "$pkgdir/usr/share/licenses/$pkgname/LICENSE"
}
```

## Testing your code

With this kind of package you can easily test your apps in your computer using a continuous delivery method, and catch the bugs before creating the tag for a release.
