
const { Command } = require("../../../../Global/Structures/Default.Commands");
const axios = require("axios")
const cheerio = require("cheerio")
class Currency extends Command {
    constructor(client) {
        super(client, {
            name: "currency",
            description: "Anlık Döviz Bilgilerini Gösterir.",
            usage: "döviz",
            category: "Misc",
            aliases: ["döviz", "doviz", "dovız", "altın", "dolar", "euro", "eyro", "yuro", "altin"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, ravgar) {
        const data = await döviz()
        message.channel.send({ embeds: [
            embed.setDescription(`
Anlık döviz ekranına hoş geldiniz! Bu ekrandan anlık döviz kurlarını görebilirsiniz. 
            `)
            .setThumbnail("https://trthaberstatic.cdn.wp.trt.com.tr/resimler/1726000/doviz-piyasasi-trt-haber-1726491.jpg")
            .addFields([
                { name: 'Dolar Alış - Satış:', value: `${data.dolar.alis} - ${data.dolar.satis}` },
                { name: 'Euro Alış - Satış:', value: `${data.euro.alis} - ${data.euro.satis}` },
                { name: 'Gram Altın Alış - Satış:', value: `${data.graltin.alis} - ${data.graltin.satis}` },
            ])
        ] })
    }
}

module.exports = Currency

async function döviz() {
    let dolaralis;
    let dolarsatis;
    let dolaryenilenme;
    let euroalis;
    let eurosatis;
    let euroyenilenme;
    let altinalis;
    let altinsatis;
    let altinyenilenme;

    let response = await axios.get("https://dovizborsa.com/doviz/")
    let data = response.data
    const $ = cheerio.load(data);

    const dolartable = $('#\\34 35-1 > span.-g2.-d2._d2._x19');
    dolartable.each(function () {
        let title = $(this).text();
        dolaralis = title;
    });
    const dolaralistable = $('#\\34 35-1 > span.-g3.-d3._d3._x19');
    dolaralistable.each(function () {
        let title = $(this).text();
        dolarsatis = title;
    });
    const dolaryenilenmeable = $('#\\34 35-1 > span.-g5.-tm._tm.__c1');
    dolaryenilenmeable.each(function () {
        let title = $(this).text();
        dolaryenilenme = title;
    });

    const eurotable = $('#\\32 00-1 > span.-g2.-d2._d2._x19');
    eurotable.each(function () {
        let title = $(this).text();
        euroalis = title;
    });
    const euro2table = $('#\\32 00-1 > span.-g3.-d3._d3._x19');
    euro2table.each(function () {
        let title = $(this).text();
        eurosatis = title;
    });
    const euro3table = $('#\\32 00-1 > span.-g5.-tm._tm.__c1');
    euro3table.each(function () {
        let title = $(this).text();
        euroyenilenme = title;
    });

    let response2 = await axios.get("https://dovizborsa.com/altin")
    let data2 = response2.data
    const $2 = cheerio.load(data2);

    const altin1table = $2('#\\37 51-1 > span.-g2.-d2._d2._x19');
    altin1table.each(function () {
        let title = $(this).text();
        altinalis = title;
    });
    const altin2table = $2('#\\37 51-1 > span.-g3.-d3._d3._x19');
    altin2table.each(function () {
        let title = $(this).text();
        altinsatis = title;
    });
    const altin3table = $2('#\\37 51-1 > span.-g5.-tm._tm.__c1');
    altin3table.each(function () {
        let title = $(this).text();
        altinyenilenme = title;
    });

    
    return {
        "dolar": { "alis": dolaralis, "satis": dolarsatis, "yenilenme": dolaryenilenme },
        "euro": { "alis": euroalis, "satis": eurosatis, "yenilenme": euroyenilenme },
        "graltin": { "alis": altinalis, "satis": altinsatis, "yenilenme": altinyenilenme }
    }
}
