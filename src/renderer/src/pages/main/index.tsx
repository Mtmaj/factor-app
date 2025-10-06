import { Button } from '@/Components/Ui/button'
import { DataTable } from '@/Components/Ui/data-table'
import { Input } from '@/Components/Ui/input'
import { useCustomers } from '@/hooks/useCustomer'
import { useFactors } from '@/hooks/useFactor'
import { downloadObjectAsJson } from '@/utils/file'
import { TimerReset } from 'lucide-react'
import { useMemo, useState } from 'react'
import { columns } from '../factors'
import jalaaliMoment from '@/utils/date'
import { digitsEnToFa, digitsFaToEn } from '@persian-tools/persian-tools'
import { useAtom } from 'jotai'
import { factorAtom } from '@/atoms/factor'
import { customerAtom } from '@/atoms/customer'

 function num(x: unknown): number {
  if (x == null) return 0
  const latin = digitsFaToEn(String(x))
  const cleaned = latin.replace(/[^\d.-]/g, '')
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : 0
}

 function parseDateFlexible(d: unknown) {
  if (!d) return jalaaliMoment.invalid()
  const formats = ['YYYY-MM-DD', 'YYYY/M/D', 'YYYY-MM-DDTHH:mm:ssZ', 'YYYY-MM-DDTHH:mm:ss.SSSZ']
  for (const f of formats) {
    const m = jalaaliMoment(String(d), f, true)
    if (m.isValid()) return m
  }
  const m2 = jalaaliMoment(String(d))  
  return m2.isValid() ? m2 : jalaaliMoment.invalid()
}

export default function HomePage() {
  const [, setFactorJson] = useAtom(factorAtom)
  const [, setCustomerJson] = useAtom(customerAtom)

  const factors =
    useFactors({
      filters: [
        { field: 'id', value: '' },
        { field: 'date', value: '' },
        { field: 'customer_id', value: '' }
      ]
    }) ?? []

  const customers = useCustomers({ filters: [] }) ?? []
  const [files, setFiles] = useState<File[] | null>(null)

   
  const incomeThisMonth = useMemo(() => {
    const today = jalaaliMoment()
    const jYearNow = today.jYear()
    const jMonthNow = today.jMonth()  

    return factors
      .filter((f: any) => {
        const m = parseDateFlexible(f?.date)
        return m.isValid() && m.jYear() === jYearNow && m.jMonth() === jMonthNow
      })
      .reduce((sum: number, f: any) => {
        const products: any[] = Array.isArray(f?.products) ? f.products : []
        const fQuote = num(f?.quote)
        const unitByFactor = fQuote > 0 ? Math.ceil(fQuote / 4.608) : 0

        if (products.length > 0) {
           const totalWeight = products.reduce((acc, p) => acc + num(p?.weight), 0)
          if (unitByFactor > 0 && totalWeight > 0) {
            return sum + unitByFactor * totalWeight
          }
           const perProduct = products.reduce((acc, p) => {
            const pq = num(p?.quote)
            const pw = num(p?.weight)
            if (pq > 0 && pw > 0) {
              return acc + Math.ceil(pq / 4.608) * pw
            }
            return acc
          }, 0)
          return sum + perProduct
        }

         const w = num(f?.weight)
        if (unitByFactor > 0 && w > 0) {
          return sum + unitByFactor * w
        }
        return sum
      }, 0)
  }, [factors])

  return (
    <div className="w-full flex flex-col items-start gap-y-[10px]">
      <h1 className="text-2xl font-bold">پنل مدیریت فاکتور</h1>

      <div className="border rounded p-[30px] flex flex-col w-full items-start gap-y-[20px]">
        <h2 className="text-xl font-semibold">بکاپ و ذخیره سازی داده</h2>
        <div className="flex flex-row items-center gap-x-[10px]">
          <Button
            className="bg-crimson-500 hover:bg-crimson-600"
            onClick={() => {
              downloadObjectAsJson({ customers, factors }, 'backup-file')
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
                const fileList = e.currentTarget.files
                setFiles(fileList && fileList.length > 0 ? Array.from(fileList) : null)
              }}
              className="absolute inset-0 opacity-0 cursor-pointer"
              id="backup-json"
              type="file"
              accept="application/json,.json"
            />
          </div>

          {files != null && files[0] && (
            <Button
              onClick={async () => {
                try {
                  const fileText = await files[0].text()
                  const fileJson = JSON.parse(fileText)
                  setCustomerJson(fileJson?.customers ?? [])
                  setFactorJson(fileJson?.factors ?? [])
                } catch (e) {
                  console.error('Invalid backup file:', e)
                } finally {
                  setFiles(null)
                }
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
          درآمد این ماه : {digitsEnToFa(Intl.NumberFormat().format(incomeThisMonth))}
        </span>
      </div>

       <DataTable columns={columns} data={[...factors].reverse().slice(0, 10)} />
    </div>
  )
}
