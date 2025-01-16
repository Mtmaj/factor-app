import { Button } from '@/Components/Ui/button'
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/Components/Ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/Ui/tooltip'
import { type_docs } from '@/constant/factor'
import { useCustomer } from '@/hooks/useCustomer'
import { useDeleteFactor, useFactor } from '@/hooks/useFactor'
import { FactorPDF } from '@/pages/pdf/factor'
import jalaaliMoment from '@/utils/date'
import { digitsEnToFa } from '@persian-tools/persian-tools'
import { pdf } from '@react-pdf/renderer'
import { Download, Edit2, Trash } from 'lucide-react'
import { Link, useParams } from 'react-router'

export type IfEquals<X, Y, A = X, B = never> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? A : B
export type WritableKeys<T> = {
  [P in keyof T]-?: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P>
}[keyof T]

export const downloadThisLink = (
  url: string,
  name = '',
  linkProps?: Partial<Pick<HTMLAnchorElement, WritableKeys<HTMLAnchorElement>>>
) => {
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.download = name
  if (linkProps) Object.assign(link, linkProps)

  document.body.appendChild(link)

  link.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    })
  )

  document.body.removeChild(link)
}
export const downloadBlob = (blob: Blob, name = '') => {
  const blobUrl = URL.createObjectURL(blob)
  downloadThisLink(blobUrl, name)
  return blobUrl
}

