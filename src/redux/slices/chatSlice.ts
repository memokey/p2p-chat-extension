import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import ACTIONS from "../../config/actions";

export interface CounterState {
  panelFlag: Boolean;
  profile: any;
  activeUser: String;
  onlineUserList: any[];
  authFlag: Boolean;
}

const initialState: CounterState = {
  panelFlag: false,
  profile: {},
  activeUser: "",
  onlineUserList: [],
  authFlag: false,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    togglePanel: (state, action: PayloadAction<Boolean>) => {
      state.panelFlag = action.payload;
    },
    setProfile: (state, action: PayloadAction<any>) => {
      state.profile = action.payload;
      if(state.profile != {}) {
        state.authFlag = true;
      } else {
        state.authFlag = false;
      }
    },
    setAuthFlag: (state, action: PayloadAction<Boolean>) => {
      state.authFlag = action.payload;
    },
    addOnlineUser: (state, action: PayloadAction<any>) => {
      if(state.onlineUserList.findIndex((s: any) => s.name == action.payload.name) == -1) {
        state.onlineUserList.push(action.payload);
      }
    },
    setOnlineUserList: (state, action: PayloadAction<any>) => {
      state.onlineUserList = action.payload;
    },
    setActiveUser: (state, action: PayloadAction<String>) => {
      state.activeUser = action.payload;
    },
    setUserMsg: (state, action: PayloadAction<any>) => {
      const userIndex = state.onlineUserList.findIndex((s: any) => s.name == state.profile.username);
      if(userIndex != -1) {
        state.onlineUserList[userIndex].msgs.push(action.payload);
      }
    },
  },
});

export const { togglePanel, setProfile, setAuthFlag, addOnlineUser, setOnlineUserList, setActiveUser, setUserMsg } = chatSlice.actions;

export default chatSlice.reducer;
