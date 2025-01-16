import { Customer, Factor } from "@/types/factors";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Form,
} from "@/Components/Ui/form";
import { Button } from "@/Components/Ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/Components/Ui/dialog";
import { EntryCustomer } from "@/pages/customers/components/entry-customer";
import { useCustomers } from "@/hooks/useCustomer";
import { useEffect, useState } from "react";
import { Combobox } from "@/Components/Ui/combo-box";
import { Edit2, Plus, X } from "lucide-react";
import { ShowCustomer } from "@/pages/customers/components/show-customer";
import { Input } from "@/Components/Ui/input";
import { DatePickerDemo } from "@/Components/Ui/date-picker-jalali";
import jalaaliMoment from "@/utils/date";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/Ui/select";
import { type_docs } from "@/constant/factor";
import { useNavigate } from "react-router";
import { useCreateFactor, useUpdateFactor } from "@/hooks/useFactor";
import { Checkbox } from "@/Components/Ui/checkbox";
export function EntryFactor({
  id,
  factorDefaultValue,
}: {
  id?: string;
  factorDefaultValue?: Factor;
}) {
  const [selectCustomer, setSelectCustomer] = useState(
    factorDefaultValue ? true : false
  );
  const [handleSubmitCustomer, setHandleSubmitCustomer] = useState<
    (val: any) => void
  >(() => {});
  const factorSchema = z.object({
    customer_id: z.string({ required_error: "شناسه کاربری الزامی است" }),
    date: z.string({ required_error: "تاریخ الزامی است" }),
    type_doc: z.string({ required_error: "نوع سند اجباری است" }),
    from: z.string().optional().nullable(),
    weight: z.string({
      required_error: "وزن اجباری است",
      invalid_type_error: "لطفا عدد وارد کنید",
    }).refine((value)=>Number(value) || value == "0" || (value.split("").filter(val=>val == ".").length == 1), "لطفا عدد وارد نمایید"),
    weight_with_plastic: z.string({
      required_error: "وزن با پلاستیک اجباری است",
      invalid_type_error: "لطفا عدد وارد کنید",
    }).refine((value)=>Number(value) || value == "0" || (value.split("").filter(val=>val == ".").length == 1), "لطفا عدد وارد نمایید"),
    quote: z.number({
      required_error: "وزن اجباری است",
      invalid_type_error: "لطفا عدد وارد کنید",
    }),
    document_id: z.string({
      required_error: "شماره سند اجباری است",
    }).min(1,"شماره سند اجباری است"),
  });
  const factorForm = useForm<z.infer<typeof factorSchema>>({
    resolver: zodResolver(factorSchema),
    defaultValues: {
      date: jalaaliMoment().format("YYYY-MM-DD"),
      ...(factorDefaultValue ?? {}),
    },
  });
  const navigate = useNavigate();
  const { mutate: createFactor } = useCreateFactor();
  const { mutate: updateFactor } = useUpdateFactor();
  function onSubmit(data: z.infer<typeof factorSchema>) {
    console.log("OK");
    if (id) {
      updateFactor({ id: id, value: data });
    } else {
      createFactor({
        value: { ...data },
      });
    }
    navigate(-1);
  }
  const customer_id_ca = factorForm.watch("customer_id");
  useEffect(() => {
    console.log(factorForm.getValues("customer_id"));
    if (factorForm.getValues("customer_id") && !selectCustomer) {
      factorForm.handleSubmit(onSubmit)();
    }
  }, [customer_id_ca]);
  console.log(factorForm.formState.errors);
  return (
    <div className="w-full flex flex-col items-start gap-y-[10px] ">
      <Form {...factorForm}>
        <form
          className="w-full flex flex-col gap-y-[20px]"
          onSubmit={factorForm.handleSubmit(onSubmit)}
        >
          <h1 className="text-2xl font-bold">اطلاعات خریدار</h1>
          <div className="flex items-center gap-x-[5px]">
            <Checkbox
              id="terms2"
              onCheckedChange={(checked) => setSelectCustomer(Boolean(checked))}
              checked={selectCustomer}
            />
            <label htmlFor="terms2">انتخاب از بین خریداران سابق</label>
          </div>
          {selectCustomer && (
            <FormField
              name="customer_id"
              control={factorForm.control}
              render={function FieldComponent({ field }) {
                const customers = useCustomers({
                  filters: [],
                });
                const [data, setData] = useState<Customer | null>(
                  customers.find((i) => i.id == field.value) ?? null
                );
                const [updateEdit, setUpdateEdit] = useState(0);
                useEffect(() => {
                  setData(customers.find((i) => i.id == field.value) ?? null);
                }, [updateEdit]);
                const [editOpen, setEditOpen] = useState(false);
                useEffect(() => {
                  field.onChange(data?.id);
                }, [data]);
                return (
                  <FormControl>
                    <FormItem className="w-full flex flex-col ga-y-[2px]">
                      <span>خریداران قبلی : </span>
                      <div className="flex flex-row gap-x-[10px] items-center">
                        <Combobox
                          data={data}
                          list={customers}
                          triggerKey="full_name"
                          placeholder="انتخاب مشتری"
                          setData={(val) => {
                            setData(val as Customer);
                          }}
                        />
                        <Dialog open={editOpen} onOpenChange={setEditOpen}>
                          <DialogTrigger asChild>
                            <Button
                              disabled={!Boolean(data)}
                              className="rounded-full"
                            >
                              ویرایش
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="pt-[40px] max-h-[90vh] overflow-auto">
                            <EntryCustomer
                              customerDefaultValue={data ?? undefined}
                              id={data?.id}
                              setIsOpen={setEditOpen}
                              setCustomerId={() => {
                                setUpdateEdit(updateEdit + 1);
                              }}
                            />
                          </DialogContent>
                        </Dialog>
                      </div>
                      {data && <ShowCustomer data={data} />}
                      {/* <Dialog>
                      <DialogTrigger asChild>
                        <Button variant={"outline"} className="w-full">
                          {customerDefault
                            ? customerDefault.full_name
                            : "انتخاب مشتری"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="pt-[50px]">
                        <div className="flex flex-row gap-x-[5px]">
                          <Combobox
                            componentList={
                              <Dialog open={addOpen} onOpenChange={setAddOpen}>
                                <DialogTrigger asChild>
                                  <div className="w-full flex flex-row text-sm hover:bg-accent transition-all cursor-pointer items-center px-2 py-1.5 gap-2">
                                    <Plus className="w-4 h-4 ml-2 mr-1 " />
                                    افزودن مشتری جدید
                                  </div>
                                </DialogTrigger>
                                <DialogContent className="pt-[40px] max-h-[90vh] overflow-auto">
                                  <EntryCustomer setIsOpen={setAddOpen} />
                                </DialogContent>
                              </Dialog>
                            }
                            data={data}
                            list={customers}
                            triggerKey="full_name"
                            placeholder="انتخاب مشتری"
                            setData={(val) => {
                              setData(val as Customer);
                            }}
                          />
                          <Dialog open={editOpen} onOpenChange={setEditOpen}>
                            <DialogTrigger asChild>
                              <Button
                                disabled={!Boolean(data)}
                                className="rounded-full"
                              >
                                ویرایش
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="pt-[40px] max-h-[90vh] overflow-auto">
                              <EntryCustomer
                                customerDefaultValue={data ?? undefined}
                                id={data?.id}
                                setIsOpen={setEditOpen}
                              />
                            </DialogContent>
                          </Dialog>
                          <Button
                            disabled={!Boolean(data)}
                            className="bg-crimson-500 hover:bg-crimson-600 rounded-full"
                            onClick={() => setData(null)}
                          >
                            لغو انتخاب
                          </Button>
                        </div>
                        {data && <ShowCustomer data={data} />}
                        <DialogClose>
                          <Button
                            disabled={!Boolean(data)}
                            onClick={() => {
                              field.onChange(data?.id);
                            }}
                            className="w-full bg-persiangreen-600 hover:bg-persiangreen-700"
                          >
                            <Check />
                            تایید
                          </Button>
                        </DialogClose>
                      </DialogContent>
                    </Dialog> */}
                      <FormMessage />
                    </FormItem>
                  </FormControl>
                );
              }}
            />
          )}
          {!selectCustomer && (
            <EntryCustomer
              setCustomerId={(id) =>
                factorForm.setValue("customer_id", id as string)
              }
              setHandleSubmit={setHandleSubmitCustomer}
              checkedChange={selectCustomer}
            />
          )}
          <h1 className="text-2xl font-bold">اطلاعات محصول</h1>
          <div className="grid md:grid-cols-3 grid-cols-1 gap-[30px] w-full">
          <FormField
              name="document_id"
              control={factorForm.control}
              render={({ field }) => (
                <FormControl>
                  <FormItem className="w-full flex flex-col items-start gap-y-[3px]">
                    <span>شماره سند</span>
                    <Input
                      value={field.value ?? ""}
                      onChange={(e) => {
                        if (e.currentTarget.value == "") {
                          field.onChange(null);
                        } else {
                          field.onChange(e.currentTarget.value);
                        }
                      }}
                    />
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
                  <FormItem className="w-full flex flex-col items-start gap-y-[3px]">
                    <span>تاریخ</span>
                    <DatePickerDemo
                      timePicker={false}
                      date={new Date(field.value ?? Date.now())}
                      setDate={(date) => {
                        field.onChange(
                          jalaaliMoment(date).format("YYYY-MM-DD")
                        );
                      }}
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
                  <FormItem className="w-full flex flex-col items-start gap-y-[3px]">
                    <span>نوع سند</span>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="انتخاب" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(type_docs).map((item) => (
                          <SelectItem dir="rtl" value={item}>
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
                  <FormItem className="w-full flex flex-col items-start gap-y-[3px]">
                    <span>مظنه (تومان)</span>
                    <Input
                      value={field.value ?? ""}
                      onChange={(e) => {
                        if (e.currentTarget.value == "") {
                          field.onChange(null);
                        } else {
                          field.onChange(
                            !Number.isNaN(Number(e.currentTarget.value))
                              ? Number(e.currentTarget.value)
                              : e.target.value
                          );
                        }
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                </FormControl>
              )}
            />
            <FormField
              name="weight"
              control={factorForm.control}
              render={({ field }) => (
                <FormControl>
                  <FormItem className="w-full flex flex-col items-start gap-y-[3px]">
                    <span>وزن (گرم)</span>
                    <Input
                      value={field.value}
                      onChange={(e) => {
                 
                          field.onChange(e.currentTarget.value);
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                </FormControl>
              )}
            />
            <FormField
              name="weight_with_plastic"
              control={factorForm.control}
              render={({ field }) => (
                <FormControl>
                  <FormItem className="w-full flex flex-col items-start gap-y-[3px]">
                    <span>وزن با پلاستیک (گرم)</span>
                    <Input
                      value={field.value}
                      onChange={(e) => {
                 
                        field.onChange(e.currentTarget.value);
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
                  <FormItem className="w-full flex flex-col items-start gap-y-[3px]">
                    <span>از طرف (اختیاری)</span>
                    <Input
                      value={field.value ?? ""}
                      onChange={(e) => {
                        if (e.currentTarget.value == "") {
                          field.onChange(null);
                        } else {
                          field.onChange(e.currentTarget.value);
                        }
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                </FormControl>
              )}
            />
          </div>
          <div className="w-full flex gap-x-[10px]">
            <Button
              onClick={() => {
                if (!selectCustomer) {
                  console.log(handleSubmitCustomer);
                  handleSubmitCustomer(5);
                } else {
                  console.log("This is Run");
                  factorForm.handleSubmit(onSubmit)();
                }
              }}
              className="rounded-full bg-persiangreen-600 hover:bg-persiangreen-700"
            >
              {id ? <Edit2 /> : <Plus />}
              {id ? "ویرایش" : "افزودن"} فاکتور
            </Button>
            <Button
              onClick={() => {
                navigate(-1);
              }}
              className="rounded-full bg-crimson-600 hover:bg-crimson-700"
            >
              <X />
              انصراف
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
