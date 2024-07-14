import asyncio
from decimal import Decimal, InvalidOperation

from aiogram import Router, F
from aiogram.filters import CommandStart, Command
from aiogram.fsm.context import FSMContext
from aiogram.types import Message, CallbackQuery

import app.keyboards as kb
from app import text
from app.state import Settings
from app.trade import send_trade_message
from db import zodb

router = Router()


@router.message(CommandStart())
async def cmd_start(message: Message):
    user_id = message.from_user.id
    zodb.add_user(user_id)
    await message.answer(text.start, reply_markup=kb.main)


# Настройки
@router.message(Command('settings'))
@router.message(F.text == '⚙️ Настройки')
async def get_settings(message: Message):
    await message.reply(text=text.settings,
                        reply_markup=kb.settings)


@router.callback_query(F.data == 'input_request')
async def input_request(callback: CallbackQuery, state: FSMContext):
    await callback.answer('')
    await state.set_state(Settings.count_request)
    await callback.message.edit_text(text.answer_input_request)


@router.message(Settings.count_request)
async def process_request_count(message: Message, state: FSMContext):
    try:
        user_id = message.from_user.id
        await state.update_data(count_request=int(message.text))
        setting_data = await state.get_data()
        count_request = setting_data['count_request']
        zodb.save_num_request(user_id, count_request)
        await message.answer(text.create_response_request(count_request))
        await state.clear()
    except ValueError:
        await message.answer(text.error_input_request)


@router.callback_query(F.data == 'input_spread')
async def input_spread(callback: CallbackQuery, state: FSMContext):
    await callback.answer('')
    await state.set_state(Settings.min_spread)
    await callback.message.edit_text(text.answer_input_spread)


@router.message(Settings.min_spread)
async def process_min_spread(message: Message, state: FSMContext):
    try:
        user_id = message.from_user.id
        await state.update_data(min_spread=Decimal(message.text))
        setting_data = await state.get_data()
        min_spread = setting_data['min_spread']
        zodb.save_spread(user_id, min_spread)
        await message.answer(text.create_response_spread(min_spread))
        await state.clear()
    except InvalidOperation:
        await message.answer(text.error_input_spread)


####


# Автоматизация
@router.message(Command('automation_bot'))
@router.message(F.text == '🔧 Автоматизация')
async def get_automation_bot(message: Message):
    await message.answer(text=text.automation_bot,
                         reply_markup=kb.automation_bot)


@router.callback_query(F.data == 'turn_on_automation')
async def turn_on_automation(callback: CallbackQuery):
    user_id = callback.from_user.id
    zodb.turn_on_automation(user_id)
    await callback.answer('')
    await callback.message.answer(text.answer_turn_on_automation)


@router.callback_query(F.data == 'turn_off_automation')
async def turn_off_automation(callback: CallbackQuery):
    user_id = callback.from_user.id
    zodb.turn_off_automation(user_id)
    await callback.answer('')
    await callback.message.answer(text.answer_turn_off_automation)


####


@router.message(Command('start_bot'))
@router.message(F.text == '▶️ Запустить бота')
async def get_start_bot(message: Message):
    user_id = message.from_user.id
    min_spread = zodb.get_user_min_spread(user_id)

    if min_spread is None:
        await message.answer(text.error_not_input_spread)
    else:
        zodb.start_bot(user_id)
        await message.answer(text.start_bot)
        await send_trade_message(user_id, message.chat.id, min_spread)


@router.message(Command('stop_bot'))
@router.message(F.text == '⏹ Остановить бота')
async def get_stop_bot(message: Message):
    user_id = message.from_user.id
    zodb.stop_bot(user_id)
    await message.answer(text.stop_bot)


@router.message(Command('help'))
@router.message(F.text == '🔎 Помощь')
async def get_help(message: Message):
    await message.answer(text.help_bot)
