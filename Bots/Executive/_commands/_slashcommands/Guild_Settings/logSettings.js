const { Client, ApplicationCommandType, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "logsettings",
    description: "Log ayarlamalarını bu komutla yapabilirsin!",
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: "8",
    options: [
        {
            name: 'banlog',
            description: 'Ban log kanalını ayarlamanı sağlar!',
            type: 7,
            required: true,
        },
        {
            name: 'jaillog',
            description: 'Jail log kanalını ayarlamanı sağlar!',
            type: 7,
            required: true,
        },
        {
            name: 'mutelog',
            description: 'Mute log kanalını ayarlamanı sağlar!',
            type: 7,
            required: true,
        },

    ],

    onRequest: async (client, interaction, ravgar) => {
        if (!system.Bot.Roots.includes(interaction.member.id)) return interaction.reply({ content : `Yetkin Yok!`, ephemeral: true })

        const banLog = interaction.guild.channels.cache.get(interaction.options.get('banlog').value);
        const jailLog = interaction.guild.channels.cache.get(interaction.options.get('jaillog').value);
        const muteLog = interaction.guild.channels.cache.get(interaction.options.get('mutelog').value);
        interaction.reply({ content: `${banLog.id} - ${jailLog.id} - ${muteLog.id}` })

    }
};