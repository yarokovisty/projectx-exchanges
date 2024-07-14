BASE_URL = 'http://66.151.40.231:5144'


def get_url_exchange(market, pair):
    return f'{BASE_URL}/exchanges/{market}/{pair}'
