require("dotenv").config();
const { SlashCommandBuilder } = require("@discordjs/builders");
const req = require("petitio");
const { MessageEmbed } = require("discord.js");
const { parse } = require("node-html-parser");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Gets Gats leaderboards.")
    .addStringOption((option) =>
      option
        .setName("leaderboard-name")
        .setDescription("The leaderboard you want to see.")
        .setRequired(true)
    ),
  async execute(interaction) {

    let embed = new MessageEmbed();
    let table;
    let title;
    if (interaction.options.getString("leaderboard-name")) {
      const request = await req(
        `https://stats.gats.io/stat/${interaction.options.getString("leaderboard-name")}`
      ).text();
      const root = parse(request);
      table = root.querySelector("tbody");
      title = root.querySelector("div .col-xs-12 h2");

          if (table) {
            
              

        embed.setDescription(`
        Currently unusable, please spam dm Tokha
        `)
        embed.addFields(
          {
            name: `** **`,
            value: `[View these stats online](https://stats.gats.io/stat/${interaction.options.getString("leaderboard-name")})`,
            inline: false
          }
        )
        embed.setTitle("Kills | " + title.rawText.replace("Stats", "").trim());
        embed.setColor("RANDOM");
        interaction.reply({ embeds: [embed] });
      } else return interaction.reply({ content: "That leaderboard does not exist. Try SMG, KDR, Assault", ephemeral: true});
    }
  }
}
