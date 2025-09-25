import { Customer, Factor } from '@/types/factors'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FormControl, FormField, FormItem, FormMessage, Form } from '@/Components/Ui/form'
import { Button } from '@/Components/Ui/button'
import { Dialog, DialogTrigger, DialogContent } from '@/Components/Ui/dialog'
import { EntryCustomer } from '@/pages/customers/components/entry-customer'
import { useCustomers } from '@/hooks/useCustomer'
import { useEffect, useState } from 'react'
import { Combobox } from '@/Components/Ui/combo-box'
import { Edit2, Plus, Trash2, X } from 'lucide-react'
import { ShowCustomer } from '@/pages/customers/components/show-customer'
import { Input } from '@/Components/Ui/input'
import { DatePickerDemo } from '@/Components/Ui/date-picker-jalali'
import jalaaliMoment from '@/utils/date'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/Components/Ui/select'
import { type_docs } from '@/constant/factor'
import { useNavigate } from 'react-router'
import { useCreateFactor, useUpdateFactor } from '@/hooks/useFactor'
import { Checkbox } from '@/Components/Ui/checkbox'
import { digitsEnToFa } from '@persian-tools/persian-tools'

const factorSchema = z.object({
  customer_id: z.string().optional(),
  customer_name: z.string().optional(),
  date: z.string({ required_error: 'تاریخ الزامی است' }),
  type_doc: z.string({ required_error: 'نوع سند اجباری است' }),
  from: z.string().optional().nullable(),
  document_id: z.string({ required_error: 'شماره سند اجباری است' }),
  quote: z.number({ required_error: 'مظنه اجباری است' }),
  products: z.array(
    z.object({
      serial_number: z.string({ required_error: 'شماره سریال اجباری است' }),
      weight: z
        .string({ required_error: 'وزن اجباری است' })
        .refine((val) => !isNaN(Number(val)), 'لطفا عدد وارد نمایید'),
      weight_with_plastic: z
        .string({ required_error: 'وزن با پلاستیک اجباری است' })
        .refine((val) => !isNaN(Number(val)), 'لطفا عدد وارد نمایید')
    })
  )
})

