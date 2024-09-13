from app import app, db
from models import User, Character, Raid, Party
from sqlalchemy import select


def create_sample_data():
    # 사용자 생성
    user1 = User(key="Pturt")
    user2 = User(key="Pturt2")
    db.session.add_all([user1, user2])
    db.session.commit()

    # 캐릭터 생성
    char1 = Character(id=user1.id, charJob="Devilhunter", charName="dehun", charClass="DEALER", charLevel=1580)
    char2 = Character(id=user1.id, charJob="Breaker", charName="bker", charClass="DEALER", charLevel=1595)
    char3 = Character(id=user2.id, charJob="Bard", charName="bard", charClass="SUPPORTER", charLevel=1600)
    db.session.add_all([char1, char2, char3])
    db.session.commit()

    # 레이드 생성
    raid1 = Raid(raidName="베히모스 반숙 방풀초 10시", raidType="BEAST", raidCreator=user1.key)
    raid2 = Raid(raidName="카멘 하드 3관 트라이", raidType="DARKNESS", raidCreator=user2.key)
    db.session.add_all([raid1, raid2])
    db.session.commit()

    # 파티 생성
    party1 = Party(raidId=raid1.raidId, charId=char1.charId)
    party2 = Party(raidId=raid1.raidId, charId=char3.charId)
    party3 = Party(raidId=raid2.raidId, charId=char2.charId)
    db.session.add_all([party1, party2, party3])
    db.session.commit()


def print_integrated_info():
    print("\n--- Integrated Information ---")

    users = db.session.execute(select(User)).scalars().all()
    for user in users:
        print(f"\nUser: {user.key}")
        for character in user.characters:
            print(
                f"  Character: {character.charName} (Job: {character.charJob}, Class: {character.charClass}, Level: {character.charLevel})")
            for party in character.parties:
                raid = db.session.get(Raid, party.raidId)
                print(f"    Participating in Raid: {raid.raidName} (Type: {raid.raidType})")

    print("\n--- Raid Information ---")
    raids = db.session.execute(select(Raid)).scalars().all()
    for raid in raids:
        print(f"\nRaid: {raid.raidName} (Type: {raid.raidType}, Creator: {raid.raidCreator})")
        for party in raid.parties:
            character = db.session.get(Character, party.charId)
            print(
                f"  Participant: {character.charName} (Job: {character.charJob}, Class: {character.charClass}, Level: {character.charLevel})")


def test_integrated_data():
    with app.app_context():
        # 데이터베이스 초기화
        db.drop_all()
        db.create_all()

        # 샘플 데이터 생성
        create_sample_data()

        # 통합 정보 출력
        print_integrated_info()


if __name__ == "__main__":
    test_integrated_data()