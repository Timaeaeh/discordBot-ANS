// @ts-check
import { Client, GatewayIntentBits } from "discord.js";
import levenshtein from "js-levenshtein";
await import("dotenv/config");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.GuildMembers,
    ],
});

client.once("ready", () => {
    console.log("I'm ready!");
});

client.on("messageCreate", async msg => {
    if (msg.guild) {
        const array = msg.cleanContent.match(
            /https?:\/\/([a-zA-Z\d%]+\.)?([a-zA-Z\d%]+)\.[a-zA-Z\d%]+\/.*/,
        );
        if (array) {
            const str = array[2];
            console.log(array);

            let d = levenshtein(str, "discord");
            const d1 = levenshtein(str, "discordapp");
            const d2 = levenshtein(str, "discordstatus");
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
