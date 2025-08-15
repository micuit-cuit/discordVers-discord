const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const { translate, translateALL } = require('../api/translate');
const Log = require('mi-log');
const log = new Log([{ style: 'circle', color: 'yellow', text: 'project-vers' }, { style: 'circle', color: 'red', text: 'command' }, { style: 'circle', color: 'pink', text: 'createUser' }]);
module.exports = {
    key: 'command.createUser',
    data: new SlashCommandBuilder()
        .setName(translate("en-US", 'command.createUser.NAME'))
        .setDescription(translate("en-US", 'command.createUser.DESCRIPTION'))
        .setNameLocalizations(translateALL('command.createUser.NAME'))
        .setDescriptionLocalizations(translateALL('command.createUser.DESCRIPTION')),
    async execute(interaction, ws) {
        //determine la langue de l'utilisateur
        const lang = interaction.locale
        log.i(`User ${interaction.user.username} requested createUser in ${lang}`);
        const requetteID = new Date().getTime()
        const userID = interaction.user.id
        ws.send(JSON.stringify({
            route: '/user/get',
            requestID: requetteID,
            user: userID,
            data: {
                userID: userID
            }
        }));
        log.d(`Sent request to get user ${userID}`);
        ws.onse(requetteID, async (data) => {
            log.d(data)
            if (data.success) {
                const reply = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle(translate(lang, 'command.createUser.alreadyExists.TITLE'))
                    .setDescription(translate(lang, 'command.createUser.alreadyExists.DESCRIPTION'))

                await interaction.reply({ embeds: [reply] })
            }else{
                requetteID ++;
                ws.send(JSON.stringify({
                    route: '/user/create',
                    requestID: requetteID,
                    user: userID,
                    data: {
                        userID: userID
                    }
                }));
                log.d(`Sent request to create user ${userID}`);
                ws.onse( requetteID, async (data) => {
                    log.d(data)
                    if (data.success) {
                        const reply = new EmbedBuilder()
                            .setColor('#0099ff')
                            .setTitle(translate(lang, 'command.createUser.created.TITLE'))
                            .setDescription(translate(lang, 'command.createUser.created.DESCRIPTION'))

                        await interaction.reply({ embeds: [reply] })
                    }else{
                        const reply = new EmbedBuilder()
                            .setColor('#0099ff')
                            .setTitle(translate(lang, 'command.createUser.error.TITLE'))
                            .setDescription(translate(lang, 'command.createUser.error.DESCRIPTION'))

                        await interaction.reply({ embeds: [reply] })
                    }
                });
            }
        });

    }
};