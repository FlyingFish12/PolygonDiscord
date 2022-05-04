const { Client, Intents, Collection } = require("discord.js");
const fs = require("fs");
require("dotenv").config();
const { token } = require('./config.json')


const client = new Client({ intents: [Intents.FLAGS.GUILDS] });


client.once("ready", () => {
  console.log("Online!");
  const activities_list = [
    "Gats with the homies",
    "With stats APIs",
	"With people On Discord",
  ];
  setInterval(() => {
    const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);
    client.user.setActivity(activities_list[index]);
	{ type: 'WATCHING' };
  }, 15000);
});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}


client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});


client.login(token);