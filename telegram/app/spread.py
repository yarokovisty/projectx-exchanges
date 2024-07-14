from itertools import combinations

from server.exchange import *


def find_best_spread_for_pair(data):
    best_buy = None
    best_sell = None
    best_profit = None
    best_spread = float('-inf')

    for buy_item, sell_item in combinations(data, 2):
        spread = sell_item['price']['sell'] - buy_item['price']['buy']
        if spread > best_spread:
            best_profit = spread
            best_spread = ((sell_item['price']['sell'] / buy_item['price']['buy']) - 1) * 100
            best_buy = buy_item
            best_sell = sell_item

    return best_profit, best_spread, best_buy, best_sell


def find_best_spread():
    exchange_pairs = fetch_exchange_data()
    best_buy = None
    best_sell = None
    best_profit = None
    best_spread = float('-inf')

    for pair in exchange_pairs.keys():
        profit_item, spread_item, buy_item, sell_item = find_best_spread_for_pair(exchange_pairs[pair])

        if spread_item > best_spread:
            best_buy = buy_item
            best_sell = sell_item
            best_profit = profit_item
            best_spread = spread_item

    return round(best_profit, 2), round(best_spread, 2), best_buy, best_sell
