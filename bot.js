const TelegramBot = require("node-telegram-bot-api");
const express = require('express');
const admin = require('firebase-admin');

// Firebase configuration
const firebaseConfig = {
  type: "service_account",
  project_id: "ton-lea",
  private_key_id: "16b478c4e693d880a24d3922c5e2e30a96ad0559",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC8TUOHD39Hgq0S\napmBUA48oyiyMr8pLqpV0b9ZIi0zG5zDv8rRbp1bnnCCuqm2wU5jPI7I87TMDTKS\nCPSwswvApd4tLWP11jf4Hx0f7IjjgM6cNH+ttnCFolDqb1AiJPzRrZZ9Gd4M43/L\naSMmrESeMMEGglPY7UXWtep/Iku0hDbt74fbUwrhZIjaCenPUO3KuKBxgFLGauVc\nYhMIgAioqb2GwU19/x02SSEY/NiVqm7lTslIK+mC9J0DQrBa/9ypTYvqYsd2+Kiu\n+VjrplKrR6+cXWjLemTgu4bwDAtBmddR4OwTj8ese7RSxJSO5kb4yvRBPo/wp6qr\njcdgQxzLAgMBAAECggEAHq5+NscNJ6NAvRP2gC4Bq9qv+l0vba/nXEVpZsYdVEsG\n/5REIVzjMfb+gSaWGauksKHA6DhheLAb0dS4vgPmgdTk/zp6o6dshjbXoYiCg4NM\n5wHc3fqwme2pPpG1nmKleSrOLwMkfbgh7gxrCFWgdqAeC4f3zoxWyVXp6B439Kkg\nlE+INGtRm20PxM7QtvWZlzi3fRd0+dKYZAeFDuc2HfxUpfxqyzVoKtn8J/9HCsYg\nu+4kbPeScFwOMrWFHfbTQCPepHU0ZzZbJg7CGYyGykhJIw1URQlNmMuE9vKK9B4/\n3jLfvnQdYBOyXv4T/Z78brjCSawlRpZsTKyKTgUVXQKBgQDvLI3PIXmBgvhv+SyN\ntJVBzcmTDPl41G/VmOFO1uR4guT0ZDgdK3vqCnstho3IGIb5LmTmly69e+RoodJT\nqwHvEFLV9Y2kxWb9Zf6M03hPxHTiO93nZ+ZOra0aMbdSwqD++Z5ohhEC1GKOS7k4\nToh6bEdOTdLgCJTE1K/1gIljtQKBgQDJjISH1VjANtBr1Fk61bGym+Th7vl3cZ0I\nY40028/37HYmUuy1J+s/V+ly4hlbyb3P+RVK9ghMQu/gBhtkeq0rJm54uG9rcWLQ\n/0/HeOKqsjMzhP+WbcoVZ+1JjSModbzHskxSBAwMXTuZfap/CDWSA0kwWdk/MKL0\n6pCBj8POfwKBgCtoFJyA4MJmeJwpxrI5EdWNeYXclvIc6+cCBfH/Ahv09YR9I8n3\neFeza0OJ5fVoriZPCzTmPy9Yas2qgLd6k7FFbyMxm3FJ+jUG67m3L2CasPPWFaHH\ns36X+pCEcVbtx7Y+q0cg/blbvj9A8u6LIi3FtPM7IIhURluqlfyiRUz5AoGBAJxy\nJYGmmoCBS+EXcLfZnliM5+p0bFJJ72HOnJI2OcUxWDjBT5oCxXlizQPu+04jV+Iy\nb1PDjIddwgL72pFxJDAFYeT1DQ+ycMjYFV45uIBVWKcaCqcCy8U36ZmZI3xJf+Lm\nxJU5LPz/9b5cLFb00VhokowkghyprSQ9WzQmmxATAoGATOly6hyjiRYCXclc+yi2\nUpJQSGUl3R1iApqEvl0B/NrvLGDiTty385RL+JGTcxgWGaWdea665ML/vfmv8ydu\nLnLLJLqH5x6790RugRk9Jo/052e6T6m24oYgQx/643qnSsB6sG8IrlsKBEM2+QM1\nHbEQZFCFeq0+v/X3Stv5Xyo=\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-lbwm1@ton-lea.iam.gserviceaccount.com",
  client_id: "115823212131955077414",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-lbwm1%40ton-lea.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig)
});

const db = admin.firestore();
const usersCollection = db.collection('users');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Replace the value below with the Telegram token you receive from @BotFather
const token = "5848386549:AAHvPrmirUkirfGfv60d_oq_VR45qdBxhqs";

