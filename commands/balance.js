const { MessageEmbed } = require("discord.js");
const eco = require("../Structure/Handlers/Economy")

module.exports = {
    name: "balance",
    description: "Check user balance",

    execute: async (interaction, client, args) => {
        const {
            member,
            guild
        } = interaction;

        let balance = eco.balance.fetch(member.id, guild.id)
        let bank = eco.bank.fetch(member.user.id, guild.id)

        if(!balance) balance = 0;
        if(!bank) bank = 0;

        const embed = new MessageEmbed()
        .setTitle(`**${member.user.username}**'s balance`)
        .setDescription(`\`\`\`Cash: ${balance} coins.\nBank: ${bank} coins.\`\`\``)
        .setColor("GREEN")

        interaction.reply({embeds: [embed]})
    }
}