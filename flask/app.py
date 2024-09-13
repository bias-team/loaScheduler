from flask import Flask, jsonify, render_template, session, redirect, url_for, request
from flask_login import LoginManager, login_required, login_user, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, init_db, User, Character, Raid, Party, CharClass, RaidType
from datetime import datetime

app = Flask(__name__)

# 데이터베이스 설정
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///game_raid.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = 'your_secret_key_here'  # 세션을 위한 시크릿 키 설정

# 데이터베이스 초기화
init_db(app)

# LoginManager 설정
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/')
def home():
    if current_user.is_authenticated:
        return render_template('index.html', user=current_user)
    return redirect(url_for("login"))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        key = request.form['key']
        user = User.query.filter_by(key=key).first()
        if user:
            login_user(user)
            return redirect(url_for('home'))
        return jsonify({"message": "Invalid key"}), 401
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('home'))

@app.route('/user', methods=['POST'])
def create_user():
    data = request.json
    new_user = User(key=data['key'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created", "id": new_user.id}), 201

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

@app.route('/party', methods=['POST'])
@login_required
def create_party():
    data = request.json
    new_party = Party(
        raidId=data['raidId'],
        charId=data['charId'],
        partyNum=data['partyNum']
    )
    db.session.add(new_party)
    db.session.commit()
    return jsonify({"message": "Party created"}), 201

if __name__ == '__main__':
    app.run(debug=True)