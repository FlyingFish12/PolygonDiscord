const { CommandInteraction, MessageEmbed, MessageActionRow, MessageSelectMenu  } = require("discord.js")

module.exports = {
    name: "serverinfo",
    description: "Displays some information about the server.",
    /**
     * @param {CommandInteraction} interaction 
     */
     async execute(interaction) {
        const { guild } = interaction;

        const { description, members, memberCount, channels, emojis, stickers } = guild;
        let owner = await interaction.guild.fetchOwner()        

        const embed1 = new MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(guild.name, guild.iconURL({dynamic: true}))
        .setThumbnail(guild.iconURL({dynamic: true}))
        .setFields(
            {name: "General:", value: `\`\`\`⊢ Name: ${guild.name}\n⊢ Owner: ${owner.user.tag}\n⊢ Created: ${guild.createdAt.toUTCString().substr(0, 16)}\n⊢ Total Channels: ${channels.cache.size}\n\n⊢ Description: ${description ?? 'This server has no description'}\`\`\``, inline: false},
            {name: "Users:", value: `\`\`\`⊢ Members: ${members.cache.filter((m) => !m.user.bot).size}\n⊢ Bots: ${members.cache.filter((m) => m.user.bot).size}\n\n⊢ Total: ${memberCount}\`\`\``, inline: false},
            {name: "Emojis + Stickers:", value: `\`\`\`⊢ Animated: ${emojis.cache.filter((e) => e.animated).size}\n⊢ Static: ${emojis.cache.filter((e) => !e.animated).size}\n⊢ Stickers: ${stickers.cache.size}\n\n⊢ Total: ${stickers.cache.size + emojis.cache.size}\`\`\``, inline: false},
            {name: "Nitro Stats:", value: `\`\`\`⊢ Tier: ${guild.premiumTier.replace("TIER_", "").replace("NONE", "no tier")}\n⊢ Boosts: ${guild.premiumSubscriptionCount}\n⊢ Boosters: ${members.cache.filter((m) => m.premiumSince).size}\`\`\``, inline: false}
        )
        .setTimestamp()
        .setFooter("Guild ID - " + guild.id);


        interaction.reply({embeds: [embed1]})
     }
}