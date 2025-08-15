const { Events } = require('discord.js');
const Log = require('mi-log');
const log = new Log([{ style: 'circle', color: 'yellow', text: 'project-vers' }, { style: 'circle', color: 'red', text: 'event' }, { style: 'circle', color: 'pink', text: 'ready' }]);
const { MessageFlags,ThumbnailBuilder ,SectionBuilder,TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize, ButtonBuilder, ButtonStyle, ActionRowBuilder, ContainerBuilder } = require('discord.js');
const emptyEmoji = "<:empty:1386769141259571362>";
const emptyText = "\u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B";
const components = [
	new ContainerBuilder()
            .addSectionComponents(
                new SectionBuilder()
                    .setThumbnailAccessory(
                        new ThumbnailBuilder()
                            .setURL("https://media.discordapp.net/attachments/1292116469777432689/1386764304241393724/photo_de_profile.png?ex=685ae466&is=685992e6&hm=acd5f63f848e5c77748c5695b4bf1888e20e9308e8e236eda30730a8a1960cdc&=&format=webp&quality=lossless&width=784&height=784")                    )
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent("# Inventaire de micuitcuit"),
                        new TextDisplayBuilder().setContent("*inventaire*"),
                        new TextDisplayBuilder().setContent("-# rien à afficher")                    ),
            )
            .addSeparatorComponents(
                new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(true),
            )
            .addActionRowComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setLabel("+99")
							.setEmoji({name: "🥕"})
                            .setCustomId("f4b91b8fd1704d8cff1796fff441acf0"),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setLabel(emptyText)
							.setEmoji(emptyEmoji)
                            .setCustomId("b1bd142d61b34117be1867bc7439d97a"),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setLabel(emptyText)
							.setEmoji(emptyEmoji)
                            .setCustomId("4317f43fe7084efccc4d5d1858b05aff"),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setLabel(emptyText)
							.setEmoji(emptyEmoji)
                            .setCustomId("8b02dde6a70844c7ed7f6bd87e4cb476"),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setLabel("2")
							.setEmoji({name: "🍎"})
                            .setCustomId("4bc143118aea4e159d308c0d456f8dee"),
                    ),
            )
            .addActionRowComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setLabel(emptyText)
							.setEmoji(emptyEmoji)
                            .setCustomId("e95c37532308467c813845feb6b911aa"),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setLabel(emptyText)
							.setEmoji(emptyEmoji)
                            .setCustomId("102f89f95af94da6abbc36effcc81dee"),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setLabel(emptyText)
							.setEmoji(emptyEmoji)
                            .setCustomId("ef68fac40cbd4ec3ed5241e0a993401a"),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setLabel(emptyText)
							.setEmoji(emptyEmoji)
                            .setCustomId("d7209f78f496474beca642bc45ee04f2"),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setLabel(emptyText)
							.setEmoji(emptyEmoji)
                            .setCustomId("ec64f090bd28412c862d5654e722a4f4"),
                    ),
            )
            .addActionRowComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setLabel(emptyText)
							.setEmoji(emptyEmoji)
                            .setCustomId("77dd87c48a484321d8b7744ad5614e12"),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setLabel(emptyText)
							.setEmoji(emptyEmoji)
                            .setCustomId("cf249423e3bb4986bf766efdd68556f0"),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setLabel(emptyText)
							.setEmoji(emptyEmoji)
                            .setCustomId("e98fb0d14f484c3bf76427b6e191db3d"),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setLabel(emptyText)
							.setEmoji(emptyEmoji)
                            .setCustomId("979aee129a074da28b83fe47fe78ccf8"),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setLabel(emptyText)
							.setEmoji(emptyEmoji)
                            .setCustomId("04db87d26c9c416986cec7d8165c0e70"),
                    ),
            )
			.addActionRowComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setLabel("Barre d'outils")
                            .setCustomId("73f854f506804569fd2500d60b00c8bf"),
                    ),
            )
			.addActionRowComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
							.setLabel("2")
							.setEmoji({name: "🍎"})
							.setCustomId("c7cd4d33954d41b3df85427222f349e6"),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setLabel(emptyText)
							.setEmoji(emptyEmoji)
                            .setCustomId("8e7d5f4395e34593d2f4d7d7e131c7dd"),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setLabel(emptyText)
							.setEmoji(emptyEmoji)
                            .setCustomId("cde1d5b310bf44d5c85e9a0f61cbdd5f"),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setLabel(emptyText)
							.setEmoji(emptyEmoji)
                            .setCustomId("41b643e8b9a341ddea544420d2c4a6b5"),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setLabel(emptyText)
							.setEmoji(emptyEmoji)
                            .setCustomId("8de099a0267b4cd4d8543bfcf3adc2a3"),
                    ),
            ),
];
module.exports = {
	name: Events.ClientReady,
	once: false,
	async execute(client, interaction) {
		log.s(`Ready! Logged in as ${interaction.user.tag}`);
		// const channel = client.channels.cache.get('1292077065595518999');
		// if (!channel) {
		// 	log.e('Channel not found');
		// 	return;
		// }
		// await channel.send({
		// 	components: components,
		// 	flags: MessageFlags.IsComponentsV2
		// });
	},

};