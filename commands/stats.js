require("dotenv").config();
const { SlashCommandBuilder } = require("@discordjs/builders");
const req = require("petitio");
const { MessageEmbed } = require("discord.js");
const { parse } = require("node-html-parser");
const Redis = require("ioredis");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Get player stats.")
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("The username to get stats for.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const redis = new Redis(process.env.REDIS);
    let embed = new MessageEmbed();
    let table;
    let title;
    let favTable;
    let favArr;
    let img;
    let dname;
    let rank;
    let mention = (id) => {
      if (id == null) {
        return null;
      } else return `<@${id}>`;
    };
    if (!interaction.options.getString("username")) {
      return interaction.reply("provide a username.");
    }
    if (interaction.options.getString("username")) {
      const request = await req(
        `https://stats.gats.io/${interaction.options.getString("username")}`
      ).text();
      const root = parse(request);
      table = root.querySelector("tbody");
      title = root.querySelector("div .col-xs-12 h1");
      rank = root.querySelector("div .col-xs-12 h3");
      favTable = root.querySelector("div.table-responsive tbody");
      if (title) {
        dname = await redis.hget(
          "accounts",
          title.rawText.replace("Stats", "").trim()
        );
      }
      if (favTable) {
        img = root.querySelector("td img").getAttribute("src");
        favArr = favTable.structuredText.split("\n").map((str) => str.trim());
      }
      let clanname = root.querySelector("h2").childNodes[1]
      if (!clanname) {
        clanname = 'No clan'
      } else {
        nearlyclanname = root.querySelector("h2").childNodes[1].rawText.replace(/\n+/g, '')
        clanname = `[${nearlyclanname}](https://stats.gats.io/clan/${nearlyclanname})`
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
            name: "Favourite Loadout",
            value: 
            `Favorite gun is the ${favArr[0]} with ${favArr[1]} kills\n` + 
            `Favorite perk is ${favArr[2]} (used ${favArr[3]} times).\n` +
            `Favorite ability is ${favArr[4]} (used ${favArr[5]} times).`,
            inline: false
          },
          { 
            name: `Clan member`,
            value: `${clanname}`,
            inline: true
          },
          {
            name: `Gats Rank`,
            value: `${rank.rawText}`,
            inline: true
          },
          {
            name: `Connected account`,
            value: `${mention(dname) ?? "No account linked"}`,
            inline: true
          }
        );
        embed.setTitle(`${title.rawText.replace("Stats", "").trim()}`);
        embed.setThumbnail("https://stats.gats.io" + img);
        embed.setColor("RANDOM");
        interaction.reply({ embeds: [embed] });
      } else return interaction.reply("That player does not exist.");
    }
  },
};
