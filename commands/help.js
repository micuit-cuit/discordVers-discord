const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const { translate, translateALL } = require('../api/translate');
const fs = require('fs');                   
const Log = require('mi-log');
const log = new Log([{ style: 'circle', color: 'yellow', text: 'project-vers' }, { style: 'circle', color: 'red', text: 'command' }, { style: 'circle', color: 'pink', text: 'help' }]);
module.exports = {
    key: 'command.help',
    data: new SlashCommandBuilder()
        .setName(translate("en-US", 'command.help.NAME'))
        .setDescription(translate("en-US", 'command.help.DESCRIPTION'))
        .setNameLocalizations(translateALL('command.help.NAME'))
        .setDescriptionLocalizations(translateALL('command.help.DESCRIPTION')),
    async execute(interaction, ws) {
        //determine la langue de l'utilisateur
        const lang = interaction.locale
        log.i(`User ${interaction.user.username} requested help in ${lang}`);
        //parcoure les fichiers de commandes et récupère l'objet key
        let commands = []
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`./${file}`);
            commands.push(command.key)
        }
        //crée un filed pour chaque commande
        const fields = []
        for (const command of commands) {
            fields.push({
                name: translate(lang, `${command}.NAME`),
                value: translate(lang, `${command}.HELP`),
            })
        }
        //crée l'embed
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(translate(lang, 'command.help.card.TITLE'))
            .setDescription(translate(lang, 'command.help.card.DESCRIPTION'))
            .addFields(fields)
        //envoie l'embed
        await interaction.reply({ embeds: [embed] })
    }
};