const { Client, ApplicationCommandType, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "yetkiayarları",
    description: "Yetki ayarlamalarını bu komutla yapabilirsin!",
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: "8",
    options: [
        {
            name: 'registerhammer',
            description: 'Register hammer rolü seç!',
            type: 8,
            required: true,
            minValue: 2,
        },
    ],

    onRequest: async (client, interaction, ravgar) => {
        if (!system.Bot.Roots.includes(interaction.member.id)) return interaction.reply({ content : `Yetkin Yok!`, ephemeral: true })

        const registerHammer = interaction.guild.channels.cache.get(interaction.options.get('registerhammer').value);
        const vmuteHammer = interaction.guild.channels.cache.get(interaction.options.get('voicemutehammer').value);
        const muteHammer = interaction.guild.channels.cache.get(interaction.options.get('mutehammer').value);
        const banHammer = interaction.guild.channels.cache.get(interaction.options.get('banhammer').value);
        const jailHammer = interaction.guild.channels.cache.get(interaction.options.get('jailhammer').value);
        

    }
};