export default function ShowFactorPage() {
  const params = useParams()
  const factorId = params.factorId
  const factor = useFactor(factorId ?? '')
  const { mutate: deleteFactor } = useDeleteFactor()
  const customer = useCustomer((factor ?? { customer_id: '' }).customer_id ?? '')
  if (!factor) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span>۴۰۴ فاکتور مدنظر موجود نیست</span>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span>۴۰۴ کاربر مدنظر موجود نیست</span>
      </div>
    )
  }
  async function downloadPdf(shouldView?: boolean) {
    const pdfBlob = await pdf(<FactorPDF customer={customer!} factor={factor!} />).toBlob()
    if (pdfBlob) {
      if (shouldView) window.open(URL.createObjectURL(pdfBlob))
      else {
        const blobUrl = downloadBlob(
          pdfBlob,
          `${customer?.full_name}-${factor?.id}-${factor?.date}.pdf`
        )
        setTimeout(() => URL.revokeObjectURL(blobUrl), 100)
      }
    }
  }
  return (
    <div className="w-full flex flex-col items-start gap-y-[20px]">
      <h1 className="text-[18px] font-semibold">
        فاکتور به شناسه {digitsEnToFa(factor.id)} برای مشتری{' '}
        <span className="text-crimson-500 hover:underline">{customer.full_name}</span>
      </h1>
      <div className="w-full flex flex-col items-end gap-y-[10px] ">
        <div className="flex flex-row gap-x-[10px]">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => {
                    downloadPdf()
                  }}
                  variant={'outline'}
                  className=" w-[30px] h-[30px]"
                >
                  <Download />
                </Button>
              </TooltipTrigger>
              <TooltipContent>دانلود pdf فاکتور</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to={`edit`}>
                  <Button variant={'outline'} className=" w-[30px] h-[30px]">
                    <Edit2 />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>ویرایش فاکتور</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Dialog>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button
                      variant={'outline'}
                      className="hover:bg-red-100 text-red-600 hover:text-red-600 w-[30px] h-[30px]"
                    >
                      <Trash />
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>حذف فاکتور</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DialogContent className="pt-[45px] flex flex-col gap-y-[20px]">
              <h1 className="font-semibold text-[17px]">
                آیا از حدف فاکتور با شناسه {digitsEnToFa(customer.id)} مطمئن هستید؟
              </h1>
              <div className="flex flex-row gap-x-[10px]">
                <DialogClose>
                  <Button
                    onClick={() => {
                      deleteFactor({ id: customer.id })
                    }}
                    className="rounded-full bg-crimson-500 hover:bg-crimson-600"
                  >
                    بله. حذف شود
                  </Button>
                </DialogClose>
                <DialogClose>
                  <Button className="rounded-full">خیر. منصرف شدم</Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <table className="w-full border font-medium">
          <tr>
            <td className="w-full flex flex-row justify-between p-[30px] border">
              <div className="flex flex-col items-start gap-y-[20px]">
                <span>آدرس : {customer.address ?? 'ندارد'}</span>
                <span>حساب بانکی : {customer.card_id ?? 'ندارد'}</span>
              </div>
              <div className="flex flex-col items-start gap-y-[20px]">
                <span>تلفن : {customer.telephone ?? 'ندارد'}</span>
                <span>موبایل : {digitsEnToFa(customer.phone_number ?? 'ندارد')}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td className="w-full flex flex-row justify-between p-[30px] border">
              <div className="flex flex-col items-start gap-y-[20px]">
                <span>صورت حساب : {customer.full_name ?? 'ندارد'}</span>
                <span>شماره سند : {digitsEnToFa(factor.document_id) ?? 'ندارد'}</span>
              </div>
              <div className="flex flex-col items-start gap-y-[20px]">
                <span>شهر : {customer.city ?? 'ندارد'}</span>
                <span>نوع سند : {type_docs[factor.type_doc as 'sell'] ?? 'ندارد'}</span>
              </div>
              <div className="flex flex-col items-start gap-y-[20px]">
                <span>
                  تاریخ :{' '}
                  {digitsEnToFa(jalaaliMoment(factor.date).format('jYYYY/jMM/jDD')) ?? 'ندارد'}
                </span>
                <span>توسط : {factor.from ?? 'ندارد'}</span>
              </div>
            </td>
          </tr>
          <tr className="w-full">
            <table className="w-full">
              <tr className="w-full">
                <th className="border">ردیف</th>
                <th className="border">شرح</th>
                <th className="border">وزن</th>
                <th className="border">عیار</th>
                <th className="border">فی</th>
                <th className="border">فی کل</th>
              </tr>
              <tr>
                <td className="border text-center py-[5px]">{digitsEnToFa(factor.id)}</td>
                <td className="border text-center">نقره ساچمه</td>
                <td className="border text-center">{digitsEnToFa(factor.weight)} گرم</td>
                <td className="border text-center">۹۹۵+</td>

                <td className="border text-center">
                  {digitsEnToFa(Intl.NumberFormat().format(Math.ceil(factor.quote / 4.6083)))} تومان
                </td>
                <td className="border text-center">
                  {digitsEnToFa(
                    Intl.NumberFormat().format(Math.ceil(factor.quote / 4.6083) * Number(factor.weight))
                  )}{' '}
                  تومان
                </td>
              </tr>
            </table>
          </tr>
          <tr className="">
            <table className="w-full">
              <tr className="w-full">
                <td className="border p-2">
                  مثقال : {digitsEnToFa(Intl.NumberFormat().format(factor.quote))} تومان
                </td>
                <td className="border p-2">
                  جمع وزن : {digitsEnToFa(Intl.NumberFormat().format(Number(factor.weight)))} گرم
                </td>
                <td className="border p-2">
                  جمع سند : {digitsEnToFa(Intl.NumberFormat().format(Number(factor.weight)))} گرم
                </td>
              </tr>
              <tr className="w-full">
                <td className="border p-2">
                  گرم : {digitsEnToFa(Intl.NumberFormat().format(Math.ceil(factor.quote / 4.6083)))}{' '}
                  تومان
                </td>
                <td className="border p-2">
                  وزن با پلاستیک :{' '}
                  {digitsEnToFa(Intl.NumberFormat().format(Number(factor.weight_with_plastic)))} گرم
                </td>
                <td className="border p-2">
                  جمع مبلغ :
                  {digitsEnToFa(
                    Intl.NumberFormat().format(Math.ceil(factor.quote / 4.6083) * Number(factor.weight))
                  )}{' '}
                  تومان
                </td>
              </tr>
            </table>
          </tr>
        </table>
      </div>
    </div>
  )
}
