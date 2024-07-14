import asyncio
import logging
import os

from aiogram import Bot, Dispatcher
from app.handlers import router
from dotenv import load_dotenv

from db.zodb import clear_bd, connection

load_dotenv()

TOKEN = os.getenv("TOKEN")

bot = Bot(token=TOKEN)
dp = Dispatcher()


async def main():
    dp.include_router(router)
    await dp.start_polling(bot)


if __name__ == '__main__':
    clear_bd()
    logging.basicConfig(level=logging.INFO)
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        connection.close()
        print('Exit')
