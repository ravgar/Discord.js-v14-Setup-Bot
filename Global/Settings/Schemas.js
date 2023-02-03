const mongoose = require("mongoose");

const talentPerms = mongoose.model("talentPerms", mongoose.Schema({
    guildID: String,
    komutAd: String,
    verilcekRol: Array,
    YetkiliRol: Array
}))

const Menus = mongoose.model("Menus", mongoose.Schema({
    Name: String,
    Roles: Array,
    Text: String,
    Secret: String,
    Secim: String,
    Date: Date,
    Author: String,
    All: { type: Boolean, default: false }
}))

const User = mongoose.model("User", mongoose.Schema({
    guildID: String,
    userID: String,
    Name: String,
    Age: String,
    Gender: String,
    Names: Array,
    Confs: Array,

    Tagged: { type: Boolean, default: false },
    TaggedAuth: String,
    TaggedDate: String,
    Taggeds: { type: Object },

    Auth: { type: Boolean, default: false },
    AuthAuth: String,
    AuthDate: String,
    Auths: { type: Object },

    UseMute: { type: Number, default: 0 },
    UseVMute: { type: Number, default: 0 },
    UseJail: { type: Number, default: 0 },
    UseBan: { type: Number, default: 0 },

    Inviter: Object,
}))

const Upstaff = mongoose.model("Upstaff", mongoose.Schema({
    guildID: { type: String, default: "" },
    userID: { type: String, default: "" },
    coin: { type: Number, default: "" },
    ToplamPuan: { type: Number, default: "" },
    Baslama: Date,
    Gorev: String,
    GorevDurum: Boolean,
    GorevTip: String,
    GorevAdet: Number,
    YapilanGorev: Number,
    ToplamGorev: Number,

    Sorumluluk: String,
    SorumlulukDurum: Boolean,
    SorumlulukTip: String,
    SorumlulukAdet: Number,
    YapilanSorumluluk: Number,
    ToplamSorumluluk: Number,

    messageStat: { type: Number, default: 0 },
    voiceStat: { type: Number, default: 0 },
    inviteStat: { type: Number, default: 0 },
}))

const VMute = mongoose.model('Voicemute', new mongoose.Schema({
    No: Number,
    userID: String,
    Kalkma: String
}));

const Mute = mongoose.model('Mute', new mongoose.Schema({
    No: Number,
    userID: String,
    Kalkma: String
}));

const Jail = mongoose.model('Jail', new mongoose.Schema({
    No: Number,
    userID: String,
    Kalkma: String
}));

const Invites = mongoose.model("Invite", new mongoose.Schema({
    guildID: { type: String, default: "" },
    userID: { type: String, default: "" },
    total: { type: Number, default: 0, min: 0 },
    regular: { type: Number, default: 0, min: 0 },
    bonus: { type: Number, default: 0, min: 0 },
    leave: { type: Number, default: 0, min: 0 },
    fake: { type: Number, default: 0, min: 0 },
}));

const Afk = mongoose.model('Afk', new mongoose.Schema({
    _id: String,
    reason: String,
    date: String
}));

const messageUserChannel = mongoose.model('messageUserChannel', new mongoose.Schema({
    guildID: String,
    userID: String,
    channelID: String,
    channelData: { type: Number, default: 0 },
}));

const messageGuild = mongoose.model('messageGuild', new mongoose.Schema({
    guildID: String,
    topStat: { type: Number, default: 0 },
    weeklyStat: { type: Number, default: 0 },
}));

const messageGuildChannel = mongoose.model('messageGuildChannel', new mongoose.Schema({
    guildID: String,
    channelID: String,
    channelData: { type: Number, default: 0 },
}));

const messageUser = mongoose.model('messageUser', new mongoose.Schema({
    guildID: String,
    userID: String,
    topStat: { type: Number, default: 0 },
    weeklyStat: { type: Number, default: 0 },
}));

const voiceGuild = mongoose.model('voiceGuild', new mongoose.Schema({
    guildID: String,
    topStat: { type: Number, default: 0 },
    weeklyStat: { type: Number, default: 0 },
}));

const voiceGuildChannel = mongoose.model('voiceGuildChannel', new mongoose.Schema({
    guildID: String,
    channelID: String,
    channelData: { type: Number, default: 0 },
}));

