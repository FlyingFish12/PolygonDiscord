const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "whois",
    description: "Displays the information of the specified member.",
    options: [
        {
            name: "target",
            description: "Select the target.",
            type: "USER",
            required: false
        }
    ],
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const target = interaction.options.getMember("target") || interaction.member;
        await target.user.fetch();
        
        const response = new MessageEmbed()
            .setColor(target.user.accentColor || "RANDOM")
            .setAuthor(target.user.tag, target.user.avatarURL({dynamic: true}))
            .setThumbnail(target.user.avatarURL({dynamic: true}))
            .addFields(
                {name: "Nickname", value: `${target.nickname || `Default`}`, inline: true},
                {name: "Server Member Since", value: `<t:${parseInt(target.joinedTimestamp / 1000)}:R>`, inline: true},
                {name: "Discord Member Since", value: `<t:${parseInt(target.user.createdTimestamp / 1000)}:R>`, inline: true},
                {name: "Roles", value: `${target.roles.cache.map(r => r).sort((first, second) => second.position - first.position).join(` | `)}`, inline: false},
            )
            .setFooter({ text : `ID - ${target.user.id}` });
            
            
        interaction.reply({embeds: [response]})
    }
}