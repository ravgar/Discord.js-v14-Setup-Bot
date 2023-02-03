const { Client, ApplicationCommandType, EmbedBuilder } = require("discord.js");
const { Stagram } = require("../../../../../Global/Settings/Schemas")
module.exports = {
    name: "profil",
    description: "Bir kullanıcının profiline bak!",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'kişi',
            description: 'Stagram profiline bakmak istediğin kullanıcıyı belirt!',
            type: 6,
            required: true
        },
    ],

    onRequest: async (client, interaction, ravgar, embed) => {
        const member = interaction.guild.members.cache.get(interaction.options.get('kişi').value);
        const profile = await Stagram.findOne({ userID: member.id })
        if (!profile && profile?.Status == false) return interaction.reply({ content: `${interaction.guild.findEmoji(system.Emojis.Iptal)} Bu profili bulamadım! Oluşturmak için \`.profil oluştur\`` }).sil(20)
        if (profile?.Picture) {
            embed.setThumbnail(profile?.Picture)
        }
        if (member.presence.activities.some(x => x.type == 2)) {
            let sponame;
            let spoauth;
            member.presence.activities.some(x => { sponame = x.details })
            member.presence.activities.some(x => { spoauth = x.state })
            embed.addFields([{
                name: `Spotify Bilgileri`, value: `\` ❯ \` Şarkı İsmi: **${sponame}**\n\` ❯ \` Şarkıcı(lar): **${spoauth}**`,
            }])
        }
        interaction.reply({
            embeds: [embed.setDescription(`
**${profile?.UserName}** kullanıcı adlı kişinin profili;

\` ❯ \` Profilin oluşturulma zamanı : **<t:${Math.floor(profile?.Date / 1000)}:R>**
    
\` ❯ \` Toplam takipçi sayısı : **${profile?.FollowersNumber ? profile?.FollowersNumber : "0"}**
\` ❯ \` Toplam beğeni sayısı : **${profile?.TopLike ? profile?.TopLike : "0"}**

\` ❯ \` Son paylaşım tarihin : **${profile?.LastPost ? `<t:${Math.floor(profile?.LastPost / 1000)}:R>` : "Paylaşım yapılmamış!"}**
\` ❯ \` Takipçilerin : ${profile?.Followers.length > 0 ? `${profile?.Followers.map(x => `${interaction.guild.members.cache.get(x)}`)}` : "Malesef takipçin yok!"}
                    
> **NOT: Daha detaylı ve değişik içerikli profil komutuna erişmek için \`.profil <ravgar/ID>\` komutunu kullanabilirsin!**
`)]
        })
}
};