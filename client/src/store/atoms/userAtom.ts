import { atom } from "recoil";

export const userAtom = atom<any | null>({
    key : 'userAtom',
    default : null
})