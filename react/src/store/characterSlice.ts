import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Character {
  charId: number;
  id: number;
  charJob: string;
  charName: string;
  charClass: string;
  charLevel: number;
}

interface CharacterState {
  characters: Character[];
}

const initialState: CharacterState = {
  characters: [],
};

const characterSlice = createSlice({
  name: 'character',
  initialState,
  reducers: {
    addCharacter: (state, action: PayloadAction<Character>) => {
      state.characters.push(action.payload);
    },
    updateCharacter: (state, action: PayloadAction<Character>) => {
      const index = state.characters.findIndex(char => char.charId === action.payload.charId);
      if (index !== -1) {
        state.characters[index] = action.payload;
      }
    },
    deleteCharacter: (state, action: PayloadAction<number>) => {
      state.characters = state.characters.filter(char => char.charId !== action.payload);
    },
  },
});

export const { addCharacter, updateCharacter, deleteCharacter } = characterSlice.actions;
export default characterSlice.reducer;