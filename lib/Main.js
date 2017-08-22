// Usage:
// node index.js -r -u "http://localhost:9000" # remember to add the registration!
// node index.js -p 9000 -c config/config.yaml
var http = require("http");
var qs = require('querystring');
var Bridge = require("matrix-appservice-bridge").Bridge;

function Main(config) {
    var self = this;

    this._config = config;

    this._bridge = new Bridge({
        homeserverUrl: config.homeserver.url,
        domain: config.homeserver.domain,
        registration: "minetest-registration.yaml",

        controller: {
            onUserQuery: function(queriedUser) {
                return {}; // auto-provision users with no additonal data
            },

            onEvent: function(request, context) {
                var ev = request.getData();
                // self._stateStorage.onEvent(ev);
                // self.onMatrixEvent(ev);
                console.log(ev)
            },
        }
    });
}


Main.prototype.run = function(port) {
    var bridge = this._bridge;
    var config = this._config;
    var roomId = config.webhookBot.roomId

     http.createServer(function(request, response) {
        console.log(request.method + " " + request.url);
        console.log(qs.parse(request.url))

        var body = "";
        request.on("data", function(chunk) {
            body += chunk;
        });

        request.on("end", function() {
            var params = qs.parse(body);
            console.log("@" + config.users.prefix + params.user_name + ":" + config.homeserver.domain)
            var intent = bridge.getIntent("@" + config.users.prefix + params.user_name + ":" + config.homeserver.domain);
            if (params.event == "message") {
                intent.sendText(roomId, params.text);
            }
            else if (params.event == "join") {
                intent.setDisplayName(params.user_name + " (MT)");
                intent.join(roomId).then(function() {
                    intent.sendMessage(roomId, {msgtype: 'm.emote', body: 'is online'})
                })
            }
            else if (params.event == "leave") {
                intent.sendMessage(roomId, {msgtype: 'm.emote', body: 'is leaving'}).then(function() {
                    intent.leave(roomId);
                })
            }
            response.writeHead(200, {"Content-Type": "application/json"});
            response.write(JSON.stringify({}));
            response.end();
        });
    }).listen(config.web.port);
     console.log("Webhook-side listening on port %s", config.web.port);

     bridge.run(port, config);

     var botIntent = bridge.getIntent(bridge.getBot().getUserId())
     botIntent.setDisplayName(config.webhookBot.displayName);

}

module.exports = Main;

