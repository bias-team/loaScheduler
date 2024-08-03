from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__)

# 파일 경로 설정
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RAID_TABLE_PATH = os.path.join(BASE_DIR, "data", "raid_table.json")
MEMBER_PATH = os.path.join(BASE_DIR, "data", "member.json")


# JSON 파일 읽기
def read_json(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)


# JSON 파일 쓰기
def write_json(data, file_path):
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)


# 초기 데이터 로드
raids = read_json(RAID_TABLE_PATH)
members = read_json(MEMBER_PATH)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/raids", methods=["GET"])
def get_raids():
    return jsonify(raids)


@app.route("/members", methods=["GET"])
def get_members():
    return jsonify(members)


@app.route("/raids", methods=["POST"])
def add_raid():
    new_raid = request.json
    raids["raids"].append(new_raid)
    write_json(raids, RAID_TABLE_PATH)
    return jsonify(new_raid), 201


@app.route("/members", methods=["POST"])
def add_member():
    new_member = request.json
    members["members"].append(new_member)
    write_json(members, MEMBER_PATH)
    return jsonify(new_member), 201


@app.route("/members/<string:nickname>", methods=["DELETE"])
def delete_member(nickname):
    global members
    members["members"] = [
        member for member in members["members"] if member["nickname"] != nickname
    ]
    write_json(members, MEMBER_PATH)
    return "", 204


@app.route("/members/<string:nickname>", methods=["PUT"])
def update_member(nickname):
    updated_member = request.json
    for member in members["members"]:
        if member["nickname"] == nickname:
            member.update(updated_member)
            write_json(members, MEMBER_PATH)
            return jsonify(member), 200
    return jsonify({"error": "Member not found"}), 404


if __name__ == "__main__":
    app.run(debug=True)
