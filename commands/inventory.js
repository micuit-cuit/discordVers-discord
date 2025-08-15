const { SlashCommandBuilder, EmbedBuilder, MessageFlags} = require('discord.js');
const { translate, translateALL } = require('../api/translate');
const { inventoryBuilder } = require("../api/component/inventory-builder");
const store = require('../api/store');
const Log = require('mi-log');
const log = new Log([{ style: 'circle', color: 'yellow', text: 'project-vers' }, { style: 'circle', color: 'red', text: 'command' }, { style: 'circle', color: 'pink', text: 'inventory' }]);
module.exports = {
    key: 'command.inventory',
    data: new SlashCommandBuilder()
        .setName(translate("en-US", 'command.inventory.NAME'))
        .setDescription(translate("en-US", 'command.inventory.DESCRIPTION'))
        .setNameLocalizations(translateALL('command.inventory.NAME'))
        .setDescriptionLocalizations(translateALL('command.inventory.DESCRIPTION')),
    async execute(interaction, ws) {
        //determine la langue de l'utilisateur
        const lang = interaction.locale
        log.i(`User ${interaction.user.username} requested inventory in ${lang}`);
        //crée 3 ligne de 5 boutons gris
        const requetteID = new Date().getTime()
        ws.send(JSON.stringify({
            route: '/user/inventory/get',
            requestID: requetteID,
            user: interaction.user.id,
            data: {
                userID: interaction.user.id
            }
        }));
        log.d(`Sent request to get inventory of ${interaction.user.username}`);
        ws.onse(requetteID, async (data) => {
            if (data.success) {
                const inventoryId = Math.floor(Math.random() * 1000000).toString(32)
                const inventoryGui = inventoryBuilder({lang, inventory:data.data, id:inventoryId, userData: interaction.user})
                const messageID =   await interaction.reply({
                    components: [inventoryGui],
                    flags: MessageFlags.IsComponentsV2,
                    allowedMentions: { parse: [] },
                });
                store.inventory[inventoryId] = {
                    userID: interaction.user.id,
                    openAt: Date.now(),
                    expireAt: Date.now() + 60*10*1000, // 10 minutes
                    messageID : messageID.id,
                    inventory: data.data,
                }
                setTimeout(() => {
                    if (store.inventory[inventoryId] && store.inventory[inventoryId].expireAt < Date.now()) {
                        log.d(`Inventory ${inventoryId} expired for user ${interaction.user.username}`);
                        delete store.inventory[inventoryId];
                        interaction.editReply({ components: [] });
                    }
                }, 60*10*1000); // 10 minutes
            } else {
                await interaction.reply({ content: translate(lang, 'command.inventory.ERROR') })
            }
        })
    }
};