# Why OpenSSH 8.8 cannot find a host key type if ssh-rsa is provided

The [OpenSSH](https://www.openssh.com/portable.html) [8.8](https://www.openssh.com/txt/release-8.8) is now in the stable channel of Arch Linux and could reach any other distribution any time soon.

In the [release 8.7](https://www.openssh.com/txt/release-8.7), the OpenSSH team announced that the `ssh-rsa` signature scheme will be disabled by default in the next version: `8.8`.

## Why?

The `ssh-rsa` signature scheme uses SHA-1 and it's sensible to chosen-prefix attacks.

## What should I do?

This should not be a problem unless you are connecting to a server using the weak `ssh-rsa` public key algorithm for host authentication.

💡 If you're using the version 8.7 or a previous one, you can test your remote hosts, like a GitLab server, or a cloud server using:

```bash
ssh -oHostKeyAlgorithms=-ssh-rsa user@host
```

If the connection fails that means that the signature algorithm is not compatible with the default configuration of OpenSSH 8.8.

## Enabling the week signature

If you can't upgrade the signature algorithm on your remote servers but you still need to use them, you can use the following command:

```bash
ssh -oHostKeyAlgorithms=+ssh-rsa user@host
```

### Using the week signature with Git

Right now, Bitbucket uses this week signature algorithm, I guess you need to use your Git repositories hosted there. 🥺 You can check your connection with the following command:

```bash
ssh -oHostKeyAlgorithms=+ssh-rsa git@bitbucket.org
```

And how can we enable this flag for all the Git commands? An easy solution is coming... You can create a SSH configuration file with the following content:

```
Host bitbucket.org
     HostKeyAlgorithms +ssh-rsa
     IdentitiesOnly yes
```

The default location of this file is under `~/.ssh/config`, maybe you already have one. Once you add this configuration value you can use any `git` command without restrictions.

## That's all

I hope this will help you to still SSHing the world 🗺️
