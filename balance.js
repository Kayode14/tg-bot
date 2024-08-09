const db = require('./firebase');

module.exports = async (ctx) => {
    const userRef = db.collection('users').doc(String(ctx.from.id));
    const doc = await userRef.get();
    if (doc.exists) {
        const userData = doc.data();
        ctx.reply(`💰 *Your Balance:*\n\nYou have ${userData.balance} $LEA.`, { parse_mode: 'Markdown' });
    } else {
        ctx.reply('⚠️ *Error:* User not found.', { parse_mode: 'Markdown' });
    }
};
