const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const dotenv = require('dotenv');
const Log = require('mi-log');
const log = new Log([{ style: 'circle', color: 'red', text: 'command-deployment' }]);

dotenv.config();

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	log.i(`Loading command ${file}`);
	const command = require(`./commands/${file}`);
	if (command.skip === true) continue;
	log.i(`Loaded command ${command.data.name}`);
	
	commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

// and deploy your commands!
(async () => {
	try {
		log.i(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(process.env.DISCORD_PREFIX),
			{ body: commands },
		);

		log.s(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		log.e(error);
	}
})();
