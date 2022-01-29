const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton } = require("discord.js");
const { deleteBoth } = require("./delete_team");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("join_team")
    .setDescription("Join a hackathon team!")
    .addRoleOption((option) => option.setName("team").setDescription("The role of the team to join").setRequired(true)),
  async execute(interaction, props) {
    const targetRole = await interaction.options.getRole("team");

    // Confirm role is a team
    if (targetRole.color !== props.roleColorDec) {
      await interaction.reply("Please join a hackathon team!");
      return;
    }

    // Confirm team has space
    if (targetRole.members.size >= props.maxMembers) {
      await interaction.reply("Sorry, this team is full!");
      return;
    }

    // Give the user the role
    await interaction.member.roles.add(targetRole);

    await interaction.reply("Team successfully created!");
  },
};
