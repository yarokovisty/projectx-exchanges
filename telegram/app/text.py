start = 'Привет!\n Это тг-бот B2aum. Бот предназначен для арбитража криптовалют.'
help_bot = ('Доступные команды:\n/start - начать\n'
            '/help - помощь\n'
            '/settings - настройки\n'
            '/automation_bot - автоматизация бота\n'
            '/start_bot - запуск бота\n'
            '/stop_bot - остановка бота\n')
settings = 'Настройки\n1) Кол-во запросов в секунду\n2) Мин. спред для уведомления'
automation_bot = 'Автоматизация бота'
start_bot = 'Бот запущен'
already_start_bot = 'Бот уже запущен'
stop_bot = 'Бот остановлен'
not_start_bot = 'Бот не запущен'
answer_input_request = 'Введите кол-во запросов:'
error_input_request = 'Пожалуйста, введите числовое значение.'
answer_input_spread = 'Введите мин. спред % для отправки сообщений:'
error_input_spread = 'Пожалуйста, введите числовое значение.'
answer_turn_on_automation = 'Автоматизация бота включена'
answer_turn_off_automation = 'Автоматизация бота выключена'
error_not_input_spread = 'Введите мин. спред'

def create_response_request(request_count: int) -> str:
    return f"Количество запросов установлено: {request_count}"


def create_response_spread(min_spread: float) -> str:
    return f'Мин. спред для уведомления установлен: {min_spread}%'


def create_trade_message(
        name_buy_exchange: str,
        url_buy_exchange: str,
        name_sell_exchange: str,
        url_sell_exchange: str,
        pair: str,
        price_buy: float,
        price_sell: float,
        profit: float,
        spread: float
) -> str:
    return (
        f"<a href='{url_buy_exchange}'>{name_buy_exchange}</a> -> <a href='{url_sell_exchange}'>{name_sell_exchange}</a> | "
        f"<b>{pair}</b>\n\n"
        f"📉 <b>Покупка:</b>\n"
        f"<b>Цена:</b> {price_buy}\n\n"
        f"📈 <b>Продажа:</b>\n"
        f"<b>Цена:</b> {price_sell}\n\n"
        f"<b>Профит:</b> {profit}\n"
        f"<b>Спред:</b> {spread}%")
