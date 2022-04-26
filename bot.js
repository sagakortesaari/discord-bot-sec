import { createCommands, commands } from './commands.js'
import { VerifyDiscordRequest } from './helpers.js';
import express from 'express';
import {
    InteractionType,
    InteractionResponseType,
  } from 'discord-interactions';
import { Client, Intents } from 'discord.js'


const app = express();
const port = 3000;

///////////// REGULAR DISCORD BOT /////////////

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once('ready', () => {
    console.log('Ready!');
});

client.on("messageCreate", msg => {
    console.log(msg.content);
    if (msg.content === "ping") {
      msg.reply("pong");
    }
});

client.on("debug", d => {
    console.log(d);
});

client.login(process.env.DISCORD_TOKEN);

///////////// DISCORD INTERACTIONS (COMMANDS ETC) /////////////

// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

app.post('/interactions', (req, res) => {
    console.log("received request!")
    
    const { type, id, data } = req.body;

    if (type === InteractionType.PING) {
        return res.send({ type: InteractionResponseType.PONG });
    }

    if (type === InteractionType.APPLICATION_COMMAND) {
        console.log(req.body);

        if (data.name === 'test') {
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: 'hi there!'
                },
            });
        }

    }

    return res.status(200).send();
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)

    createCommands(process.env.APP_ID, process.env.GUILD_ID, commands);
}) 
