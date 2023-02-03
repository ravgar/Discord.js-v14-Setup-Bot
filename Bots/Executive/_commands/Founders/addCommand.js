
const { Command } = require("../../../../Global/Structures/Default.Commands");
const { CommandPerm } = require("../../../../Global/Settings/Schemas")
class AddCommand extends Command {
    constructor(client) {
        super(client, {
            name: "komutizin",
            description: "Bot içi bir komuta kullanabilmesi için rol ekleyebilirsiniz.",
            usage: "komutizin ekle/sil <Komut> <Rol>",
            category: "Founders",
            aliases: ["komuti", "izin", "komutizinekle"],
            enabled: true,
        });
    }


    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, ravgar) {
        if (!args[0]) return message.channel.send({ content: `UYARI: Lütfen bir argüman belirt! \`ekle - sil\`` }).sil(10)
        if (args[0] == "ekle") {
            if (!args[1]) return message.channel.send({ content: `UYARI: Lütfen bir komut ismi belirtin!` }).sil(10)
            let isimler = []
            global.commands.map(x => isimler.push(x.name))
            if (!isimler.includes(args[1])) return message.channel.send({ content: `UYARI: Lütfen listemde olan bir komut seç!` }).sil(10)
            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args.splice(2)[0]) || message.guild.roles.cache.find(r => r.name === args.splice(2).join(''));
            if (!role) return message.channel.send({ content: `UYARI: Lütfen bir rol belirtin!` }).sil(20)
            const control = await CommandPerm.findOne({ commandName: args[1] })
            if (control?.roleID.includes(role.id)) return message.channel.send({ content: `UYARI: Bu komuta zaten bu rol tanımlanmış. Silmek için \`.komutizin sil <Komut> <Rol>\`` }).sil(20)
            await CommandPerm.findOneAndUpdate({ commandName: args[1] }, { $push: { roleID: role.id } }, { upsert: true }).exec();
            message.channel.send({ content: `Tebrikler! Başarılı bir şekilde ${args[1]} komutuna <@&${role.id}> rolünü tanımladınız!` }).sil(50)
        } else if (args[0] == "sil") {
            if (!args[1]) return message.channel.send({ content: `UYARI: Lütfen bir komut ismi belirtin!` }).sil(10)
            let isimler = []
            global.commands.map(x => isimler.push(x.name))
            if (!isimler.includes(args[1])) return message.channel.send({ content: `UYARI: Lütfen listemde olan bir komut seç!` }).sil(10)
            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args.splice(2)[0]) || message.guild.roles.cache.find(r => r.name === args.splice(2).join(''));
            if (!role) return message.channel.send({ content: `UYARI: Lütfen bir rol belirtin!` }).sil(20)
            const control = await CommandPerm.findOne({ commandName: args[1] })
            if (!control?.roleID.includes(role.id)) return message.channel.send({ content: `UYARI: Bu komuta zaten bu rol tanımlanmamış. Tanımlamak için \`.komutizin ekle <Komut> <Rol>\`` }).sil(20)
            await CommandPerm.findOneAndUpdate({ commandName: args[1] }, { $pull: { roleID: role.id } }, { upsert: true }).exec();
            message.channel.send({ content: `Tebrikler! Başarılı bir şekilde ${args[1]} komutundan <@&${role.id}> rolünü kaldırdınız!` }).sil(50)
        }
    }
}

module.exports = AddCommand
