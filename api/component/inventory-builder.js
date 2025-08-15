const { ThumbnailBuilder ,SectionBuilder,TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize, ButtonBuilder, ActionRowBuilder, ContainerBuilder } = require('discord.js');

const { translate } = require("../translate")
const emptyEmoji = "<:empty:1386769141259571362>";
const emptyText = "\u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B";
module.exports = {
    inventoryBuilder({lang, inventory, id, statuButton = {}, displayAcctonBar = false, canUse = false, canSplit = false, userData = {}, itemData = ""}) {
        const inventoryGui = new ContainerBuilder()
        inventoryGui.addSectionComponents(
            new SectionBuilder()
                .setThumbnailAccessory(
                    new ThumbnailBuilder()
                        .setURL(userData.displayAvatarURL({ extension: 'png' }) ?? "https://cdn.discordapp.com/embed/avatars/0.png")
                )
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(translate(lang, 'command.inventory.card.TITLE', `<@${userData.id}>`)),
                    new TextDisplayBuilder().setContent((itemData == null)?translate(lang, 'command.inventory.card.description.UNSELECTED'): translate(lang, 'command.inventory.card.description.SELECTED', itemData)),
                    new TextDisplayBuilder().setContent(translate(lang, 'command.inventory.card.FOOTER'))
                ),
        )
        inventoryGui.addSeparatorComponents(
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(true),
        );
        
        for (let i = 0; i < 3; i++) {
            let row = new ActionRowBuilder();
            for (let j = 0; j < 5; j++) {
                const item = inventory["slot" + (i * 5 + j + 1)];
                row.addComponents(new ButtonBuilder()
                    .setCustomId(`inv_slot${i * 5 + j + 1}_${id}`)
                    .setLabel( item == null ? emptyText : textBuilder(item.quantity))
                    .setEmoji(item == null ? emptyEmoji : translate(lang, item.key+".EMOJI"))
                    .setDisabled(!statuButton["slot" + (i * 5 + j + 1)]? false : statuButton["slot" + (i * 5 + j + 1)].disabled)
                    .setStyle(statuButton["slot" + (i * 5 + j + 1)]?.style || 'Secondary'));
            }
            inventoryGui.addActionRowComponents(row);
        }
        if (!displayAcctonBar) {
            inventoryGui.addActionRowComponents(new ActionRowBuilder()
                .addComponents(new ButtonBuilder().setCustomId('inv_HOTBAR_'+id).setLabel(translate(lang, 'command.inventory.button.HOTBAR')).setStyle('Success'))
            );
        } else {
            inventoryGui.addActionRowComponents(new ActionRowBuilder()
                .addComponents(new ButtonBuilder().setCustomId('inv_DROP_'+id).setLabel(translate(lang, 'command.inventory.button.actionBar.DROP')).setStyle('Danger'))
                .addComponents(new ButtonBuilder().setCustomId('inv_USE_'+id).setLabel(translate(lang, 'command.inventory.button.actionBar.USE')).setStyle('Success').setDisabled(!canUse))
                .addComponents(new ButtonBuilder().setCustomId('inv_SELL_'+id).setLabel(translate(lang, 'command.inventory.button.actionBar.SELL')).setStyle('Primary').setDisabled(true))
                .addComponents(new ButtonBuilder().setCustomId('inv_SPLIT_'+id).setLabel(translate(lang, 'command.inventory.button.actionBar.SPLIT')).setStyle('Secondary').setDisabled(canSplit))
            );
        }
        const rowAction = new ActionRowBuilder();
        for (let j = 0; j < 5; j++) {
            const item = inventory["slot" + (j + 16)];
            rowAction.addComponents(new ButtonBuilder()
                .setCustomId(`inv_slot${j + 16}_${id}`)
                .setLabel(item == null ? emptyText : textBuilder(item.quantity))
                .setEmoji(item == null ? emptyEmoji : translate(lang, item.key+".EMOJI"))
                .setDisabled(statuButton["slot" + (j + 16)]? statuButton["slot" + (j + 16)].disabled : false)
                .setStyle(statuButton["slot" + (j + 16)]?.style || 'Secondary')
            );
            }
        inventoryGui.addActionRowComponents(rowAction);
        return inventoryGui
    }
}

function textBuilder(n) {
    if (n < 10) {
        return `\u200B \u200B \u200B \u200B \u200B${n}`;  // 3 chars (2 espaces + chiffre)
    }
    if (n < 100) {
        return `\u200B \u200B \u200B${n}`;  // 3 chars (1 espace + 2 chiffres)
    }
    if (n < 1000) {
        return `${n}`;  // 3 chars max (3 chiffres)
    }
    if (n < 10000) {
        const k = Math.floor(n / 1000);
        return `+${k}k`;  // ex: +1k, +9k (3 chars)
    }
    return `\u200B \u200B \u200B±∞`;  // 3 chars (2 espaces + infini)
}

