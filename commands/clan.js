require("dotenv").config();
const req = require("petitio");
const { MessageEmbed } = require("discord.js");
const { parse } = require("node-html-parser");
const Redis = require("ioredis");

module.exports = {
    name: "clan-stats",
    description: "Get's a clans stats for you.",
    options: [
        {
            name: "clan-name",
            description: "The name of the clan to get stats for.",
            type: "STRING",
            required: true
        }
    ],
    /**
     * 
     * @param {Interaction} interaction 
     */
async execute(interaction) {

    const redis = new Redis(process.env.REDIS);
    let embed = new MessageEmbed();
    let table;
    let title;
    let favTable;
    let favArr;
    let img;
    let dname;
    if (!interaction.options.getString("clan-name")) {
      return interaction.reply("provide a clan name.");
    }
    if (interaction.options.getString("clan-name")) {
      const request = await req(
        `https://stats.gats.io/clan/${interaction.options.getString("clan-name")}`
      ).text();
      const root = parse(request);
      table = root.querySelector("tbody");
      title = root.querySelector("div .col-xs-12 h1");
      favTable = root.querySelector("div.table-responsive tbody");
      if (title) {
        dname = await redis.hget(
          "accounts",
          title.rawText.replace("Clan Summary", "").trim()
        );
      }
      if (favTable) {
        img = root.querySelector("td img").getAttribute("src");
        favArr = favTable.structuredText.split("\n").map((str) => str.trim());
      }
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
            value: p[1],
            inline: true,
          }));

        embed.addFields(arr);
        embed.setTitle(title.rawText.replace("Clan Summary", "").trim());
        embed	.setURL(`https://stats.gats.io/clan/${interaction.options.getString("clan-name")}`);
        embed.setThumbnail("https://stats.gats.io" + img);
        embed.setFooter({ text: `${title.rawText.replace("Clan Summary", "").trim()}'s favorite perk is ${favArr[2]}, and their favorite gun is the ${favArr[0]}.` });
        embed.setColor("RANDOM");
        interaction.reply({ embeds: [embed] });
      } else return interaction.reply("That clan does not exist.");
    }
  },
};
