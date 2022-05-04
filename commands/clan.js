require("dotenv").config();
const { SlashCommandBuilder } = require("@discordjs/builders");
const req = require("petitio");
const { MessageEmbed } = require("discord.js");
const { parse } = require("node-html-parser");
const Redis = require("ioredis");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clan-stats")
    .setDescription("Connect your Discord account to your Gats account.")
    .addStringOption((option) =>
      option
        .setName("clan-name")
        .setDescription("The clan to get stats for.")
        .setRequired(true)
    ),
  async execute(interaction) {

    let embed = new MessageEmbed();
    let table;
    let title;
    let favTable;
    let favArr;
    let img;
    let dname;
    let rank;
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
          title.rawText.replace("Clan Summary", "").trim()
      }
      if (favTable) {
        img = root.querySelector("td img").getAttribute("src");
        favArr = favTable.structuredText.split("\n").map((str) => str.trim());
      }

      if (table) {
        let arr = table.structuredText
          .split("\n")
          .map((str) => str.trim())

          const description = () => {
            let elems = []
            for (let i=0; i < arr.length; i+=2) elems.push(`${arr[i]} - ${arr[i+1]}`)
          
            return elems
          }

        embed.setDescription(description)
        embed.addFields(
          { 
            name: "Clan's Favourite Loadout",
            value: 
            `Favorite gun is the ${favArr[0]} with ${favArr[1]} kills\n` + 
            `Favorite perk is ${favArr[2]} (used ${favArr[3]} times).\n` +
            `Favorite ability is ${favArr[4]} (used ${favArr[5]} times).`,
            inline: false
          },
        );
        embed.setTitle(title.rawText.replace("Clan Summary", "").trim());
        embed.setURL(`https://stats.gats.io/clan/${interaction.options.getString("clan-name")}`);
        embed.setThumbnail("https://stats.gats.io" + img);
        embed.setColor("RANDOM");
        interaction.reply({ embeds: [embed] });
      } else return interaction.reply("That clan does not exist.");
    }
  },
};