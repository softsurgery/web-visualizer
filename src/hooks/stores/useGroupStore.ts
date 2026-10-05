import { create } from "zustand";
import { CreateGroupDto } from "@/types";
import { setDeepValue } from "@/lib/object";

interface GroupStoreData {
  createDto: CreateGroupDto;
  createDtoErrors: Record<string, string[]>;
}

const initialState: GroupStoreData = {
  createDto: {
    name: "",
  },
  createDtoErrors: {},
};

export interface GroupStore extends GroupStoreData {
  set: <T>(name: keyof GroupStoreData, value: T) => void;
  setNested: <T>(path: string, value: T) => void;
  reset: () => void;
}

export const useGroupStore = create<GroupStore>((set) => ({
  ...initialState,
  set: (name, value) => {
    set((state) => ({
      ...state,
      [name]: value,
    }));
  },
  setNested: (path, value) => {
    const [rootKey, ...restPath] = path.split(".");
    const nestedPath = restPath.join(".");
    set((state) => {
      const updatedRoot = setDeepValue(
        { ...(state[rootKey as keyof GroupStoreData] as object) },
        nestedPath,
        value,
      );
      return {
        ...state,
        [rootKey]: updatedRoot,
      };
    });
  },
  reset: () => {
    set({ ...initialState });
  },
}));
