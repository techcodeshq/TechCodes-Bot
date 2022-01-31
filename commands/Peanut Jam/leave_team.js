const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton } = require("discord.js");
const { deleteBoth } = require("./delete_team");

module.exports = {
  data: new SlashCommandBuilder().setName("leave_team").setDescription("Leave your current team"),
  async execute(interaction, props) {
    const otherTeam = interaction.member.roles.cache.find((r) => r.color === props.roleColorDec);

    //Make sure user is in a team
    if (!otherTeam) {
      await interaction.reply("You have to be in a team to leave one!");
      return;
    }

    await interaction.member.roles.remove(otherTeam);

    if (otherTeam.members.size === 0) {
      await deleteBoth(otherTeam, props.guild);
    }
    await interaction.reply("Successfully left team!");
  },
};
