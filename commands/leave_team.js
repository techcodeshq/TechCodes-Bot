const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton } = require("discord.js");
const { deleteBoth } = require("./delete_team");

module.exports = {
  data: new SlashCommandBuilder().setName("leave_team").setDescription("Leave your current hackathon team"),
  async execute(interaction, props) {
    const otherTeam = interaction.member.roles.cache.find((r) => r.color === props.roleColorDec);

    //Make sure user is in a team
    if (!otherTeam) {
      await interaction.reply("You have to be in a team to leave one!");
      return;
    }

    if (otherTeam.members.size === 1) {
      await deleteBoth(otherTeam, props.guild);
    } else {
      await interaction.member.roles.remove(otherTeam);
    }

    await interaction.reply("Successfully left team!");
  },
};
