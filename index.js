const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Dein Token fürs Discord-Bot
const DISCORD_TOKEN = "YOUR_DISCORD_BOT_TOKEN";
// Dein UEX API Bearer Token
const UEX_API_TOKEN = "YOUR_UEX_API_TOKEN";

const API_URL = "https://api.uexcorp.uk/2.0/marketplace_listings";

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // Befehl: !listings
  if (message.content.toLowerCase() === "!listings") {
    try {
      const response = await axios.get(API_URL, {
        headers: {
          "Authorization": `Bearer ${UEX_API_TOKEN}`
        }
      });

      if (response.data.status !== "ok") {
        message.reply("⚠️ Fehler bei API-Antwort: " + response.data.status);
        return;
      }

      const listings = response.data.data;

      if (!listings || listings.length === 0) {
        message.reply("📭 Keine Marketplace Listings gefunden.");
        return;
      }

      // Beispiel: Zeige die ersten 5 Listings
      const formatted = listings.slice(0, 5).map((item, i) => {
        return `**${i + 1}. ${item.item_name}** — ${item.price} ${item.currency} bei ${item.location}`;
      }).join("\n");

      message.reply(`📦 UEX Marketplace Listings:\n${formatted}`);

    } catch (error) {
      console.error(error);
      message.reply("⚠️ Konnte die UEX Marketplace Listings nicht abrufen.");
    }
  }
});

client.login(DISCORD_TOKEN);
