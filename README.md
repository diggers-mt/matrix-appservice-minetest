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
