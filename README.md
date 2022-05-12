# 🤖 discord-bot-sec

#### Project in the course TDA602 - Exploring Discord Bot Security 

The following README are instructions for how to get both of the bots running to test the functionality that we have implemented.

## remote-shell-bot

Since this bot is very simple, it requires very little configuration for it to work. Nonetheless, [create a bot, and call it *remote-shell-bot*, or something similar](#create-bot-in-discord-developer-portal). 

Once invited to a server, select (or create) a new text channel in that server and copy its ID (if you can't do this, you have to enable developer mode in the `Advanced` settings of the Discord Client). This text channel will be the channel that you use to access the remote shell.

Go to the file [bot.py](remote-shell-bot/bot.py), and paste the copied channel ID in the `ping_channel` variable.

Finally, go back to your bot on the discord developer portal and click `Bot` in the sidebar to the left. Click `Reset Token`, and copy the new token. Paste this token in the `discord_token` variable in [bot.py](remote-shell-bot/bot.py).

The bot is now ready to be run. You can run it locally to test it, and you should see that the bot announces itself in the channel you created/selected before. You can now execute arbitrary commands using `>command`, e.g. `>whoami` etc.

## privacy-bot

This bot requires a bit more set up for the *fake* functionality to be tested, and we will include instructions for how to get them to work, but the security related features will work without the extra configuration for the *fake* stuff.

Start by [creating a bot, and naming it something like `privacy-bot`](#create-bot-in-discord-developer-portal). 

We must now gather all of the environment variables needed for this bot, and paste them in the [.env-example file](privacy-bot/.env-example).

Click `Bot` in the left sidebar on the discord developer portal and then click `Reset Token` to generate a new bot token. Copy this token and paste it in `DISCORD_TOKEN` in the [.env-example file](privacy-bot/.env-example).

Now click `General Information` in the left sidebar, copy the `APPLICATION ID` and paste it in `APP_ID` in the [.env-example file](privacy-bot/.env-example). Do the same for `PUBLIC KEY`, just below the `APPLICATION ID`.

Now open up Discord and copy the ID of the server that you invited the bot to, and paste that ID in the `GUILD_ID` in the [.env-example file](privacy-bot/.env-example).

You should now rename the [.env-example file](privacy-bot/.env-example) to `.env`. You can now run the bot using either `yarn start` or `npm run start`, depending on your environment.

You should now be able to run the bot and see that all messages in channels that it has access to will be collected, both those that were sent before the bot was started, and all messages sent after it was started.

The following instructions will only make the `/poll <amount>` command work. For the sake of testing, it is not relevant to make sure that it works - it was only for demonstration purposes to have a feature that could be used to fool users into inviting the bot.

**Prerequisites:**

* A domain pointing to the host that is running the bot, recommend something like [Duck DNS](https://www.duckdns.org/).
* A reverse proxy (HTTPS-enabled) forwarding requests from the domain to local port 3000, recommend [Caddy](https://caddyserver.com/) or something else that is easy to set up (should be running on the same host as the bot).

Start off by going to the discord developer portal and going to your application and then clicking `General Information` in the left sidebar. Paste your domain in the `INTERACTIONS ENDPOINT URL` in the following format `https://<domain>/interactions`.

If you attempt to save the URL without having the reverse proxy and bot running beforehand, the URL validation will not work. Make sure that they are running before you save the URL.

With this set up, you should now be able to use the `/poll <amount>` slash command from the bot.

## Create Bot in Discord Developer Portal

1. Navigate to the [Applications section](https://discord.com/developers/applications).

2. Click on `New Application` in the top right and enter a name for your new application.

3. In the sidebar to the left, click on `Bot`, and then click `Add Bot`, confirm by clicking `Yes, do it!`.

4. Head to the OAuth2/URL-Generator section and and check the `bot` scope, and then check `Administrator` as bot permissions (just as a proof of concept, none of the bots need all of them, but it's easier). Copy the generated URL down below and use it to invite your newly created bot to a discord server.

5. Continue where you were...