const bot = new TelegramBot(token, { polling: true });

const gifUrl = "https://media2.giphy.com/media/26n6xBpxNXExDfuKc/giphy.gif";
const gifUrl2 = "https://media4.giphy.com/media/4xWGyVKoXqg2eVCiq9/giphy.gif";
const groupLink = "https://t.me/alliance_Ton";
const mainImageUrl = "https://ibb.co/RHKK2Cq"; // replace with your image URL

// Define the tasks array
const tasks = [
  { 
    description: "1. Follow TON Alliance on Twitter 🐦\n🔗 [https://twitter.com/AllianceTon](https://twitter.com/AllianceTon)\n💰 Reward: 15 LEA", 
    link: "https://twitter.com/AllianceTon", 
    points: 15, 
    type: "twitter", 
    prompt: "Please enter your Twitter username (starting with @):" 
  },
  { 
    description: "2. Like and retweet pinned post 🔄\n💰 Reward: 20 LEA", 
    link: "https://x.com/allianceton/status/1820569160981848407?s=46", 
    points: 20, 
    type: "twitter", 
    prompt: "Please enter your Twitter username (starting with @):" 
  },
  { 
    description: "3. Like and retweet this tweet 🔄\n💰 Reward: 20 LEA", 
    link: "https://x.com/allianceton/status/1820568925756887403?s=46", 
    points: 20, 
    type: "twitter", 
    prompt: "Please enter your Twitter username (starting with @):" 
  },
  { 
    description: "4. Comment $LEA under TON tweet 📝\n💰 Reward: 30 LEA", 
    link: "https://x.com/allianceton/status/1820568056227307970?s=46", 
    points: 30, 
    type: "twitterLink", 
    prompt: "Please enter the tweet link (starting with https://x.com/ or https://twitter.com/):" 
  },
  { 
    description: "5. Add $LEA to Telegram name ✏️\n💰 Reward: 40 LEA", 
    link: "reply DONE after", 
    points: 40, 
    type: "telegramName", 
    prompt: "Please add $LEA to your Telegram name and reply this text with : done ,to continue." 
  },
  { 
    description: "6. Join Notcoin Community 👥\n💰 Reward: 25 LEA", 
    link: "@notcoincommunity", 
    points: 25, 
    type: "telegramGroup", 
    groupId: "@notcoincommunity", 
    prompt: "Please enter your Telegram username :" 
  },
  { 
    description: "7. Join fastonswapchat 👥\n💰 Reward: 25 LEA", 
    link: "@fastonswapchat", 
    points: 25, 
    type: "telegramGroup", 
    groupId: "@fastonswapchat", 
    prompt: "Please enter your Telegram username:" 
  }
];


const sendMainMenu = async (chatId, username) => {
  const welcomeMessage = `🎉 Welcome to Ton Alliance Earn Bot, @${username}! 🎉\n\n📋 Perform tasks or refer friends to earn $LEA. 💰`;

  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "📝 TASKS for the day", callback_data: "tasks" }],
        [{ text: "👥 Refer friends", callback_data: "refer" }],
        [{ text: "💵 Balance", callback_data: "balance" }]
      ]
    }
  };

  await bot.sendPhoto(chatId, mainImageUrl, {
    caption: welcomeMessage,
    ...options
  });

  const userRef = usersCollection.doc(`${chatId}`);
  await userRef.set({
    userId: chatId,
    username: username,
    referralNo: 0,
    balance: 0,
    withdrawalAddress: null,
    referrals: [],
    earnings: 0,
    completedTasks: []
  }, { merge: true });
};

// Function to prompt the user to join the group
const promptJoinGroup = (chatId) => {
  const joinMessage = `👋 Welcome to Lea Earn Bot! Please make sure you join our Telegram group: ${groupLink} before you proceed.`;

  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "➡️ Proceed", callback_data: "proceed" }]
      ]
    }
  };

  // Send the welcome message with the GIF and the Proceed button
  bot.sendAnimation(chatId, gifUrl, {
    caption: joinMessage,
    ...options
  });
};

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const username = msg.from.username || "User";

  const userRef = usersCollection.doc(`${chatId}`);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    promptJoinGroup(chatId);
  } else {
    sendMainMenu(chatId, username);
  }
});

