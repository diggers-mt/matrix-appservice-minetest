var bridgeLib = require("matrix-appservice-bridge");

var Main = require("./lib/Main");

var Cli = bridgeLib.Cli;
var AppServiceRegistration = bridgeLib.AppServiceRegistration;

var cli = new Cli({
    registrationPath: "minetest-registration.yaml",
    bridgeConfig: {
        schema: "config/minetest-config-schema.yaml",
        affectsRegistration: true
    },
    generateRegistration: function(reg, callback) {
        var config = cli.getConfig();
        reg.setId(AppServiceRegistration.generateToken());
        reg.setHomeserverToken(AppServiceRegistration.generateToken());
        reg.setAppServiceToken(AppServiceRegistration.generateToken());
        reg.setRateLimited(false);
        reg.setSenderLocalpart(config.webhookBot.userName);
        reg.addRegexPattern("users", "@" + config.users.prefix + ".*", true);
        callback(reg);
    },
    run: function(port, config) {
        console.log("Matrix-side listening on port %s", port);
        (new Main(config)).run(port);
    },
});
cli.run();


