let aylartoplam = { "01": "Ocak", "02": "Şubat", "03": "Mart", "04": "Nisan", "05": "Mayıs", "06": "Haziran", "07": "Temmuz", "08": "Ağustos", "09": "Eylül", "10": "Ekim", "11": "Kasım", "12": "Aralık" };
global.aylar = aylartoplam;

const tarihsel = global.tarihsel = function (tarih) {
  let tarihci = moment(tarih).tz("Europe/Istanbul").format("DD") + " " + global.aylar[moment(tarih).tz("Europe/Istanbul").format("MM")] + " " + moment(tarih).tz("Europe/Istanbul").format("YYYY HH:mm")
  return tarihci;
};

const moment = global.moment = require("moment");
require("moment-duration-format");
require("moment-timezone");
const Discord = global.Discord = require("discord.js");
const ravgarcik = global.ravgarcik = require("../Settings/Ravgarcık.js");
const system = global.system = require("../Settings/System");
const settings = global.settings = require("../Settings/System");

const createEnum = global.createEnum = function (keys) {
  const obj = {};
  for (const [index, key] of keys.entries()) {
    if (key === null) continue;
    obj[key] = index;
    obj[index] = key;
  }
  return obj;
}

const numberEmojis = global.numberEmojis = function (sayi) {
  let guild = client.guilds.cache.get(system.Guild.ID)
  var basamakbir = sayi.toString().replace(/ /g, "     ");
  var basamakiki = basamakbir.match(/([0-9])/g);
  basamakbir = basamakbir.replace(/([a-zA-Z])/g, "Belirlenemiyor").toLowerCase();
  if (basamakiki) {
    basamakbir = basamakbir.replace(/([0-9])/g, d => {
      return {
        "0": guild.findEmoji(system.Emojis.sifir),
        "1": guild.findEmoji(system.Emojis.bir),
        "2": guild.findEmoji(system.Emojis.iki),
        "3": guild.findEmoji(system.Emojis.uc),
        "4": guild.findEmoji(system.Emojis.dort),
        "5": guild.findEmoji(system.Emojis.bes),
        "6": guild.findEmoji(system.Emojis.alti),
        "7": guild.findEmoji(system.Emojis.yedi),
        "8": guild.findEmoji(system.Emojis.sekiz),
        "9": guild.findEmoji(system.Emojis.dokuz)
      }[d];
    });
  }
  return basamakbir;
}

Promise.prototype.sil = function (time) {
  if (this) this.then(message => {
    if (message.deletable)
      setTimeout(() => message.delete(), time * 1000)
  });
};

Discord.Collection.prototype.array = function () {
  return [...this.values()]
};

Discord.Guild.prototype.findEmoji = function (content) {
  let emoji = this.emojis.cache.find(e => e.name === content) || this.emojis.cache.find(e => e.id === content)
  if (!emoji) return client._logger.log(`${content} emojisi ${this.name} sunucusuna yüklenmediğinden kullanılamadı.`, "error");
  return emoji;
}

Discord.Guild.prototype.findChannel = function (chanelName) {
  let channel = this.channels.cache.find(k => k.name === chanelName)
  return channel;
}

Discord.GuildMember.prototype.setRoles = function (roles) {
  const newRoles = this.roles.cache.filter(x => x.managed).map(x => x.id).concat(roles);
  return this.roles.set(newRoles)
};

Discord.GuildMember.prototype.hasRole = function (role, every = true) {
  return (
    (Array.isArray(role) && ((every && role.every((x) => this.roles.cache.has(x))) || (!every && role.some((x) => this.roles.cache.has(x))))) || (!Array.isArray(role) && this.roles.cache.has(role))
  );
};

Discord.Guild.prototype.log = async function log(cezano, user, admin, tip, channelName) {
  let channel = this.channels.cache.find(x => x.name === channelName);
  let tur;
  if (tip === "Susturulma") tur = "metin kanallarından susturuldu!"
  if (tip === "Seste Susturulma") tur = "ses kanallarından susturuldu!"
  if (tip === "Cezalandırılma") tur = "cezalandırıldı!"
  if (tip === "Uyarılma") tur = "uyarıldı!"
  if (tip === "Yasaklanma") tur = "yasaklandı!"
  if (channel) {
    let embed = new Discord.EmbedBuilder()
      .setAuthor(channel.guild.name, channel.guild.iconURL({ dynamic: true, size: 2048 })).setColor("RANDOM")
      .setDescription(`${user} (\`#${cezano.No}\`) üyesi, <t:${Math.floor(Date.now() / 1000)}:R> **${cezano.Sebep}** nedeniyle ${tur}`)
      .setFooter({ text: "Created © by Ravgar." + ` • Ceza Numarası: #${cezano.No}`, iconURL: client.guild.iconURL({ dynamic: true }) })
    channel.send({ embeds: [embed] })
  }
}


const closeYt = global.closeYt = async function () {
  const { guildPerms } = require("../Settings/Schemas")
  let arr = [];
  let sunucu = client.guilds.cache.get(system.Guild.ID);
  if (!sunucu) return;
  const yetkiPermleri = [Discord.PermissionsBitField.Flags.Administrator, Discord.PermissionsBitField.Flags.ManageRoles, Discord.PermissionsBitField.Flags.ManageChannels, Discord.PermissionsBitField.Flags.ManageGuild, Discord.PermissionsBitField.Flags.BanMembers, Discord.PermissionsBitField.Flags.KickMembers]
  sunucu.roles.cache.filter(rol => rol.editable).filter(rol => yetkiPermleri.some(yetki => rol.permissions.has(yetki))).forEach(async (rol) => { arr.push({ rol: rol.id, perm: rol.permissions.bitfield.toString().replace('n', '') }); guildPerms.findOne({ guildID: system.Guild.ID }, async (err, res) => { let newData = new guildPerms({ guildID: system.Guild.ID, roller: arr }); newData.save(); }); rol.setPermissions(0n) });
}

const puni = global.puni = async function (id, type) {
  let uye = client.guilds.cache.get(system.Guild.ID).members.cache.get(id);
  if (!uye) return;

  if (type == "jail") {
      if (uye.voice.channel) await uye.voice.kick().catch(err => { })
      return await uye.roles.cache.has(ravgar?.boosterRolü) ? uye.roles.set([ravgar?.boosterRolü, ravgar?.jailRolü]).catch(err => { }) : uye.roles.set([ravgar?.jailRolü]).catch(err => { });
  }

  if (type == "ban") return await uye.ban({ reason: "ravgar Sikmiş Diyolar" }).catch(err => { })
};
