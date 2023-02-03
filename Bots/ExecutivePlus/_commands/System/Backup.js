const { Command } = require("../../../../Global/Structures/Default.Commands");
const { roleBackup } = require("../../../../Global/Settings/Schemas")
class Eval extends Command {
    constructor(client) {
        super(client, {
            name: "backup",
            description: "-",
            usage: "-",
            category: "Guild",
            aliases: ["yedek", "yedekle", "backupla"],
            enabled: true,
        });
    }


    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, ravgar) {
        await roleBackup.deleteMany({});
        if (roleBackup) { await roleBackup.deleteMany({}); }
        message.guild.roles.cache.filter(r => r.name !== "@everyone" && !r.managed).forEach(async role => {
            let roleChannelOverwrites = [];
            message.guild.channels.cache.filter(c => c.permissionOverwrites.cache.has(role.id)).forEach(c => {
                if (c.isThread() || !c.permissionOverwrites.cache.has(role.id)) return;
                let channelPerm = c.permissionOverwrites.cache.get(role.id);
                let pushlanacak = { id: c.id, allow: channelPerm.allow.toArray(), deny: channelPerm.deny.toArray() };
                roleChannelOverwrites.push(pushlanacak);
            });
            await new roleBackup({
                roleID: role.id,
                name: role.name,
                color: role.hexColor,
                hoist: role.hoist,
                position: role.position,
                permissions: role.permissions.bitfield,
                mentionable: role.mentionable,
                time: Date.now(),
                members: role.members.map(m => m.id),
                channelOverwrites: roleChannelOverwrites
            }).save();
        })



        message.channel.send({ embeds: [embed.setDescription(`\`Manuel\` olarak yedekleme işlemi başarıyla alındı.`)] });
        //message.react(message.guild.emojiGöster(emojiler.Onay));
        client._logger.log(`ROL => Manuel olarak backup işlemi gerçekleştirildi. (${message.author.tag})`, "backup")
        //client.logger.log(`KANAL => Manuel olarak backup işlemi gerçekleştirildi. (${message.author.tag})`, "backup")
    }
}

module.exports = Eval
