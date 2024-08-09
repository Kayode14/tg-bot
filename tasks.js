const db = require('./firebase');
const admin = require('firebase-admin');

// Define the tasks with added emojis and improved descriptions
const tasks = [
  { id: 1, description: "🔁 *Retweet our tweet:* [Click here](https://x.com/allianceton/status/1820568925756887403?s=46)", type: "twitterLink", points: 50 },
  { id: 2, description: "🐦 *Follow us on Twitter:* [Click here](https://twitter.com/AllianceTon/)", type: "twitter", points: 50 },
  { id: 3, description: "🔁 *Retweet our pinned tweet:* [Click here](https://x.com/AllianceTon/status/1820569160981848407)", type: "twitterLink", points: 50 },
  { id: 4, description: "📝 *Add $LEA to your Telegram name*", link: "", type: "telegramName", points: 100 },
  { id: 5, description: "👥 *Join our TONmap Telegram group:* [Click here](https://t.me/TonMapen)", type: "telegramGroup", points: 50 },
  { id: 6, description: "🐦 *Follow TonMap Twitter:* [Click here](https://x.com/TonMapBot/)", type: "twitter", points: 50 },
  { id: 7, description: "🐦 *Follow our DRPS Twitter account:* [Click here](https://twitter.com/dropsonton)", type: "twitter", points: 50 }
];

// Get a task by its ID
const getTaskById = (taskId) => {
  return tasks.find(task => task.id == taskId);
};

// Get available tasks for a user
const getTasksForUser = async (userId) => {
  const userRef = db.collection('users').doc(String(userId));
  const doc = await userRef.get();
  
  if (doc.exists) {
    const userData = doc.data();
    const availableTasks = tasks.filter(task => !userData.completedTasks.includes(task.id));
    
    return availableTasks;
  }
  
  return [];
};

// Handle task completion
const handleTaskCompletion = async (ctx, taskId, userInput) => {
  const userId = ctx.from.id;
  const userRef = db.collection('users').doc(String(userId));
  const doc = await userRef.get();
  const task = getTaskById(taskId);

  if (doc.exists && task) {
    const userData = doc.data();
    
    if (!userData.completedTasks.includes(taskId)) {
      let isValid = true;

      if (task.type === "telegramName") {
        const fullName = `${ctx.from.first_name} ${ctx.from.last_name || ''}`.trim();
        if (!fullName.includes("$LEA")) {
          isValid = false;
          ctx.reply("⚠️ *Please add '$LEA' to your name and try again.*");
        }
      }

      if (isValid) {
        await userRef.update({
          balance: admin.firestore.FieldValue.increment(task.points),
          completedTasks: admin.firestore.FieldValue.arrayUnion(task.id)
        });
        ctx.reply("🎉 *Task completed!* You've earned `$LEA`. Keep up the great work! 💪");
      }
    } else {
      ctx.reply("✅ *This task is already completed!* You're all set. 😎");
    }
  } else {
    ctx.reply("⚠️ *Task not found or already completed.* Please select a valid task. 🤔");
  }
};

// Export the functions
module.exports = {
  getTaskById,
  getTasksForUser,
  handleTaskCompletion
};
