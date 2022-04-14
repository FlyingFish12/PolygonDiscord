const { DatabaseUrl } = require("../../config.json");
const { Client } = require("discord.js")
const mongoose = require("mongoose");

module.exports = {
    name: "ready",
    once: true,
    /**
     * @param {Client} client
     */
    async execute(client) {
        console.log("The client is now ready!")
        client.user.setActivity("Everyone. Everything. All the time.", {type: "WATCHING"});
        
        if(!DatabaseUrl) return;
        mongoose.connect(DatabaseUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log("The client is now connected to the database!")
        }).catch((err) => {
            console.log(err)
        });
    }
}
