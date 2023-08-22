import AsyncCreatableSelect from 'react-select/async-creatable'
const filterColors = async (inputValue: string) => {
  const result = await fetch(
    `https://keywords.aiamzads.com/api/keyword-store/keyword-groups?q=${inputValue}`,
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
    <AsyncCreatableSelect
      cacheOptions
      defaultOptions
      loadOptions={promiseOptions}
      onChange={handleSelectChange}
      onCreateOption={(option) => {
        promiseOptions(option)
      }}
    />
  )
}

export default CustomSelect
