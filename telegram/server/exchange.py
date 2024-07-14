
import requests

from server.base_url import get_url_exchange


def get_response_exchange(market, pair):
    url = get_url_exchange(market, pair)
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        return None


def fetch_exchange_data():
    markets_pairs = [
        ('bingix', 'btcusdt'), ('bingix', 'ethusdt'),
        ('garantex', 'btcusdt'), ('garantex', 'ethusdt'),
        ('bybit', 'btcusdt'), ('bybit', 'btcusdc'), ('bybit', 'ethusdt'), ('bybit', 'ethusdc'),
        ('bitget', 'btcusdt'), ('bitget', 'btcusdc'), ('bitget', 'ethusdt'), ('bitget', 'ethusdc')
    ]

    exchange_pairs = {}

    for market, pair in markets_pairs:
        response = get_response_exchange(market, pair)
        if response:
            if pair not in exchange_pairs:
                exchange_pairs[pair] = []
            exchange_pairs[pair].append(response)

    return exchange_pairs
