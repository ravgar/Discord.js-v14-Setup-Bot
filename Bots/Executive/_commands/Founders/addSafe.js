
const { Command } = require("../../../../Global/Structures/Default.Commands");
class AddSafe extends Command {
    constructor(client) {
        super(client, {
            name: "güvenli",
            description: "Güvenli eklemenizi/çıkarmanızı sağlar!",
            usage: "güvenli <ravgar/ID>",
            category: "Founders",
            aliases: ["güvenli", "piç", "ravgar", "olmazböyle", "gw", "ibne", "yavşak"],
            enabled: true,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, ravgar, c) {
        if (!ravgar?.Founders.includes(message.member.id) && !system.Bot.Roots.includes(message.member.id) && !c) return message.channel.send({ content: system.Replys.NoAuth }).sil(20)
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!member) return message.channel.send({ content: system.Replys.Member + ` \`${system.Bot.Prefixs[0]}gw <@ravgar/ID>\`` }).sil(20)
        const row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.SelectMenuBuilder()
                    .setCustomId('guvenliekle')
                    .setPlaceholder('🔝 Güvenli Kategorisi İçin Tıkla!')
                    .addOptions(
                        {
                            label: 'Full',
                            description: `${member.user.tag} Full kategorisinde güvenli ekle!`,
                            value: 'full',
                        },
                        {
                            label: 'Rol Ver/Al',
                            description: `${member.user.tag} Rol Ver/Al kategorisinde güvenli ekle!`,
                            value: 'rolveral',
                        },
                        {
                            label: 'Rol',
                            description: `${member.user.tag} Rol kategorisinde güvenli ekle!`,
                            value: 'rol',
                        },
                        {
                            label: 'Kanal',
                            description: `${member.user.tag} Kanal kategorisinde güvenli ekle!`,
                            value: 'kanal',
                        },
                        {
                            label: 'Chat',
                            description: `${member.user.tag} Chat Guard kategorisinde güvenli ekle!`,
                            value: 'chat',
                        },
                    ),
            );
        let full = ravgar?.Full || []
        let rolveral = ravgar?.RoleAddRemove || []
        let rols = ravgar?.Role || []
        let channels = ravgar?.Channel || []
        let chat = ravgar?.Chat || []
        let guvenli = await message.channel.send({
            components: [row],
            embeds: [embed.setDescription(`
${message.guild.name} Sunucusu güvenli listemine hoş geldin!              
                `)
                .addFields([{
                    name: `Full Kategorisindeki Üyeler`, value: `${full.length > 0 ? full.map(x => message.guild.members.cache.has(x) ? message.guild.members.cache.get(x) : x).join('\n') : "Bu güvenli kategoride kimse bulunamadı!"}`,
                }])
                .addFields([{
                    name: `Rol Kategorisindeki Üyeler`, value: `${rols.length > 0 ? rols.map(x => message.guild.members.cache.has(x) ? message.guild.members.cache.get(x) : x).join('\n') : "Bu güvenli kategoride kimse bulunamadı!"}`,
                }])
                .addFields([{
                    name: `Rol Ver/Al Kategorisindeki Üyeler`, value: `${rolveral.length > 0 ? rolveral.map(x => message.guild.members.cache.has(x) ? message.guild.members.cache.get(x) : x).join('\n') : "Bu güvenli kategoride kimse bulunamadı!"}`,
                }])
                .addFields([{
                    name: `Kanal Kategorisindeki Üyeler`, value: `${channels.length > 0 ? channels.map(x => message.guild.members.cache.has(x) ? message.guild.members.cache.get(x) : x).join('\n') : "Bu güvenli kategoride kimse bulunamadı!"}`,
                }])
                .addFields([{
                    name: `Chat Guard Kategorisindeki Üyeler`, value: `${chat.length > 0 ? chat.map(x => message.guild.members.cache.has(x) ? message.guild.members.cache.get(x) : x).join('\n') : "Bu güvenli kategoride kimse bulunamadı!"}`,
                }])
            ]
        })
        var filter = (component) => component.user.id === message.member.id;
        const collector = guvenli.createMessageComponentCollector({ filter, time: 30000 })
        collector.on('collect', async (interaction) => {
            if (guvenli) guvenli.delete();
            if (interaction.customId == "guvenliekle") {
                if (interaction.values[0] == "full") {
                    if (!ravgar?.Full.includes(member.id)) {
                        await ravgarcik.findOneAndUpdate({ guildID: message.guild.id }, { $push: { Full: member.id } }, { upsert: true })
                        interaction.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${member} (\`${member.id}\`) kişisi ${message.member} (\`${message.member.id}\`) tarafından **Full** kategoride güvenliye eklendi!` })
                    } else {
                        await ravgarcik.findOneAndUpdate({ guildID: message.guild.id }, { $pull: { Full: member.id } }, { upsert: true })
                        interaction.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${member} (\`${member.id}\`) kişisi ${message.member} (\`${message.member.id}\`) tarafından **Full** kategoride güvenliden çıkarıldı!` })
                    }
                }
                if (interaction.values[0] == "rolveral") {
                    if (!ravgar?.RoleAddRemove.includes(member.id)) {
                        await ravgarcik.findOneAndUpdate({ guildID: message.guild.id }, { $push: { RoleAddRemove: member.id } }, { upsert: true })
                        interaction.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${member} (\`${member.id}\`) kişisi ${message.member} (\`${message.member.id}\`) tarafından **Rol Ver/Al** kategoride güvenliye eklendi!` })
                    } else {
                        await ravgarcik.findOneAndUpdate({ guildID: message.guild.id }, { $pull: { RoleAddRemove: member.id } }, { upsert: true })
                        interaction.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${member} (\`${member.id}\`) kişisi ${message.member} (\`${message.member.id}\`) tarafından **Rol Ver/Al** kategoride güvenliden çıkarıldı!` })
                    }
                }
                if (interaction.values[0] == "rol") {
                    console.log(member.id)
                    console.log(message.guild.id)
                    if (!ravgar?.Role.includes(member.id)) {
                        await ravgarcik.findOneAndUpdate({ guildID: message.guild.id }, { $push: { Role: member.id } }, { upsert: true })
                        interaction.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${member} (\`${member.id}\`) kişisi ${message.member} (\`${message.member.id}\`) tarafından **Rol** kategoride güvenliye eklendi!` })
                    } else {
                        await ravgarcik.findOneAndUpdate({ guildID: message.guild.id }, { $pull: { Role: member.id } }, { upsert: true })
                        interaction.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${member} (\`${member.id}\`) kişisi ${message.member} (\`${message.member.id}\`) tarafından **Rol** kategoride güvenliden çıkarıldı!` })
                    }
                }
                if (interaction.values[0] == "kanal") {
                    if (!ravgar?.Channel.includes(member.id)) {
                        await ravgarcik.findOneAndUpdate({ guildID: message.guild.id }, { $push: { Channel: member.id } }, { upsert: true })
                        interaction.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${member} (\`${member.id}\`) kişisi ${message.member} (\`${message.member.id}\`) tarafından **Kanal** kategoride güvenliye eklendi!` })
                    } else {
                        await ravgarcik.findOneAndUpdate({ guildID: message.guild.id }, { $pull: { Channel: member.id } }, { upsert: true })
                        interaction.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${member} (\`${member.id}\`) kişisi ${message.member} (\`${message.member.id}\`) tarafından **Kanal** kategoride güvenliden çıkarıldı!` })
                    }
                }
                if (interaction.values[0] == "chat") {
                    if (!ravgar?.Chat.includes(member.id)) {
                        await ravgarcik.findOneAndUpdate({ guildID: message.guild.id }, { $push: { Chat: member.id } }, { upsert: true })
                        interaction.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${member} (\`${member.id}\`) kişisi ${message.member} (\`${message.member.id}\`) tarafından **Chat** kategoride güvenliye eklendi!` })
                    } else {
                        await ravgarcik.findOneAndUpdate({ guildID: message.guild.id }, { $pull: { Chat: member.id } }, { upsert: true })
                        interaction.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Onay)} ${member} (\`${member.id}\`) kişisi ${message.member} (\`${message.member.id}\`) tarafından **Chat** kategoride güvenliden çıkarıldı!` })
                    }
                }
            }
        })
    }
}

module.exports = AddSafe

