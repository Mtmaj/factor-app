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
import { Link, useNavigate, useParams } from 'react-router-dom'

export default function ShowFactorPage() {
  const params = useParams<{ id?: string; factorId?: string }>()
  const factorId = params.id ?? params.factorId ?? ''
  const navigate = useNavigate()
  const factor = useFactor(factorId)
  const { mutate: deleteFactor } = useDeleteFactor()
  const customer = useCustomer(factor?.customer_id ?? '')

  if (!factorId || !factor) {
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

  const pricePerGram = Math.ceil(Number(factor.quote) / 4.608)
  const totalWeight = (factor.products ?? []).reduce((s, p) => s + Number(p.weight || 0), 0)
  const totalWeightWithPlastic = (factor.products ?? []).reduce(
    (s, p) => s + Number(p.weight_with_plastic || 0),
    0
  )
  const totalAmount = totalWeight * pricePerGram

  const factorForPdf = {
    ...factor,
    weight: String(totalWeight),
    weight_with_plastic: String(totalWeightWithPlastic)
  }

  async function downloadPdf(shouldView?: boolean) {
    const pdfBlob = await pdf(
      <FactorPDF customer={customer!} factor={factorForPdf as any} />
    ).toBlob()
    if (!pdfBlob) return
    const blobUrl = URL.createObjectURL(pdfBlob)
    if (shouldView) window.open(blobUrl)
    else {
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = `${customer!.full_name}-${factor!.id}-${factor!.date}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
    }
    setTimeout(() => URL.revokeObjectURL(blobUrl), 100)
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
                  onClick={() => downloadPdf()}
                  variant="outline"
                  className="w-[30px] h-[30px]"
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
                  <Button variant="outline" className="w-[30px] h-[30px]">
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
                      variant="outline"
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
                آیا از حذف فاکتور با شناسه {digitsEnToFa(factor.id)} مطمئن هستید؟
              </h1>
              <div className="flex flex-row gap-x-[10px]">
                <DialogClose>
                  <Button
                    onClick={() => {
                      deleteFactor({ id: factor.id })
                      navigate('/factors')
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

        <div className="w-full border rounded-md overflow-hidden">
          <div className="grid md:grid-cols-3 grid-cols-1 gap-4 p-4 border-b">
            <div className="flex flex-col gap-2">
              <span>صورت‌حساب: {customer.full_name || 'ندارد'}</span>
              <span>شماره سند: {digitsEnToFa(factor.document_id) || 'ندارد'}</span>
              <span>
                تاریخ: {digitsEnToFa(jalaaliMoment(factor.date).format('jYYYY/jMM/jDD')) || 'ندارد'}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span>شهر: {customer.city || 'ندارد'}</span>
              <span>
                نوع سند: {type_docs[factor.type_doc as keyof typeof type_docs] || 'ندارد'}
              </span>
              <span>توسط: {factor.from || 'ندارد'}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span>آدرس: {customer.address || 'ندارد'}</span>
              <span>حساب بانکی: {customer.card_id || 'ندارد'}</span>
              <span>موبایل: {digitsEnToFa(customer.phone_number || 'ندارد')}</span>
            </div>
          </div>

          <div className="w-full overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-2">ردیف</th>
                  <th className="border p-2">شماره سریال</th>
                  <th className="border p-2">شرح</th>
                  <th className="border p-2">وزن (گرم)</th>
                  <th className="border p-2">وزن با پلاستیک (گرم)</th>
                  <th className="border p-2">عیار</th>
                  <th className="border p-2">فی (تومان)</th>
                  <th className="border p-2">فی کل (تومان)</th>
                </tr>
              </thead>
              <tbody>
                {(factor.products ?? []).map((p, idx) => {
                  const w = Number(p.weight || 0)
                  const rowTotal = w * pricePerGram
                  return (
                    <tr key={idx}>
                      <td className="border p-2 text-center">{digitsEnToFa(String(idx + 1))}</td>
                      <td className="border p-2 text-center">{p.serial_number || '-'}</td>
                      <td className="border p-2 text-center">نقره ساچمه</td>
                      <td className="border p-2 text-center">{digitsEnToFa(String(w))}</td>
                      <td className="border p-2 text-center">
                        {digitsEnToFa(String(p.weight_with_plastic || '0'))}
                      </td>
                      <td className="border p-2 text-center">۹۹۵+</td>
                      <td className="border p-2 text-center">
                        {digitsEnToFa(Intl.NumberFormat().format(pricePerGram))}
                      </td>
                      <td className="border p-2 text-center">
                        {digitsEnToFa(Intl.NumberFormat().format(rowTotal))}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td className="border p-2 font-semibold text-center" colSpan={3}>
                    جمع
                  </td>
                  <td className="border p-2 text-center font-semibold">
                    {digitsEnToFa(Intl.NumberFormat().format(totalWeight))}
                  </td>
                  <td className="border p-2 text-center font-semibold">
                    {digitsEnToFa(Intl.NumberFormat().format(totalWeightWithPlastic))}
                  </td>
                  <td className="border p-2"></td>
                  <td className="border p-2 text-center font-semibold">
                    {digitsEnToFa(Intl.NumberFormat().format(pricePerGram))}
                  </td>
                  <td className="border p-2 text-center font-semibold">
                    {digitsEnToFa(Intl.NumberFormat().format(totalAmount))}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="grid md:grid-cols-3 grid-cols-1 gap-4 p-4 border-t">
            <div className="border p-2">
              مثقال: {digitsEnToFa(Intl.NumberFormat().format(factor.quote))} تومان
            </div>
            <div className="border p-2">
              گرم: {digitsEnToFa(Intl.NumberFormat().format(pricePerGram))} تومان
            </div>
            <div className="border p-2">
              جمع مبلغ: {digitsEnToFa(Intl.NumberFormat().format(totalAmount))} تومان
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
