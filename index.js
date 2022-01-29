// Require the necessary discord.js classes
const { Client, Intents, Collection } = require("discord.js");
const { token } = require("./config.json");

// Create a new client instance
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_WEBHOOKS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

const fs = require("fs");
client.commands = new Collection();

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Consider Thyself Ready!");
});

// Get all commands and store them
const commandFiles = fs.readdirSync("./commands/").filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  const guild = interaction.member.guild;
  const roleColor = "#6343ba";

  if (!command) return;

  try {
    await command.execute(interaction, {
      client: client,
      guild: guild,
      roleColor: roleColor,
      roleColorDec: parseInt(roleColor.slice(1), 16),
      categoryName: "Teams",
      maxMembers: 4,
    });
  } catch (error) {
    console.log("u suck");
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

// Login to Discord with your client's token
client.login(token);

//https://discord.com/api/oauth2/authorize?client_id=936386452911169626&permissions=8&scope=bot
