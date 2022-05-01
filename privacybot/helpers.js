import fetch from 'node-fetch';
import { verifyKey } from 'discord-interactions';

export async function DiscordRequest(endpoint, type, body) {
    const url = 'https://discord.com/api/v9/' + endpoint;

    let response = null; 

    if (body != null) {
        response = await fetch(url, {
            method: type,
            body: JSON.stringify(body),
            headers: {'Content-Type': 'application/json; charset=UTF-8', Authorization: `Bot ${process.env.DISCORD_TOKEN}`}
        })
    } else {
        response = await fetch(url, {
            method: type,
            headers: {'Content-Type': 'application/json; charset=UTF-8',
                Authorization: `Bot ${process.env.DISCORD_TOKEN}`}
        })
    }

    return await response;
}

export function VerifyDiscordRequest(clientKey) {
    return function (req, res, buf, encoding) {
      const signature = req.get('X-Signature-Ed25519');
      const timestamp = req.get('X-Signature-Timestamp');
  
      const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
      if (!isValidRequest) {
        res.status(401).send('Bad request signature');
        throw new Error('Bad request signature');
      }
    };
}