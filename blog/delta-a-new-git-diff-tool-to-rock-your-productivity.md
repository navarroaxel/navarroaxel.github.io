# Delta: A new git diff tool to rock your productivity

![Cover](https://res.cloudinary.com/practicaldev/image/fetch/s--u3VsN7Ty--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/i/i88l23vilbx28gwdtlnf.jpg)

The delta tool (a.k.a. git-delta, a.k.a. delta-diff) is a diff viewer written
in Rust 💪. Initially made to have a better Developer Experience using the
`git diff` command, but has evolved enough transcending a simple diff for git.

## Installation

In windows, you can just download the
[delta.exe](https://github.com/dandavison/delta/releases/download/0.3.0/delta-0.3.0-x86_64-pc-windows-msvc.zip)
program from the
[official repository](https://github.com/dandavison/delta),
or use a tool like: `choco install delta` or `scoop install delta`.

In MacOS, you could use `brew install git-delta`

Linux has a lot of alternatives, download the Debian package from the
[releases page](https://github.com/dandavison/delta/releases), or run
`dnf install git-delta` in Fedora, or `yay -S git-delta-bin` in Archlinux.

Or, find your destiny here: <https://github.com/dandavison/delta#installation>

## The basics

The basic usage is set `delta` as your pager (make sure `delta` is in your PATH variable)

```bash
git config --global core.pager delta
git show 0ff1a88cc
```

![Delta sections](https://dev-to-uploads.s3.amazonaws.com/i/bue9us7uxg9iv7dqugh8.png)

You can use `--light` or `--dark` to adjust the delta colors in your terminal:

```bash
git config --global core.pager "delta --dark"
git diff -- ClientApp/src/hook/useBrowserHardwarePermissions.ts
```

![delta in dark mode](https://dev-to-uploads.s3.amazonaws.com/i/oxuywwipfeit2ibmhgna.png)

### Show line numbers

Do you want to display line numbers? easy-peasy!

```bash
git config --global core.pager "delta --line-numbers --dark"
```

![delta with line numbers](https://dev-to-uploads.s3.amazonaws.com/i/xp4beqrhhhl0393isjnh.png)

### Delta vs GitHub

A simple comparison between the default format delta output and a GitHub diff
view.

<table>
<tr>
  <td>delta</td>
  <td>GitHub</td>
</tr>
<tr>
  <td>
    <img
      src="https://dev-to-uploads.s3.amazonaws.com/i/ob4tl88f6rsgsm90da2e.png"
      alt="delta"
    />
  </td>
  <td>
    <img
      src="https://dev-to-uploads.s3.amazonaws.com/i/bpyxh2ar28tsm6kdoie9.png"
      alt="GitHub"
    />
  </td>
</tr>
</table>

## Side by side 🚀

You can view a side-by-side diff view with `-s` or `--side-by-side` to see
your `git diff` in a really new way:

![Delta with side by side view](https://dev-to-uploads.s3.amazonaws.com/i/ufbm9ge6bapx0tf3cvg4.png)

This feature rocks! And you can enable this in git using:

```bash
git config --global delta.side-by-side true
```

## Other usages

### Comparing outside the land of git

`delta` is not limited to `git`. We can use `delta` to show a diff of 2 files.

```bash
delta dnscrypt-proxy.toml.pacnew dnscrypt-proxy.toml
```

![delta 2 files](https://dev-to-uploads.s3.amazonaws.com/i/hkncagq1wksl8maq3btx.png)


### Comparing two folders

We can compare 2 folders to see the diffences:

```bash
delta dir1 dir2
```

![Delta directory example](https://dev-to-uploads.s3.amazonaws.com/i/uvsnerda0e04hboc6f1c.png)

## More delta

You have a lot of possible customization options you could investigate in the
[README](https://github.com/dandavison/delta#full---help-output) or set the
colors of your choice in your
[.gitconfig file](https://github.com/dandavison/delta#configuration). And
this is only the version 0.3.0 of this young app.

Thanks to [Dan Davison](https://github.com/dandavison) for this awesome tool!
and if you :yellow_heart: it too, leave a :star: in
<https://github.com/dandavison/delta>.
