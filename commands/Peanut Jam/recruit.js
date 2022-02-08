const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton } = require("discord.js");
const { deleteBoth } = require("./delete_team");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("recruit")
    .setDescription("Recruit a friend to your team!")
    .addUserOption((option) =>
      option.setName("target").setDescription("The username of the person to recruit").setRequired(true)
    ),
  async execute(interaction, props) {
    const targetUserId = (await interaction.options.getUser("target").fetch()).id;
    const targetUser = await props.guild.members.cache.get(targetUserId);

    // Confirm recruiter has a team
    const otherTeams = interaction.member.roles.cache.filter((r) => r.color === props.roleColorDec);
    if (otherTeams.size === 0) {
      await interaction.reply({ content: "Please join or create a team first!", ephemeral: true });
      return;
    }

    const recruitingTeam = otherTeams.first();
    // Confirm team has space
    if (recruitingTeam.members.size >= props.maxMembers) {
      await interaction.reply({ content: "Sorry, your team is full!", ephemeral: true });
      return;
    }

    // Confirm recruitee doesnt have a team
    const otherTeamsTarget = targetUser.roles.cache.filter((r) => r.color === props.roleColorDec);
    if (otherTeamsTarget.size > 0) {
      await interaction.reply({ content: "This user is already in a team!", ephemeral: true });
      return;
    }

    // Confirm recruitee isnt a bot
    if (targetUser.user.bot === true) {
      await interaction.reply({
        content: "You can't recruit a bot! (That wouldn't be fair would it)",
        ephemeral: true,
      });
      return;
    }

    await targetUser.roles.add(recruitingTeam);
    await interaction.reply({ content: "User has been recruited to your team!", ephemeral: true });
  },
};
