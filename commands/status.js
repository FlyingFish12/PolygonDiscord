const { Discord, Intents, Client, MessageEmbed, version: djsversion } = require("discord.js");
const { connection } = require("mongoose");
const moment = require("moment");
const m = require("moment-duration-format");
let cpuStat = require("cpu-stat")
let os = require('os');

module.exports = {
    name: "status",
    description: "Displays the status of the client and database connection",
    async execute(interaction, client) {

        const Response = new MessageEmbed()
      .setColor(`#454ade`)
      .setTitle(`Feesh Bot's Info`)
      .setThumbnail(client.user.displayAvatarURL({dynamic: true}))
      .setDescription(`Invite: [Invite me here!](https://discord.com/api/oauth2/authorize?client_id=735918313921708053&permissions=1515523009648&scope=bot%20applications.commands)\nUptime: <t:${parseInt(client.readyTimestamp / 1000)}:R>`)
      .addFields(
        { name: `Bot Owner`, value: `\`\`\`Fefe#9196\`\`\``, inline: true },
        {
          name: `Servers`,
          value: `\`\`\`${client.guilds.cache.size}\`\`\``,
          inline: true,
        },
        { name: `Framework`, value: `\`\`\`Discord.js\`\`\``, inline: true },
        { name: `Node.js Version`, value: `\`\`\`${process.version}\`\`\``, inline: true },
        { name: `Discord.js Version`, value: `\`\`\`${djsversion}\`\`\``, inline: true },
      )
      .addField("Database ", `\`\`\`${switchTo(connection.readyState)}\`\`\``, true)
      .addField("API Latency", `\`\`\`${(client.ws.ping)}ms\`\`\``, true)
      .addField("Mem Usage", `\`\`\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB\`\`\``, true)
      .setTimestamp()
      .setFooter(`ID:895001466450903050`);

        interaction.reply({embeds: [Response]})
    }
}
function switchTo(val) {
    var status = " ";
    switch(val) {
        case 0 : status = `🔴 DISCONNECTED`
        break;
        case 1 : status = `🟢 CONNECTED`
        break;
        case 2 : status = `🟡 CONNECTING`
        break;
        case 3 : status = `🟠 DISCONNECTING`
        break;
    }
    return status;
}