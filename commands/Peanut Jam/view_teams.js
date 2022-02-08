const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("view_teams").setDescription("View all current teams!"),
  async execute(interaction, props) {
    // get roles
    // map role.name and members.size
    const teams = props.guild.roles.cache.filter((role) => role.color === props.roleColorDec);
    const fields = teams.map((team) => ({
      name: team.name,
      value: `${team.members.map((member) => `<@${member.user.id}>`).join(" ⋅ ")}
      ${team.members.size}/${props.maxMembers} | ${team.members.size < props.maxMembers ? "Joinable!" : "All full!"}`,
    }));

    const embed = new MessageEmbed()
      .setColor(props.roleColor)
      .setTitle("Current Peanut Jam Teams!")
      .setDescription(
        "All of the teams that have been created for Peanut Jam 2021!\n\nUse `/peanut_jam join_team` to join one!"
      )
      .setThumbnail(
        "https://cdn.discordapp.com/icons/760579209235267654/e6d187b90449b870d424044cbde570c7.webp?size=128"
      )
      .addFields(...fields);

    await interaction.reply({ embeds: [embed], ephemeral: false });
  },
};