const voiceJoinedAt = mongoose.model('voiceJoinedAt', new mongoose.Schema({
    userID: String,
    date: Number,
}));

const voiceUser = mongoose.model('voiceUser', new mongoose.Schema({
    guildID: String,
    userID: String,
    topStat: { type: Number, default: 0 },
    weeklyStat: { type: Number, default: 0 },
    lastSeen: Number
}));

const voiceUserChannel = mongoose.model('voiceUserChannel', new mongoose.Schema({
    guildID: String,
    userID: String,
    channelID: String,
    channelData: { type: Number, default: 0 },
}));

const Punitives = mongoose.model('Punitive', new mongoose.Schema({
    No: Number,
    Uye: String,
    Yetkili: String,
    Tip: String,
    Sebep: String,
    AtilanSure: String,
    Kalkma: Date,
    Tarih: Date,
    Bitis: Date,
    Kaldiran: String,
    Aktif: { type: Boolean, default: true },
}));

const Snipe = mongoose.model('Snipe', new mongoose.Schema({
    channelID: String,
    yazar: String,
    yazilmaTarihi: String,
    silinmeTarihi: String,
    dosya: Boolean,
    icerik: String
}));

const AuditRole = mongoose.model("AuditRole", new mongoose.Schema({
    user: String,
    roller: Array
}));

const guildPerms = mongoose.model('guildPerms', new mongoose.Schema({
    guildID: String,
    roller: Array
}));

const roleBackup = mongoose.model('roleBackup', new mongoose.Schema({
    roleID: String,
    name: String,
    color: String,
    hoist: Boolean,
    position: String,
    permissions: String,
    mentionable: Boolean,
    time: Number,
    members: Array,
    channelOverwrites: Array
}));

const channelBackup = mongoose.model('channelBackup', new mongoose.Schema({
    channelID: String,
    name: String,
    parentID: String,
    position: Number,
    permissionOverwrites: Array,
    nsfw: Boolean,
    rateLimitPerUser: Number,
    type: String,
    topic: String,
    time: Number,
    userLimit: Number,
    bitrate: Number,
}))

const Stagram = mongoose.model('Stagram', new mongoose.Schema({
    userID: String,
    Status: Boolean,
    UserName: String,
    Picture: String,
    Date: Date,
    comMode: Boolean,
    LastPost: Date,
    PostLikers: Array,
    Post: String,
    PostLike: Number,
    TopLike: Number,
    Followers: Array,
    FollowersNumber: Number,
}));

const PrivRoom = mongoose.model('PrivRoom', new mongoose.Schema({
    userID: String,
    vChannelID: String,
    tChannelID: String,
    leaveDate: { type: Number, default: Date.now() }
}))

const Economy = mongoose.model('Economy', new mongoose.Schema({
    userID: String,
    coin: { type: Number, default: 0 },
    dailyCoin: { type: Number, default: 0 },
    transfer: { type: Object },
}))

const OldChannels = mongoose.model('OldChannels', new mongoose.Schema({
    guildID: String,
    channelID: String,
    name: String,
    parentID: String,
    position: Number,
    permissionOverwrites: Array,
    nsfw: Boolean,
    rateLimitPerUser: Number,
    type: String,
    topic: String,
    time: Number,
    userLimit: Number,
    bitrate: Number,
}))

const OldRoles = mongoose.model('OldRoles', new mongoose.Schema({
    guildID: String,
    roleID: String,
    name: String,
    color: String,
    hoist: Boolean,
    position: String,
    permissions: String,
    mentionable: Boolean,
    time: Number,
    members: Array,
    channelOverwrites: Array
}))

const GiveAways = mongoose.model('GiveAways', new mongoose.Schema({
    messageID: String,
    katilan: Array,
    time: String,
}))

const CommandPerm = mongoose.model('CommandPerm', new mongoose.Schema({
    commandName: String,
    roleID: Array,
}))


module.exports = {
    talentPerms, Menus, User, VMute, Mute, Jail, Invites, Afk,
    messageUserChannel, messageGuild, messageGuildChannel, messageUser,
    voiceGuild, voiceGuildChannel, voiceJoinedAt, voiceUser, voiceUserChannel,
    Punitives, Upstaff, Snipe, AuditRole, guildPerms, roleBackup, channelBackup,
    Stagram, PrivRoom, Economy, OldChannels, OldRoles, GiveAways, CommandPerm
}
