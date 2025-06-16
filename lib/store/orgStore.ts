// lib/store/orgStore.ts
import { create } from 'zustand';

interface OrgState {
  /** 選択中の法人 ID（未選択なら null） */
  selectedOrgId: string | null;
  /** 法人 ID を更新する */
  setSelectedOrgId: (id: string | null) => void;
}

export const useOrgStore = create<OrgState>((set) => ({
  selectedOrgId: null,
  setSelectedOrgId: (id) => set({ selectedOrgId: id }),
}));
