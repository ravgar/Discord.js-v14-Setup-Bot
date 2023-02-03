const { Event } = require("../../../../Global/Structures/Default.Events");
const chalk = require('chalk')

class ready extends Event {
    constructor(client) {
        super(client, {
            name: "ready",
            enabled: true,
        });
    }

    async onLoad() {
        setInterval(async () => {
            const guild = client.guilds.cache.get(system.Guild.ID)
            const ravgar = await ravgarcik.findOne({ guildID: system.Guild.ID })
            guild.invites.fetch().then((guildInvites) => {
                const cacheInvites = new Discord.Collection();
                guildInvites.map((inv) => {
                    cacheInvites.set(inv.code, { code: inv.code, uses: inv.uses, inviter: inv.inviter });
                });
                client.Invites.set(guild.id, cacheInvites);
            });
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
        const ravgar = await ravgarcik.findOne({ guildID: system.Guild.ID })
        if (ravgar) return;
        if (!ravgar) {
            new ravgarcik({
                guildID: system.Guild.ID,
                odemeGunu: Date.now()
            }).save()
        }
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
