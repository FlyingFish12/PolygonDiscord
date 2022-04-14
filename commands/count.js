const { CommandInteraction, Client, MessageEmbed } = require(`discord.js`);
const DB = require("../Schemas/CountDB");

module.exports = {
    name: `count`,
    description: `Check the count for this server`,
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { guild, user } = interaction;
        const Data = await DB.findOne({GuildID: guild.id});
        if (!Data) return interaction.reply({embeds: [new MessageEmbed()
            .setColor("RED")
            .setDescription(`There is no data in the database`)
        ]});

        const Embed = new MessageEmbed()
            .setColor("PURPLE")
            .setDescription(`The current count is \`${Data.Count}\``);
        interaction.reply({embeds: [Embed]});
    },
}