from persistent import Persistent


class User(Persistent):
    def __init__(self, user_id):
        self.user_id = user_id
        self.launch_bot = False
        self.num_request = None
        self.min_spread = None
        self.automation = None

    def start_bot(self):
        self.launch_bot = True

    def stop_bot(self):
        self.launch_bot = False

    def set_num_request(self, num):
        self.num_request = num

    def set_min_spread(self, min_spread):
        self.min_spread = min_spread

    def turn_on_automation(self):
        self.automation = True

    def turn_off_automation(self):
        self.automation = False
