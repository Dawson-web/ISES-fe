import { create } from "zustand";

interface IProps {
  bears: number;
  increasePopulation: () => void;
  removeAllBears: () => void;
}

const useStore = create<IProps>((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
  updateBears: (newBears: number) => set({ bears: newBears }),
}));

export default useStore;
