const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const { translate, translateALL } = require('../api/translate');
const Log = require('mi-log');
const log = new Log([{ style: 'circle', color: 'yellow', text: 'project-vers' }, { style: 'circle', color: 'red', text: 'command' }, { style: 'circle', color: 'pink', text: 'astuse' }]);
const astuseListe = require('../api/astuse.json');
module.exports = {
    key: 'command.astuse',
    data: new SlashCommandBuilder()
        .setName(translate("en-US", 'command.astuse.NAME'))
        .setDescription(translate("en-US", 'command.astuse.DESCRIPTION'))
        .setNameLocalizations(translateALL('command.astuse.NAME'))
        .setDescriptionLocalizations(translateALL('command.astuse.DESCRIPTION')),
    async execute(interaction, ws) {
        //choix d'une astuce aléatoire dans la liste et affichage
        const lang = interaction.locale

        const astuse = astuseListe[Math.floor(Math.random() * astuseListe.length)];
        const embed = new EmbedBuilder()
            .setTitle(translate(lang, astuse+".NAME"))
            .setDescription(translate(lang, astuse+".DESCRIPTION"))
            .setColor('#0099ff')
        
        await interaction.reply({ embeds: [embed]});
    }
}