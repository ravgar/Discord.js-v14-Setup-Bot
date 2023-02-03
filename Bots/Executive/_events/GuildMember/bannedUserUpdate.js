const { Event } = require("../../../../Global/Structures/Default.Events");
const { User } = require("../../../../Global/Settings/Schemas");
class UserUpdate extends Event {
    constructor(client) {
        super(client, {
            name: "userUpdate",
            enabled: true,
        });
    }

    async onLoad(oldUser, newUser) {
        const guild = client.guilds.cache.get(system.Guild.ID);
        if (!guild) return;
        if (oldUser.username == newUser.username || oldUser.bot || newUser.bot) return;
        try {
            const ravgar = await ravgarcik.findOne({ guildID: system.Guild.ID });
            let guild = await (client.guilds.cache.get(system.Guild.ID));
            let uye = guild.members.cache.get(oldUser.id);
            const users = await User.findOne({ userID: uye.id })
            let yasaklitag = guild.roles.cache.get(ravgar?.bannedTagRole);
            let log = guild.channels.cache.find(x => x.name == "banned-log")
            if (oldUser.username != newUser.username || oldUser.tag != newUser.tag || oldUser.discriminator != newUser.discriminator) {
                if (ravgar.bannedTags.some(tag => newUser.tag.toLowerCase().includes(tag))) {
                    if (!uye.roles.cache.has(yasaklitag.id)) {
                        uye.setRoles(yasaklitag.id).catch(e => { });
                        uye.setNickname(`${ravgar?.unTag} Yasaklı Tag!`);
                        if (log) log.send({ content: `${uye}, adlı üye **( ${ravgar?.bannedTags.filter(a => uye.user.username.includes(a) || uye.user.discriminator == a.replace("#", "")).map(a => a).join(", ")} )** tagını kullanıcı adına ekleyerek yasaklı tag cezalısına atıldı!\n\n─────────────────\n\nÖnce: ${oldUser.tag} | Sonra: ${newUser.tag}` })
                    } else { return; }
                } else {
                    if (!uye.roles.cache.has(yasaklitag.id)) { return; } else {
                        if (users) {
                            if (ravgar?.tagMode == true && ravgar?.tags.some(x => !newUser.tag.includes(x))) {
                                uye.setRoles(ravgar?.unregisterRoles).catch(err => { })
                                uye.setNickname(`${ravgar?.unTag} İsim | Yaş`);
                                return;
                            }
                            if (users?.Gender == "Man") return uye.roles.add(ravgar?.ManRoles).catch(err => { })
                            if (users?.Gender == "Woman") return uye.roles.add(ravgar?.WomanRoles).catch(err => { })
                            await uye.setNickname(`${ravgar?.tags.some(x => uye.user.username.includes(x)) ? ravgar?.tags[0] : (ravgar?.unTag ? ravgar?.unTag : (ravgar?.tags[0] || ""))} ${users?.Name} | ${users?.Age}`);
                            return;
                        }
                        await uye.setRoles(ravgar?.unregisterRoles);
                        await uye.setNickname(`${ravgar?.tags.some(x => uye.user.username.includes(x))} İsim | Yaş`).catch(err => { })
                        if (log) log.send({ content: `${uye}, adlı üye **( ${ravgar?.bannedTags.filter(a => uye.user.username.includes(a) || uye.user.discriminator == a.replace("#", "")).map(a => a).join(", ")} )** tagını kullanıcı adından silerek yasaklı tagdan ayrıldı!\n\n─────────────────\n\nÖnce ${oldUser.tag} | Sonra: ${newUser.tag}` })

                    }
                }
            }
        } catch (e) {
            console.log("User Update Error" + e)
        }
    }
}

module.exports = UserUpdate;