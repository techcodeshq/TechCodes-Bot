const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("link")
    .setDescription("Get all your links here!")
    .addStringOption((option) =>
      option
        .setName("link_name")
        .setDescription("Choose your link:")
        .setRequired(true)
        .addChoice("Points Counter", "points")
        .addChoice("Our Website", "website")
        .addChoice("Repost Form", "repost")
    ),
  async execute(interaction, props) {
    const choice = await interaction.options.getString("link_name");
    const replies = {
      points: "https://app.techcodes.org",
      website: "https://techcodes.org",
      repost: "https://bit.ly/techcodesrepost",
    };

    await interaction.reply({ content: `Here you go!\n${replies[choice]}`, ephemeral: true });
  },
};
