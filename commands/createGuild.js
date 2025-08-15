const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder,ButtonBuilder} = require('discord.js');
const { translate, translateALL } = require('../api/translate');
const Log = require('mi-log');
const log = new Log([{ style: 'circle', color: 'yellow', text: 'project-vers' }, { style: 'circle', color: 'red', text: 'command' }, { style: 'circle', color: 'pink', text: 'createGuild' }]);
module.exports = {
    key: 'command.createGuild',
    data: new SlashCommandBuilder()
        .setName(translate("en-US", 'command.createGuild.NAME'))
        .setDescription(translate("en-US", 'command.createGuild.DESCRIPTION'))
        .setNameLocalizations(translateALL('command.createGuild.NAME'))
        .setDescriptionLocalizations(translateALL('command.createGuild.DESCRIPTION')),
    async execute(interaction, ws) {
        //determine la langue de l'utilisateur
        const lang = interaction.locale
        log.i(`User ${interaction.user.username} requested createGuild in ${lang}`);
        //création du serveur
        //demande au cor si le serveur existe déjà
        ws.sendAndAwait({
            route: '/guild/get',
            requestID: new Date().getTime(),
            user: interaction.user.id,
            data: {
                discordServerID: interaction.guildId,
                discordUserID: interaction.user.id
            }
        }, async (data) => {
            log.d(data);
            if (data.success) {
                //le serveur existe déjà
                const embed = new EmbedBuilder()
                    .setTitle(translate(lang, 'command.createGuild.error_already_exist.TITLE'))
                    .setDescription(translate(lang, 'command.createGuild.error_already_exist.DESCRIPTION'))
                    .setColor('#0099ff');
                interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }
            const embed = new EmbedBuilder()
                .setTitle(translate(lang, 'command.createGuild.documentation.TITLE'))
                .setDescription(translate(lang, 'command.createGuild.documentation.DESCRIPTION'))
                .setColor('#0099ff')
            const row = new ActionRowBuilder()
                .addComponents(new ButtonBuilder().setCustomId('createGuild').setLabel(translate(lang, 'command.createGuild.BUTTON')).setStyle('Primary'));
            await interaction.reply({ embeds: [embed], components: [row]});
        });
    }
};