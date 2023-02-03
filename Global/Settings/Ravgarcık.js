const mongoose = require("mongoose");

const Ravgarcık = mongoose.model('Ravgarcık', new mongoose.Schema({
    guildID: String,
    Founders: Array,
    guildURL: String,

    /* TAG */
    tags: Array,
    unTag: String,
    bannedTags: Array,

    /* Aç Kapa */
    tagMode: Boolean,
    staffMode: Boolean, 
    regMent: Boolean,
    underWorldSystem: Boolean,

    /* Kanallar */
    welcomeChannel: String,
    inviteLog: String,
    botVoiceChannel: String,
    chatChannel: String,
    stagramChannel: String,
    botCommands: Array,

    /* Upstaff */
    bannedChannels: Array, 
    staffRanks: Array,
    voiceCount: { type: Number, default: 5 },
    voiceCoin: { type: Number, default: 3 },
    messageCount: { type: Number, default: 5 }, 
    messageCoin: { type: Number, default: 3 },
    registerCoin: { type: Number, default: 3 },
    inviteCoin: { type: Number, default: 3 },
    taggedCoin: { type: Number, default: 3 },
    authCoin: { type: Number, default: 3 },

    /* Roller */
    registerHammer: Array,
    vmuteHammer: Array,
    muteHammer: Array,
    banHammer: Array,
    jailHammer: Array,
    foundingRoles: Array,

    jailedRole: String,
    vmutedRole: String,
    mutedRole: String,
    suspectRole: String,
    bannedTagRole: String,
    tagRole: String,
    vipRole: String,

    manRoles: Array,
    womanRoles: Array,
    unregisterRoles: Array,

    boosterRole: String,

    /* Yasaklı Tag */
    bannedTags: Array,

    /* Guvenli */
    Full: Array,
    RoleAddRemove: Array,
    Role: Array,
    Channel: Array,
    Emoji: Array,
    Chat: Array,

    /* Ozel Oda */
    ozelOdaVoice: String,
    ozelOdaText: String,

    /* Giriş Etiket */
    loginMentionChannel: Array,

    /* Kategori */
    supportCategory: String,
    registerParents: Array,
    streamerParents: Array,
    publicParents: Array,

    /* Market */
    ecoProduct: Array,

    /* Açma Kapamalı */
    chatGuard: Boolean,

    /* Haftalık Ödül */
    weeklyAuth: String,
    weeklyAuthLog: String,

    /* Odeme */
    payDay: Number,

}));

module.exports = Ravgarcık;
