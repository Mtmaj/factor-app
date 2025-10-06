import { Input } from '@/Components/Ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/Ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/Components/Ui/dropdown-menu'
import { Button } from '@/Components/Ui/button'

import { NewspaperIcon } from '@heroicons/react/24/outline'
import { Edit2, Eye, FilterIcon, MoreHorizontal, Plus, Trash2 } from 'lucide-react'

import { CellContext, ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/Components/Ui/data-table'
import { memo, useState } from 'react'
import { useDeleteFactor, useFactors } from '@/hooks/useFactor'
import { Factor } from '@/types/factors'
import { useCustomers } from '@/hooks/useCustomer'
import jalaaliMoment from '@/utils/date'
import { digitsEnToFa } from '@persian-tools/persian-tools'
import { FilterType } from '@/types/main'
import { DatePickerDemo } from '@/Components/Ui/date-picker-jalali'
import moment from 'moment-jalaali'
import { Link } from 'react-router'
import { Dialog, DialogContent } from '@/Components/Ui/dialog'

function ToPersianNumber<type>({ cell }: CellContext<type, unknown>) {
  const raw = cell.getValue()
  const value = raw === null || raw === undefined ? '-' : String(raw)
  return <div className="w-full flex flex-row items-center">{digitsEnToFa(value)}</div>
}

/** اکشن‌ها را به یک کامپوننت مستقل تبدیل کردیم تا استفاده از هوک‌ها مجاز باشد */
const ActionCell = memo(function ActionCell({
  id,
  displayId
}: {
  id: string
  displayId: string | number
}) {
  const [open, onOpenChange] = useState(false)
  const { mutate: deleteFactor } = useDeleteFactor()

  return (
    <>
      <Dialog onOpenChange={onOpenChange} open={open}>
        <DialogContent className="pt-[45px] flex flex-col gap-y-[20px]">
          <h1 className="font-semibold text-[17px]">
            آیا از حدف فاکتور با شناسه {digitsEnToFa(String(displayId))} مطمئن هستید؟
          </h1>
          <div className="flex flex-row gap-x-[10px]">
            <Button
              onClick={() => {
                deleteFactor({ id })
                onOpenChange(false)
              }}
              className="rounded-full bg-crimson-500 hover:bg-crimson-600"
            >
              بله. حذف شود
            </Button>
            <Button onClick={() => onOpenChange(false)} className="rounded-full">
              خیر. منصرف شدم
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <DropdownMenu dir="rtl">
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="items-start">
          <DropdownMenuLabel>تنظیمات فاکتور</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(id)}>
            کپی کردن شناسه
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <Link to={`/factors/${id}`}>
            <DropdownMenuItem>
              <Eye /> مشاهده
            </DropdownMenuItem>
          </Link>
          <Link to={`/factors/${id}/edit`}>
            <DropdownMenuItem>
              <Edit2 /> ویرایش
            </DropdownMenuItem>
          </Link>

          <DropdownMenuItem
            onClick={() => onOpenChange(true)}
            className="bg-red-50 text-red-500 hover:!bg-red-100 hover:!text-red-600"
          >
            <Trash2 /> حذف
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
})

export const columns: ColumnDef<Factor>[] = [
  {
    accessorKey: 'id',
    header: 'شناسه فاکتور',
    cell: ToPersianNumber<Factor>
  },
  {
    accessorKey: 'customer_name',
    header: 'نام کاربر',
    cell: ({ row }) => (
      <div className="w-full flex flex-row items-center">
        {row.original.customer_name?.trim() || 'کاربر ناشناس'}
      </div>
    )
  },
  {
    accessorKey: 'date',
    header: 'تاریخ',
    cell: ({ row }) => {
      const date = row.original.date
      const m = jalaaliMoment(date, 'YYYY-MM-DD', true)
      return <div>{m.isValid() ? digitsEnToFa(m.format('jYYYY/jMM/jDD')) : '-'}</div>
    }
  },
  {
    id: 'totalWeight',
    header: 'وزن کل (گرم)',
    cell: ({ row }) => {
      const products = row.original.products || []
      const total = products.reduce((sum: number, p: any) => sum + Number(p?.weight || 0), 0)
      return digitsEnToFa(String(total))
    }
  },
  {
    enableSorting: false,
    id: 'actions',
    cell: ({ row }) => (
      <ActionCell id={String(row.original.id)} displayId={row.original.id} />
    )
  }
]

export default function FactorPage() {
  const [isHighFilter, setIsHighFilter] = useState(false)
  const [fullNameInput, setFullNameInput] = useState('')
  const [filters, setFilters] = useState<FilterType[]>([
    { field: 'id', value: '' },
    { field: 'date', value: '' },
    { field: 'customer_id', value: '' }
  ])

  const factors = useFactors({ filters }) ?? []
  const customers = useCustomers({ filters: [] }) ?? []

  const factorsWithCustomerName: Factor[] = (factors ?? []).map((f: any) => {
    if (f?.customer_name && String(f.customer_name).trim() !== '') return f
    const customer = customers.find((c: any) => String(c?.id) === String(f?.customer_id))
    return { ...f, customer_name: customer?.full_name || 'کاربر ناشناس' }
  })

  return (
    <div className="w-full flex flex-col items-start gap-y-[20px]">
      <div className="w-full flex flex-row justify-between items-center">
        <div className="flex flex-row items-center gap-x-[5px]">
          <NewspaperIcon
            className="text-[10px] mb-[2px] text-persiangreen-600"
            fontSize={'5px'}
            width={'30px'}
          />
          <h1 className="font-semibold text-[22px]">لیست فاکتور‌ها</h1>
        </div>
        <div className="flex flex-row gap-x-[10px] items-center">
          <Input
            onChange={(e) =>
              setFilters((prev) =>
                prev.map((item) =>
                  item.field === 'id' ? { ...item, value: e.currentTarget.value } : item
                )
              )
            }
            placeholder="جست و جو  با شناسه..."
            className="rounded-full"
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <FilterIcon
                  onClick={() => setIsHighFilter((s) => !s)}
                  className={`${
                    isHighFilter ? 'bg-crimson-500 text-white' : 'text-crimson-500'
                  } transition-all rounded-full p-[10px]`}
                  size={'40px'}
                />
              </TooltipTrigger>
              <TooltipContent>فیلتر پیشرفته</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Link to={'/factors/add'}>
            <Button className="rounded-full bg-crimson-500 hover:bg-crimson-600">
              <Plus />
              ساخت فاکتور جدید
            </Button>
          </Link>
        </div>
      </div>

      {isHighFilter && (
        <div className="w-full flex flex-wrap items-center gap-[15px]">
          <div className="flex flex-col relative items-start gap-y-[2px]">
            <span className="text-[15px]">نام کاربر</span>
            <div className="w-full relative group">
              <Input
                onChange={(e) => {
                  const v = e.currentTarget.value
                  setFullNameInput(v)
                  if (v === '') {
                    setFilters((prev) =>
                      prev.map((item) =>
                        item.field === 'customer_id' ? { ...item, value: '' } : item
                      )
                    )
                  }
                }}
                value={fullNameInput}
              />
              <div className="absolute group-focus-within:visible hover:visible invisible z-[20] mt-[10px] rounded w-full border bg-white flex-col items-start">
                {customers.length === 0 ? (
                  <div className="w-full py-[20px] flex flex-col items-center justify-center">
                    <span>موردی یافت نشد.</span>
                  </div>
                ) : (
                  customers.map((customer: any) => {
                    return (
                      <div
                        key={customer.id}
                        onClickCapture={() => {
                          setFullNameInput(customer.full_name)
                          setFilters((prev) =>
                            prev.map((item) =>
                              item.field === 'customer_id'
                                ? { ...item, value: customer.id }
                                : item
                            )
                          )
                        }}
                        className="w-full cursor-pointer hover:bg-gray-50 px-[10px] py-[5px] flex flex-row justify-start"
                      >
                        <span className="text-[14px]">{customer.full_name}</span>
                      </div>
                    )
                  })
                )}
                <div
                  onClick={() => {
                    setFullNameInput('')
                    setFilters((prev) =>
                      prev.map((item) =>
                        item.field === 'customer_id' ? { ...item, value: '' } : item
                      )
                    )
                  }}
                  className="w-full cursor-pointer hover:bg-gray-50 px-[10px] py-[5px] flex flex-row justify-start"
                >
                  <span className="text-[14px]">حذف فیلتر</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start gap-y-[2px]">
            <span className="text-[15px]">تاریخ فاکتور</span>
            <div className="w-full flex flex-row gap-x-[5px] items-center">
              <DatePickerDemo
                timePicker={false}
                date={moment(
                  (filters.find((i) => i.field === 'date')?.value as string) || Date.now()
                ).toDate()}
                setDate={(date) =>
                  setFilters((prev) =>
                    prev.map((i) =>
                      i.field === 'date'
                        ? { ...i, value: jalaaliMoment(date).format('YYYY-MM-DD') }
                        : i
                    )
                  )
                }
              />
              {filters.find((i) => i.field === 'date')?.value !== '' && (
                <Button
                  variant={'outline'}
                  onClick={() =>
                    setFilters((prev) =>
                      prev.map((i) => (i.field === 'date' ? { ...i, value: '' } : i))
                    )
                  }
                >
                  حذف تاریخ
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      <DataTable<Factor, unknown> columns={columns} data={factorsWithCustomerName ?? []} />
    </div>
  )
}
