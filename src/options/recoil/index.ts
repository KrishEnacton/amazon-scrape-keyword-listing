import { atom, atomFamily } from 'recoil'

export const arrayAtomFamily = atomFamily({
  key: 'arrayAtomFamily',
  default: [] as [],
})

export const userAtom = atom({
  key: 'userAtom',
  default: { phone: '', password: '', token: '' } as any,
})

export const arrayAtomObject = {
  keywordTags: 'keywordTags',
  ASINTags: 'ASINTags',
}
