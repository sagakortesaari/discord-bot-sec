import { InteractionResponseType } from "discord-interactions";
import { DiscordRequest } from "./helpers.js"

export function createCommands(appId, guildId, commands) {
    // API endpoint for creating slash commands
    const endpoint = `applications/${appId}/guilds/${guildId}/commands`

    commands.forEach(command => {
        DiscordRequest(endpoint, "POST", command.command).then(r => r.json().then(obj => console.log(obj)));
    })
}

// List of emojies to be used (the number emojis)
const idToEmoji = [
    "1️⃣",
    "2️⃣",
    "3️⃣",
    "4️⃣",
    "5️⃣",
    "6️⃣",
    "7️⃣",
    "8️⃣",
    "9️⃣",
    "🔟"
]

const getNLabels = (n) => {
    let labels = [];
    for (let i = 0; i < n; i++) {
        labels.push({
            type: 1,
            components: [{
                type: 4,
                custom_id: `alt${i}`,
                label: `Alternative ${i + 1}`,
                style: 1,
                min_length: 1,
                max_length: 4000,
                placeholder: `Alternative ${i + 1}`,
                required: true
            }]
        });
    }
    console.log(labels.map(l => l.components[0].custom_id));
    return labels;
}

const createAltFields = (options) => {
    let fields = [];

    for (let i = 0; i < options.length; i++) {
        fields.push(
            {
                name: options[i],
                value: idToEmoji[i],
                inline: true
            }
        )
    }

    return fields;
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

export const commands = [
    {
        command: {
            name: "poll",
            description: "Create a poll!",
            options: [
                {
                    type: 4,
                    name: "amount",
                    required: true,
                    description: "The amount of voting options you want to add to the poll",
                    max_value: 4,
                    min_value: 2
                }
            ]
        },
        modal_id: "poll_modal",
        callback: (body, res) => {
            const amount = body.data.options[0].value;

            const comps = [
                {
                    type: 1,
                    components: [{
                        type: 4,
                        custom_id: "title",
                        label: "Poll title",
                        style: 1,
                        min_length: 1,
                        max_length: 4000,
                        placeholder: "Who's the best hacker?",
                        required: true
                    }]
                },
                ...getNLabels(amount)
            ]

            res.send({
                type: InteractionResponseType.APPLICATION_MODAL,
                data: {
                    title: "Create a poll!",
                    custom_id: "poll_modal",
                    components: comps
                }
            })
        },
        modal_submit: (body, res) => {
            const alts = body.data.components.slice(1).map(c => c.components[0].value)
            console.log(alts)
            res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    embeds: [
                        {
                            title: `Poll 🤔 ${body.data.components[0].components[0].value}`,
                            description: "Vote below for the best option!",
                            fields: [
                                ...createAltFields(alts)
                            ]

                        }
                    ]
                }
            })

            const token = body.token;

            // Get original interaction response
            DiscordRequest(`webhooks/${process.env.APP_ID}/${token}/messages/@original`, "GET", null).then(res => res.json().then(async msg => {
                const msgId = msg.id;
                const channel = msg.channel_id;

                const fields = createAltFields(alts);

                // Create Reaction with emoji
                for (let index = 0; index < fields.length; index++) {
                    const element = fields[index];
                    await DiscordRequest(`channels/${channel}/messages/${msgId}/reactions/${element.value}/@me`, "PUT", null)
                    await delay(500)
                    console.log(`Reaction ${element.value} added to message ${msgId}`)
                }
            }))
        }
    }
]