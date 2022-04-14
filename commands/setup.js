const { CommandInteraction, Client, MessageEmbed } = require(`discord.js`);
const DB = require("../Schemas/CountDB");

module.exports = {
    name: `c-setup`,
    description: `Setup the counting system`,
    options: [
        {
            name: "channel",
            description: "What is the counting channel",
            type: "CHANNEL",
            channelTypes: ["GUILD_TEXT"],
            required: true
        }
    ],
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { options, guild, channel } = interaction;
        const Channel = options.getChannel("channel");

        await DB.findOneAndUpdate(
            { GuildID: guild.id },
            {
                ChannelID: Channel.id,
                Count: 0,
                CountBy: client.user.id,
            },
            {new: true, upsert: true}
        );
        const Embed = new MessageEmbed()
            .setColor("GREEN")
            .setDescription(`Set <#${Channel.id}> as the counting channel`);
        interaction.reply({embeds: [Embed]});
    },
}