const { Events } = require('discord.js');
const Log = require('mi-log');
const log = new Log([{ style: 'circle', color: 'yellow', text: 'project-vers' }, { style: 'circle', color: 'red', text: 'event' }, { style: 'circle', color: 'pink', text: 'message' }]);

module.exports = {
	name: Events.MessageCreate,
	once: false,
	async execute(client, interaction) {
		log.i(`Message from ${interaction.author.username}: ${interaction.content}`);

	},

};