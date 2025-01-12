import { Button } from '@/Components/Ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/Components/Ui/form'
import { Input } from '@/Components/Ui/input'
import { useCreateCustomer, useUpdateCustomer } from '@/hooks/useCustomer'
import { Customer } from '@/types/factors'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export function EntryCustomer({
  id,
  customerDefaultValue,
  setIsOpen,
  setHandleSubmit,
  setCustomerId,
  checkedChange
}: {
  id?: string
  customerDefaultValue?: Customer
  setIsOpen?: (val: boolean) => void
  setHandleSubmit?: (val: any) => void
  setCustomerId?: (val: any) => void
  checkedChange?: boolean
  handleFactorSubmit?: () => void
}) {
  const customerSchema = z.object({
    address: z.string().optional().nullable(),
    telephone: z
      .string()
      .refine((val) => Number(val) || val == '0', 'عدد وارد نمایید')
      .optional()
      .nullable(),
    phone_number: z
      .string({ required_error: 'شماره همراه اجباری است' })
      .refine((val) => Number(val) || val == '0', 'عدد وارد نمایید'),
    card_id: z
      .string()
      .refine((val) => Number(val) || val == '0', 'عدد وارد نمایید')
      .optional()
      .nullable(),
    full_name: z.string({ required_error: 'نام کامل اجباری است' }).min(1, 'نام کامل اجباری است'),
    city: z.string().optional().nullable()
  })
  const customerForm = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      ...(customerDefaultValue ?? {})
    }
  })
  useEffect(() => {
    console.log('OK')
    setHandleSubmit?.(() => {
      return () => customerForm.handleSubmit(onSubmit)()
    })
    console.log(() => {
      customerForm.handleSubmit(onSubmit)()
    })
  }, [checkedChange ?? false])
  const { mutate: createCustomer } = useCreateCustomer()
  const { mutate: updateCustomer } = useUpdateCustomer()
  function onSubmit(data: z.infer<typeof customerSchema>) {
    let value: any = null
    if (id) {
      value = updateCustomer({ id: id, value: data })
    } else {
      value = createCustomer({
        value: { ...data }
      })
    }
    setCustomerId?.(value.value.id)
    setIsOpen?.(false)
  }

  return (
    <div className="w-full flex flex-col gap-y-[20px]">
      <h1 className="text-xl font-bold">{id ? 'ویرایش' : 'افزودن'} مشتری</h1>
      <Form {...customerForm}>
        <form
          className={
            id ? 'w-full flex flex-col gap-y-[10px]' : 'grid md:grid-cols-3 grid-cols-1 gap-[10px]'
          }
        >
          <FormField
            name="full_name"
            control={customerForm.control}
            render={({ field }) => (
              <FormControl>
                <FormItem className="w-full flex flex-col items-start gap-y-[3px]">
                  <span>نام و نام خانوادگی</span>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              </FormControl>
            )}
          />
          <FormField
            name="phone_number"
            control={customerForm.control}
            render={({ field }) => (
              <FormControl>
                <FormItem className="w-full flex flex-col items-start gap-y-[3px]">
                  <span>مویایل</span>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              </FormControl>
            )}
          />
          <FormField
            name="telephone"
            control={customerForm.control}
            render={({ field }) => (
              <FormControl>
                <FormItem className="w-full flex flex-col items-start gap-y-[3px]">
                  <span>تلفن (اختیاری)</span>
                  <Input
                    value={field.value ?? ''}
                    onChange={(e) => {
                      if (e.currentTarget.value == '') {
                        field.onChange(null)
                      } else {
                        field.onChange(e.currentTarget.value)
                      }
                    }}
                  />
                  <FormMessage />
                </FormItem>
              </FormControl>
            )}
          />
          <FormField
            name="card_id"
            control={customerForm.control}
            render={({ field }) => (
              <FormControl>
                <FormItem className="w-full flex flex-col items-start gap-y-[3px]">
                  <span>شماره حساب (اختیاری)</span>
                  <Input
                    value={field.value ?? ''}
                    onChange={(e) => {
                      if (e.currentTarget.value == '') {
                        field.onChange(null)
                      } else {
                        field.onChange(e.currentTarget.value)
                      }
                    }}
                  />
                  <FormMessage />
                </FormItem>
              </FormControl>
            )}
          />
          <FormField
            name="city"
            control={customerForm.control}
            render={({ field }) => (
              <FormControl>
                <FormItem className="w-full flex flex-col items-start gap-y-[3px]">
                  <span>شهر (اختیاری)</span>
                  <Input
                    value={field.value ?? ''}
                    onChange={(e) => {
                      if (e.currentTarget.value == '') {
                        field.onChange(null)
                      } else {
                        field.onChange(e.currentTarget.value)
                      }
                    }}
                  />
                  <FormMessage />
                </FormItem>
              </FormControl>
            )}
          />
          <FormField
            name="address"
            control={customerForm.control}
            render={({ field }) => (
              <FormControl>
                <FormItem className="w-full flex flex-col items-start gap-y-[3px]">
                  <span>آدرس (اختیاری)</span>
                  <Input
                    value={field.value ?? ''}
                    onChange={(e) => {
                      if (e.currentTarget.value == '') {
                        field.onChange(null)
                      } else {
                        field.onChange(e.currentTarget.value)
                      }
                    }}
                  />
                  <FormMessage />
                </FormItem>
              </FormControl>
            )}
          />
          {Boolean(id) && (
            <Button
              onClick={() => {
                customerForm.handleSubmit(onSubmit)()
              }}
              className="w-full bg-persiangreen-600 hover:bg-persiangreen-700"
            >
              <Check />
              تایید
            </Button>
          )}
        </form>
      </Form>
    </div>
  )
}
