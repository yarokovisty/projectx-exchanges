from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, InlineKeyboardMarkup, InlineKeyboardButton

main = ReplyKeyboardMarkup(
    keyboard=[
        [KeyboardButton(text='⚙️ Настройки'), KeyboardButton(text='🔧 Автоматизация')],
        [KeyboardButton(text='▶️ Запустить бота'), KeyboardButton(text='⏹ Остановить бота')],
        [KeyboardButton(text='🔎 Помощь')]
    ],
    resize_keyboard=True,
    input_field_placeholder='Выберите пункт меню'
)

settings = InlineKeyboardMarkup(
    inline_keyboard=[
        [
            InlineKeyboardButton(text='1) Кол-во запросов', callback_data='input_request'),
            InlineKeyboardButton(text='2) Спред', callback_data='input_spread')
        ]
    ]
)

automation_bot = InlineKeyboardMarkup(
    inline_keyboard=[
        [
            InlineKeyboardButton(text='Вкл', callback_data='turn_on_automation'),
            InlineKeyboardButton(text='Выкл', callback_data='turn_off_automation')
        ]
    ]
)
