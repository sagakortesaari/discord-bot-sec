import discord
import subprocess
from secret import token

client = discord.Client()

@client.event
async def on_ready():
    print('Connected to discord as', client.user.name)

@client.event
async def on_message(message):
    if message.author == client.user:
        return

    if message.content.startswith('>'): 
        res = subprocess.getoutput(str(message.content[1:]))
        print("res", res)
        await message.channel.send(res)

client.run(token) ## Replace this with your token