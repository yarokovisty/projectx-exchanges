from aiogram.fsm.state import StatesGroup, State


class Settings(StatesGroup):
    count_request = State()
    min_spread = State()

