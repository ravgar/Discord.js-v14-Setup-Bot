const { Client, ApplicationCommandType, EmbedBuilder } = require("discord.js");
const { Stagram } = require("../../../../../Global/Settings/Schemas")
module.exports = {
    name: "Takip",
    type: ApplicationCommandType.User,

    onRequest: async (client, interaction) => {
        let followHim = await client.users.fetch(interaction.targetId)
        let follower = interaction.guild.members.cache.get(interaction.member.id)
        const followers = await Stagram.findOne({ userID: followHim.id });
        if (!followers && followers?.Status == false) return interaction.reply({ content: `Bu kişi bir profile sahip değil o yüzden takip edemezsin!`, ephemeral: true })
        if (followers?.Followers.some(x => x == follower.id)) {
            return interaction.reply({ content: `Bu kişiyi zaten takip ediyorsun dostum!`, ephemeral: true });
        } else {
            await Stagram.updateOne({ userID: followHim.id }, { $inc: { FollowersNumber: 1 } }, { upsert: true }).exec();
            await Stagram.updateOne({ userID: followHim.id }, { $push: { Followers: follower.id } }, { upsert: true }).exec();
            return interaction.reply({ content: `Başarılı şekilde ${followHim} kişisini takip ettiniz! ${interaction.guild.findEmoji(system.Emojis.Onay)}` })
        }
    }
};