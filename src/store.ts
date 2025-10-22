import { create } from "zustand";

interface Type {
  msgs: string[];
  setMsgs: (msg: string) => void;
}
export const useMsg = create<Type>((set) => ({
  msgs: [] as Array<string>,
  setMsgs: (msg: string) => set((state) => ({ msgs: [...state.msgs, msg] })),
}));
