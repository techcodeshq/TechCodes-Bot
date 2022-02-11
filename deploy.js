const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

require("dotenv").config();

const commands = [];
const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

// Register commands for test guild
rest
  .put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands })
  .then(() => console.log("Successfully registered guild commands."))
  .catch(console.error);

// Register commands globally
if (!parseInt(process.env.TESTING)) {
  rest
    .put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands })
    .then(() => console.log("Successfully registered commands globally."))
    .catch(console.error);
}
