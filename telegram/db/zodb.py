import ZODB.FileStorage
import transaction

from db import entity

storage = ZODB.FileStorage.FileStorage('tgbot.fs')
db = ZODB.DB(storage)
connection = db.open()
root = connection.root()


def clear_bd():
    root.clear()
    transaction.commit()


def add_user(user_id):
    if str(user_id) not in root:
        user = entity.User(user_id)
        root[str(user_id)] = user
        transaction.commit()


def get_user_min_spread(user_id):
    user = root.get(str(user_id), None)
    if user:
        return user.min_spread
    return None


def save_spread(user_id, min_spread):
    user = root.get(str(user_id), None)

    if user:
        user.set_min_spread(min_spread)
        transaction.commit()


def get_num_request(user_id):
    user = root.get(str(user_id), None)
    if user:
        return user.num_request
    return None


def save_num_request(user_id, num_request):
    user = root.get(str(user_id), None)

    if user:
        user.set_num_request(num_request)
        transaction.commit()


def turn_on_automation(user_id):
    user = root.get(str(user_id), None)

    if user:
        user.turn_on_automation()
        transaction.commit()


def turn_off_automation(user_id):
    user = root.get(str(user_id), None)

    if user:
        user.turn_off_automation()
        transaction.commit()


def get_launch_bot(user_id):
    user = root.get(str(user_id), None)
    if user:
        return user.launch_bot
    return None


def start_bot(user_id):
    user = root.get(str(user_id), None)

    if user:
        user.start_bot()
        transaction.commit()


def stop_bot(user_id):
    user = root.get(str(user_id), None)

    if user:
        user.stop_bot()
        transaction.commit()
