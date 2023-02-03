const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const mongoose = require('mongoose');
const { bgBlue, black, green } = require("chalk");
const fs = require('fs');
const ms = require("ms")
const dataLimit = new Map();
class RAVGAR extends Client {
    constructor(options) {
        /*
        * Client üzerine eklenebilcek özelliklere https://discord.js.org/#/docs/discord.js/main/typedef/ClientOptions
        * Sayfasından göz atabilirsiniz.
        * 
        * Token eklemek için String<token> şeklinde bir token ekleyebilirsiniz.
        * MongoURI eklemek için String<mongoURI> şeklinde bir mongoURI ekleyebilirsiniz.
        * Bot sahibini eklemek için Array<owners> şeklinde bir owner ekleyebilirsiniz.
        * Botunuza bir prefix eklemek için Array<prefix> şeklinde bir prefix ekleyebilirsiniz.
        * 
        * @param {Object} options
        * @returns {Promise<Client>}
        * 
        */
        super({
            options,
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
            ]
        })
        this._logger = require('../Additions/_console.additions');
        require('../Additions/_general.additions')
        this.token = options.token
        this.MongoURI = options.MongoURI
        this.prefix = options.prefix || [".", "!", "?"]
        this.owners = options.owners || ["311517508601380865"]
        this.ravgarcik = global.ravgarcik = require("../Settings/Ravgarcık")
        this.commands = new Collection()
        this.aliases = new Collection()
        this.slashcommands = new Collection()
        this.Invites = new Collection();
        this._dirname = options._dirname
        this.getUser = GetUser;
        async function GetUser(id) { try { return await this.users.fetch(id); } catch (error) { return undefined; } };

        const system = global.system = require("../Settings/System");
        const settings = global.settings = require("../Settings/System")

        this.on("disconnect", () => this._logger.log("Bot is disconnecting...", "disconnecting"))
            .on("reconnecting", () => this._logger.log("Bot reconnecting...", "reconnecting"))
            .on("error", (e) => this._logger.log(e, "error"))
            .on("warn", (info) => this._logger.log(info, "warn"));

        // process.on("unhandledRejection", (err) => { this._logger.log(err, "caution") });
        process.on("warning", (warn) => { this._logger.log(warn, "varn") });

