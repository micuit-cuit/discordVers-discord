const { Events, EmbedBuilder, ModalBuilder, ActionRowBuilder , TextInputBuilder, TextInputStyle, MessageFlags } = require('discord.js');
const Log = require('mi-log');
const store = require('../api/store');
const {translate} = require('../api/translate');
const { inventoryBuilder } = require("../api/component/inventory-builder");
const log = new Log([{ style: 'circle', color: 'yellow', text: 'project-vers' }, { style: 'circle', color: 'red', text: 'event' }, { style: 'circle', color: 'pink', text: 'invButton' }]);

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	async execute(client, interaction, ws) {
		if (!(interaction.isButton() || interaction.isModalSubmit())) return;
		if (!interaction.customId.startsWith('inv_')) return;
		log.i(`Button ${interaction.customId} clicked by ${interaction.user.username}`);
		const lang = interaction.locale;
		if (interaction.customId.startsWith('inv_DROPMODAL')) {
			const invID = interaction.customId.split('_')[2];
			const quantity = interaction.fields.getTextInputValue("inv_DROPMODAL_QUANTITY");
			const user = interaction.user.id;
			const inventory = store.inventory[invID];
			if (!inventory) {
				log.e(`Inventory ${invID} not found`);
				//reply with error message
				interaction.reply({ content: translate(lang, 'command.inventory.buttonReturn.ERROR_NOT_FOUND'), ephemeral: true });
				return;
			}
			if (inventory.userID !== user) {
				log.e(`User ${user} is not the owner of inventory ${invID}`);
				interaction.reply({ content: translate(lang, 'command.inventory.buttonReturn.ERROR_NOT_OWNER'), ephemeral: true });
				//reply with error message
				return;
			}
			if (inventory.expireAt < Date.now()) {
				log.e(`Inventory ${invID} expired`);
				interaction.reply({ content: translate(lang, 'command.inventory.buttonReturn.ERROR_EXPIRED'), ephemeral: true });
				store.inventory[invID] = null;
				return;
			}
			const slot = inventory.activeSlot;
			if (!slot) {
				log.e(`No slot selected`);
				interaction.reply({ content: translate(lang, 'command.inventory.buttonReturn.ERROR_NO_SLOT'), ephemeral: true });
				return;
			}
			const requetteID = new Date().getTime()
			ws.send(JSON.stringify({
				route: '/user/inventory/drop',
				requestID: requetteID,
				user: user,
				data: {
					slot: slot,
					quantity: Math.floor(quantity),
				}
			}));
			ws.onse(requetteID, async (data) => {
				if (data.success) {
					log.i(`Slot ${slot} moved`);
					inventory.activeSlot = null;
					inventory.splitMode = false;
					inventory.splitQuantity = 0;

					inventory.inventory = data.data;

					const inventoryGui = inventoryBuilder({lang , userData:interaction.user, inventory: data.data, id: invID});
					await interaction.update({
						components: [inventoryGui],
						flags: MessageFlags.IsComponentsV2,
						allowedMentions: { parse: [] },
					});
				} else {
					log.e(`Slot ${slot} not moved`);
					interaction.reply({ content: "error, "+data.data, ephemeral: true });
				}
			})
			return;
		}else if (interaction.customId.startsWith('inv_SPLITMODAL')) {
			const invID = interaction.customId.split('_')[2];
			const quantity = interaction.fields.getTextInputValue("inv_SPLITMODAL_QUANTITY");
			const user = interaction.user.id;
			const inventory = store.inventory[invID];
			if (!inventory) {
				log.e(`Inventory ${invID} not found`);
				//reply with error message
				interaction.reply({ content: translate(lang, 'command.inventory.buttonReturn.ERROR_NOT_FOUND'), ephemeral: true });
				return;
			}
			if (inventory.userID !== user) {
				log.e(`User ${user} is not the owner of inventory ${invID}`);
				interaction.reply({ content: translate(lang, 'command.inventory.buttonReturn.ERROR_NOT_OWNER'), ephemeral: true });
				//reply with error message
				return;
			}
			if (inventory.expireAt < Date.now()) {
				log.e(`Inventory ${invID} expired`);
				interaction.reply({ content: translate(lang, 'command.inventory.buttonReturn.ERROR_EXPIRED'), ephemeral: true });
				store.inventory[invID] = null;
				return;
			}
			const slot = inventory.activeSlot;
			if (!slot) {
				log.e(`No slot selected`);
				interaction.reply({ content: translate(lang, 'command.inventory.buttonReturn.ERROR_NO_SLOT'), ephemeral: true });
				return;
			}
			inventory.splitMode = true;
			inventory.splitQuantity = quantity;
			const statuButton = {}
			for (let i = 1; i < 21; i++) {
				if (inventory.inventory['slot'+i]) {
					statuButton['slot'+i] = {style: inventory.activeSlot === 'slot'+i ? 'Primary' : 'Secondary',disabled: true}
				}
			}
			const inventoryGui = inventoryBuilder({lang , userData:interaction.user, inventory: inventory.inventory, id: invID, statuButton, displayAcctonBar: true, canUse: false, canSplit: false});
			await interaction.update({
                    components: [inventoryGui],
                    flags: MessageFlags.IsComponentsV2,
                    allowedMentions: { parse: [] },
                });
			return;
		}
		const slot = interaction.customId.split('_')[1];
		const invID = interaction.customId.split('_')[2];
		const user = interaction.user.id;
		const inventory = store.inventory[invID];
		if (!inventory) {
			log.e(`Inventory ${invID} not found`);
			//reply with error message
			interaction.reply({ content: translate(lang, 'command.inventory.buttonReturn.ERROR_NOT_FOUND'), ephemeral: true });
			return;
		}
		if (inventory.userID !== user) {
			log.e(`User ${user} is not the owner of inventory ${invID}`);
			interaction.reply({ content: translate(lang, 'command.inventory.buttonReturn.ERROR_NOT_OWNER'), ephemeral: true });
			//reply with error message
			return;
		}
		if (inventory.expireAt < Date.now()) {
			log.e(`Inventory ${invID} expired`);
			interaction.reply({ content: translate(lang, 'command.inventory.buttonReturn.ERROR_EXPIRED'), ephemeral: true });
			store.inventory[invID] = null;
			return;
		}
		if (!slot.startsWith('slot')) {
			if (slot === 'HOTBAR') {
				await interaction.update({ content: "" });
			}else if (slot === 'DROP') {
				//ouvre une modal pour confirmer la quantité et la suppression
				log.i(`Slot ${slot} selected`);
				log.i(`quantity ${inventory.inventory[inventory.activeSlot].quantity}`);
				log.i(`item ${inventory.inventory[inventory.activeSlot].key}`);
				const modal = new ModalBuilder()
					.setCustomId('inv_DROPMODAL_'+invID)
					.setTitle(translate(lang, 'command.inventory.modal.drop.TITLE'))
				
				const input = new TextInputBuilder()
					.setCustomId('inv_DROPMODAL_QUANTITY')
					.setLabel(translate(lang, 'command.inventory.modal.drop.DESCRIPTION', translate(lang, inventory.inventory[inventory.activeSlot].key+'.NAME'), inventory.inventory[inventory.activeSlot].quantity).slice(0, 45))
					.setPlaceholder(translate(lang, 'command.inventory.modal.drop.INPUT'))
					.setValue(String(inventory.inventory[inventory.activeSlot].quantity))
					.setStyle(TextInputStyle.Short)
					.setRequired(true)
				const row = new ActionRowBuilder()
					.addComponents(input)
				modal.addComponents(row)
				await interaction.showModal(modal);

			}else if (slot === 'USE') {
				await interaction.update({ content: "USE" });
			}else if (slot === 'SELL') {
				await interaction.update({ content: "SELL" });
			}else if (slot === 'SPLIT') {
				//crée une modal pour choisir la quantité
				log.i(`Slot ${slot} selected`);
				log.i(`quantity ${inventory.inventory[inventory.activeSlot].quantity}`);
				log.i(`item ${inventory.inventory[inventory.activeSlot].key}`);
				const modal = new ModalBuilder()
					.setCustomId('inv_SPLITMODAL_'+invID)
					.setTitle(translate(lang, 'command.inventory.modal.split.TITLE'))

				const input = new TextInputBuilder()
					.setCustomId('inv_SPLITMODAL_QUANTITY')
					.setLabel(translate(lang, 'command.inventory.modal.split.DESCRIPTION', translate(lang, inventory.inventory[inventory.activeSlot].key+'.NAME'), inventory.inventory[inventory.activeSlot].quantity).slice(0, 45))
					.setPlaceholder(translate(lang, 'command.inventory.modal.split.INPUT'))
					.setValue(String(Math.floor(inventory.inventory[inventory.activeSlot].quantity/2)))
					.setStyle(TextInputStyle.Short)
					.setRequired(true)
				const row = new ActionRowBuilder()
					.addComponents(input)
				modal.addComponents(row)
				await interaction.showModal(modal);
				//set les casse plaine en disable
			}else{
				try {
					await interaction.update({ content: "" });
				} catch (error) {
					log.e(`Error: ${error}`);
				}
			}
			return;
		}

		// active le slot si aucun slot n'est actif
		if (!inventory.activeSlot) {
			//regarde si le slot est vide ou non
			if (!inventory.inventory[slot]) {
				interaction.update({ content: ""});
				return;
			}
			inventory.activeSlot = slot;
			log.i(`Slot ${slot} activated`);
			const itemKey = inventory.inventory[slot].key;
			const description =`${translate(lang, itemKey+'.EMOJI')}${translate(lang, itemKey+'.NAME')}\n${translate(lang, itemKey+'.DESCRIPTION')}\n ${translate(lang, 'command.inventory.cards.description.QUANTITY', inventory.inventory[slot].quantity)}`;
		
			const inventoryGui = inventoryBuilder({lang , userData:interaction.user, inventory: inventory.inventory, id: invID, statuButton: { [slot]:{style: 'Primary',disabled: false} }, displayAcctonBar: true, canUse: false, canSplit: !(inventory.inventory[slot].quantity > 1), itemData: description})
				interaction.update({
					components: [inventoryGui],
					flags: MessageFlags.IsComponentsV2,
					allowedMentions: { parse: [] },
				});
			return;
		}else{
			////envois au ws la requette pour echanger les items
			log.i(`Slot ${slot} selected`);
			if (slot === inventory.activeSlot) {
				log.i(`Slot ${slot} unselected`);
				inventory.activeSlot = null;
				const inventoryGui = inventoryBuilder({lang , userData:interaction.user, inventory: inventory.inventory, id: invID});
				interaction.update({
					components: [inventoryGui],
					flags: MessageFlags.IsComponentsV2,
					allowedMentions: { parse: [] },
				});
				inventory.activeSlot = null;
				inventory.splitMode = false;
				inventory.splitQuantity = 0;
				return;
			}
			const requetteID = new Date().getTime()
			if (inventory.splitMode) {
				ws.send(JSON.stringify({
					route: '/user/inventory/split',
					requestID: requetteID,
					user: user,
					data: {
						inventoryID: invID,
						slotFrom: inventory.activeSlot,
						slotTo: slot,
						quantity: Math.floor(inventory.splitQuantity)
					}
				}));
				ws.onse(requetteID, async (data) => {
					if (data.success) {
						log.i(`Slot ${slot} moved`);
						inventory.activeSlot = null;
						inventory.splitMode = false;
						inventory.splitQuantity = 0;
						inventory.inventory = data.data;
						const inventoryGui = inventoryBuilder({lang , userData:interaction.user, inventory: data.data, id: invID});
						await interaction.update({ 
							components: [inventoryGui],
							flags: MessageFlags.IsComponentsV2,
							allowedMentions: { parse: [] },
						});
					} else {
						log.e(`Slot ${slot} not moved`);
						interaction.reply({ content: "error, "+data.data, ephemeral: true });
					}
				})
				return;
			}
			ws.send(JSON.stringify({
				route: '/user/inventory/move',
				requestID: requetteID,
				user: user,
				data: {
					inventoryID: invID,
					slotFrom: inventory.activeSlot,
					slotTo: slot
				}
			}));
			ws.onse(requetteID, async (data) => {
				if (data.success) {
					log.i(`Slot ${slot} moved`);
					inventory.activeSlot = null;
					inventory.inventory = data.data;
					const inventoryGui = inventoryBuilder({lang , userData:interaction.user, inventory: data.data, id: invID});
					await interaction.update({
						components: [inventoryGui],
						flags: MessageFlags.IsComponentsV2,
						allowedMentions: { parse: [] },
					});
				} else {
					log.e(`Slot ${slot} not moved`);
					interaction.reply({ content: "error, "+data.data, ephemeral: true });
				}
			})
		}
	},

};
