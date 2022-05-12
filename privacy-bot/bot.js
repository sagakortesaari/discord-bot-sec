import { createCommands, commands } from './commands.js'
import { VerifyDiscordRequest } from './helpers.js';
import express from 'express';
import {
    InteractionType,
    InteractionResponseType,
} from 'discord-interactions';
import { Client, Intents } from 'discord.js';
import * as fs from 'fs';

const app = express();
const port = 3000;

///////////// REGULAR DISCORD BOT /////////////

const saveMessagesInGuild = (guild) => {
    guild.channels.fetch().then(channels => {
        channels.forEach(channel => {
            if (channel.type == "GUILD_TEXT") {
                console.log(`Doing channel ${channel.name} in guild ${guild.name}`);
                channel.messages.fetch().then(messages => {
                    messages.forEach(async message => {
                        await fs.mkdir(`./messages/${guild.id}/`, { recursive: true }, (err) => {
                            if (err) throw err;
                        });

                        // Append message to file using fs
                        await fs.appendFile(`./messages/${guild.id}/${channel.id}.txt`, `[${message.author.id}:${message.author.tag}]: ${message.content}\n`, {
                            encoding: 'utf8',
                            flag: 'a'
                        }, (err) => {
                            if (err) throw err;
                        });
                    });
                });
            }
        });
    })
}

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once('ready', () => {
    console.log('Ready!');

    client.guilds.fetch("967858208599335013").then(async guild => {
        console.log(guild.name);
        await saveMessagesInGuild(guild);
    })
});

client.on("guildCreate", async guild => {
    // Get all messages in all channels and save to a file
    await saveMessagesInGuild(guild);
})

const saveMessage = async (msg) => {
    if (msg.channel.type == "GUILD_TEXT") {
        console.log("logging new msg from " + msg.author.username);
        // Append message to file using fs
        await fs.appendFile(`./messages/${msg.channel.guild.id}/${msg.channel.id}.txt`, `[${msg.author.id}:${msg.author.tag}]: ${msg.content}\n`, {
            encoding: 'utf8',
            flag: 'a'
        }, (err) => {
            if (err) throw err;
        });
    }
}

client.on("messageCreate", msg => {
    saveMessage(msg);
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

        const command = commands.find(c => c.command.name === data.name);
        command.callback(req.body, res);
    }

    if (type === InteractionType.APPLICATION_MODAL_SUBMIT) {
        console.log(req.body);

        const command = commands.find(c => c.modal_id === data.custom_id);
        command.modal_submit(req.body, res);
    }

    if (type == InteractionType.MESSAGE_COMPONENT) {
        console.log(req.body);

        const command = commands.find(c => c.message_id === data.custom_id);
        command.message_component_interaction(req.body, res);
    }

    return res.status(200).send();
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)

    createCommands(process.env.APP_ID, process.env.GUILD_ID, commands);
}) 