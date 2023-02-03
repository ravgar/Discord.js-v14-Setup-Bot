const { Client, ApplicationCommandType, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "rol",
    description: "Bu bir rol ver/al komutudur.",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'ver',
            description: 'Bununla sadece rol verebilirsin.',
            type: 1,
            options: [
                {
                    name: 'rol',
                    description: 'Verilecek rolü belirtmelisin.',
                    type: 8,
                    required: true
                },
                {
                    name: 'kişi',
                    description: 'Verilecek kişiyi belirtmelisin.',
                    type: 6,
                    required: true
                }
            ]
        },
        {
            name: 'al',
            description: 'Bununla sadece rolü alabilirsin.',
            type: 1,
            options: [
                {
                    name: 'rol',
                    description: 'Alınacak rolü belirtmelisin.',
                    type: 8,
                    required: true
                },
                {
                    name: 'kişi',
                    description: 'Alınacak kişiyi belirtmelisin.',
                    type: 6,
                    required: true
                }
            ]
        }
    ],

    onRequest: async (client, interaction, ravgar) => {
        if (!ravgar?.foundingRoles.some(x => interaction.member.roles.cache.has(x))) return interaction.reply({ content : `Yetkin Yok!`, ephemeral: true })
        if(interaction.options._subcommand === 'ver') {
            try {
                const member = interaction.guild.members.cache.get(interaction.options.get('kişi').value);
                const role = interaction.options.get('rol').role;
    
                await member.roles.add(role.id);
                const embed = new EmbedBuilder()
                .setTitle('Rol Eklendi!')
                .setDescription(`Başarıyla ${role} rolü ${member} kişisine verildi.`)
                .setColor('Green')
        
                return interaction.reply({ embeds: [embed], ephemeral: true })
            } catch {
                return interaction.reply({ content: `Başarısız! Belirlenen üyenin üzerine bir rol eklenemedi.`, ephemeral: true });
            }
        } else if(interaction.options._subcommand === "al") {
            try {
                const member = interaction.guild.members.cache.get(interaction.options.get('kişi').value);
                const role = interaction.options.get('rol').role;
    
                await member.roles.remove(role.id);
                const embed = new EmbedBuilder()
                .setTitle('Rol Kaldırıldı!')
                .setDescription(`Başarıyla ${role} rolü ${member} kişisinden geri alındı.`)
                .setColor('Red')
        
                return interaction.reply({ embeds: [embed], ephemeral: true })
            } catch {
                return interaction.reply({ content: `Başarısız! Belirlenen üyenin üzerinden bir rol alınamadı.`, ephemeral: true });
            }
        }
    }
};