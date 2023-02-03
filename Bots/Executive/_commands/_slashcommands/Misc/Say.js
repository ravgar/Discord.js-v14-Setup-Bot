const { Client, ApplicationCommandType, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "say",
    description: "Bu Bir Deneme Komutudur.",
    type: ApplicationCommandType.ChatInput,

    onRequest: async (client, interaction) => {
        interaction.reply({ content: "Lulu Ve Piku Götten Verirse Komut Çalışacaktır." })
    }
};