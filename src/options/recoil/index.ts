import { atom, atomFamily } from 'recoil'

export const arrayAtomFamily = atomFamily({
  key: 'arrayAtomFamily',
  default: [] as [],
})

export const arrayAtomObject = {
  keywordTags: 'keywordTags',
  ASINTags: 'ASINTags',
}
