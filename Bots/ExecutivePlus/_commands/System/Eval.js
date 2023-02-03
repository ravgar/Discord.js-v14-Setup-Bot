
const { Command } = require("../../../../Global/Structures/Default.Commands");
class Eval extends Command {
    constructor(client) {
        super(client, {
            name: "eval",
            description: "-",
            usage: "-",
            category: "Guild",
            aliases: ["eval"],
            enabled: true,
        });
    }


    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, ravgar) {
        if (!args[0]) return message.channel.send({ content : `Kod belirtilmedi!` });
        let code = args.join(' ');

        function clean(text) {
            if (typeof text !== 'string') text = require('util').inspect(text, { depth: 0 })
            text = text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203))
            return text;
        };
        try {
            var evaled = clean(await eval(code));
            if (evaled.match(new RegExp(`${client.token}`, 'g')));
            message.channel.send(`${evaled.replace(sistem.MODTOKEN, "YARRAMI YEEEEĞĞĞĞ!!!").replace(client.token, "YARRAMI YEEEEĞĞĞĞ!!!").replace(sistem.MongoURL, "mongodb://pornhub.com:27017/1080pFullHD").replace(sistem.STATTOKEN, "YARRAMI YEEEEĞĞĞĞ!!!").replace(sistem.MPLUSTOKEN, "YARRAMI YEEEEĞĞĞĞ!!!")}`, { code: "js", split: true });
        } catch (err) { message.channel.send(err, { code: "js", split: true }) };
    }
}

module.exports = Eval
