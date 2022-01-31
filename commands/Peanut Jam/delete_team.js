const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton, Permissions } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("delete_team")
    .setDescription("Delete an existing team!")
    .addRoleOption((option) =>
      option.setName("team").setDescription("The role of the team to delete").setRequired(true)
    ),
  async deleteBoth(role, guild) {
    const channelName = role.name
      .toLowerCase()
      .replace(/\s/gi, "-")
      .replace(/[^a-z+\-+0-9]/gi, "");

    const targetChannel = await guild.channels.cache.find((c) => c.name === channelName);

    targetChannel.delete();
    guild.roles.delete(role);
  },
  async execute(interaction, props) {
    const targetRole = await interaction.options.getRole("team");

    // Confirm role is a team
    if (targetRole.color !== props.roleColorDec) {
      await interaction.reply("Please delete a valid team!");
      return;
    }

    // Confirm admin
    if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      await interaction.reply("You can't do that! Please talk to an executive to learn more!");
    }

    await this.deleteBoth(targetRole, props.guild);
    await interaction.reply("Deleted!");
  },
};
