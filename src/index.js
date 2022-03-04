const { Client, Intents } = require("discord.js");
const { config } = require("dotenv");
config();

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING,
        Intents.FLAGS.GUILD_MEMBERS,
    ],
});

/**
 *
 * @param {String} w
 * @param {String} v
 * @returns {Number}
 */
function levenshteinDistance(w, v) {
    if (w === v) return 0;
    let rows = new Array(w.length + 1);
    for (let j = 0; j <= w.length; j++) {
        rows[j] = new Array(v.length + 1);
        for (let i = 0; i <= v.length; i++) {
            if (!j) {
                if (!i) {
                    rows[j][i] = 0;
                } else {
                    rows[j][i] = rows[j][i - 1] + 1;
                }
            } else {
                if (!i) {
                    rows[j][i] = rows[j - 1][i] + 1;
                } else {
                    rows[j][i] = d(
                        rows[j][i - 1] + 1,
                        rows[j - 1][i] + 1,
                        rows[j - 1][i - 1],
                        w[j - 1] === v[i - 1],
                    );
                }
            }
        }
    }
    console.log(rows);
    return rows[w.length][v.length];
}

/**
 * @param {number} ins
 * @param {number} del
 * @param {number} sub
 * @param {boolean} eq
 * @returns {number}
 */
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

client.once("ready", () => {
    console.log("I'm ready!");
});

client.on("message", async msg => {
    if (msg.guild) {
        let array = msg.cleanContent.match(
            /https?:\/\/([a-zA-Z\d%]+\.)?([a-zA-Z\d%]+)\.[a-zA-Z\d%]+\/.*/,
        );
        if (array) {
            let str = array[2];
            console.log(array);

            let d = levenshteinDistance(str, "discord");
            let d1 = levenshteinDistance(str, "discordapp");
            let d2 = levenshteinDistance(str, "discordstatus");
            if (d1 < d) d = d1;
            if (d2 < d) d = d2;
            console.log(d);

            // link similar but not equal to something with discord
            if (d / str.length <= 0.5 && d) {
                console.log(msg.guild.id, d / str.length);
                /*
                msg.guild.members.fetch('316212656950476802').then(tim => {
                    tim.send(`Possible Phishing Attack! ${msg.channel}`);
                });
                */
                await msg.delete();
            }
        }
    }
});

client.login(process.env.BOT_TOKEN);
