const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const mongoose = require('mongoose');
const { bgBlue, black, green } = require("chalk");
const fs = require('fs');
const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);
const { Punitives } = require("../Settings/Schemas")

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
        this.commands = global.commands = new Collection()
        this.aliases = new Collection()
        this.slashcommands = global.slashcommands = new Collection()
        this.Invites = new Collection();
        this._dirname = options._dirname
        this.getUser = GetUser;
        async function GetUser(id) { try { return await this.users.fetch(id); } catch (error) { return undefined; } };
        // Limit
        this.banLimit = new Map();
        this.banSure = new Map();

        this.jailLimit = new Map();
        this.jailSure = new Map();

        this.vmuteLimit = new Map();
        this.vmuteSure = new Map();

        this.cmuteLimit = new Map();
        this.cmuteSure = new Map();
        // Limit
        const system = global.system = require("../Settings/System");
        const settings = global.settings = require("../Settings/System")

        this.on("disconnect", () => this._logger.log("Bot is disconnecting...", "disconnecting"))
            .on("reconnecting", () => this._logger.log("Bot reconnecting...", "reconnecting"))
            // .on("error", (e) => this._logger.log(e, "error"))
            .on("warn", (info) => this._logger.log(info, "warn"));

        // process.on("unhandledRejection", (err) => { this._logger.log(err, "caution") });
        process.on("warning", (warn) => { this._logger.log(warn, "varn") });

        process.on("uncaughtException", err => {
            const hata = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
            console.error("Beklenmedik Hata: ", hata);
        });
    }

    async fetchCommands(active = true, slash = false) {

        if (slash) {
            const slashcommands = await globPromise(`../../Bots/${this._dirname}/_commands/_slashcommands/*/*.js`);
            const arrSlash = [];
            slashcommands.map((value) => {
                const file = require(value);
                if (!file?.name) return;
                this.slashcommands.set(file.name, file);

                if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
                arrSlash.push(file);

            });
            this.on("ready", async () => {
                client.guilds.cache.map(async (x) => {
                    x.commands.set(arrSlash);
                })
                this._logger.log(`${arrSlash.length} Slash Command(s) loaded.`, "ready")
            })
        }
        if (!active) return;
        let dirs = fs.readdirSync("./_commands", { encoding: "utf8" });
        this._logger.log(`${black.bgHex('#D9A384')(this._dirname.toUpperCase())} ${dirs.length} category in client loaded.`, "category");
        dirs.forEach(dir => {
            let files = fs.readdirSync(`../../Bots/${this._dirname}/_commands/${dir}`, { encoding: "utf8" }).filter(file => file.endsWith(".js"));
            this._logger.log(`${black.bgHex('#D9A384')(this._dirname.toUpperCase())} ${files.length} commands loaded in ${dir} category.`, "load");
            files.forEach(file => {
                const cmd = new (require(`../../Bots/${this._dirname}/_commands/${dir}/${file}`))(client);
                if (cmd) cmd.on()
            });
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

    async puniPu(memberID) {
        let res = await Punitives.find({ Uye: memberID })
        if (!res) return 0
        let filArray = res.map(x => (x.Tip))
        let Mute = filArray.filter(x => x == "Susturulma").length || 0
        let VMute = filArray.filter(x => x == "Seste Susturulma").length || 0
        let Jail = filArray.filter(x => x == "Cezalandırılma").length || 0
        let Ban = filArray.filter(x => x == "Yasaklanma").length || 0
        // let Warn = filArray.filter(x => x == "Uyarılma").length || 0
        let cezaPuanı = (Mute * 5) + (VMute * 8) + (Jail * 15) + (Ban * 30)
        return cezaPuanı;
    }

    async splitMessage(text, { maxLength = 2_000, char = '\n', prepend = '', append = '' } = {}) {

        if (text.length <= maxLength) return [text];
        let splitText = [text];
        if (Array.isArray(char)) {
            while (char.length > 0 && splitText.some(elem => elem.length > maxLength)) {
                const currentChar = char.shift();
                if (currentChar instanceof RegExp) {
                    splitText = splitText.flatMap(chunk => chunk.match(currentChar));
                } else {
                    splitText = splitText.flatMap(chunk => chunk.split(currentChar));
                }
            }
        } else {
            splitText = text.split(char);
        }
        if (splitText.some(elem => elem.length > maxLength)) throw new RangeError('SPLIT_MAX_LEN');
        const messages = [];
        let msg = '';
        for (const chunk of splitText) {
            if (msg && (msg + char + chunk + append).length > maxLength) {
                messages.push(msg + append);
                msg = prepend;
            }
            msg += (msg && msg !== prepend ? char : '') + chunk;
        }
        return messages.concat(msg).filter(m => m);
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

}

module.exports = { RAVGAR }