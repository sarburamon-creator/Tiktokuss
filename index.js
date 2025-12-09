// index.js
const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require("discord.js");
const fs = require("fs-extra");
const fetch = require("node-fetch");

// Load env from Render
const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

// Storage for TikTok session ID
const DATA_FILE = "./data.json";

// Ensure data file exists
if (!fs.existsSync(DATA_FILE)) {
    fs.writeJsonSync(DATA_FILE, { session_id: "" });
}

function getData() {
    return fs.readJsonSync(DATA_FILE);
}

function saveData(obj) {
    fs.writeJsonSync(DATA_FILE, obj);
}

// Create Discord client
const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

// =========================
// Slash Commands
// =========================
const commands = [
    new SlashCommandBuilder()
        .setName("set_session_id")
        .setDescription("Salvează session ID-ul TikTok")
        .addStringOption(opt =>
            opt.setName("session")
                .setDescription("Session ID de pe TikTok")
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName("new_username")
        .setDescription("Schimbă username-ul contului TikTok")
        .addStringOption(opt =>
            opt.setName("username")
                .setDescription("Noul username (ex: 𝕤𝕚𝕣𝟚>>)")
                .setRequired(true)
        )
].map(cmd => cmd.toJSON());

// Register commands
const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
    try {
        console.log("⏳ Înregistrez comenzi...");

        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands }
        );

        console.log("✔ Comenzi înregistrate!");
    } catch (err) {
        console.error(err);
    }
})();

// =========================
// TikTok functions
// (Aici introducem X-Gorgon + change username)
// =========================

// ------- PLACEHOLDER — voi introduce X-Gorgon COMPLET după ce confirmi că funcționează partea de Discord ------- //

async function changeTikTokUsername(sessionId, newUsername) {
    // AICI voi pune codul X-Gorgon complet
    // pentru moment returnez ceva ca să testăm botul

    return `Username schimbat (simulat) la: ${newUsername}`;
}


// =========================
// Discord events
// =========================
client.on("ready", () => {
    console.log(`🤖 Logat ca ${client.user.tag}`);
});

// Command handler
client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const data = getData();

    if (interaction.commandName === "set_session_id") {
        const session = interaction.options.getString("session");

        data.session_id = session;
        saveData(data);

        return interaction.reply(`✔ Session ID salvat cu succes.`);
    }

    if (interaction.commandName === "new_username") {
        const username = interaction.options.getString("username");

        if (!data.session_id)
            return interaction.reply("❌ Nu ai setat un session ID! Folosește /set_session_id");

        await interaction.reply("⏳ Schimb username-ul...");

        const result = await changeTikTokUsername(data.session_id, username);

        return interaction.editReply(result);
    }
});

// Start bot
client.login(TOKEN);
