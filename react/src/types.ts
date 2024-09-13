// src/types.ts

export enum CharClass {
  DEALER = "딜러",
  SUPPORTER = "서포터"
}

export enum RaidType {
  BEAST = "발탄",
  DESIRE = "비아키스",
  FANTASY = "아브렐슈드",
  DISEASE = "일리아칸",
  DARKNESS = "카멘",
  PREV_DESIRE = "에키드나",
  KAYANGEL = "카양겔",
  EVORYTOWER = "상아탑",
  BEHEYMES = "베히모스",
  AEGIR = "에기르"
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
  // charClass: CharClass;
  charLevel: number;
  userId: string; // 캐릭터 소유자의 ID 추가
}

export interface Raid {
  id: number;
  name: string;
  type: RaidType;
  partyCount: number;
  parties: number[][];
  raidCreatorId: string;
}

export function getCharClassFromJob(job: CharJob): CharClass {
  if (job === CharJob.ARTIST || job === CharJob.BARD || job === CharJob.HOLYKNIGHT) {
    return CharClass.SUPPORTER;
  }
  return CharClass.DEALER;
}

export function getDefaultPartyCount(raidType: RaidType): number {
  switch (raidType) {
    case RaidType.KAYANGEL:
      return 1;
    case RaidType.BEHEYMES:
      return 4;
    case RaidType.EVORYTOWER:
      return 1;
    default:
      return 2;
  }
}

export function createDefaultParties(partyCount: number): number[][] {
  return Array(partyCount).fill([]);
}