from flask import Flask, render_template, request, jsonify, redirect, url_for, session
import json
import os
import re

app = Flask(__name__)
app.secret_key = "your_secret_key"  # 세션을 위한 비밀 키 설정

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
    if "user_id" in session:
        return render_template("index.html")
    return redirect(url_for("login"))


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        user_id = request.form["user_id"]
        session["user_id"] = user_id
        return redirect(url_for("index"))
    return render_template("login.html")


@app.route("/logout")
def logout():
    session.pop("user_id", None)
    return redirect(url_for("login"))


@app.route("/signup", methods=["POST"])
def signup():
    user_id = request.json["user_id"]
    if re.match(r"^[a-zA-Z0-9]{2,20}$", user_id):
        session["user_id"] = user_id
        return jsonify({"message": "가입 완료"}), 201
    return (
        jsonify(
            {
                "error": "유효하지 않은 ID입니다. 영문자와 숫자로 구성된 2~20자리 문자열이어야 합니다."
            }
        ),
        400,
    )


@app.route("/raids", methods=["GET"])
def get_raids():
    return jsonify(raids)


@app.route("/members", methods=["GET"])
def get_members():
    if "user_id" in session:
        user_id = session["user_id"]
        user_members = [
            member for member in members["members"] if member["id"] == user_id
        ]
        return jsonify({"members": user_members})
    return jsonify({"error": "Unauthorized"}), 401


@app.route("/raids", methods=["POST"])
def add_raid():
    new_raid = request.json
    raids["raids"].append(new_raid)
    write_json(raids, RAID_TABLE_PATH)
    return jsonify(new_raid), 201


@app.route("/members", methods=["POST"])
def add_member():
    if "user_id" in session:
        user_id = session["user_id"]
        new_member = request.json
        new_member["id"] = user_id  # 세션의 사용자 ID를 사용
        members["members"].append(new_member)
        write_json(members, MEMBER_PATH)
        return jsonify(new_member), 201
    return jsonify({"error": "Unauthorized"}), 401


@app.route("/members/<string:id>", methods=["DELETE"])
def delete_member(id):
    global members
    members["members"] = [member for member in members["members"] if member["id"] != id]
    write_json(members, MEMBER_PATH)
    return "", 204


@app.route("/members/<string:id>", methods=["PUT"])
def update_member(id):
    if "user_id" in session:
        user_id = session["user_id"]
        updated_member = request.json
        for member in members["members"]:
            if member["id"] == id and member["id"] == user_id:
                member.update(updated_member)
                write_json(members, MEMBER_PATH)
                return jsonify(member), 200
    return jsonify({"error": "Unauthorized"}), 401


if __name__ == "__main__":
    app.run(debug=True)
