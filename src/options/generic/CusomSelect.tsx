import AsyncSelect from 'react-select/async'

const filterColors = async (inputValue: string) => {
  const result = await fetch(
    `https://keywords.aiamzads.com/api/keyword-store/keyword-groups?q=test`,
  )
    .then((res) => {
      if (res.ok) return res.json()
    })
    .then((data) => {
      return data.keyword_groups.map((i) => {
        return { value: i.id.toString(), label: i.group_name }
      })
    })

  return result.filter((i) => i.value?.toLowerCase().includes(inputValue?.toLowerCase()))
}

const promiseOptions = (inputValue: string) =>
  new Promise((resolve) => {
    filterColors(inputValue).then((res) => {
      resolve(res)
    })
  }) as any
const CustomSelect: React.FC<{ handleSelectChange: any }> = ({ handleSelectChange }) => {
  return (
    <AsyncSelect
      cacheOptions
      defaultOptions
      loadOptions={promiseOptions}
      onChange={handleSelectChange}
    />
  )
}

export default CustomSelect
