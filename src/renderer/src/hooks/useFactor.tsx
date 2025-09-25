import { factorAtom } from '@/atoms/factor'
import { customerAtom } from '@/atoms/customer'
import { FilterType } from '@/types/main'
import { useAtom, useAtomValue } from 'jotai'

 export function useFactors({ filters }: { filters: FilterType[] }) {
  const data = useAtomValue(factorAtom)
  let tempData = [...data]

  filters.forEach((i) => {
    tempData = tempData.filter(
      // @ts-ignore
      (factor) => factor[i.field] == i.value || i.value == ''
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
  const customers = useAtomValue(customerAtom)

  return {
    mutate: ({ value }: { value: any }) => {
       if (!value.customer_name || value.customer_name.trim() === '') {
        const customer = customers.find((c) => String(c.id) === String(value.customer_id))
        value.customer_name = customer?.full_name ?? 'کاربر ناشناس'
      }

 
      value.id = data.length ? (Number(data[data.length - 1].id) + 1).toString() : '1'
      value.is_deleted = false
      setData([...data, value])

      return { value }
    }
  }
}

 export function useUpdateFactor() {
  const [data, setData] = useAtom(factorAtom)
  const customers = useAtomValue(customerAtom)

  return {
    mutate: ({ value, id }: { value: any; id: string }) => {
       if (!value.customer_name || value.customer_name.trim() === '') {
        const customer = customers.find((c) => String(c.id) === String(value.customer_id))
        value.customer_name = customer?.full_name ?? 'کاربر ناشناس'
      }

 
      setData(data.map((item) => (item.id === id ? { ...item, ...value } : item)))
      return { value }
    }
  }
}

 export function useDeleteFactor() {
  const [data, setData] = useAtom(factorAtom)

  return {
    mutate: ({ id }: { id: string }) => {
      setData(
        data.map((item) =>
          item.id == id ? { ...item, is_deleted: true } : item
        )
      )
    }
  }
}
