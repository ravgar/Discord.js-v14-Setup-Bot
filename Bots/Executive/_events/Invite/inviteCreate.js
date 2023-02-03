const { Event } = require("../../../../Global/Structures/Default.Events");

class InviteCreate extends Event {
    constructor(client) {
        super(client, {
            name: "inviteCreate",
            enabled: true,
        });    
    }    

    async onLoad(invite) {
        invite.guild.invites.fetch().then((guildInvites) => {
            const cacheInvites = new Discord.Collection();
            guildInvites.map((inv) => {
                cacheInvites.set(inv.code, { code: inv.code, uses: inv.uses, inviter: inv.inviter });
            });
            client.Invites.set(invite.guild.id, cacheInvites);
        });
    }
}    

module.exports = InviteCreate;