const nconf = require("nconf");
const path = require("path");

const production = process.env.NODE_ENV === "production";
console.log(`[config] App is running in ${(production)?'production':'development'} mode`);

nconf.argv()
     .env()
     .file({file : path.join(__dirname, (production) ? 'config.json' : "dev-config.json") });

module.exports = nconf;