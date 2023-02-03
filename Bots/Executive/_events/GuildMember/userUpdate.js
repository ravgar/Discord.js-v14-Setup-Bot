const { Event } = require("../../../../Global/Structures/Default.Events");
const { User, Upstaff } = require("../../../../Global/Settings/Schemas")
class UserUpdate extends Event {
    constructor(client) {
        super(client, {
            name: "userUpdate",
            enabled: true,
        });
    }

    async onLoad(oldUser, newUser) {
        const guild = client.guilds.cache.get(system.Guild.ID)
        if (!guild) return;
        if (oldUser.username == newUser.username || oldUser.bot || newUser.bot) return;
        const ravgar = await ravgarcik.findOne({ guildID: system.Guild.ID });
        let uye = guild.members.cache.get(oldUser.id);
        let log = guild.channels.cache.find(x => x.name == "tag-log")
        const user = await User.findOne({ userID: uye.id })
        if (oldUser.username != newUser.username || oldUser.tag != newUser.tag || oldUser.discriminator != newUser.discriminator) {
            if (ravgar?.tags.some(tag => newUser.tag.toLowerCase().includes(tag))) {
                if (!uye.roles.cache.has(ravgar?.tagRole)) {
                    uye.roles.add(ravgar?.tagRole).catch(e => { });
                    if (log) log.send({ content: `${uye}, adlı üye **( ${ravgar?.tags.filter(a => uye.user.username.includes(a) || uye.user.discriminator == a.replace("#", "")).map(a => a).join(", ")} )** tagını kullanıcı adına ekleyerek ailemize katıldı!\n\n─────────────────\n\nÖnce: ${oldUser.tag} | Sonra: ${newUser.tag}` })
                } else { return; }
            } else {
                if (!uye.roles.cache.has(ravgar?.tagRole)) { return; } else {
                    if (ravgar?.tagMode == true) {
                        uye.setRoles(ravgar?.unregisterRoles).catch(e => { });
                        if (log) log.send({ content: `${uye}, adlı üye **( ${ravgar?.tags.filter(a => uye.user.username.includes(a) || uye.user.discriminator == a.replace("#", "")).map(a => a).join(", ")} )** tagını kullanıcı adından silerek aramızdan ayrıldı!\n\n─────────────────\n\nÖnce ${oldUser.tag} | Sonra: ${newUser.tag}` })
                    } else {
                        let tagRol = guild.roles.cache.get(ravgar?.tagRole);
                        await uye.roles.remove(uye.roles.cache.filter(rol => tagRol.position <= rol.position));
                        if (log) log.send({ content: `${uye}, adlı üye **( ${ravgar?.tags.filter(a => uye.user.username.includes(a) || uye.user.discriminator == a.replace("#", "")).map(a => a).join(", ")} )** tagını kullanıcı adından silerek aramızdan ayrıldı!\n\n─────────────────\n\nÖnce ${oldUser.tag} | Sonra: ${newUser.tag}` })
                    }
                    if (user.Tagged) {
                        let taglayanData = await User.findOne({ userID: user.TaggedAuth }) || {}
                        if (taglayanData) {
                            let taglibul = taglayanData.find(e => e.id == uye.id)
                            if (taglibul) await User.updateOne({ userID: user.TaggedAuth }, { $pull: { "Taggeds": findUser } }, { upsert: true })
                            await Upstaff.updateOne({ guildID: guild.id, userID: user.TaggedAuth }, { $inc: { coin: -ravgar?.taggedCoin } }, { upsert: true });
                        }
                    }
                }
            }
        }
    }
}

module.exports = UserUpdate;