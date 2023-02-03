const { Event } = require("../../../../Global/Structures/Default.Events");

class VoiceLog extends Event {
    constructor(client) {
        super(client, {
            name: "voiceStateUpdate",
            enabled: true,
        });    
    }    

    async onLoad(oldState, newState) {
        let logKanali = newState.guild.channels.cache.find(x => x.name == "voice-log")
        if (!logKanali) return;
        if (!oldState.channelId && newState.channelId) return logKanali.send(`\`${newState.guild.members.cache.get(newState.id).displayName} (${newState.id})\` üyesi \`${newState.guild.channels.cache.get(newState.channelId).name}\` adlı sesli kanala **katıldı!**`).catch();
        if (oldState.channelId && !newState.channelId) return logKanali.send(`\`${newState.guild.members.cache.get(newState.id).displayName} (${newState.id})\` üyesi \`${newState.guild.channels.cache.get(oldState.channelId).name}\` adlı sesli kanaldan **ayrıldı!**`).catch();
        if (oldState.channelId && newState.channelId && oldState.channelId != newState.channelId) return logKanali.send(`\`${newState.guild.members.cache.get(newState.id).displayName} (${newState.id})\` üyesi ses kanalını **değiştirdi!** (\`${newState.guild.channels.cache.get(oldState.channelId).name}\` => \`${newState.guild.channels.cache.get(newState.channelId).name}\`)`).catch();
        if (oldState.channelId && oldState.selfMute && !newState.selfMute) return logKanali.send(`\`${newState.guild.members.cache.get(newState.id).displayName} (${newState.id})\` üyesi \`${newState.guild.channels.cache.get(newState.channelId).name}\` adlı sesli kanalda kendi susturmasını **kaldırdı!**`).catch();
        if (oldState.channelId && !oldState.selfMute && newState.selfMute) return logKanali.send(`\`${newState.guild.members.cache.get(newState.id).displayName} (${newState.id})\` üyesi \`${newState.guild.channels.cache.get(newState.channelId).name}\` adlı sesli kanalda kendini **susturdu!**`).catch();
        if (oldState.channelId && oldState.selfDeaf && !newState.selfDeaf) return logKanali.send(`\`${newState.guild.members.cache.get(newState.id).displayName} (${newState.id})\` üyesi \`${newState.guild.channels.cache.get(newState.channelId).name}\` adlı sesli kanalda kendi sağırlaştırmasını **kaldırdı!**`).catch();
        if (oldState.channelId && !oldState.selfDeaf && newState.selfDeaf) return logKanali.send(`\`${newState.guild.members.cache.get(newState.id).displayName} (${newState.id})\` üyesi \`${newState.guild.channels.cache.get(newState.channelId).name}\` adlı sesli kanalda kendini **sağırlaştırdı!**`).catch();
    }
}    

module.exports = VoiceLog;