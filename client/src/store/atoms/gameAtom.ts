import { atom } from "recoil";

export const gameAtom = atom<any | null>({
    key : 'gameAtom',
    default : null
})