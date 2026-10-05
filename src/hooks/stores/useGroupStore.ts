import { create } from "zustand";
import { CreateGroupDto, UpdateGroupDto } from "@/types";
import { setDeepValue } from "@/lib/object";

interface GroupStoreData {
  createDto: CreateGroupDto;
  updateDto: UpdateGroupDto;
  createDtoErrors: Record<string, string[]>;
  updateDtoErrors: Record<string, string[]>;
}

const initialState: GroupStoreData = {
  createDto: {
    name: "",
  },
  updateDto: {
    name: "",
  },
  createDtoErrors: {},
  updateDtoErrors: {},
};

export interface GroupStore extends GroupStoreData {
  set: <T>(name: keyof GroupStoreData, value: T) => void;
  setNested: <T>(path: string, value: T) => void;
  reset: () => void;
  resetCreate: () => void;
  resetUpdate: () => void;
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
  resetCreate: () => {
    set({
      createDto: { ...initialState.createDto },
      createDtoErrors: {},
    });
  },
  resetUpdate: () => {
    set({
      updateDto: { ...initialState.updateDto },
      updateDtoErrors: {},
    });
  },
}));
