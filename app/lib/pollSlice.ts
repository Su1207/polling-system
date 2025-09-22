import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Option {
  option: string;
  isCorrect: boolean;
  count: number;
}

interface PollState {
  currentPoll: {
    _id: string;
    question: string;
    options: Option[];
    timer: number;
    status: "active";
  } | null;
  pollHistory: any[];
  votes?: { [key: number]: number };
}

const initialState: PollState = {
  currentPoll: null,
  pollHistory: [],
  votes: {},
};

const pollSlice = createSlice({
  name: "poll",
  initialState,
  reducers: {
    setCurrentPoll: (
      state,
      action: PayloadAction<PollState["currentPoll"]>
    ) => {
      state.currentPoll = action.payload;
    },
    setVotes: (state, action: PayloadAction<PollState["votes"]>) => {
      state.votes = action.payload;
    },
    updateResults: (state, action: PayloadAction<Option[]>) => {
      if (state.currentPoll) {
        state.currentPoll.options = action.payload;
      }
    },
  },
});

export const { setCurrentPoll, updateResults, setVotes } = pollSlice.actions;
export default pollSlice.reducer;