export function EntryFactor({
  id,
  factorDefaultValue
}: {
  id?: string
  factorDefaultValue?: Factor
}) {
  const [selectCustomer, setSelectCustomer] = useState(!!factorDefaultValue)
  const [handleSubmitCustomer, setHandleSubmitCustomer] = useState<(val: any) => void>(() => {})

  const customers = useCustomers({ filters: [] })
  const navigate = useNavigate()
  const { mutate: createFactor } = useCreateFactor()
  const { mutate: updateFactor } = useUpdateFactor()

  const factorForm = useForm<z.infer<typeof factorSchema>>({
    resolver: zodResolver(factorSchema),
    defaultValues: {
      date: jalaaliMoment().format('YYYY-MM-DD'),
      products: factorDefaultValue?.products ?? [
        { serial_number: '', weight: '', weight_with_plastic: '' }
      ],
      ...(factorDefaultValue ?? {})
    }
  })
  const { fields, append, remove } = useFieldArray({
    control: factorForm.control,
    name: 'products'
  })

  async function onSubmit(data: z.infer<typeof factorSchema>) {
    if (!selectCustomer) {
      await handleSubmitCustomer?.({})
    }

    const customer_id = String(factorForm.getValues('customer_id') ?? '')
    const nameFromForm = factorForm.getValues('customer_name')?.trim()

    const customer = customers.find((c) => String(c.id) === customer_id)
    const resolvedName = nameFromForm || customer?.full_name || 'کاربر ناشناس'

    const finalData = {
      ...data,
      customer_id,
      customer_name: resolvedName,
      created_date: new Date().toISOString()
    }

    if (!id) {
      createFactor({ value: finalData })
    } else {
      updateFactor({ id, value: finalData })
    }

    navigate('/factors')
  }

  return (
    <div className="w-full flex flex-col items-start gap-y-[10px] ">
      <Form {...factorForm}>
        <form
          className="w-full flex flex-col gap-y-[20px]"
          onSubmit={factorForm.handleSubmit(onSubmit)}
        >
          {/*  اطلاعات خریدار */}
          <h1 className="text-2xl font-bold">اطلاعات خریدار</h1>
          <div className="flex items-center gap-x-[5px]">
            <Checkbox
              id="terms2"
              onCheckedChange={(checked) => setSelectCustomer(Boolean(checked))}
              checked={selectCustomer}
            />
            <label htmlFor="terms2">انتخاب از بین خریداران سابق</label>
          </div>

          {selectCustomer ? (
            <FormField
              name="customer_id"
              control={factorForm.control}
              render={({ field }) => {
                const customers = useCustomers({ filters: [] })
                const [data, setData] = useState<Customer | null>(
                  customers.find((i) => i.id == field.value) ?? null
                )
                const [updateEdit, setUpdateEdit] = useState(0)
                useEffect(() => {
                  setData(customers.find((i) => i.id == field.value) ?? null)
                }, [updateEdit])

                const [editOpen, setEditOpen] = useState(false)

                useEffect(() => {
                  if (data?.id) {
                    factorForm.setValue('customer_id', String(data.id))
                    field.onChange(String(data.id))
                  }
                }, [data])

                return (
                  <FormControl>
                    <FormItem className="w-full flex flex-col ga-y-[2px]">
                      <span>خریداران قبلی :</span>
                      <div className="flex flex-row gap-x-[10px] items-center">
                        <Combobox
                          data={data}
                          list={customers}
                          triggerKey="full_name"
                          placeholder="انتخاب مشتری"
                          setData={(val) => setData(val as Customer)}
                        />
                        <Dialog open={editOpen} onOpenChange={setEditOpen}>
                          <DialogTrigger asChild>
                            <Button disabled={!Boolean(data)} className="rounded-full">
                              ویرایش
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="pt-[40px] max-h-[90vh] overflow-auto">
                            <EntryCustomer
                              customerDefaultValue={data ?? undefined}
                              id={data?.id}
                              setIsOpen={setEditOpen}
                              setCustomerId={() => setUpdateEdit(updateEdit + 1)}
                            />
                          </DialogContent>
                        </Dialog>
                      </div>
                      {data && <ShowCustomer data={data} />}
                      <FormMessage />
                    </FormItem>
                  </FormControl>
                )
              }}
            />
          ) : (
            <EntryCustomer
              setCustomerId={(id) => {
                factorForm.setValue('customer_id', id as string)
              }}
              setCustomerName={(name) => {
                factorForm.setValue('customer_name', name)
              }}
              setHandleSubmit={setHandleSubmitCustomer}
              checkedChange={selectCustomer}
            />
          )}

          {/* اطلاعات فاکتور */}
          <h1 className="text-2xl font-bold">اطلاعات فاکتور</h1>
          <div className="grid md:grid-cols-3 grid-cols-1 gap-[30px] w-full">
            <FormField
              name="document_id"
              control={factorForm.control}
              render={({ field }) => (
                <FormControl>
                  <FormItem>
                    <span>شماره سند</span>
                    <Input {...field} />
                    <FormMessage />
                  </FormItem>
                </FormControl>
              )}
            />

            <FormField
              name="date"
              control={factorForm.control}
              render={({ field }) => (
                <FormControl>
                  <FormItem>
                    <span>تاریخ</span>
                    <DatePickerDemo
                      timePicker={false}
                      date={new Date(field.value ?? Date.now())}
                      setDate={(date) => field.onChange(jalaaliMoment(date).format('YYYY-MM-DD'))}
                    />
                    <FormMessage />
                  </FormItem>
                </FormControl>
              )}
            />

            <FormField
              name="type_doc"
              control={factorForm.control}
              render={({ field }) => (
                <FormControl>
                  <FormItem>
                    <span>نوع سند</span>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="انتخاب" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(type_docs).map((item) => (
                          <SelectItem key={item} value={item}>
                            {type_docs[item]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                </FormControl>
              )}
            />

            <FormField
              name="quote"
              control={factorForm.control}
              render={({ field }) => (
                <FormControl>
                  <FormItem>
                    <span>مظنه (تومان)</span>
                    <Input
                      value={field.value ?? ''}
                      onChange={(e) => {
                        const val = e.currentTarget.value
                        field.onChange(val === '' ? undefined : Number(val))
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                </FormControl>
              )}
            />

            <FormField
              name="from"
              control={factorForm.control}
              render={({ field }) => (
                <FormControl>
                  <FormItem>
                    <span>از طرف (اختیاری)</span>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                    <FormMessage />
                  </FormItem>
                </FormControl>
              )}
            />
          </div>

          <h1 className="text-2xl font-bold">محصولات</h1>
          {fields.map((field, index) => (
            <div key={field.id} className="border p-4 rounded-md mb-4">
              <div className="grid md:grid-cols-3 grid-cols-1 gap-[30px]">
                <FormField
                  name={`products.${index}.serial_number`}
                  control={factorForm.control}
                  render={({ field }) => (
                    <FormControl>
                      <FormItem>
                        <span>شماره سریال</span>
                        <Input {...field} />
                        <FormMessage />
                      </FormItem>
                    </FormControl>
                  )}
                />
                <FormField
                  name={`products.${index}.weight`}
                  control={factorForm.control}
                  render={({ field }) => {
                    const options = ['50', '100', '150', '250', '500']
                    const current = String(field.value ?? '')
                    const selectValue = options.includes(current) ? current : 'free'
                    const isFree = selectValue === 'free'

                    return (
                      <FormControl>
                        <FormItem className="w-full flex flex-col items-start gap-y-[3px]">
                          <span>وزن (گرم)</span>

                          <Select
                            value={selectValue}
                            onValueChange={(val) => {
                              if (val === 'free') {
                                field.onChange('')
                              } else {
                                field.onChange(val)
                              }
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="انتخاب" />
                            </SelectTrigger>
                            <SelectContent>
                              {[...options, 'free'].map((item) => (
                                <SelectItem key={item} dir="rtl" value={item}>
                                  {digitsEnToFa(item === 'free' ? 'آزاد' : item)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {isFree && (
                            <Input
                              className="mt-2"
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(e.currentTarget.value)}
                              placeholder="وزن دلخواه را وارد کنید"
                            />
                          )}

                          <FormMessage />
                        </FormItem>
                      </FormControl>
                    )
                  }}
                />

                <FormField
                  name={`products.${index}.weight_with_plastic`}
                  control={factorForm.control}
                  render={({ field }) => (
                    <FormControl>
                      <FormItem>
                        <span>وزن با پلاستیک (گرم)</span>
                        <Input {...field} />
                        <FormMessage />
                      </FormItem>
                    </FormControl>
                  )}
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                onClick={() => remove(index)}
                className="mt-2"
              >
                <Trash2 className="w-4 h-4 mr-2" /> حذف محصول
              </Button>
            </div>
          ))}

          <Button
            type="button"
            onClick={() => append({ serial_number: '', weight: '', weight_with_plastic: '' })}
            className="rounded-full bg-blue-500 hover:bg-blue-600"
          >
            + افزودن محصول
          </Button>

          <div className="w-full flex gap-x-[10px]">
            <Button
              type="submit"
              className="rounded-full bg-persiangreen-600 hover:bg-persiangreen-700"
            >
              {id ? <Edit2 /> : <Plus />} {id ? 'ویرایش' : 'افزودن'} فاکتور
            </Button>
            <Button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-full bg-crimson-600 hover:bg-crimson-700"
            >
              <X /> انصراف
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
