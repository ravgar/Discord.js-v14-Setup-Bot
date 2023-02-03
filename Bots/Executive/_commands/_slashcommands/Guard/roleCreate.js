const { Client, ApplicationCommandType, EmbedBuilder } = require("discord.js");
const { roleBackup } = require("../../../../../Global/Settings/Schemas");
const Bots = require("../../../../DistMain")
module.exports = {
    name: "rolkur",
    description: "Sunucu içerisi bir rol kurmanızı sağlar!",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'rolid',
            description: 'Kurmak istediğin rolün idsini belirt!',
            type: 3,
            required: true
        },
    ],

    onRequest: async (client, interaction, ravgar) => {
        const role = interaction.options.get('rolid').value
        if (isNaN(role)) return await interaction.reply({ content: `Bir rol id girmen gerekli! ${interaction.guild.findEmoji(system.Emojis.Iptal)}`, ephemeral: true })
        roleBackup.findOne({ roleID: role }, async (err, data) => {
            if (!data) {
                interaction.guild.channels.cache.find(x => x.name == "guard-log").send({ content: `[${role}] ID'li rol silindi fakar datamda herhangi bir veri bulamadım! İşlemleri malesef gerçekleştiremiyorum!` }); console.log(`[${role}] ID'li rol silindi fakat herhangi bir veri olmadığı için işlem yapılmadı.`);
                interaction.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`${role} ID'li rolün herhangi bir datası bulunamadı! Rol kurulumu iptal edildi!`)] })
                return
            }
            const newRole = await interaction.guild.roles.create({
                name: data?.name,
                color: data?.color,
                hoist: data?.hoist,
                position: data?.position,
                permissions: data?.permissions,
                mentionable: data?.mentionable,
                reason: "Rol Silindiği İçin Tekrar Oluşturuldu!"
            });
            let length = (data.members.length + 5);
            const sayı = Math.floor(length / Bots.length);
            if (sayı < 1) sayı = 1;
            const channelPerm = data.channelOverwrites.filter(e => client.guilds.cache.get(system.Guild.ID).channels.cache.get(e.id))
            for await (const perm of channelPerm) {
                const bott = Bots[1]
                const guild2 = bott.guilds.cache.get(system.Guild.ID)
                let kanal = guild2.channels.cache.get(perm.id);
                if (!kanal) return;
                let newPerm = {};
                perm.allow.forEach(p => {
                    newPerm[p] = true;
                });
                perm.deny.forEach(p => {
                    newPerm[p] = false;
                });
                kanal.permissionOverwrites.create(newRole, newPerm).catch(error => client._logger.error(error));
            }
            for (let index = 0; index < Bots.length; index++) {
                const bot = Bots[index];
                const guild = bot.guilds.cache.get(system.Guild.ID);
                if (newRole.deleted) {
                    client._logger.log(`[${role}] - ${bot.user.tag} - Rol Silindi Dağıtım İptal`);
                    break;
                }
                const members = data.members.filter(e => guild.members.cache.get(e) && !guild.members.cache.get(e).roles.cache.has(newRole)).slice((index * sayı), ((index + 1) * sayı));
                if (members.length <= 0) {
                    client._logger.log(`[${role}] Olayında kayıtlı üye olmadığından veya rol üyelerine dağıtıldığından dolayı rol dağıtımı gerçekleştirmedim.`);
                    interaction.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`${role} ID'li rolün üyelerine rol dağıtıldığı için ya da üye olmadığı için iptal edildi!`)] })
                    break;
                }
                for await (const user of members) {
                    const member = guild.members.cache.get(user)
                    member.roles.add(newRole.id)
                }
            }
            await interaction.reply({ content: `\`${role}\` rolünün yedeği kurulup, kanallara ayarlama yapılacak ve roldeki kişilere dağıtım yapılacaktır. Biraz sabırlı olmanızı bekliyoruz.`, ephemeral: true })
            const newData = new OldRoles({
                roleID: newRole.id,
                name: newRole.name,
                color: newRole.hexColor,
                hoist: newRole.hoist,
                position: newRole.position,
                permissions: newRole.permissions.bitfield,
                mentionable: newRole.mentionable,
                time: Date.now(),
                members: data.members.filter(e => newRole.guild.members.cache.get(e)),
                channelOverwrites: data.channelOverwrites.filter(e => newRole.guild.channels.cache.get(e.id))
            });
            newData.save();
            client.dataChecker(newRole.id, role)
        });
    }
};