bot.on('callback_query', async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;
  const username = callbackQuery.from.username || "User";

  if (data === 'proceed') {
    sendMainMenu(chatId, username);
  } else if (data === 'tasks') {
    bot.sendMessage(chatId, "Here are your tasks for the day...");
  } else if (data === 'refer') {
    const userRef = usersCollection.doc(`${chatId}`);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      const userData = userDoc.data();
      const referralLink = generateReferralLink(chatId);
      const referralMessage = `
        👥 Refer your friends and earn rewards! 💰

        🔗 Your referral link: ${referralLink}

        📈 Amount per referral: 100 LEA
        📊 Your referral count: ${userData.referralNo}
        💵 Earnings from referrals: ${userData.earnings} LEA
      `;

      bot.sendMessage(chatId, referralMessage);
    }
  }
});

const generateReferralLink = (userId) => {
  return `https://t.me/EARNLEA_bot?start=${userId}`;
};

bot.onText(/\/start (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const username = msg.from.username || "User";
  const referrerId = match[1]; // The referrer ID from the referral link

  const userRef = usersCollection.doc(`${chatId}`);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    // New user
    if (referrerId) {
      // Handle referral
      const referrerRef = usersCollection.doc(`${referrerId}`);
      const referrerDoc = await referrerRef.get();

      if (referrerDoc.exists) {
        // Update referrer data
        await referrerRef.update({
          referralNo: admin.firestore.FieldValue.increment(1),
          earnings: admin.firestore.FieldValue.increment(100)
        });

        // Update new user data
        await userRef.set({
          userId: chatId,
          username: username,
          referralNo: 0,
          balance: 100, // Reward for new user
          withdrawalAddress: null,
          referrals: [referrerId], // Add referrer to new user data
          earnings: 0
        }, { merge: true });
      }
    } else {
      // New user without a referral
      await createUser(chatId, username);
    }

    promptJoinGroup(chatId);
  } else {
    sendMainMenu(chatId, username);
  }
});


//for tasks
const handleTaskCompletion = async (chatId, taskId, userResponse) => {
  const task = tasks[taskId];
  const userRef = usersCollection.doc(`${chatId}`);
  const userDoc = await userRef.get();

  if (userDoc.exists) {
    const userData = userDoc.data();
    const userId = userDoc.id;

    // Verification logic for each task type
    if (task.type === "twitter" && userResponse.startsWith("@")) {
      await userRef.update({
        balance: admin.firestore.FieldValue.increment(task.points),
        completedTasks: admin.firestore.FieldValue.arrayUnion(taskId)
      });
      bot.sendMessage(chatId, `✅ Task ${taskId + 1} completed. Verified.`);
    } else if (task.type === "twitterLink" && (userResponse.startsWith("https://x.com/") || userResponse.startsWith("https://twitter.com/"))) {
      await userRef.update({
        balance: admin.firestore.FieldValue.increment(task.points),
        completedTasks: admin.firestore.FieldValue.arrayUnion(taskId)
      });
      bot.sendMessage(chatId, `✅ Task ${taskId + 1} completed. Verified.`);
    } else if (task.type === "telegramName") {
      // Fetch user's profile to check for $LEA in their name
      const telegramUser = await bot.getChatMember(chatId, userId);
      if (
        (telegramUser.user.first_name && telegramUser.user.first_name.includes("$LEA")) ||
        (telegramUser.user.last_name && telegramUser.user.last_name.includes("$LEA"))
      ) {
        await userRef.update({
          balance: admin.firestore.FieldValue.increment(task.points),
          completedTasks: admin.firestore.FieldValue.arrayUnion(taskId)
        });
        bot.sendMessage(chatId, `✅ Task ${taskId + 1} completed. Verified.`);
      } else {
        bot.sendMessage(chatId, `❌ Your Telegram name does not include $LEA. Please try again.`);
      }
    } else if (task.type === "telegramGroup") {
      // For tasks 6 and 7, verify as soon as the user presses "done"
      await userRef.update({
        balance: admin.firestore.FieldValue.increment(task.points),
        completedTasks: admin.firestore.FieldValue.arrayUnion(taskId)
      });
      bot.sendMessage(chatId, `✅ Task ${taskId + 1} completed. Verified.`);
    } else {
      bot.sendMessage(chatId, `❌ Invalid response. Please try again.`);
    }
  }
};

