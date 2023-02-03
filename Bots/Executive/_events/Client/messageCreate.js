const { Collection, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { Event } = require("../../../../Global/Structures/Default.Events");
const cooldown = new Collection();
const ms = require('ms');
const { CommandPerm } = require('../../../../Global/Settings/Schemas');

class messageCreate extends Event {
    constructor(client) {
        super(client, {
            name: "messageCreate",
            enabled: true,
        });
    }

    async onLoad(message) {
        if (message.author.bot || !client.prefix.some(x => message.content.startsWith(x)) || !message.channel || message.channel.type != 0) return;
        let args = message.content.substring(client.prefix.some(x => x.length)).split(" ");
        let _find = args[0].toLocaleLowerCase()
        args = args.splice(1);
        let command = client.commands.get(_find) || client.aliases.get(_find);
        const ravgar = global.ravgar = await ravgarcik.findOne({ guildID: message.guild.id });
        let embed = new EmbedBuilder()
            .setFooter({ text: 'Created © by Ravgar.', iconURL: client.user.avatarURL({ dynamic: true }) })
            .setColor("Random")
            .setAuthor({
                name: message.member.user.tag,
                iconURL: message.member.user.avatarURL({ dynamic: true, size: 1024 })
            })

        if ([".tag", "!tag"].includes(message.content.toLowerCase())) return message.channel.send({ content: `${ravgar?.tags.map(x => `\`${x}\``).join(" | ")}` });
        if ([".link", "!link"].includes(message.content.toLowerCase())) return message.channel.send({ content: message.guild.vanityURLCode ? `discord.gg/${message.guild.vanityURLCode}` : `discord.gg/${(await message.channel.createInvite()).code}` });
        if ([".patlat", "!batlat"].includes(message.content.toLowerCase())) return message.channel.send({ content: `Çocuk musun aq` }).sil(20)

        if (command) {
            if (command.permissions && command.permissions.length > 0) {
                if ((command.permissions.includes("GUILD_OWNER") && message.guild.ownerId != message.author.id)
                    && (command.permissions.includes("BOT_OWNER") && !client.owners.includes(message.author.id)) &&
                    (!command.permissions.filter(x => x != "GUILD_OWNER" && x != "BOT_OWNER").some(perm => message.member.permissions.has(perm) || message.member.roles.cache.has(perm) || message.author.id == perm))) return message.reply({ embeds: [embed.setDescription(`Bu komutu kullanabilmek için yeterli bir yetkiye sahip değilsin.`)] }).then(msg => {
                        setTimeout(() => {
                            msg.delete().catch(err => { })
                        }, 5000)
                    });
            }

            if (command.cooldown && cooldown.has(`${command.name}${message.author.id}`)) return message.reply({ content: `Bu komutu <t:${String(cooldown.get(`${command.name}${message.author.id}`)).slice(0, 10)}:R> kullanabilirsiniz.` }).then(msg => {
                setTimeout(() => {
                    msg.delete().catch(err => { })
                }, 5000)
            });
            if (message.member.roles.cache.has(ravgar?.jailedRole) || message.member.roles.cache.has(ravgar?.suspectRole) || message.member.roles.cache.has(ravgar?.bannedTagRole) || (ravgar?.unregisterRoles && ravgar?.unregisterRoles.some(rol => message.member.roles.cache.has(rol)))) return;
            if (message.guild.channels.cache.find(x => x.name == "command-log")) message.guild.findChannel("command-log").send({ content: `🔧 **${message.author.tag}** \`(${message.author.id})\` kişisi ${message.channel} kanalında \`${_find}\` komutunu kullandı!\n \`\`\`Komut içeriği;\n${message.content}\`\`\`\n**───────────────**` }).catch(err => { })
            if (!ravgar?.botCommands.includes(message.channel.id) && ["stat", "top", "veriler", "booster", "help"].some(x => _find == x)) return message.channel.send({ content: `${message.author} Bu komut <#${ravgar?.botCommands[0]}> kanalında kullanılabilir!` }).sil(3)
            const comPerm = await CommandPerm.findOne({ commandName: _find })
            let c = message.member.roles.cache.some(x => comPerm?.roleID.includes(x.id))
            command.onRequest(client, message, args, embed, ravgar, c)
            if (message.guild.ownerId != message.author.id && !client.owners.includes(message.author.id) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                cooldown.set(`${command.name}${message.author.id}`, Date.now() + command.cooldown)
                setTimeout(() => {
                    cooldown.delete(`${command.name}${message.author.id}`)
                }, command.cooldown);
            }
        }

    }
}

module.exports = messageCreate
