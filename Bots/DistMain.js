const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
let Bots = global.bots = []
module.exports = Bots
system.Tokens.DistTokens.forEach(token => {
    let clients = new Client({
        fetchAllMembers: true,
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildEmojisAndStickers,
            GatewayIntentBits.GuildIntegrations,
            GatewayIntentBits.GuildWebhooks,
            GatewayIntentBits.GuildInvites,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildPresences,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildMessageTyping,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.DirectMessageReactions,
            GatewayIntentBits.DirectMessageTyping,
            GatewayIntentBits.MessageContent
        ],
        partials: [
            Partials.Channel,
            Partials.Message,
            Partials.User,
            Partials.GuildMember,
            Partials.Reaction
        ],
        presence: {
            status: "invisible"
        },
    });
    clients.on("ready", () => {
        Bots.push(clients);
    })
    async function urlSpam() {
        const ravgarcik = require("../Global/Settings/Ravgarcık")
        const ravgar = await ravgarcik.findOne({ guildID: system.Guild.ID });
        const log = clients.channels.cache.find(x => x.name == "guard-log");
        const request = require('request');
        const guild = clients.guilds.cache.get(system.Guild.ID)
        const owner = guild.ownerId
        if (!guild) return;
        if (!ravgar?.guildURL) return;
        if (guild.vanityURLCode && (guild.vanityURLCode == ravgar?.guildURL)) return;
        if (!log) {
            owner.send({ embeds: [new Discord.EmbedBuilder().setDescription(`URL Değiştirildi. Kontrolüme Takıldı ve Bende Tekrardan URL'yi geri aldım.`)] }).catch(err => console.log("URL DEĞİŞTİ AMA SUNUCU SAHİBİNE MESAJ GÖNDEREMEDİM!"))
        } else {
            clients.channels.cache.find(x => x.name == "guard-log").send({ content: `@everyone`, embeds: [new Discord.EmbedBuilder().setDescription(`URL Değiştirildi. Kontrolüme Takıldı ve Bende Tekrardan URL'yi geri aldım.`)] })
        }
        request({ url: `https://discord.com/api/v6/guilds/${guild.id}/vanity-url`, body: { code: ravgar?.guildURL }, json: true, method: 'PATCH', headers: { "Authorization": `Bot ${token}` } }, (err, res, body) => { if (err) { console.log("Malesef Fonksiyon Çalışmadı...") } });
    }
    clients.on("ready", async () => {
        const guild = clients.guilds.cache.get(system.Guild.ID)
        if (guild.premiumTier == 3) {
            setInterval(() => {
                urlSpam();
            }, 1000 * 5);
        }
    })

    clients.login(token).then(e => {
    }).catch(e => {
        console.log(`${token.substring(Math.floor(token.length / 2))} giriş yapamadı.`);
    });
});
