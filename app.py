from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import json
import os
import re
from minio import Minio
from minio.error import S3Error
import yaml
import io

app = Flask(__name__)
app.secret_key = "your_secret_key"  # 세션을 위한 비밀 키 설정

# Secret.yaml 파일 읽기
with open("Secret.yaml", "r", encoding="UTF-8") as f:
    secret = yaml.safe_load(f)

use_minio = secret.get("use_minio", False)

# MinIO 클라이언트 설정
if use_minio:
    minio_client = Minio(
        secret["minio"]["endpoint"],
        access_key=secret["minio"]["access_key"],
        secret_key=secret["minio"]["secret_key"],
        secure=secret["minio"]["secure"],
    )

# 버킷 및 파일 이름 설정
RAID_BUCKET = secret["minio"]["bucket_name"]
RAID_FILE = secret["minio"]["raid_file"]
MEMBER_FILE = secret["minio"]["member_file"]

# 파일 경로 설정
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RAID_TABLE_PATH = os.path.join(BASE_DIR, "data", "raid_table.json")
MEMBER_PATH = os.path.join(BASE_DIR, "data", "member.json")


# JSON 파일 읽기
def read_json_from_minio(bucket_name, file_name):
    try:
        response = minio_client.get_object(bucket_name, file_name)
        data = json.loads(response.read())
        response.close()
        response.release_conn()
        return data
    except S3Error as e:
        print(f"Error occurred: {e}")
        return {"raids": []} if file_name == RAID_FILE else {"members": []}


# JSON 파일 쓰기
def write_json_to_minio(data, bucket_name, file_name):
    try:
        json_data = json.dumps(data, ensure_ascii=False, indent=4)
        minio_client.put_object(
            bucket_name,
            file_name,
            io.BytesIO(json_data.encode("utf-8")),
            length=len(json_data),
        )
    except S3Error as e:
        print(f"Error occurred: {e}")


# JSON 파일 읽기 (로컬)
def read_json(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)


# JSON 파일 쓰기 (로컬)
def write_json(data, file_path):
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)


# 초기 데이터 로드
if use_minio:
    raids = read_json_from_minio(RAID_BUCKET, RAID_FILE)
    members = read_json_from_minio(RAID_BUCKET, MEMBER_FILE)
else:
    raids = read_json(RAID_TABLE_PATH)
    members = read_json(MEMBER_PATH)


@app.route("/")
def index():
    if "user_id" in session:
        return render_template("index.html", user_id=session["user_id"])
    return redirect(url_for("login"))


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        user_id = request.form["user_id"]
        if any(member["id"] == user_id for member in members["members"]):
            session["user_id"] = user_id
            return redirect(url_for("index"))
        return render_template(
            "login.html", error="로그인 실패: ID가 존재하지 않습니다."
        )
    return render_template("login.html")


@app.route("/logout")
def logout():
    session.pop("user_id", None)
    return redirect(url_for("login"))


@app.route("/signup", methods=["POST"])
def signup():
    user_id = request.json["user_id"]
    if re.match(r"^[a-zA-Z0-9]{2,20}$", user_id):
        if any(member["id"] == user_id for member in members["members"]):
            return jsonify({"error": "ID가 이미 존재합니다."}), 400
        new_member = {
            "id": user_id,
            "nickname": "임의닉네임",
            "position": "딜러",
            "remark": "1640 백사멸 받피증 극특 등등 메모",
        }
        members["members"].append(new_member)
        if use_minio:
            write_json_to_minio(members, RAID_BUCKET, MEMBER_FILE)
        else:
            write_json(members, MEMBER_PATH)
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
    if "user_id" in session:
        user_id = session["user_id"]
        for raid in raids["raids"]:
            for participant in raid["participants"]:
                participant["is_user_character"] = participant["nickname"] in [
                    member["nickname"]
                    for member in members["members"]
                    if member["id"] == user_id
                ]
        return jsonify(raids)
    return jsonify({"error": "Unauthorized"}), 401


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
    if "user_id" in session:
        new_raid = request.json
        new_raid["creator"] = session["user_id"]  # 레이드 생성자 추가
        raids["raids"].append(new_raid)
        if use_minio:
            write_json_to_minio(raids, RAID_BUCKET, RAID_FILE)
        else:
            write_json(raids, RAID_TABLE_PATH)
        return jsonify(new_raid), 201
    return jsonify({"error": "Unauthorized"}), 401


