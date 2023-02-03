const { Command } = require("../../../../Global/Structures/Default.Commands");
const { User } = require("../../../../Global/Settings/Schemas");
class Pm2 extends Command {
    constructor(client) {
        super(client, {
            name: "test",
            description: "-",
            usage: "-",
            category: "Guild",
            aliases: ["test"],
            enabled: true,
        });
    }


    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, ravgar) {
        const sik = await User.findOne({ userID: message.member.id })
        message.channel.send({ content: sik.AuthDate })
    }
}

module.exports = Pm2