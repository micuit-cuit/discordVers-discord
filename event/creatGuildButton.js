const { Events, EmbedBuilder, ModalBuilder, ActionRowBuilder , TextInputBuilder, TextInputStyle } = require('discord.js');
const Log = require('mi-log');
const store = require('../api/store');
const {translate} = require('../api/translate');
const log = new Log([{ sRtyle: 'circle', color: 'yellow', text: 'project-vers' }, { style: 'circle', color: 'red', text: 'event' }, { style: 'circle', color: 'pink', text: 'creatGuildButton.js' }]);

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	async execute(client, interaction, ws) {
		if (!(interaction.isButton() || interaction.isModalSubmit())) return;
		if (!interaction.customId.startsWith('createGuild')) return;
		//si le bouton est cliqué par un autre utilisateur que le créateur
		if (interaction.user.id !== interaction.message.interaction.user.id) {
			await interaction.reply({ content: translate(interaction.locale, 'command.createGuild.button.ERROR_NOT_OWNER'), ephemeral: true });
			return;
		}
		//crée un modal pour demander le nom du serveur
		const modal = new ModalBuilder()
			.setTitle(translate(interaction.locale, 'command.createGuild.modal.TITLE'))
			.setCustomId('createGuild')

		const row = new TextInputBuilder()
			.setCustomId('guildName')
			.setLabel(translate(interaction.locale, 'command.createGuild.modal.INPUT_LABEL'))
			.setPlaceholder(translate(interaction.locale, 'command.createGuild.modal.INPUT_PLACEHOLDER'))
			.setStyle(TextInputStyle.PLAIN_TEXT)
			.setRequired(true)

		await interaction.showModal(modal);


	},

};
