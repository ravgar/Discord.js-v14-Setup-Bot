const { Event } = require("../../../../Global/Structures/Default.Events");

class GuildCreate extends Event {
    constructor(client) {
        super(client, {
            name: "guildCreate",
            enabled: true,
        });    
    }    

    async onLoad(guild) {
        guild.invites.fetch().then((guildInvites) => {
            const cacheInvites = new Collection();
            guildInvites.map((inv) => {
                cacheInvites.set(inv.code, { code: inv.code, uses: inv.uses, inviter: inv.inviter });
            });
            client.Invites.set(guild.id, cacheInvites);
        });
    }
}    

module.exports = GuildCreate;