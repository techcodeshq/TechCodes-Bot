const { SlashCommandBuilder } = require("@discordjs/builders");
const commands = require("./Peanut Jam");

const slashCommand = new SlashCommandBuilder()
  .setName("peanut_jam")
  .setDescription("For all of your Penut Jam related needs!");

Object.keys(commands).forEach((commandName) => {
  const data = commands[commandName].data;
  return slashCommand.addSubcommand((subcommand) => {
    subcommand.options = data.options;
    return subcommand.setName(data.name).setDescription(data.description);
  });
});

module.exports = {
  data: slashCommand,
  async execute(interaction, props) {
    const choice = await interaction.options.getSubcommand();
    const roleColor = "#6343ba";

    if (!(choice in commands)) {
      await interaction.reply({ content: "Silly you have to use a command!", ephemeral: true });
      return;
    }

    commands[choice].execute(interaction, {
      ...props,
      roleColor: roleColor,
      roleColorDec: parseInt(roleColor.slice(1), 16),
      categoryName: "Teams",
      maxMembers: 4,
    });
  },
};
