const { Event } = require("../../../../Global/Structures/Default.Events");
const { User } = require("../../../../Global/Settings/Schemas")
class TagControl extends Event {
    constructor(client) {
        super(client, {
            name: "ready",
            enabled: true,
        });
    }

    async onLoad() {
        setInterval(() => { tagControl(); }, 600 * 1000);
        setInterval(() => { tagControl2(); }, 600 * 1000);
        setInterval(() => { tagControl3(); }, 600 * 1000);

        async function tagControl() {
            const guild = client.guilds.cache.get(system.Guild.ID)
            const ravgar = await ravgarcik.findOne({ guildID: guild.id })
            const members = guild.members.cache.filter(member => ravgar?.tags.some(x => member.user.tag.includes(x)) && !member.roles.cache.has(ravgar?.jailedRole) && !member.roles.cache.has(ravgar?.bannedTagRole) && !member.roles.cache.has(ravgar?.suspectRole) && !member.roles.cache.has(ravgar?.tagRole) && !member.user.bot).array().splice(0, 10)
            for await (const member of members) {
                await member.roles.add(ravgar?.tagRole)
                if (member.manageable) await member.setNickname(member.displayName.replace(ravgar?.unTag ? ravgar?.unTag : ravgar?.tags[0], ravgar?.tags[0]))
                guild.channels.cache.find(x => x.name == "tag-log").send({ content: `${member} (\`${member.id}\`) kişisinin isminde tagımız bulunduğu için otomatik olarak taglı rolü verilmiştir!` });
            }
        }

        async function tagControl2() {
            const guild = client.guilds.cache.get(system.Guild.ID)
            const ravgar = await ravgarcik.findOne({ guildID: guild.id })
            const members = guild.members.cache.filter(member => !ravgar?.tags.some(x => member.user.tag.includes(x)) && member.roles.cache.has(ravgar?.tagRole)).array().splice(0, 10)
            for await (const member of members) {
                await member.roles.remove(ravgar?.tagRole)
                if (member.manageable) await member.setNickname(member.displayName.replace(ravgar?.tags[0], ravgar?.unTag ? ravgar?.unTag : ravgar?.tags[0]))
                guild.channels.cache.find(x => x.name == "tag-log").send({ content: `${member} (\`${member.id}\`) kişisinin isminde tagımız bulunmadığı için otomatik olarak taglı rolü alınmıştır!` });
                const user = await User.findOne({ userID: member.id })
                if (user?.Tagged) {
                    let taglayanData = await User.findOne({ userID: user.TaggedAuth }) || {}
                    if (taglayanData) {
                        let taglibul = taglayanData.find(e => e.id == member.id)
                        if (taglibul) await User.updateOne({ userID: user.TaggedAuth }, { $pull: { "Taggeds": findUser } }, { upsert: true })
                        await Upstaff.updateOne({ guildID: guild.id, userID: user.TaggedAuth }, { $inc: { coin: -ravgar?.taggedCoin } }, { upsert: true });
                    }
                }
            }
        }

        async function tagControl3() {
            const guild = client.guilds.cache.get(system.Guild.ID)
            const ravgar = await ravgarcik.findOne({ guildID: guild.id })
            const members = guild.members.cache.filter(member => !ravgar?.tags.some(x => member.user.tag.includes(x)) && !member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !member.roles.cache.has(ravgar?.vipRole) && !member.roles.cache.has(ravgar?.boosterRole) && ravgar?.unregisterRoles.some(x => member.roles.cache.has(x))).array().splice(0, 10)
            for await (const member of members) {
                if (ravgar?.tagMode == true) {
                    await member.setRoles(ravgar?.unregisterRoles)
                    if (member.manageable) await member.setNickname(member.displayName.replace(ravgar?.tags[0], ravgar?.unTag ? ravgar?.unTag : ravgar?.tags[0]))
                    guild.channels.cache.find(x => x.name == "tag-log").send({ content: `${member} (\`${member.id}\`) kişisinin isminde tagımız bulunmadığı için otomatik olarak kayıtsıza atılmıştır! (Bu işlem sunucuda taglı sistem aktif olduğu için yapılmıştır.)` });
                    const user = await User.findOne({ userID: member.id })
                    if (user?.Tagged) {
                        let taglayanData = await User.findOne({ userID: user.TaggedAuth }) || {}
                        if (taglayanData) {
                            let taglibul = taglayanData.find(e => e.id == member.id)
                            if (taglibul) await User.updateOne({ userID: user.TaggedAuth }, { $pull: { "Taggeds": findUser } }, { upsert: true })
                            await Upstaff.updateOne({ guildID: guild.id, userID: user.TaggedAuth }, { $inc: { coin: -ravgar?.taggedCoin } }, { upsert: true });
                        }
                    }
                }
            }
        }
    }
}

module.exports = TagControl;

