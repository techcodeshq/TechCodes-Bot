const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton } = require("discord.js");
const { deleteBoth } = require("./delete_team");

const basicPerms = (role, deny = false) => {
  const obj = {
    id: role,
  };
  obj[deny ? "deny" : "allow"] = ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"];
  return obj;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("create_team")
    .setDescription("Create a team!")
    .addStringOption((option) => option.setName("name").setDescription("The name of your new team!").setRequired(true)),
  async execute(interaction, props) {
    const teamName = await interaction.options.getString("name");
    const denyEveryone = basicPerms(props.guild.roles.everyone, true);
    const alreadyExists = await props.guild.roles.cache.find((r) => r.name === teamName);

    //Make sure team doesnt already exist
    if (alreadyExists) {
      await interaction.reply(
        "This team name is already in use! Please choose a different name or use `/join` to join it!"
      );
      return;
    }

    const success = async () => {
      // Make sure the category exists
      let category = await props.guild.channels.cache.find(
        (c) => c.name === props.categoryName && c.children.size < 50
      );

      if (!category || category === undefined || category.children.size >= 50) {
        await props.guild.channels
          .create(props.categoryName, {
            type: "GUILD_CATEGORY",
          })
          .then((data) => (category = data));
      }

      // Create the role
      let role = null;
      await props.guild.roles
        .create({
          name: teamName,
          color: props.roleColor,
        })
        .then((data) => {
          role = data;
        });

      // Create the channel in the category
      await category.createChannel(teamName, {
        permissionOverwrites: [denyEveryone, basicPerms(role)],
      });

      // Give the user the role
      interaction.member.roles.add(role);
    };

    // Check if already in team
    const otherTeams = interaction.member.roles.cache.filter((r) => r.color === props.roleColorDec);

    if (otherTeams.size > 0) {
      const row = new MessageActionRow().addComponents(
        new MessageButton().setCustomId("cancel").setLabel("Cancel").setStyle("DANGER"),
        new MessageButton().setCustomId("create").setLabel("Leave and Create New").setStyle("SUCCESS")
      );

      await interaction.reply({ content: "You already have a team!", components: [row], ephemeral: true }).then(() => {
        const collector = interaction.channel.createMessageComponentCollector({ componentType: "BUTTON", time: 15000 });

        collector.on("collect", async (click) => {
          const replies = {
            cancel: "Cancelled!",
            create: "Left old party and creating a new one!",
          };
          const newReply = replies[click.customId];
          if (click.customId === "leave") {
            click.member.roles.remove(otherTeams.first());
          }
          if (click.customId === "create") {
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

    success();

    await interaction.reply("Team successfully created!");
  },
};
