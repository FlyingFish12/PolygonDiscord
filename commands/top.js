require("dotenv").config();
const req = require("petitio");
const { MessageEmbed } = require("discord.js");
const { parse } = require("node-html-parser");

module.exports = {
    name: "top-gun",
    description: "Get's the gun leaderboard stats for you.",
    options: [
        {
            name: "gun-name",
            description: "The leaderboard for the chosen gun. (pistol, smg, shotgun, assault, sniper, lmg)",
            type: "STRING",
            required: true
        }
    ],
    /**
     * 
     * @param {Interaction} interaction 
     */
async execute(interaction) {

    let embed = new MessageEmbed();
    let table;
    let title;
    if (!interaction.options.getString("gun-name")) {
      return interaction.reply("provide a valid gun name. (pistol, smg, shotgun, assault, sniper, lmg)");
    }
    if (interaction.options.getString("gun-name")) {
      const request = await req(
        `https://stats.gats.io/stat/${interaction.options.getString("gun-name")}`
      ).text();
      const root = parse(request);
      table = root.querySelector("tbody");
      title = root.querySelector("div .col-xs-12 h1");
      
      if (table) {
        let arr = table.structuredText
          .split("\n")
          .map((str) => str.trim())
          .reduce(function (accumulator, currentValue, currentIndex, array) {
            if (currentIndex % 2 === 0)
              accumulator.push(array.slice(currentIndex, currentIndex + 2));
            return accumulator;
          }, [])
          .map((p) => ({
            name: p[0],
            value: p[1] + p[2],
            inline: false,
          }));

        embed.addFields(arr);
        embed.setTitle(title.rawText.replace("Stats", "").trim());
        embed.setURL(`https://stats.gats.io/stat/${interaction.options.getString("gun-name")}`);
        embed.setColor("RANDOM");
        interaction.reply({ embeds: [embed] });
      } else return interaction.reply({ content: "That gun does not exist.", ephemeral: true});
    }
  },
};
