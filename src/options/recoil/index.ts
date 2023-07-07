import { atom, atomFamily } from 'recoil'

export const arrayAtomFamily = atomFamily({
  key: 'arrayAtomFamily',
  default: [] as [],
})

export const userAtom = atom({
  key: 'userAtom',
  default: { phone: '', password: '', token: '' } as any,
})

export const counterAtom = atom({
  key: 'counterAtom',
  default: 0 as number,
})

export const arrayAtomObject = {
  keywordTags: 'keywordTags',
  ASINTags: 'ASINTags',
}
