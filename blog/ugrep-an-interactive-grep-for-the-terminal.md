# ugrep: an interactive grep for the terminal

ugrep is a faster, user-friendly and compatible grep replacement tool written in C++11. Let's see how to install it and how to use the interactive query mode, fuzzy search, and other options.

## Installation

In Windows, you can just download the full-featured [ugrep.exe](https://github.com/Genivia/ugrep/releases) from the [official repository](https://github.com/Genivia/ugrep), or use a tool like: `choco install ugrep` or `scoop install ugrep`.

In MacOS, you could use `brew install ugrep`.

In any case, you can find your destiny here: <https://github.com/Genivia/ugrep#install>.

## The basics

The basic usage is initializing the interactive query mode and look for a specific text recursively in sub-directories using plain-text or regex.

```bash
ugrep -Q
```

![ugrep query mode in tldr pages repository](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/b3qsd9og05nypn50vgiv.png)

💡 Tip: you can add the `--ignore-case` argument to make case-insensitive matches.

If you only want to see the files containing the search term you can use the following arguments:

```bash
ugrep -Q --ignore-case --files-with-matches
```

![ugrep query mode listing filenames in tldr pages repository](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9yllgdg64e2wnv4vegwv.png)

## The fuzzy search

The [fuzzy search](https://en.wikipedia.org/wiki/Approximate_string_matching) is a technique that looks for a text that matches a pattern approximately, instead of exactly. We can look for a text within the specified [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance).

```bash
ugrep -Z3 android
```

💡 Tip: `-Z3` matches up to three extra, missing or replaced characters; `-Z+~3` allows up to three insertions (`+`) or substitutions (`~`), but no deletions (`-`).

You can start a query mode with fuzzy search this way:

```bash
ugrep -Q -Z3
```

## Interactive TUI

Once you have started the query mode, you can toggle fuzzy search, only list filenames or more options from the panel by pressing `F1`.

![ugrep help and options](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/eesmpv9rne7mrgna2508.png)

Press the upper case Z to toggle on/off the fuzzy search mode, and `[` to increase and `]` to decrease the fuzziness.

Also, you can scroll up and down the result of a search using the arrow keys or `^S`, and then use `F2` to open the editor for the file of the current matched text (nano, vim, etc).

## More ugrep

You have a lot of possible customization options you could investigate in the [README](https://github.com/Genivia/ugrep#readme) or use [ugrep with Vim](https://github.com/Genivia/ugrep#vim).

Thanks to [Dr. Robert van Engelen](https://github.com/genivia-inc) for this awesome tool! and if you 💛 it too, leave a ⭐ in <https://github.com/Genivia/ugrep>.
