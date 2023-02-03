const { Event } = require("../../../../Global/Structures/Default.Events");
const { Invites, Upstaff, User } = require("../../../../Global/Settings/Schemas")
class GuildMemberRemove extends Event {
    constructor(client) {
        super(client, {
            name: "guildMemberRemove",
            enabled: true,
        });
    }

    async onLoad(member) {
        if (member.guild.id !== system.Guild.ID) return;
        const ravgar = await ravgarcik.findOne({ guildID: member.guild.id })
        let inviteChannel = client.channels.cache.get(ravgar?.inviteLog);
        const inviteMemberData = await User.findOne({ userID: member.user.id }) || [];
        if (!inviteMemberData.Inviter) {
            if (inviteChannel) inviteChannel.send({ content: `**${member.user.tag}** sunucumuzdan ayrıldı! Davet eden: ${member.guild.vanityURLCode ? 'Özel URL' : `Davetçi Bulunamadı!`}` });
          } else if (inviteMemberData.Inviter.inviter === member.guild.id) {
            await Invites.findOneAndUpdate({ guildID: member.guild.id, userID: member.guild.id }, { $inc: { total: -1 } }, { upsert: true });
            const inviterData = await Invites.findOne({ guildID: member.guild.id, userID: member.guild.id });
            if (inviteChannel) inviteChannel.send({ content: `**${member.user.tag}** sunucumuzdan ayrıldı! Davet eden: \`Sunucu Özel URL\` \`(${inviterData ? inviterData.total : 0})\`` });
          } else {
            if (Date.now() - member.user.createdTimestamp < 1000 * 60 * 60 * 24 * 7) {
              const inviter = await client.users.fetch(inviteMemberData.Inviter.inviter);
              const inviterData = await Invites.findOne({ guildID: member.guild.id, userID: member.guild.id });
              if (inviteChannel) inviteChannel.send({ content: `**${member.user.tag}** sunucumuzdan ayrıldı! Davet eden: **${inviter.tag}** \`(${inviterData ? inviterData.total : 0})\`` })
            } else {
              const inviter = await client.users.fetch(inviteMemberData.Inviter.inviter);
              await Invites.findOneAndUpdate({ guildID: member.guild.id, userID: inviter.id }, { $inc: { leave: 1, total: -1 } }, { upsert: true });
              const inviterData = await Invites.findOne({ guildID: member.guild.id, userID: member.guild.id });
              if (inviteChannel) inviteChannel.send({ content: `**${member.user.tag}** sunucumuzdan ayrıldı! Davet eden: **${inviter.tag}** \`(${inviterData ? inviterData.total : 0})\`` });
            }
          }
    }

}
module.exports = GuildMemberRemove;

