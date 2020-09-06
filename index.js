require('dotenv').config();
const ms = require('ms');
const fs = require('fs');
const remind = require('./reminders.json');
const { Client, MessageEmbed } = require('discord.js');
const client = new Client();
const prefix = process.env.PREFIX;
let time = 0;
let color = null;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
})

client.on('message', (msg) => {
    if(msg.author.id === '577006572362792989'){
        msg.react('750969705073999912');
    }

    if(msg.author.id === '285939193618890753'){
        msg.react('750970045751885865');
    }

    if(msg.author.id === '276273030177619968'){
        msg.react('751089272446124113');
    };

    if(msg.author.id === '428680925228957696'){
        msg.react('751128488638939217');
    };

    if(msg.content.toLowerCase() === `${prefix}invite`){
        const inviteEmbed = new MessageEmbed()
        .setTitle('Click here to invite this bot to your server.')
        .setURL('https://discord.com/api/oauth2/authorize?client_id=739816330580066335&permissions=85056&scope=bot')
        .setColor('BLUE');
        msg.channel.send(inviteEmbed);
    };
    
    if(msg.content.toLowerCase() === `${prefix}set`) {
        if(remind[msg.author.id]) return msg.channel.send('You are already in the reminder list.');
        remind[msg.author.id] = {
            'ppr': false,
            'ppm': false,
            'pph': false,
            'ppf': false,
            'pppetb': false,
            'pprl': false,
            'daily': false,
            'time': null
        };
        fs.writeFile('./reminders.json', JSON.stringify(remind, null , 2), (err) => {
            if(err)
            console.log(err);
        })
        msg.channel.send('Successfully added to the reminders list. Please use \`!config\` to set your reminders.');
        //console.log(remind);
    };

    if(remind[msg.author.id]){

    if(msg.content.toLowerCase() === `${prefix}config`){
        const embed = new MessageEmbed()
        .setDescription('This is your current configuration.\n \`false\` represents that the reminders are currently disabled for the corresponding command, and \`true\` represents that they are enabled.\n\`null\` in \`!set-timer\` represents that there is currently no custom raid timer set. The time shown is in seconds and you should also be using seconds while setting a custom timer for your raids.\nTo change it please use command listed, like \`!raid\`')
        .addFields(
            {name: 'Raid (\`!raid\`)', value: remind[msg.author.id]['ppr'], inline: true},
            {name: 'Mine (\`!mine\`)', value: remind[msg.author.id]['ppm'], inline: true},
            {name: 'Hunt (\`!hunt\`)', value: remind[msg.author.id]['pph'], inline: true},
            {name: 'Fish (\`!fish\`)', value: remind[msg.author.id]['ppf'], inline: true},
            {name: 'Pet Bonding (\`!petb\`)', value: remind[msg.author.id]['pppetb'], inline: true},
            {name: 'Roulette (\`!rl\`)', value: remind[msg.author.id]['pprl'], inline: true},
            {name: 'PP Daily(\`!daily\`)', value: remind[msg.author.id]['daily'], inline: true},
            {name: 'Custom Raid Timer (\`!set-time\`)', value: remind[msg.author.id]['time'], inline: true}
        )
        .setAuthor(`${msg.author.tag}`, `${msg.author.displayAvatarURL({format: 'png',dynamic: true})}`)
        .setColor('#d6204e')
        .setFooter(`${msg.author.id}`, `${msg.author.displayAvatarURL({format: 'png',dynamic: true})}`)
        .setTimestamp();
        msg.channel.send(embed);
    }

    if(msg.content.startsWith(`${prefix}set-time`)){
        const args = msg.content.trim().split(/ +/);
        const customTime = args[1];
        if (customTime){
        if(isNaN(customTime)) return msg.channel.send('Please provide with a correct time in seconds.');
        remind[msg.author.id]['time'] = customTime;
        msg.channel.send(`Set your raid reminder time to ${customTime} seconds. To reset it please use \`!set-time\``)
        }
        else{
            if(remind[msg.author.id]['time']){
            remind[msg.author.id]['time'] = null;
            msg.channel.send('Successfully resetted your custom raid time.');
        }} 
    }

    switch (msg.content.toLowerCase()){
        case `${prefix}raid`:
            config('ppr');
            break;
        case `${prefix}mine`:
            config('ppm');
            break;
        case `${prefix}hunt`:
            config('pph');
            break;
        case `${prefix}fish`:
            config('ppf');
            break;
        case `${prefix}petb`:
            config('pppetb');
            break;
        case `${prefix}daily`:
            config('daily');
            break;
        case `${prefix}rl`:
            config('pprl');
            break;

            
    }

    function config(m){
        if (remind[msg.author.id][m]){
            remind[msg.author.id][m] = false;
            fs.writeFile('./reminders.json', JSON.stringify(remind, null , 2), (err) => {
                if(err)
                console.log(err);
            })
            msg.channel.send(`Disabled reminders for ${m}.`);
            //console.log(remind);
        }
        else {
            remind[msg.author.id][m] = true;
            fs.writeFile('./reminders.json', JSON.stringify(remind, null , 2), (err) => {
                if(err)
                console.log(err);
            })
            msg.channel.send(`Enabled reminders for ${m}.`);
            //console.log(remind);
        } 
    }

    if(msg.content.toLowerCase() === 'ppdaily'){
        if(remind[msg.author.id]['daily']){
        const dailyTime = ms('24h')+100;
        const filter = m => m.author.id === '584895655609106437' && m.embeds[0];
        msg.channel.awaitMessages(filter, {max: 1, time: 5000, errors: ['time']})
        .then((collected) => {
            const ppmsg = collected.first();
            if (ppmsg.embeds[0].hexColor === '#bfdbff'){
            setTimeout(() => {
                msg.author.send(`Your **PP Daily** is ready now.`).catch(err => console.log(err));
            }, dailyTime);
        }})
        .catch(err => console.log(err));
    }}


    function reminder() {
        switch (msg.content.toLowerCase()){
            case 'ppr':
                if(!remind[msg.author.id]['time'])
                    time = 120100;
                else time = (remind[msg.author.id]['time']*1000)+100;
                color = '#ee558b';
                break;
            case 'ppm':
                time = 300100;
                color = '#1bb76e';
                break;
            case 'pph':
                time = 60100;
                color = '#ffcc4d';
                break;
            case 'ppf':
                time = 60100;
                color = '#55acee';
                break;
            case 'pppetb':
                time = (15*60*1000)+100;
                color = '#fc6464';
                break;
            case 'pprl':
                time = 3600100;
                color = '#bfdbff';
                break;
        }
            if (remind[msg.author.id][msg.content.toLowerCase()]){
            const filter = m => m.author.id === '584895655609106437' && m.embeds[0];
            msg.channel.awaitMessages(filter, {max: 1, time: 5000, errors: ['time']})
            .then((collected) => {
                const ppmsg = collected.first();
                if (ppmsg.embeds[0].hexColor === color){
                setTimeout(() => {
                    msg.reply(`**${msg.content.toLowerCase()}** is ready now.`);
                }, time);
            }})
            .catch(err => console.log(err));
        }
    }
    reminder();
}
       
})

client.login(process.env.TOKEN);
