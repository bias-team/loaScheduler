from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
from datetime import datetime
from enum import Enum
import os
import hashlib

db = SQLAlchemy()

########################### 사용자 - User
class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)  # 고유 ID값
    key = db.Column(db.String(255), unique=True, nullable=False)  # 사용자 지정 ID
    password = db.Column(db.String(64), nullable=False)  # 비밀번호
    salt = db.Column(db.String(32), nullable=False)  # 해시용 소금 값
    characters = db.relationship("Character", back_populates="user")

    def set_password(self, password):
        self.salt = os.urandom(16).hex()
        self.password = self._hash_password(password, self.salt)

    def check_password(self, password):
        return self.password == self._hash_password(password, self.salt)

    @staticmethod
    def _hash_password(password, salt):
        return hashlib.sha256((password + salt).encode()).hexdigest()

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return str(self.id)



########################### 캐릭터 - Character

# 캐릭터 클래스
class CharClass(Enum):
    DEALER = "딜러"
    SUPPORTER = "서포터"

# 캐릭터 직업
class CharJob(Enum):
    DESTROYER = "디스트로이어"
    WARLOAD = "워로드"
    BERSERKER = "버서커"
    HOLYKNIGHT = "홀리나이트"
    SLAYER = "슬레이어"
    STRIKER = "스트라이커"
    BREAKER = "브레이커"
    BATTLER_MASTER = "배틀마스터"
    INFIGHTER = "인파이터"
    SOUL_MASTER = "기공사"
    LANCE_MASTER = "창술사"
    DEVIL_HUNTER = "데빌헌터"
    BLASTER = "블래스터"
    HAWK_EYE = "호크아이"
    SCOUTER = "스카우터"
    GUNSLINGER = "건슬링어"
    BARD = "바드"
    SUMMONER = "서머너"
    ARCANA = "아르카나"
    SORCERESS = "소서리스"
    BLADE = "블레이드"
    DEMONIC = "데모닉"
    REAPER = "리퍼"
    SOUL_EATER = "소울이터"
    ARTIST = "도화가"
    AEROMANCER = "기상술사"
class Character(db.Model):

    MAX_LEVEL = 1710
    MIN_LEVEL = 0
    __tablename__ = 'character'
    charId = db.Column(db.Integer, primary_key=True)
    id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    charJob = db.Column(db.Enum(CharJob))
    charName = db.Column(db.String(12))
    charClass = db.Column(db.Enum(CharClass))
    charLevel = db.Column(db.Integer, default = 0)
    user = relationship("User", back_populates="characters")
    parties = relationship("Party", back_populates="character", cascade="all, delete-orphan")

    def level_up(self):
        if self.charLevel < self.MAX_LEVEL:
            self.charLevel += 0.5
            db.session.commit()
        else:
            raise ValueError("최대 레벨입니다.")

    def level_down(self):
        if self.charLevel > self.MIN_LEVEL:
            self.charLevel -= 0.5
            db.session.commit()
        else:
            raise ValueError("이미 최소 레벨입니다.")

########################### 레이드 - Raid

# 레이드 타입
class RaidType(Enum):
    BEAST = "발탄"
    DESIRE = "비아키스"
    FANTASY = "아브렐슈드"
    DISEASE = "일리아칸"
    DARKNESS = "카멘"
    OVERTURE = "서막 : 붉어진 백야의 나선"
    ACT1 = "1막 : 대지를 부수는 업화의 궤적"
    ACT2 = "2막 : 부유하는 악몽의 진혼곡"
    KAYANGEL = "카양겔"
    EVORYTOWER = "상아탑"
    BEHEYMES = "베히모스"


class Raid(db.Model):
    __tablename__ = 'raid'
    raidId = db.Column(db.Integer, primary_key=True)
    raidName = db.Column(db.String(50))
    raidType = db.Column(db.Enum(RaidType))
    raidCreator = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    raidTime = db.Column(db.DateTime, default=datetime.utcnow)
    parties = relationship("Party", back_populates="raid", cascade="all, delete-orphan")


########################### 파티 - Party ( 캐릭터 - 레이드 )

class Party(db.Model):
    __tablename__ = 'party'
    partyId = db.Column(db.Integer, primary_key=True)
    raidId = db.Column(db.Integer, db.ForeignKey('raid.raidId'))
    charId = db.Column(db.Integer, db.ForeignKey('character.charId'))
    raid = relationship("Raid", back_populates="parties")
    character = relationship("Character", back_populates="parties")

def init_db(app):
    db.init_app(app)
    with app.app_context():
        db.create_all()