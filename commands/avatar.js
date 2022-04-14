const { MessageEmbed } = require('discord.js')

module.exports = {
        name: "avatar",
        description: "Show's the specified user's avatar.",
        options: [
            {
                name: "target",
                description: "Select the target.",
                type: "USER",
                required: false
            }
        ],
        /**
         * 
         * @param {Interaction} interaction 
         */
    async execute(interaction) {
        const target = interaction.options.getMember("target") || interaction.member;
        await target.user.fetch();

        const Response = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle(target.user.username + "'s avatar")
        .setImage(target.user.avatarURL({dynamic: true, size: 512}))

        interaction.reply({embeds: [Response]})
    }
}