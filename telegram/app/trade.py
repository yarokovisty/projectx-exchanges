import asyncio

from app.spread import find_best_spread
from app.text import create_trade_message
from aiogram.enums import ParseMode

from db import zodb

# asincio


async def send_trade_message(user_id, chat_id, min_spread):
    from run import bot

    launch = zodb.get_launch_bot(user_id)

    while launch:
        profit, spread, buy_exchange, sell_exchange = find_best_spread()
        if spread >= min_spread:
            trade_message = create_trade_message(
                buy_exchange['exchangeId'],
                '#',
                sell_exchange['exchangeId'],
                '#',
                buy_exchange['pair'],
                buy_exchange['price']['buy'],
                sell_exchange['price']['sell'],
                profit,
                spread
            )

            await bot.send_message(
                chat_id=chat_id,
                text=trade_message,
                parse_mode=ParseMode.HTML,
                disable_web_page_preview=True
            )

        launch = zodb.get_launch_bot(user_id)
