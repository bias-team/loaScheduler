// src/types.ts
export interface Character {
  charId: number;
  charName: string;
  charJob: string;
  charClass: string;
  charLevel: number;
}

export interface Raid {
  id: number;
  name: string;
  partyCount: number;
  parties: number[][];
}