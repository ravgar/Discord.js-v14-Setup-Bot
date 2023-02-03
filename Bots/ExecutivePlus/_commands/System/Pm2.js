const { Command } = require("../../../../Global/Structures/Default.Commands");
const children = require("child_process");
class Pm2 extends Command {
    constructor(client) {
        super(client, {
            name: "pm2",
            description: "-",
            usage: "-",
            category: "Guild",
            aliases: ["pm2"],
            enabled: true,
        });
    }


    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, ravgar) {
        const ls = children.exec(`pm2 ${args.join(' ')}`);
        ls.stdout.on('data', async function (data) {
            const arr = await client.splitMessage(data, { maxLength: 1950, char: "\n" }).then(x => x);
            arr.forEach(datas => {
                message.channel.send({ content: `\`\`\`js\n${datas}\`\`\`` })
            })
        });
    }
}

module.exports = Pm2