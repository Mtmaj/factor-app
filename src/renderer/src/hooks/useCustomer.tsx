import { customerAtom } from '@/atoms/customer'
import { Customer } from '@/types/factors'
import { useAtom, useAtomValue } from 'jotai'

export function useCustomers({
  filters
}: {
  filters: {
    field: string
    value: string
  }[]
}) {
  const data = useAtomValue(customerAtom)
  let tempData = [...data]
  filters.map((i) => {
    tempData = tempData.filter(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      (customer) => customer[i.field].includes(i.value)
    )
  })
  tempData = tempData.filter((i) => !i.is_deleted)
  return [...tempData]
}

export function useCustomer(id: string) {
  const data = useAtomValue(customerAtom)
  return data.find((customer) => customer.id == id && !customer.is_deleted)
}

export function useCreateCustomer() {
  const [data, setData] = useAtom(customerAtom)
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

export function useUpdateCustomer() {
  const [data, setData] = useAtom(customerAtom)

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

export function useDeleteCustomer({ value, id }: { value: Customer; id: string }) {
  const [data, setData] = useAtom(customerAtom)
  setData([
    ...data.map((item) => {
      if (item.id == id) {
        item.is_deleted = true
      }
      return item
    })
  ])
  return {
    id,
    value
  }
}