@app.route("/raids/<string:raid_name>", methods=["PUT"])
def update_raid(raid_name):
    if "user_id" in session:
        updated_raid = request.json
        for raid in raids["raids"]:
            if (
                raid["raid_name"] == raid_name
                and raid.get("creator") == session["user_id"]
            ):
                raid.update(updated_raid)
                if use_minio:
                    write_json_to_minio(raids, RAID_BUCKET, RAID_FILE)
                else:
                    write_json(raids, RAID_TABLE_PATH)
                return jsonify(raid), 200
        return jsonify({"error": "권한이 없습니다."}), 403
    return jsonify({"error": "Unauthorized"}), 401


@app.route("/raids/<string:raid_name>", methods=["DELETE"])
def delete_raid(raid_name):
    if "user_id" in session:
        global raids
        raids["raids"] = [
            raid
            for raid in raids["raids"]
            if not (
                raid["raid_name"] == raid_name
                and raid.get("creator") == session["user_id"]
            )
        ]
        if use_minio:
            write_json_to_minio(raids, RAID_BUCKET, RAID_FILE)
        else:
            write_json(raids, RAID_TABLE_PATH)
        return "", 204
    return jsonify({"error": "Unauthorized"}), 401


@app.route("/raids/<string:raid_name>/add_participant", methods=["POST"])
def add_participant_to_raid(raid_name):
    if "user_id" in session:
        participant = request.json
        if "nickname" not in participant or "position" not in participant:
            return jsonify({"error": "참가자 데이터가 올바르지 않습니다."}), 400
        for raid in raids["raids"]:
            if raid["raid_name"] == raid_name:
                if raid["status"] != "예정":
                    return (
                        jsonify(
                            {
                                "error": "레이드 상태가 예정일 때만 참가자를 추가할 수 있습니다."
                            }
                        ),
                        400,
                    )
                if not any(
                    p["nickname"] == participant["nickname"]
                    for p in raid["participants"]
                ):
                    max_participants = int(raid["raid_max_size"]) + 4
                    if len(raid["participants"]) >= max_participants:
                        return (
                            jsonify(
                                {
                                    "error": "레이드 크기 초과로 참가자를 추가할 수 없습니다."
                                }
                            ),
                            400,
                        )
                    raid["participants"].append(participant)
                    if use_minio:
                        write_json_to_minio(raids, RAID_BUCKET, RAID_FILE)
                    else:
                        write_json(raids, RAID_TABLE_PATH)
                    return jsonify(raid), 201
                else:
                    return jsonify({"error": "이미 등록된 참가자입니다."}), 400
    return jsonify({"error": "Unauthorized"}), 401


@app.route("/members", methods=["POST"])
def add_member():
    if "user_id" in session:
        user_id = session["user_id"]
        new_member = request.json
        new_member["id"] = user_id  # 세션의 사용자 ID를 사용
        members["members"].append(new_member)
        if use_minio:
            write_json_to_minio(members, RAID_BUCKET, MEMBER_FILE)
        else:
            write_json(members, MEMBER_PATH)
        return jsonify(new_member), 201
    return jsonify({"error": "Unauthorized"}), 401


@app.route("/members/<string:nickname>", methods=["DELETE"])
def delete_member(nickname):
    if "user_id" in session:
        user_id = session["user_id"]
        global members
        members["members"] = [
            member
            for member in members["members"]
            if not (member["id"] == user_id and member["nickname"] == nickname)
        ]
        if use_minio:
            write_json_to_minio(members, RAID_BUCKET, MEMBER_FILE)
        else:
            write_json(members, MEMBER_PATH)
        return "", 204
    return jsonify({"error": "Unauthorized"}), 401


@app.route("/members/<string:nickname>", methods=["PUT"])
def update_member(nickname):
    if "user_id" in session:
        user_id = session["user_id"]
        updated_member = request.json
        for member in members["members"]:
            if member["id"] == user_id and member["nickname"] == nickname:
                member.update(updated_member)
                if use_minio:
                    write_json_to_minio(members, RAID_BUCKET, MEMBER_FILE)
                else:
                    write_json(members, MEMBER_PATH)
                return jsonify(member), 200
        return jsonify({"error": "권한이 없습니다."}), 403
    return jsonify({"error": "Unauthorized"}), 401


if __name__ == "__main__":
    app.run(debug=True)
