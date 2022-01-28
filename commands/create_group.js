const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton } = require("discord.js");

const basicPerms = (role, deny = false) => {
  const obj = {
    id: role,
  };
  obj[deny ? "deny" : "allow"] = ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"];
  return obj;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("create_group")
    .setDescription("Create a Hackathon Group!")
    .addStringOption((option) =>
      option.setName("name").setDescription("The name of your new group!").setRequired(true)
    ),
  async execute(interaction, props) {
    const groupName = interaction.options.getString("name");
    const denyEveryone = basicPerms(props.guild.roles.everyone, true);

    // Make sure the category exists
    let category = await props.guild.channels.cache.find((c) => c.name === "Groups");

    if (category === undefined) {
      await props.guild.channels
        .create("Groups", {
          type: "GUILD_CATEGORY",
        })
        .then((data) => (category = data));
    }

    const success = async () => {
      // Create the role
      let role = null;
      await props.guild.roles
        .create({
          name: groupName,
          color: props.roleColor,
        })
        .then((data) => {
          role = data;
        });

      // Create the channel in the category
      await category.createChannel(groupName, {
        permissionOverwrites: [denyEveryone, basicPerms(role)],
      });

      // Give the user the role
      interaction.member.roles.add(role);
    };

    // Check if already in team
    const otherTeams = interaction.member.roles.cache.filter((r) => r.color === parseInt(props.roleColor.slice(1), 16));

    if (otherTeams.size > 0) {
      const row = new MessageActionRow().addComponents(
        new MessageButton().setCustomId("cancel").setLabel("Cancel").setStyle("PRIMARY"),
        new MessageButton().setCustomId("leave").setLabel("Leave Current").setStyle("DANGER"),
        new MessageButton().setCustomId("create").setLabel("Leave and Create New").setStyle("SUCCESS")
      );

      await interaction.reply({ content: "You already have a team!", components: [row], ephemeral: true }).then(() => {
        const collector = interaction.channel.createMessageComponentCollector({ componentType: "BUTTON", time: 15000 });

        collector.on("collect", async (click) => {
          const replies = {
            cancel: "Cancelled!",
            leave: "Left old party!",
            create: "Left old party and creating a new one!",
          };
          const newReply = replies[click.customId];
          if (click.customId === "leave" || click.customId === "create") {
            click.member.roles.remove(otherTeams.first());
          }
          if (click.customId === "create") {
            success();
          }

          await click.update({ content: newReply, components: [] });
        });
      });
      return;
    }

    success();

    await interaction.reply("Pong!");
  },
};
