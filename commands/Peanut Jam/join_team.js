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

    const success = async () => {
      await interaction.member.roles.add(targetRole);
    };

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

    // Check if already in team
    const otherTeams = interaction.member.roles.cache.filter((r) => r.color === props.roleColorDec);

    if (otherTeams.size > 0) {
      const row = new MessageActionRow().addComponents(
        new MessageButton().setCustomId("cancel").setLabel("Cancel").setStyle("DANGER"),
        new MessageButton().setCustomId("join").setLabel("Leave and Join New").setStyle("SUCCESS")
      );

      await interaction.reply({ content: "You already have a team!", components: [row], ephemeral: true }).then(() => {
        const collector = interaction.channel.createMessageComponentCollector({ componentType: "BUTTON", time: 15000 });

        collector.on("collect", async (click) => {
          const replies = {
            cancel: "Cancelled!",
            join: "Team successfully joined!",
          };
          const newReply = replies[click.customId];
          if (click.customId === "join") {
            // Check for number of people with role
            if (otherTeams.first().members.size === 1) {
              await deleteBoth(otherTeams.first(), props.guild);
            } else {
              await click.member.roles.remove(otherTeams.first());
            }
            success();
          }

          await click.update({ content: newReply, components: [] });
        });
      });
      return;
    }

    // Give the user the role
    success();
    await interaction.reply("Team successfully joined!");
  },
};
