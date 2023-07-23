const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '6531118039:AAEYs9Nta-iislSfHevo8HDVvnyimPB90K4'
const bot = new TelegramApi(token, {polling: true})
const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, ты должен будешь отгадать`)
    const randomNumber = Math.floor(Math.random()*10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

const start = () =>{
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Информация о боте'},
        {command: '/game', description: 'Игра угадай число'}
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        const name = msg.from.first_name;
    
        if (text === '/start'){
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/d21/e99/d21e9940-fc86-49ba-9d91-b20a71136040/8.webp')
            return bot.sendMessage(chatId, `Добро пожаловать, ${name}`)
        }
        if (text === '/info'){
            return bot.sendMessage(chatId, `Это - мой первый бот`)
        }
        if (text === '/game'){
            return startGame(chatId)
        }
        
        return bot.sendMessage(chatId, `Я тебя не понимаю, попробуй еще раз!`)
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again'){
            return startGame(chatId)
        }
        if (data == chats[chatId]){
            return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions)
        } else{
            return bot.sendMessage(chatId, `Ты не угадал, бот выбрал цифру ${chats[chatId]}`, againOptions)
        }
    })
}

start()