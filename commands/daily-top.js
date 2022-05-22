require("dotenv").config();
const { SlashCommandBuilder } = require("@discordjs/builders");
const req = require("petitio");
const { MessageEmbed } = require("discord.js");
const { parse } = require("node-html-parser");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("daily-score")
    .setDescription("Gets daily Gats leaderboard highscores."),
  async execute(interaction) {
    let embed = new MessageEmbed();
    let daily;
    const request = await req(
        `https://gats.io/`
      ).text();

    const root = parse(request);
    daily = root.querySelector("hsd");

    if (daily) {
        let arr = daily.structuredText
          .split("\n")
          .map((str) => str.trim())

    embed.setDescription(`spam dm tokha`)
    interaction.reply({ embeds: [embed] });
    } else interaction.reply("techinical issues, please spam dm tokha")
  },
};
