const { Client, Collection } = require('discord.js');
const { Token } = require("./config.json");
const client = new Client({intents: 32511});

const { promisify } = require("util");
const { glob } = require("glob");
const PG = promisify(glob);
const Ascii = require("ascii-table");

client.commands = new Collection();

const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const ready = require('./Events/Client/ready');

client.distube = new DisTube(client, {
    emitNewSongOnly: true,
    leaveOnFinish: true,
    emitAddSongWhenCreatingQueue: false,
    plugins: [new SpotifyPlugin()]
})
module.exports = client;


require("./Structure/Systems/GiveawaySys")(client);

require("./Structure/Handlers/Events")(client, PG, Ascii);
require("./Structure/Handlers/Commands")(client, PG, Ascii);


client.login(Token)