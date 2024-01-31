import { atom } from "recoil";

export const publisherAtom = atom<any|null>({
    key : 'publsiherAtom',
    default : null
})