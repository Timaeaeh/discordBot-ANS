const Discord = require('discord.js');
let client = new Discord.Client();
const {token} = require('./token.json');

/**
 * 
 * @param {String} w 
 * @param {String} v 
 * @returns {Number}
 */
function levenshteinDistance(w, v) {
    if (w == v) return 0;
    let rows = new Array(w.length + 1);
    for (let j = 0; j <= w.length; j++) {
        rows[j] = new Array(v.length + 1);
        for (let i = 0; i <= v.length; i++) {
            if (!j) {
                if (!i) {
                    rows[j][i] = 0;
                } else {
                    rows[j][i] = rows[j][i-1] + 1;
                }
            } else {
                if (!i) {
                    rows[j][i] = rows[j-1][i] + 1;
                } else {
                    rows[j][i] = d(rows[j][i-1] + 1, rows[j-1][i] + 1, rows[j-1][i-1], w[j-1] == v[i-1]);
                }
            }
        }
    }
    console.log(rows);
    return rows[w.length][v.length];
}

function d(ins, del, sub, eq) {
    if (!eq) sub++;
    if (ins < del) {
        if (ins < sub) return ins;
        else return sub;
    } else {
        if (del < sub) return del;
        else return sub;
    }
}

client.once('ready',() => {
    console.log('I\'m ready!');
});

client.on('message', (msg) => {
    if (msg.guild) {
        let array = msg.cleanContent.match(/https?:\/\/([a-zA-Z0-9%]+\.)?([a-zA-Z0-9%]+)\.[a-zA-Z0-9%]+\/.+/);
        if (array) {
            let str = array[2];
            console.log(array);
            
            let d = levenshteinDistance(str, "discord");
            let d1 = levenshteinDistance(str, "discordapp");
            let d2 = levenshteinDistance(str, "discordstatus");
            if (d1 < d) d = d1;
            if (d2 < d) d = d2;
            //console.log(d);
            
            // link similar but not equal to something with discord
            if (d / str.length <= 0.5 && d) {
                console.log(d / str.length);
                msg.guild.members.fetch('316212656950476802').then(tim => {
                    tim.send(`Possible Phishing Attack! ${msg.channel}`);
                });
                //msg.delete();
            }
        }
    }
});

client.login(token);
