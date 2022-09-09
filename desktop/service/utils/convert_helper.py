import json
import ast


def stringToDict(s):
    s = str(s, "utf-8")
    return ast.literal_eval(s)


def dictToString(d):
    def change_type(byte):
        if isinstance(byte, bytes):
            return str(byte, encoding="utf-8")
        return json.JSONEncoder.default(byte)

    return json.dumps(d, cls=change_type)
