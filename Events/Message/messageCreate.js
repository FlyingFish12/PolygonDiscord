const { Message, Client } = require("discord.js");
const DB = require("../../Schemas/CountDB");

module.exports = {
    name: "messageCreate",
    /**
     * @param {Message} message 
     * @param {Client} client
     */
    async execute(message, client) {
        const { guild, channel, member } = message;
        const Data = await DB.findOne({GuildID: guild.id});
        if (!Data) return;
        if (channel.id !== Data.ChannelID) return;

        if (!parseInt(message.content)) return message.delete();

        if (parseInt(message.content) !== Data.Count + 1) return message.delete();

        if (Data.CountBy === member.id) message.delete();

        await DB.findOneAndUpdate(
            {GuildID: guild.id, ChannelID: channel.id},
            {Count: parseInt(message.content), CountBy: message.author.id}
        );
    }
}