        process.on("uncaughtException", err => {
            const hata = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
            console.error("Beklenmedik Hata: ", hata);
        });
    }

    async fetchEvents(active = true) {
        if (!active) return;
        let dirs = fs.readdirSync('./_events', { encoding: "utf8" });
        dirs.forEach(dir => {
            let files = fs.readdirSync(`../../Bots/${this._dirname}/_events/${dir}`, { encoding: "utf8" }).filter(file => file.endsWith(".js"));
            files.forEach(file => {
                const events = new (require(`../../Bots/${this._dirname}/_events/${dir}/${file}`))(client);
                if (events) events.on();
            });
        });
    }

    async connect(token = this.token) {
        if (!token) {
            this._logger.log(`${black.bgHex('#D9A384')(this._dirname.toUpperCase())} Tokeni girilmediğinden dolayı bot kapanıyor...`, "error");
            process.exit()
            return;
        }
        if (this.MongoURI) {
            await mongoose.connect(this.MongoURI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }).then(async (a) => {
                this._logger.log("MongoDB Bağlantısı Başarıyla Kuruldu.", "mongodb")
                await this.login(token)
                    .then(a => {

                    }).catch(err => {
                        console.log(err)
                        this._logger.log(`${black.bgHex('#D9A384')(this._dirname.toUpperCase())} Botun tokeni doğrulanamadı. 5 Saniye sonra tekrardan denenecektir...`, "reconnecting")
                        setTimeout(() => {
                            this.login().catch(ravgarizm => {
                                this._logger.log(`${black.bgHex('#D9A384')(this._dirname.toUpperCase())} => Bot tokeni tamamiyle doğrulanamadı.. Bot kapanıyor...`, "error")
                                process.exit()
                            })
                        }, 5000)
                    })
            }).catch(err => {
                this._logger.log("MongoDB Bağlantısı Başarısız.", "error")
                process.exit();
            })
        }
    }

    async safe(id, process = "İşlem Bulunamadı.") {
        const ravgarmis = await ravgarcik.findOne({ guildID: system.Guild.ID })
        const guild = this.guilds.cache.get(system.Guild.ID)
        let uye = this.guilds.cache.get(system.Guild.ID).members.cache.get(id);
        let full = ravgarmis?.Full || []
        let rolveral = ravgarmis?.RoleAddRemove || []
        let role = ravgarmis?.Role || []
        let channel = ravgarmis?.Channel || []
        let emoji = ravgarmis?.Emoji || []
        if (process == "EkleCikar") {
            if (uye.id === this.user.id || uye.id === guild.ownerId || full.some(g => g.includes(uye.id))) {
                return true
            } else if (rolveral.some(g => g.includes(uye.id))) {
                return this.limitChecker(uye, process);
            }
        } else if (process == "Rol") {
            if (uye.id === this.user.id || uye.id === guild.ownerId || full.some(g => g.includes(uye.id))) {
                return true
            } else if (role.some(g => g.includes(uye.id))) {
                return this.limitChecker(uye, process);
            }
        } else if (process == "Channel") {
            if (uye.id === this.user.id || uye.id === guild.ownerId || full.some(g => g.includes(uye.id))) {
                return true
            } else if (channel.some(g => g.includes(uye.id))) {
                return this.limitChecker(uye, process);
            }
        } else if (process == "Emoji") {
            if (uye.id === this.user.id || uye.id === guild.ownerId || full.some(g => g.includes(uye.id))) {
                return true
            } else if (emoji.some(g => g.includes(uye.id))) {
                return this.limitChecker(uye, process);
            }
        } else if (process == "full") {
            if (uye.id === this.user.id || uye.id === guild.ownerId || full.some(g => g.includes(uye.id))) {
                return true
            } else return false;
        } else if (this.system.Bot.Roots.some(x => x.id == id)) return true;
    }

    async limitChecker(uye, process = "İşlem Bulunamadı.") {
        let id = uye.id
        let limitController = dataLimit.get(id) || []
        let type = { _id: id, proc: process, date: Date.now() }
        limitController.push(type)
        dataLimit.set(id, limitController)
        setTimeout(() => { if (dataLimit.has(id)) { dataLimit.delete(id) } }, ms("10m"))

        if (limitController.length >= 12) {
            let loged = uye.guild.channels.cache.find(x => x.name == "guard-log");
            let taslak = `${uye} (\`${uye.id}\`) isimli güvenli listesinde ki yönetici anlık işlem uygulama nedeni ile "__${process}__" zoruyla cezalandırıldı.
\`\`\`fix
Son Anlık işlemler;
${limitController.map((x, index) => `${index + 1}. | ${x.proc} | <t:${Math.floor(x.date / 1000)}:R>`).join("\n")}
                \`\`\``
            if (loged) loged.send(taslak);
            await puni(uye.id, "Ban")
            return false
        } else {
            return true
        }
    }
    async dataChecker(newID, oldID) {
        const ravgarmis = await ravgarcik.findOne({ guildID: system.Guild.ID })

        // ROLE //
        if (ravgarmis?.manRoles.includes(oldID)) {
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $pull: { manRoles: oldID } }, { upsert: true }).exec();
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $push: { manRoles: newID } }, { upsert: true }).exec();
        }
        if (ravgarmis?.womanRoles.includes(oldID)) {
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $pull: { womanRoles: oldID } }, { upsert: true }).exec();
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $push: { womanRoles: newID } }, { upsert: true }).exec();
        }
        if (ravgarmis?.registerHammer.includes(oldID)) {
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $pull: { registerHammer: oldID } }, { upsert: true }).exec();
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $push: { registerHammer: newID } }, { upsert: true }).exec();
        }
        if (ravgarmis?.vmuteHammer.includes(oldID)) {
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $pull: { vmuteHammer: oldID } }, { upsert: true }).exec();
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $push: { vmuteHammer: newID } }, { upsert: true }).exec();
        }
        if (ravgarmis?.muteHammer.includes(oldID)) {
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $pull: { muteHammer: oldID } }, { upsert: true }).exec();
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $push: { muteHammer: newID } }, { upsert: true }).exec();
        }
        if (ravgarmis?.banHammer.includes(oldID)) {
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $pull: { banHammer: oldID } }, { upsert: true }).exec();
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $push: { banHammer: newID } }, { upsert: true }).exec();
        }
        if (ravgarmis?.jailHammer.includes(oldID)) {
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $pull: { jailHammer: oldID } }, { upsert: true }).exec();
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $push: { jailHammer: newID } }, { upsert: true }).exec();
        }
        if (ravgarmis?.foundingRoles.includes(oldID)) {
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $pull: { foundingRoles: oldID } }, { upsert: true }).exec();
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $push: { foundingRoles: newID } }, { upsert: true }).exec();
        }
        if (oldID == ravgarmis?.jailedRole) {
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $set: { jailedRole: newID } }, { upsert: true }).exec();
        }
        if (oldID == ravgarmis?.vmutedRole) {
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $set: { vmutedRole: newID } }, { upsert: true }).exec();
        }
        if (oldID == ravgarmis?.mutedRole) {
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $set: { mutedRole: newID } }, { upsert: true }).exec();
        }
        if (oldID == ravgarmis?.suspectRole) {
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $set: { suspectRole: newID } }, { upsert: true }).exec();
        }
        if (oldID == ravgarmis?.bannedTagRole) {
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $set: { bannedTagRole: newID } }, { upsert: true }).exec();
        }

        // CHANNEL //
        if (oldID == ravgarmis?.welcomeChannel) {
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $set: { welcomeChannel: newID } }, { upsert: true }).exec();
        } if (oldID == ravgarmis?.inviteLog) {
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $set: { inviteLog: newID } }, { upsert: true }).exec();
        } if (oldID == ravgarmis?.botVoiceChannel) {
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $set: { botVoiceChannel: newID } }, { upsert: true }).exec();
        } if (oldID == ravgarmis?.chatChannel) {
            await ravgarcik.findOneAndUpdate({ guildID: system.Guild.ID }, { $set: { chatChannel: newID } }, { upsert: true }).exec();
        }

    }
}

module.exports = { ravgar }