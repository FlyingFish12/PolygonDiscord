const { CommandInteraction, Client, MessageEmbed } = require(`discord.js`);
const DB = require("../Schemas/CountDB");

module.exports = {
    name: `setcount`,
    description: `Set the count for the channel`,
    permission: "ADMINISTRATOR",
    options: [
        {
            name: "count",
            description: "What should the count be?",
            type: "INTEGER",
            required: true
        }
    ],
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        if (interaction.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR, Permissions.FLAGS.MANAGE_MESSAGES])) {

        const { options } = interaction;

            if (interaction.user.id !== interaction.guild.ownerId) return interaction.reply({content: `This command is an owner only command!`, ephemeral: true});

                const Count = options.getInteger("count");
                const Data = await DB.findOne({GuildID: interaction.guild.id});

                if (!Data) return interaction.reply({content: `There is no data in the database`, ephemeral: true});
                await DB.findOneAndUpdate({GuildID: interaction.guild.id}, {Count: Count});

            interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`<:approved:941879734768398337> Set the count to \`${Count}\``)]});
        }

        else {

            return interaction.reply('You can\'t use this command')

        };
    },
}