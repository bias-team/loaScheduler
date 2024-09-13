from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
from datetime import datetime
from enum import Enum
import sqlite3


db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(255), unique=True, nullable=False)
    characters = relationship("Character", back_populates="user")

class CharClass(Enum):
    DEALER = "딜러"
    SUPPORTER = "서포터"


# class CharJob(Enum):
#     DESTROYER = "디스트로이어"
#     WARLOAD = "워로드"
#     BERSERKER = "버서커"
#     HOLYKNIGHT = "홀리나이트"
#     SLAYER = "슬레이어"
#     STRIKER = "스트라이커"
#     BREAKER = "브레이커"
#     BATTLER_MASTER = "배틀마스터"
#     INFIGHTER = "인파이터"
#     SOUL_MASTER = "기공사"
#     LANCE_MASTER = "창술사"
#     DEVIL_HUNTER = "데빌헌터"
#     BLASTER = "블래스터"
#     HAWK_EYE = "호크아이"
#     SCOUTER = "스카우터"
#     GUNSLINGER = "건슬링어"
#     BARD = "바드"
#     SUMMONER = "서머너"
#     ARCANA = "아르카나"
#     SORCERESS = "소서리스"
#     BLADE = "블레이드"
#     DEMONIC = "데모닉"
#     REAPER = "리퍼"
#     SOUL_EATER = "소울이터"
#     ARTIST = "도화가"
#     AEROMANCER = "기상술사"


class Character(db.Model):
    __tablename__ = 'character'
    charId = db.Column(db.Integer, primary_key=True)
    id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    charJob = db.Column(db.String(50))
    charName = db.Column(db.String(12))
    charClass = db.Column(db.Enum(CharClass))
    charLevel = db.Column(db.Integer)
    user = relationship("User", back_populates="characters")
    parties = relationship("Party", back_populates="character")

#레이드 타입
class RaidType(Enum):
    BEAST = "발탄"
    DESIRE = "비아키스"
    FANTASY = "아브렐슈드"
    DISEASE = "일리아칸"
    DARKNESS = "카멘"
    PREV_DESIRE = "에키드나"
    KAYANGEL = "카양겔"
    EVORYTOWER = "상아탑"
    BEHEYMES = "베히모스"
    AEGIR = "에기르"


class Raid(db.Model):
    __tablename__ = 'raid'
    raidId = db.Column(db.Integer, primary_key=True)
    raidName = db.Column(db.String(50))
    raidType = db.Column(db.Enum(RaidType))
    raidCreator = db.Column(db.String(50))
    raidTime = db.Column(db.DateTime, default=datetime.utcnow)
    parties = relationship("Party", back_populates="raid")

class Party(db.Model):
    __tablename__ = 'party'
    raidId = db.Column(db.Integer, db.ForeignKey('raid.raidId'), primary_key=True)
    charId = db.Column(db.Integer, db.ForeignKey('character.charId'), primary_key=True)
    raid = relationship("Raid", back_populates="parties")
    partyNum = db.Column(db.Integer) # 파티 내 순서
    character = relationship("Character", back_populates="parties")

def init_db(app):
    db.init_app(app)
    with app.app_context():
        db.create_all()