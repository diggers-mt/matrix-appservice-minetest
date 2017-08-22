# matrix-appservice-minetest
A Matrix - Minetest bridge

Very simple bridge for Minetest.

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
