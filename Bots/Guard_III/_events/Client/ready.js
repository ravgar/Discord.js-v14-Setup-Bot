const { Event } = require("../../../../Global/Structures/Default.Events");
const chalk = require('chalk');
const { roleBackup } = require('../../../../Global/Settings/Schemas');

class ready extends Event {
    constructor(client) {
        super(client, {
            name: "ready",
            enabled: true,
        });
    }

    async onLoad() {

        setInterval(async () => {
            const guild = await client.guilds.cache.get(system.Guild.ID)
            await roleBackup.deleteMany({});
            if (roleBackup) { await roleBackup.deleteMany({}); }
            guild.roles.cache.filter(r => r.name !== "@everyone" && !r.managed).forEach(async role => {
                let roleChannelOverwrites = [];
                guild.channels.cache.filter(c => c.permissionOverwrites.cache.has(role.id)).forEach(c => {
                    let channelPerm = c.permissionOverwrites.cache.get(role.id);
                    let pushlanacak = { id: c.id, allow: channelPerm.allow.toArray(), deny: channelPerm.deny.toArray() };
                    roleChannelOverwrites.push(pushlanacak);
                });
                await new roleBackup({
                    guildID: system.Guild.ID,
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
        }, 1000 * 60 * 60 * 24)

        setInterval(async () => {
            const ravgar = await ravgarcik.findOne({ guildID: system.Guild.ID })
            const voice = require("@discordjs/voice")
            const channel = client.channels.cache.get(ravgar?.botVoiceChannel);
            voice.joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
                selfMute: true,
            });
        }, 1000 * 3)

        _status(
            [
                { name: `Porno`, type: 3 }, // İzliyor
                { name: `Am şelalesini`, type: 2 },  // Dinliyor
                { name: `Sikiyle`, type: 0 },  // Bir oyun oynuyor
                { name: `ravgarcık`, type: 1, url: "https://twitch.tv/ravgar" }, // Twitch'de yayında
                { name: `31 Çekme`, type: 5 } // Yarışmada yarışıyor
            ],
            ["dnd", "online", "idle"],
            {
                on: false,
                activities: 5000,
                status: 30000
            }
        )
        console.log(`[${tarihsel(Date.now())}] ${chalk.green.bgHex('#2f3236')(`Başarıyla Giriş Yapıldı: ${client.user.tag}`)}`)


    }
}


function _status(activities, status, time) {
    if (!time.on) {
        client.user.setActivity(activities[3])
        client.user.setStatus(status[0])
    } else {
        let i = 0;
        setInterval(() => {
            if (i >= activities.length) i = 0
            client.user.setActivity(activities[i])
            i++;
        }, time.activities);

        let s = 0;
        setInterval(() => {
            if (s >= activities.length) s = 0
            client.user.setStatus(status[s])
            s++;
        }, time.status);
    }
}
module.exports = ready;