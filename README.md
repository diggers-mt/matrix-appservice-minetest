# matrix-appservice-minetest
A very simple Matrix - Minetest bridge

On the Minetest side you need the [minetest-matrix](https://github.com/diggers-mt/minetest-matrix) mod, using the `appservice` branch. You also need to create a user for the mod, to listen for messages on the Matrix side since this appservice can't send messages **to** Minetest.

The appservice accepts webhooks **from** Minetest, creates virtual users and displays join/leave/chat messages.

The code is pieced together from `matrix-appservice-bridge` [HOWTO](https://github.com/matrix-org/matrix-appservice-bridge/blob/master/HOWTO.md), [matrix-appservice-slack](https://github.com/matrix-org/matrix-appservice-slack) and the config from [matrix-appservice-webhooks](https://github.com/turt2live/matrix-appservice-webhooks). Probably room for some improvement to feel free!

Installation
------------

```sh
$ git clone ...
$ cd matrix-appservice-minetest
$ npm install
# Copy config sample and edit
$ cp config/config.sample.yaml config/config.yaml

# Generate registration file
$ node app.js -r -u "http://localhost:8008" -c config/config.yaml
# Copy/move minetest-registration.yaml to your HS data dir and add the path to `app_service_config_files`

# Start server
$ node app.js -p 9000 -c config/config.yaml

# Restart your HS
```

# Running with Docker

You need to generate the registration file and let synapse (or whatever server you're using) have access to it. The approach here is to generate it with a temporary container and a [bind mount](https://docs.docker.com/engine/admin/volumes/bind-mounts/) so the file is accessible on the host and can be copied to the homeserver.

Below are a few example of how do achieve this.


### Build the image
```
# Feel free to change the tag
docker build -t matrix-minetest-image .
```

### Generating registration file
```
# The host in the URL depends on what you later name the container
docker run --rm -v "$(pwd)":/app matrix-minetest-image \
  -r -u "http://matrixminetest:9000" -c config/config.yaml
cp minetest-registration.yaml /path/to/synapse/
```

All the arguments after the image name (`matrix-minetest-image`) will be passed to `node`, so you can use another config file if you wish.


### Running the container with default arguments

```
# Port is 9000 and config is config/config.yaml as per the Dockerfile CMD
docker run -p 4501:4501 -d --name matrixminetest -v $(pwd):/app/ matrix-minetest-image
```

### Running the container with custom arguments

```
# Using 127.0.0.1 means the port won't be exposed outside the host, so you'd have to reverse proxy it
docker run -p 127.0.0.1:4501:4501  -d --name matrixminetest -v $(pwd):/app/ matrix-minetest-image \
  -p 9001 -c config/other_config.yaml
```

### Update config.yaml
If you want to use the internal network you need to set the URL to synapse to the name of the container.

```
homeserver:
  # The domain for the client-server API calls.
  url: "http://synapse:8008"
```

### Creating a network to connect the containers
```
docker network create matrix-network
docker network connect matrix-network [your_synapse_container]
docker network connect matrix-network matrixminetest
```

Now restart your containers and you should be good to go!
