
const { Command } = require("../../../../Global/Structures/Default.Commands");
class HELP extends Command {
    constructor(client) {
        super(client, {
            name: "help",
            description: "Sunucu içerisi bot komutlarını gösterir.",
            usage: "help",
            category: "Misc",
            aliases: ["yardım", "y"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {
        client.on("interactionCreate", async(interaction) => {
            let founders = `\n${client.commands.filter(cmd => cmd.description && cmd.category && cmd.category === "Founders").map(cmd => `${system.Bot.Prefixs[0]}${cmd.name} - \`${cmd.description}\``).join("\n")}`
            let misc = `\n${client.commands.filter(cmd => cmd.description && cmd.category && cmd.category === "Misc").map(cmd => `${system.Bot.Prefixs[0]}${cmd.name} - \`${cmd.description}\``).join("\n")}`
            let mod = `\n${client.commands.filter(cmd => cmd.description && cmd.category && cmd.category === "Moderation").map(cmd => `${system.Bot.Prefixs[0]}${cmd.name} - \`${cmd.description}\``).join("\n")}`
            let register = `\n${client.commands.filter(cmd => cmd.description && cmd.category && cmd.category === "Register").map(cmd => `${system.Bot.Prefixs[0]}${cmd.name} - \`${cmd.description}\``).join("\n")}`
            let stat = `\n${client.commands.filter(cmd => cmd.description && cmd.category && cmd.category === "Stat").map(cmd => `${system.Bot.Prefixs[0]}${cmd.name} - \`${cmd.description}\``).join("\n")}`
            let diger = `\n${client.commands.filter(cmd => cmd.description && cmd.category && cmd.category === "Stagram").map(cmd => `${system.Bot.Prefixs[0]}${cmd.name} - \`${cmd.description}\``).join("\n")}`
    
            if (interaction.customId == "yardimpaneli") {
                if (interaction.values[0] == "yonetici") {
                    interaction.reply({
                        embeds: [new Discord.EmbedBuilder().setDescription(`Komut Ismi   -   \`Komut Açıklaması\`\n${founders}`)], ephemeral: true
                    })
                }
                if (interaction.values[0] == "general") {
                    interaction.reply({
                        embeds: [new Discord.EmbedBuilder().setDescription(`Komut Ismi   -   \`Komut Açıklaması\`\n${misc}`)], ephemeral: true
                    })
                }
                if (interaction.values[0] == "moderasyon") {
                    interaction.reply({
                        embeds: [new Discord.EmbedBuilder().setDescription(`Komut Ismi   -   \`Komut Açıklaması\`\n${mod}`)], ephemeral: true
                    })
                }
                if (interaction.values[0] == "register") {
                    interaction.reply({
                        embeds: [new Discord.EmbedBuilder().setDescription(`Komut Ismi   -   \`Komut Açıklaması\`\n${register}`)], ephemeral: true
                    })
                }
                if (interaction.values[0] == "stat") {
                    interaction.reply({
                        embeds: [new Discord.EmbedBuilder().setDescription(`Komut Ismi   -   \`Komut Açıklaması\`\n${stat}`)], ephemeral: true
                    })
                }
                if (interaction.values[0] == "diger") {
                    interaction.reply({
                        embeds: [new Discord.EmbedBuilder().setDescription(`Komut Ismi   -   \`Komut Açıklaması\`\n${diger}`)], ephemeral: true
                    })
                }
            }
        })
    }

    async onRequest(client, message, args, embed, ravgar) {
        const row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.SelectMenuBuilder()
                    .setCustomId('yardimpaneli')
                    .setPlaceholder('Yardım Paneli')
                    .addOptions(
                        { label: 'Yönetici Komutları', value: 'yonetici', emoji: { "id": "1006650789525200987" } },
                        { label: 'Genel Komutlar', value: 'general', emoji: { "id": "1006650793207791787" } },
                        { label: 'Moderasyon Komutları', value: 'moderasyon', emoji: { "id": "1006650794805821510" } },
                        { label: 'Register Komutları', value: 'register', emoji: { "id": "1006650792339574894" } },
                        { label: 'Stat Komutları', value: 'stat', emoji: { "id": "1006650792339574894" } },
                        { label: 'Diğer Komutlar', value: 'diger', emoji: { "id": "1006650792339574894" } },
                    ),
            );
        message.channel.send({ content: `Aşağıdaki menü yardımı ile komutların detayını öğrenebilirsin!`, components: [row] });
    }
}

module.exports = HELP
