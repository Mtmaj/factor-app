import { Button } from '@/Components/Ui/button'
import { DataTable } from '@/Components/Ui/data-table'
import { Input } from '@/Components/Ui/input'
import { useCustomers } from '@/hooks/useCustomer'
import { useFactors } from '@/hooks/useFactor'
import { downloadObjectAsJson } from '@/utils/file'
import { TimerReset } from 'lucide-react'
import { useState } from 'react'
import { columns } from '../factors'
import jalaaliMoment from '@/utils/date'
import { digitsEnToFa } from '@persian-tools/persian-tools'
import { useAtom } from 'jotai'
import { factorAtom } from '@/atoms/factor'
import { customerAtom } from '@/atoms/customer'

export default function HomePage() {
  const [, setFactorJson] = useAtom(factorAtom)
  const [, setCustomerJson] = useAtom(customerAtom)
  const factors = useFactors({
    filters: [
      {
        field: 'id',
        value: ''
      },
      { field: 'date', value: '' },
      { field: 'customer_id', value: '' }
    ]
  })
  const customers = useCustomers({ filters: [] })
  const [files, setFiles] = useState<File[] | null>(null)

  return (
    <div className="w-full flex flex-col items-start gap-y-[10px]">
      <h1 className="text-2xl font-bold">پنل مدیریت فاکتور</h1>
      <div className="border rounded p-[30px] flex flex-col w-full items-start gap-y-[20px]">
        <h2 className="text-xl font-semibold">بکاپ و ذخیره سازی داده</h2>
        <div className="flex flex-row items-center gap-x-[10px]">
          <Button
            className="bg-crimson-500 hover:bg-crimson-600"
            onClick={() => {
              downloadObjectAsJson({ customers: customers, factors: factors }, 'backup-file')
            }}
          >
            <TimerReset />
            دریافت فایل بکاپ
          </Button>
          <div className="relative flex group cursor-pointer">
            <Button variant={'outline'} className="group-hover:bg-gray-100">
              {files != null && files[0] ? files[0].name : 'انتخاب فایل بکاپ'}
            </Button>
            <Input
              onChange={(e) => {
                const file_list = e.currentTarget.files
                if (file_list?.length == 0) {
                  setFiles(null)
                } else {
                  setFiles(Array.prototype.slice.call(file_list))
                }
              }}
              className="absolute opacity-0 cursor-pointer"
              id="picture"
              type="file"
              accept=".json"
            />
          </div>
          {files != null && files[0] && (
            <Button
              onClick={async () => {
                const file_text = await files[0].text()
                const file_json = JSON.parse(file_text)
                console.log(file_json)
                setCustomerJson(file_json.customers)
                setFactorJson(file_json.factors)
                setFiles(null)
              }}
            >
              جایگذاری فایل بکاپ
            </Button>
          )}
        </div>
      </div>
      <div className="w-full flex flex-row mt-[40px] justify-between items-center">
        <h1 className="text-xl font-bold ">فاکتور های اخیر</h1>
        <span>
          درآمد این ماه :{' '}
          {digitsEnToFa(
            Intl.NumberFormat().format(
              sumList(
                factors
                  .filter(
                    (item) =>
                      jalaaliMoment(item.date).isAfter(jalaaliMoment().format('YYYY-MM-01')) &&
                      jalaaliMoment(item.date).isBefore(jalaaliMoment().format('YYYY-MM-31'))
                  )
                  .map((item) => Math.ceil(item.quote / 4.6083) * item.weight)
              )
            )
          )}
        </span>
      </div>

      <DataTable columns={columns} data={factors.reverse().slice(0, 10)} />
    </div>
  )
}

function sumList(list: number[]) {
  let sum = 0
  list.map((item) => {
    sum += item
  })
  return sum
}
