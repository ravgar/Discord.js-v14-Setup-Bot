const { Event } = require("../../../../Global/Structures/Default.Events");

class InviteDelete extends Event {
    constructor(client) {
        super(client, {
            name: "inviteDelete",
            enabled: true,
        });    
    }    

    async onLoad(invite) {
        setTimeout(async () => {
            invite.guild.invites.fetch().then((guildInvites) => {
                const cacheInvites = new Discord.Collection();
                guildInvites.map((inv) => {
                    cacheInvites.set(inv.code, { code: inv.code, uses: inv.uses, inviter: inv.inviter });
                });
                client.Invites.set(invite.guild.id, cacheInvites);
            });
        }, 5000)
    }
}    

module.exports = InviteDelete;