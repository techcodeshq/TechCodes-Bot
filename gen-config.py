#!/usr/bin/env python

import os
import json


def get_var(name):
    var = os.environ.get(name)
    if var is None:
        print(f"Did not supply env var '{name}'")
        return False
    return var


token = get_var("TOKEN")
client_id = get_var("CLIENT_ID")
guild_id = get_var("GUILD_ID")
try:
    testing = int(get_var("TESTING"))
except:
    testing = 1
try:
    peanut_jam = int(get_var("PEANUT_JAM"))
except:
    peanut_jam = 0

if not (token and client_id and guild_id):
    exit(1)

config_fp = open("config.json", "w")
json.dump({"token": token, "clientId": client_id, "guildId": guild_id,
          "testing": testing == 1, "enabled": {"peanut_jam": peanut_jam == 0}}, config_fp)
