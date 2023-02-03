const { Event } = require("../../../../Global/Structures/Default.Events");
const { voiceUser, voiceGuild, messageGuild, messageUser } = require("../../../../Global/Settings/Schemas")
const { CronJob } = require("cron");
const Ravgarcık = require("../../../../Global/Settings/Ravgarcık");
const System = require("../../../../Global/Settings/System");
class DeleteStat extends Event {
    constructor(client) {
        super(client, {
            name: "ready",
            enabled: true,
        });
    }

    async onLoad() {
        const guild = client.guilds.cache.get(System.Guild.ID)
        const ravgar = await Ravgarcık.findOne({ guildID: guild.id })
        const control = new CronJob("59 23 * * 0", async() => {
            if (!ravgar?.weeklyAuth) return;
            let log = client.channels.cache.get(ravgar?.weeklyAuthLog)
            guild.roles.cache.get(ravgar?.weeklyAuth).members.map(x => {
                x.roles.remove(ravgar?.weeklyAuth).catch(err => console.log("HAFTALIK LİDER ROLÜ TEMİZLENİRKEN BİR HATA OLUŞTU!" + err))
            })
            const weeklyLeaderVoice = await voiceUser.find({ guildID: guild.id }).sort({ weeklyStat: -1 })
            const weeklyLeaderMessage = await messageUser.find({ guildID: guild.id }).sort({ weeklyStat: -1 });
            weeklyLeaderVoice.filter((a) => guild.members.cache.get(a.userID)).splice(0, 1).map((x, index) => {
                const member = guild.members.cache.get(x.userID)
                member.roles.add(ravgar?.weeklyAuth).catch(err => console.log("HAFTALIK LİDER ROLÜ VERİLİRKEN HATA OLUŞTU" + err))
                if (log) log.send({ content: `${member} (\`${member.id}\`) kişisi bu hafta **Ses** kategorisinde 1. olarak ${guild.roles.cache.get(ravgar?.weeklyAuth).name} rolünü kazandı! Emeklerin için teşekkürler!` })
            })
            weeklyLeaderMessage.filter((a) => message.guild.members.cache.get(a.userID)).splice(0, 1).map((x, index) => {
                const member = guild.members.cache.get(x.userID)
                member.roles.add(ravgar?.weeklyAuth).catch(err => console.log("HAFTALIK LİDER ROLÜ VERİLİRKEN HATA OLUŞTU" + err))
                if (log) log.send({ content: `${member} (\`${member.id}\`) kişisi bu hafta **Mesaj** kategorisinde 1. olarak ${guild.roles.cache.get(ravgar?.weeklyAuth).name} rolünü kazandı! Emeklerin için teşekkürler!` })
            })
        }, null, true, "Europe/Istanbul");
        control.start();

        const weekly = new CronJob("0 0 * * 0", () => {
            client.guilds.cache.forEach(async (guild) => {
                await messageGuild.findOneAndUpdate({ guildID: guild.id }, { $set: { weeklyStat: 0 } });
                await voiceGuild.findOneAndUpdate({ guildID: guild.id }, { $set: { weeklyStat: 0 } });
                await messageUser.findOneAndUpdate({ guildID: guild.id }, { $set: { weeklyStat: 0 } });
                await voiceUser.findOneAndUpdate({ guildID: guild.id }, { $set: { weeklyStat: 0 } });
            });
        }, null, true, "Europe/Istanbul");
        weekly.start();
    }
}

module.exports = DeleteStat;