const sendTasks = async (chatId) => {
  const taskHeader = `📝 These are the currently available tasks:\n\n`;
  await bot.sendAnimation(chatId, gifUrl2, { caption: taskHeader });

  const userRef = usersCollection.doc(`${chatId}`);
  const userDoc = await userRef.get();

  let completedTasks = [];
  if (userDoc.exists) {
    const userData = userDoc.data();
    completedTasks = userData.completedTasks || [];
  }

  for (let i = 0; i < tasks.length; i++) {
    if (!completedTasks.includes(i)) {
      const task = tasks[i];
      const taskMessage = `${task.description}\nLink: ${task.link || "Link will be provided later"}\n`;
      const options = {
        reply_markup: {
          inline_keyboard: [[{ text: "✅ Done", callback_data: `task_done_${i}` }]]
        }
      };
      await bot.sendMessage(chatId, taskMessage, options);
    }
  }
};

bot.on('callback_query', async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;
  const username = callbackQuery.from.username || "User";

  if (data === 'tasks') {
    sendTasks(chatId);
  } else if (data === 'refer') {
    const userRef = usersCollection.doc(`${chatId}`);
    const userDoc = await userRef.get();

    if (userDoc.exists) {}
  } else if (data.startsWith('task_done_')) {
    const taskId = parseInt(data.split('_')[2], 10);
    const task = tasks[taskId];
    bot.sendMessage(chatId, task.prompt, { reply_markup: { force_reply: true } })
      .then((sentMessage) => {
        bot.onReplyToMessage(sentMessage.chat.id, sentMessage.message_id, async (msg) => {
          await handleTaskCompletion(chatId, taskId, msg.text);
          await bot.deleteMessage(chatId, callbackQuery.message.message_id); // Delete the task message
        });
      });
  }
});


const MIN_WITHDRAWAL_BALANCE = 350;

// Function to send balance message with GIF and Withdraw button
async function sendBalanceMessage(chatId, totalBalance, taskEarnings, referralEarnings) {
  const balanceMessage = `
    💵 Your total balance: ${totalBalance} LEA

    🏦 Task earnings: ${taskEarnings} LEA
    🎁 Referral earnings: ${referralEarnings} LEA
  `;

  const balanceGif = 'https://media1.giphy.com/media/yIxNOXEMpqkqA/giphy.gif'; // Balance GIF URL

  await bot.sendAnimation(chatId, balanceGif, {
    caption: balanceMessage,
    reply_markup: {
      inline_keyboard: [[{ text: 'Withdraw', callback_data: 'withdraw' }]]
    }
  });
}

// Function to handle withdrawal process
async function handleWithdraw(chatId, totalBalance) {
  if (totalBalance < MIN_WITHDRAWAL_BALANCE) {
    const minBalanceMessage = '❌ The minimum withdrawal balance is 350 LEA.';
    const sadGif = 'https://media1.giphy.com/media/SsYt3M37MnhhGelWC3/giphy.gif'; // Sad humor GIF URL

    await bot.sendAnimation(chatId, sadGif, {
      caption: minBalanceMessage
    });
  } else {
    const requestAddressMessage = '🎉 Please send your TON withdrawal address:';
    const happyGif = 'https://media3.giphy.com/media/8gjWMXlOrfUik0NvR2/giphy.gif'; // Rich humor GIF URL

    await bot.sendAnimation(chatId, happyGif, {
      caption: requestAddressMessage
    });

    // Store the state to expect the address next
    userStates[chatId] = 'awaiting_address';
  }
}

// State management to store user states
const userStates = {};

bot.on('callback_query', async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  if (data === 'balance') {
    try {
      const userRef = usersCollection.doc(`${chatId}`);
      const userDoc = await userRef.get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        const totalBalance = userData.balance + userData.earnings;

        await sendBalanceMessage(chatId, totalBalance, userData.balance, userData.earnings);

        // Optionally, store the total balance in Firestore
        await userRef.update({ totalBalance });
      } else {
        await bot.sendMessage(chatId, "User data not found.");
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      await bot.sendMessage(chatId, "An error occurred while fetching your balance.");
    }
  } else if (data === 'withdraw') {
    try {
      const userRef = usersCollection.doc(`${chatId}`);
      const userDoc = await userRef.get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        const totalBalance = userData.totalBalance;

        await handleWithdraw(chatId, totalBalance);
      } else {
        await bot.sendMessage(chatId, "User data not found.");
      }
    } catch (error) {
      console.error("Error handling withdrawal:", error);
      await bot.sendMessage(chatId, "An error occurred while processing your withdrawal.");
    }
  }
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  if (userStates[chatId] === 'awaiting_address') {
    const withdrawalAddress = msg.text;

    // Save the withdrawal address to Firestore
    const userRef = usersCollection.doc(`${chatId}`);
    await userRef.update({ withdrawalAddress });

    await bot.sendMessage(chatId, '✅ Your withdrawal is being processed.');
    userStates[chatId] = null; // Reset state
  }
});
