const dotenv = require('dotenv');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const Log = require('mi-log');
const path = require('node:path');
const fs = require('node:fs');
dotenv.config();
const WebSocket = require('ws');
const ws = new WebSocket(process.env.CORE_SERVER_URL, {
    perMessageDeflate: false
});
const log = new Log([{ style: 'circle', color: 'yellow', text: 'project-vers' }]);
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildVoiceStates
]});
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		log.w(`The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		log.e(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction, ws);
	} catch (error) {
		log.e(error);
		await interaction.reply({ content: 'There was an error while executing this command!\n \`\`\`'+error+`\`\`\``, ephemeral: true });
	}
});

const eventsPath = path.join(__dirname, 'event');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		try {client.once(event.name, (...args) => event.execute(client, args[0], ws));} catch (error) {log.e(error);}
	} else {
		try {client.on(event.name, (...args) => event.execute(client,args[0], ws));} catch (error) {log.e(error);}
	}
}

ws.on('open', function open() {
	log.i('Connected to the websocket server');
    ws.requestID = {};// {requestID: callback}
    ws.onse = (requestID, callback) => {
        ws.requestID[requestID] = callback;
    }
    ws.init = () => {
        ws.on('message', (data) => {
            const message = JSON.parse(data);
            if (ws.requestID[message.requestID]) {
                ws.requestID[message.requestID](message);
                delete ws.requestID[message.requestID];
            }
        }); 
    }
    ws.sendAndAwait = (message, callback) => {
        ws.send(JSON.stringify(message));
        ws.onse(message.requestID, callback);
    }
	ws.init();
	client.login(process.env.DISCORD_TOKEN);
});
ws.on('close', function close() {
	log.e('disconnected');
	process.exit(1);
});
ws.on('error', function error(err) {
	log.e(err);
	process.exit(1);
});
