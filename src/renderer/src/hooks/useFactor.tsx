import { factorAtom } from '@/atoms/factor'
import { FilterType } from '@/types/main'
import { useAtom, useAtomValue } from 'jotai'

export function useFactors({ filters }: { filters: FilterType[] }) {
  const data = useAtomValue(factorAtom)
  let tempData = [...data]
  filters.map((i) => {
    tempData = tempData.filter(
      (factor) =>
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        factor[i.field] == i.value || i.value == ''
    )
  })
  tempData = tempData.filter((i) => !i.is_deleted)
  return [...tempData]
}

export function useFactor(id: string) {
  const data = useAtomValue(factorAtom)
  return data.find((factor) => factor.id == id && !factor.is_deleted)
}

export function useCreateFactor() {
  const [data, setData] = useAtom(factorAtom)
  return {
    mutate: function mutate({ value }: { value: any }) {
      value.created_date = new Date(Date.now()).toISOString()
      value.id = data.length != 0 ? (Number(data[data.length - 1].id) + 1).toString() : '1'
      value.is_deleted = false
      setData([...data, value])
      return {
        value
      }
    }
  }
}

export function useUpdateFactor() {
  const [data, setData] = useAtom(factorAtom)

  return {
    mutate: function mutate({ value, id }: { value: any; id: string }) {
      setData([
        ...data.map((item) => {
          if (item.id == id) {
            item = { ...item, ...value }
          }
          return item
        })
      ])
      return {
        value
      }
    }
  }
}

export function useDeleteFactor() {
  const [data, setData] = useAtom(factorAtom)

  return {
    mutate: ({ id }: { id: string }) => {
      return setData([
        ...data.map((item) => {
          if (item.id == id) {
            item.is_deleted = true
          }
          return item
        })
      ])
    }
  }
}
