# Docker commit: converting a container into an image

We can convert a specific container into a base Docker image, but that's not the recommended way to create images because these could include useless cached or session data. 
The easiest way to control the data stored in the Docker layers is using the `Dockerfile`.

🧠 Remember that a Docker image has a read-only filesystem based on layers which works as a _template_ to start containers in a preinstalled environment, and a Docker container uses this _"template"_ to run isolated applications into a virtualized run-time environment with a normal filesystem.

## Is this necessary to create images with non-root users?

No, you can run commands with other users using the `Dockerfile` as well. You can see an example [here](https://dev.to/cloudx/testing-our-package-build-in-the-docker-world-34p0).

## Adding a port forwarding rule to a container

Perhaps we are testing a random software with a container and we need to publish a port to the host OS, or to another computer.

If that is the case, we can't add a forwarding port rule to an already existing container, so here is when `docker commit` comes to save us.

```
$ docker commit my_container my_image
$ docker run -p 8080:80 -it my_image
```

Now we can access to the port `80` in the container using `http://localhost:8080` in the host OS.

`docker commit` can also be used to attach new volumes to the container.

## The size is important

Remember that it's a good practice to keep your Docker images as minimalist as possible. Also the reproducible way to create and ship images is the `Dockerfile`.

💡 You can [inspect the layers of a Docker image](https://dev.to/cloudx/analyzing-the-docker-layers-with-dive-5e7o) using Dive, to optimize the size of your images.
