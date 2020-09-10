import { Command } from "discord-akairo";
import { Message } from "discord.js";
import axios from "axios";

interface IsUpArguments {
  domain: string;
}

class IsUpCommand extends Command {
  constructor() {
    super("isup", {
      aliases: ["isup", "is-up"],
      description: {
        content: "Check if a website is up.",
        usage: "<domain>",
      },
      category: "util",
      ratelimit: 1,
      cooldown: 15000,
      args: [
        {
          id: "domain",
          type: "string",
          match: "text",
        },
      ],
    });
  }

  async exec(message: Message, args: IsUpArguments): Promise<void> {
    const domain = args.domain.replace(/https?:\/\//, "");
    const url = `https://${domain}`;
    const res = await axios.get(
      `https://api-prod.downfor.cloud/httpcheck/${domain}`,
    );

    try {
      const { isDown } = JSON.parse(res.data);
      if (isDown) {
        message.reply(`${url} is down`);
      } else {
        message.reply(`${url} is up`);
      }
    } catch {
      message.reply(`Unable to determine if ${url} is down.`);
    }
  }
}

export default IsUpCommand;
