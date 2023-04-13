import { IMenuItem } from "@/models/IChat";
import { IMessage } from "@/models/IMessage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface menuState {
  chats: IMenuItem[] | null;
}

const initialState: menuState = {
  chats: null,
};
export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setMenu: (state, action: PayloadAction<IMenuItem[]>) => {
      state.chats = action.payload;
    },
    messageAdded: (
      state,
      action: PayloadAction<{ message: IMessage; chatId: number }>
    ) => {
      state.chats = state.chats || [];
      let chat = state.chats.find((chat) => chat.id === action.payload.chatId);
      if (chat) {
        chat.lastMessage = action.payload.message;
        state.chats = state.chats.filter((c) => c.id !== chat?.id);
        state.chats = [chat, ...state.chats];
      }
    },
  },
});

export const { setMenu, messageAdded } = menuSlice.actions;

export const selectMenu = (state: any) => state.menu.chats;

export const menuReducer = menuSlice.reducer;
