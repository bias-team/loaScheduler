// src/types.ts

export enum CharClass {
  DEALER = "딜러",
  SUPPORTER = "서포터"
}

export enum CharJob {
  DESTROYER = "디스트로이어",
  WARLOAD = "워로드",
  BERSERKER = "버서커",
  HOLYKNIGHT = "홀리나이트",
  SLAYER = "슬레이어",
  STRIKER = "스트라이커",
  BREAKER = "브레이커",
  BATTLER_MASTER = "배틀마스터",
  INFIGHTER = "인파이터",
  SOUL_MASTER = "기공사",
  LANCE_MASTER = "창술사",
  DEVIL_HUNTER = "데빌헌터",
  BLASTER = "블래스터",
  HAWK_EYE = "호크아이",
  SCOUTER = "스카우터",
  GUNSLINGER = "건슬링어",
  BARD = "바드",
  SUMMONER = "서머너",
  ARCANA = "아르카나",
  SORCERESS = "소서리스",
  BLADE = "블레이드",
  DEMONIC = "데모닉",
  REAPER = "리퍼",
  SOUL_EATER = "소울이터",
  ARTIST = "도화가",
  AEROMANCER = "기상술사"
}

export interface Character {
  charId: number;
  charName: string;
  charJob: CharJob;
  charClass: CharClass;
  charLevel: number;
}

export interface Raid {
  id: number;
  name: string;
  partyCount: number;
  parties: number[][];
}