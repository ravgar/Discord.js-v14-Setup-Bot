const { Client, ApplicationCommandType, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "avatar",
    description: "Bir kullanıcının avatarına bak!",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'kişi',
            description: 'Avatarını görmek istediğin üyeyi etiketle.',
            type: 6,
            required: true
        },
    ],

    onRequest: async (client, interaction) => {
        const member = interaction.guild.members.cache.get(interaction.options.get('kişi').value);
        interaction.reply({ content: `[${member}] kişisinin avatarı;`, embeds: [new Discord.EmbedBuilder().setImage(member.user.avatarURL({ dynamic: true, size: 2048 }))], ephemeral: true })
    }
};