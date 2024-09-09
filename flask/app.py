from flask import Flask,jsonify, render_template, session, redirect, url_for, request
import yaml
from flask_login import login_required, login_user, logout_user, current_user
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, init_db, User, Character, Raid, Party, CharClass, RaidType
from datetime import datetime

app = Flask(__name__)

# 모든 도메인에서의 CORS 요청 허용
CORS(app, supports_credentials=True)

# Secret.yaml 읽기
with open("Secret.yaml", "r", encoding="UTF-8") as f:
    secret = yaml.safe_load(f)
@app.route('/')
def home():
    if "userId" in session:
        return render_template('index.html', userId =session["userId"])
    return redirect(url_for("login"))

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(key=data['key']).first()
    if user and user.check_password(data['password']):
        login_user(user)
        return jsonify({"message": "Logged in successfully"}), 200
    return jsonify({"message": "Invalid username or password"}), 401

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully"}), 200

@app.route('/user', methods=['POST'])
def create_user():
    data = request.json
    new_user = User(key=data['key'])
    new_user.set_password(data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created", "id": new_user.id}), 201

@app.route('/user/<int:user_id>', methods=['PUT'])
@login_required
def update_user(user_id):
    if current_user.id != user_id:
        return jsonify({"message": "Unauthorized"}), 403
    user = User.query.get_or_404(user_id)
    data = request.json
    user.key = data.get('key', user.key)
    if 'password' in data:
        user.set_password(data['password'])
    db.session.commit()
    return jsonify({"message": "User updated"}), 200

# Character operations (CRU)
@app.route('/character', methods=['POST'])
@login_required
def create_character():
    data = request.json
    new_character = Character(
        id=current_user.id,
        charJob=data['charJob'],
        charName=data['charName'],
        charClass=CharClass(data['charClass']),
        charLevel=data['charLevel']
    )
    db.session.add(new_character)
    db.session.commit()
    return jsonify({"message": "Character created", "id": new_character.charId}), 201

@app.route('/character/<int:char_id>', methods=['GET'])
@login_required
def get_character(char_id):
    character = Character.query.get_or_404(char_id)
    if character.id != current_user.id:
        return jsonify({"message": "Unauthorized"}), 403
    return jsonify({
        "charId": character.charId,
        "userId": character.id,
        "charJob": character.charJob,
        "charName": character.charName,
        "charClass": character.charClass.value,
        "charLevel": character.charLevel
    }), 200

@app.route('/character/<int:char_id>', methods=['PUT'])
@login_required
def update_character(char_id):
    character = Character.query.get_or_404(char_id)
    if character.id != current_user.id:
        return jsonify({"message": "Unauthorized"}), 403
    data = request.json
    character.charJob = data.get('charJob', character.charJob)
    character.charName = data.get('charName', character.charName)
    character.charClass = CharClass(data.get('charClass', character.charClass.value))
    character.charLevel = data.get('charLevel', character.charLevel)
    db.session.commit()
    return jsonify({"message": "Character updated"}), 200

# Raid operations (CRUD)
@app.route('/raid', methods=['POST'])
@login_required
def create_raid():
    data = request.json
    new_raid = Raid(
        raidName=data['raidName'],
        raidType=RaidType(data['raidType']),
        raidCreator=current_user.key,
        raidTime=datetime.fromisoformat(data['raidTime'])
    )
    db.session.add(new_raid)
    db.session.commit()
    return jsonify({"message": "Raid created", "id": new_raid.raidId}), 201

@app.route('/raid/<int:raid_id>', methods=['GET'])
@login_required
def get_raid(raid_id):
    raid = Raid.query.get_or_404(raid_id)
    return jsonify({
        "raidId": raid.raidId,
        "raidName": raid.raidName,
        "raidType": raid.raidType.value,
        "raidCreator": raid.raidCreator,
        "raidTime": raid.raidTime.isoformat()
    }), 200

@app.route('/raid/<int:raid_id>', methods=['PUT'])
@login_required
def update_raid(raid_id):
    raid = Raid.query.get_or_404(raid_id)
    if raid.raidCreator != current_user.key:
        return jsonify({"message": "Unauthorized"}), 403
    data = request.json
    raid.raidName = data.get('raidName', raid.raidName)
    raid.raidType = RaidType(data.get('raidType', raid.raidType.value))
    raid.raidTime = datetime.fromisoformat(data.get('raidTime', raid.raidTime.isoformat()))
    db.session.commit()
    return jsonify({"message": "Raid updated"}), 200

@app.route('/raid/<int:raid_id>', methods=['DELETE'])
@login_required
def delete_raid(raid_id):
    raid = Raid.query.get_or_404(raid_id)
    if raid.raidCreator != current_user.key:
        return jsonify({"message": "Unauthorized"}), 403
    db.session.delete(raid)
    db.session.commit()
    return jsonify({"message": "Raid deleted"}), 200

if __name__ == '__main__':
    app.run(debug=True)


