from sqlite3 import IntegrityError

from flask import Flask, jsonify, render_template, session, redirect, url_for, request
from flask_login import LoginManager, login_required, login_user, logout_user, current_user
from models import db, init_db, User, Character, Raid, Party,CharJob, CharClass, RaidType
from datetime import datetime
import yaml
from flask_cors import CORS

app = Flask(__name__)

# 모든 도메인에서의 CORS 요청 허용
CORS(app, supports_credentials=True)

# Secret.yaml 읽기
with open("Secret.yaml", "r", encoding="UTF-8") as f:
    secret = yaml.safe_load(f)

# 데이터베이스 설정
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///game_raid.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = 'your_secret_key_here'  # 세션을 위한 시크릿 키 설정
app.config['SESSION_PROTECTION'] = 'strong'


# 데이터베이스 초기화
init_db(app)

# LoginManager 설정
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.errorhandler(Exception)
def handle_error(e):
    app.logger.error(f"Unexpected error: {str(e)}")
    return jsonify({"message": "An unexpected error occurred (500)"}), 500

# 홈 화면
@app.route('/')
@login_required
def home():
    if current_user.is_authenticated:
        return render_template('index.html', user=current_user)

# 로그인
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    if 'key' not in data or 'password' not in data:
        return jsonify({"message": "Missing key or password"}), 400

    user = User.query.filter_by(key=data['key']).first()
    if user and user.check_password(data['password']):
        login_user(user)
        return jsonify({"message": "Login successful", "user_id": user.id}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401

# 로그아웃
@app.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully"}), 200

############################################
############################################ 유저
# 유저 생성
@app.route('/user', methods=['POST'])
def create_user():
    data = request.json
    if 'key' not in data or 'password' not in data:
        return jsonify({"message": "Missing key or password"}), 400

    existing_user = User.query.filter_by(key=data['key']).first()
    if existing_user:
        return jsonify({"message": "User with this key already exists"}), 409

    new_user = User(key=data['key'])
    new_user.set_password(data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created", "id": new_user.id}), 201


# 유저 수정
app.route('/user/<int:user_id>', methods=['PUT'])
@login_required
def update_user(user_id):
    if current_user.id != user_id:
        return jsonify({"message": "Unauthorized"}), 403

    user = User.query.get_or_404(user_id)
    data = request.json

    if 'key' in data:
        existing_user = User.query.filter_by(key=data['key']).first()
        if existing_user and existing_user.id != user_id:
            return jsonify({"message": "Key already in use"}), 409
        user.key = data['key']

    if 'password' in data:
        user.set_password(data['password'])

    db.session.commit()
    return jsonify({"message": "User updated"}), 200


############################################
############################################ 캐릭터
# 캐릭터 생성
@app.route('/character', methods=['POST'])
@login_required
def create_character():
    if not current_user.is_authenticated:
        return jsonify({"message": "User is not authenticated"}), 403

    data = request.json
    try:
        new_character = Character(
            id=current_user.id,
            charJob=CharJob[data['charJob']],  # Enum으로 변환
            charName=data['charName'],
            charClass=CharClass[data['charClass']],  # Enum으로 변환
            charLevel=data['charLevel']
        )
        db.session.add(new_character)
        db.session.commit()
        return jsonify({"message": "Character created", "id": new_character.charId}), 201
    except Exception as e:
        app.logger.error(f"Error creating character: {str(e)}")
        return jsonify({"message": "Error while creating character"}), 500
# 캐릭터 조회
@app.route('/character/<int:char_id>', methods=['GET'])
@login_required
def get_character(char_id):
    app.logger.info(f"Accessing character {char_id}")

    # ID 존재하지 않으면 404 에러
    character = Character.query.get_or_404(char_id)

    return jsonify({
        "charId": character.charId,
        "userId": character.id,
        "charJob": character.charJob.value,  #### 이 미친 ENUM이 날 힘들게해
        "charName": character.charName,
        "charClass": character.charClass.value,
        "charLevel": character.charLevel
    }), 200

# 캐릭터 수정
@app.route('/character/<int:char_id>', methods=['PUT'])
@login_required
def update_character(char_id):
    character = Character.query.get_or_404(char_id)

    # 본인 소유 캐릭터가 아니면 비승인
    if character.id != current_user.id:
        return jsonify({"message": "Unauthorized"}), 403

    data = request.json

    try:
        if 'charJob' in data:
            character.charJob = CharJob[data['charJob']]
        if 'charName' in data:
            character.charName = data['charName']
        if 'charClass' in data:
            character.charClass = CharClass[data['charClass']]
        if 'charLevel' in data:
            character.charLevel = data['charLevel']

        db.session.commit()
        return jsonify({"message": "Character updated"}), 200
    except KeyError as e:
        return jsonify({"message": f"Invalid value for {str(e)}"}), 400
    except Exception as e:
        app.logger.error(f"Error updating character: {str(e)}")
        return jsonify({"message": "Error while updating character"}), 500


############################################
############################################ 레이드

# 레이드 생성
@app.route('/raid', methods=['POST'])
@login_required
def create_raid():
    data = request.json

    # 필수 필드 체크
    if not all(key in data for key in ('raidName', 'raidType')):
        return jsonify({"message": "Missing required fields"}), 400

    # raidTime 처리
    if 'raidTime' in data:
        try:
            raid_time = datetime.fromisoformat(data['raidTime'])
        except ValueError:
            return jsonify({"message": "Invalid raidTime format, use ISO 8601"}), 400
    else:
        raid_time = datetime.utcnow()  # 기본값으로 현재 시간 사용

    try:
        new_raid = Raid(
            raidName=data['raidName'],
            raidType=RaidType[data['raidType']],  # 문자열을 Enum으로 변환
            raidCreator=current_user.key,
            raidTime=raid_time  # datetime 객체로 설정
        )
        db.session.add(new_raid)
        db.session.commit()
        return jsonify({"message": "Raid created", "id": new_raid.raidId}), 201

    except Exception as e:
        app.logger.error(f"Error creating raid: {str(e)}")
        return jsonify({"message": "Error while creating raid"}), 500
# 레이드 조회
@app.route('/raid/<int:raid_id>', methods=['GET'])
@login_required
def get_raid(raid_id):
    try:
        raid = Raid.query.get_or_404(raid_id)

        return jsonify({
            "raidId": raid.raidId,
            "raidName": raid.raidName,
            "raidType": raid.raidType.value,
            "raidCreator": raid.raidCreator,
            "raidTime": raid.raidTime.isoformat()
        }), 200

    except Exception as e:
        app.logger.error(f"Error retrieving raid {raid_id}: {str(e)}")
        return jsonify({"message": "Error while getting raid"}), 500

# 레이드 수정
@app.route('/raid/<int:raid_id>', methods=['PUT'])
@login_required
def update_raid(raid_id):
    raid = Raid.query.get_or_404(raid_id)

    # 레이드 생성자만 수정 가능
    if raid.raidCreator != current_user.key:
        app.logger.warning(f"Unauthorized update attempt by user {current_user.key} on raid {raid_id}")
        return jsonify({"message": "Unauthorized"}), 403
    data = request.json

    try:
        if 'raidName' in data :
            raid.raidName = data['raidName']
        if 'raidType' in data :
            raid.raidType = RaidType[data['raidType']]
        if 'raidTime' in data :
            raid.raidTime = data['raidName']

        db.session.commit()
        return jsonify({"message": "Raid updated"}), 200

    except ValueError as e:
        return jsonify({"message": str(e)}), 400
    except Exception as e:
        app.logger.error(f"Error updating raid {raid_id}: {str(e)}")
        return jsonify({"message": "An error occurred while updating the raid"}), 500


# 레이드 삭제
@app.route('/raid/<int:raid_id>', methods=['DELETE'])
@login_required
def delete_raid(raid_id):
    try:
        raid = Raid.query.get_or_404(raid_id)

        if raid.raidCreator != current_user.key:
            app.logger.warning(f"Unauthorized delete attempt by user {current_user.key} on raid {raid_id}")
            return jsonify({"message": "Unauthorized"}), 403

        db.session.delete(raid)
        db.session.commit()

        return jsonify({"message": "Raid deleted", "raidId": raid_id}), 200

    except Exception as e:
        app.logger.error(f"Error deleting raid {raid_id}: {str(e)}")
        return jsonify({"message": "An error occurred while deleting the raid"}), 500


############################################
############################################ 파티 (공대)

# 공대 생성
@app.route('/party', methods=['POST'])
@login_required
def create_party():
    data = request.json

    # 필수 필드 체크
    if not all(key in data for key in ('raidId', 'charId')):
        return jsonify({"message": "Missing required fields: 'raidId', 'charId'"}), 400

    try:

        # 새로운 파티 생성
        new_party = Party(
            raidId=data['raidId'],
            charId=data['charId'],
        )

        # 데이터베이스에 추가
        db.session.add(new_party)
        db.session.commit()

        return jsonify({"message": "Party created", "partyId": new_party.partyId}), 201


    except IntegrityError as e:

        app.logger.error(f"IntegrityError: {str(e)}. Data: {data}")

        return jsonify({"message": "Party with this raidId and charId already exists"}), 409

# 특정 파티 조회
@app.route('/party/<int:party_id>', methods=['GET'])
@login_required
def get_party(party_id):
    try:
        party = Party.query.get_or_404(party_id)

        return jsonify({
            "partyId": party.partyId,
            "raidId": party.raidId,
            "charId": party.charId,
        }), 200

    except Exception as e:
        app.logger.error(f"Error retrieving party {party_id}: {str(e)}")
        return jsonify({"message": "Error while getting party"}), 500


# 레이드의 모든 파티 조회
@app.route('/raid/<int:raid_id>/parties', methods=['GET'])
@login_required
def get_parties_by_raid(raid_id):
    try:
        parties = Party.query.filter_by(raidId=raid_id).all()

        parties_list = [{
            "partyId": party.partyId,
            "raidId": party.raidId,
            "charId": party.charId,
        } for party in parties]

        return jsonify(parties_list), 200

    except Exception as e:
        app.logger.error(f"Error retrieving parties for raid {raid_id}: {str(e)}")
        return jsonify({"message": "Error while getting parties"}), 500


# 파티 삭제
@app.route('/party/<int:party_id>', methods=['DELETE'])
@login_required
def delete_party(party_id):
    party = Party.query.get_or_404(party_id)

    # 레이드 생성자 확인
    raid = Raid.query.get(party.raidId)

    # 파티 생성자/ 레이드 생성자가 파티 삭제 가능
    if party.charId != current_user.id and (raid is None or raid.raidCreator != current_user.key):
        return jsonify({"message": "Unauthorized"}), 403

    try:
        db.session.delete(party)
        db.session.commit()
        return jsonify({"message": "Party deleted"}), 200

    except Exception as e:
        app.logger.error(f"Error deleting party: {str(e)}")
        return jsonify({"message": "Error while deleting party"}), 500

if __name__ == '__main__':
    app.run(debug=True)