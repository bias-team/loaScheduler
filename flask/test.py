import os
import sqlite3


def check_tables(db_file):
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()

    # 모든 테이블 목록 가져오기
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()

    print("Tables in the database:")
    for table in tables:
        print(table[0])
        # 각 테이블의 스키마 출력
        cursor.execute(f"PRAGMA table_info({table[0]})")
        columns = cursor.fetchall()
        print(f"Columns in {table[0]}:")
        for column in columns:
            print(f"  {column[1]} ({column[2]})")
        print()

    conn.close()


# 사용 예
check_tables('lostarkRaid.db')