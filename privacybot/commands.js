import { DiscordRequest } from "./helpers.js"

export function createCommands(appId, guildId, commands) {
    // API endpoint for creating slash commands
    const endpoint = `applications/${appId}/guilds/${guildId}/commands`

    commands.forEach(command => {
        DiscordRequest(endpoint, "POST", command).then(r => r.json().then(obj => console.log(obj)));
    })
} 

export const commands = [
    {
        name: "test",
        description: "test command"
    }
]