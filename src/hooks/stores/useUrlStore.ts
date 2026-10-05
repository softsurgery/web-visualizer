import { create } from "zustand";
import { CreateUrlDto, UpdateUrlDto } from "@/types";
import { setDeepValue } from "@/lib/object";

interface UrlStoreData {
  createDto: CreateUrlDto;
  updateDto: UpdateUrlDto;
  createDtoErrors: Record<string, string[]>;
  updateDtoErrors: Record<string, string[]>;
}

const initialState: UrlStoreData = {
  createDto: {
    name: "",
    url: "",
    pointToCenter: false,
  },
  updateDto: {
    name: "",
    url: "",
    pointToCenter: false,
  },
  createDtoErrors: {},
  updateDtoErrors: {},
};

export interface UrlStore extends UrlStoreData {
  set: <T>(name: keyof UrlStoreData, value: T) => void;
  setNested: <T>(path: string, value: T) => void;
  reset: () => void;
  resetCreate: () => void;
  resetUpdate: () => void;
}

export const useUrlStore = create<UrlStore>((set) => ({
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
        { ...(state[rootKey as keyof UrlStoreData] as object) },
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
