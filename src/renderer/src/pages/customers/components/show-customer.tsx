import { Customer } from "@/types/factors";
import { digitsEnToFa } from "@persian-tools/persian-tools";

export function ShowCustomer({ data }: { data: Customer }) {
  return (
    <div className="w-full flex flex-col items-start gap-y-[10px]">
      <h1 className="text-xl font-bold">اطلاعات مشتری</h1>
      <div className="grid grid-cols-3 gap-[20px] w-full">
        <span>شناسه مشتری : {digitsEnToFa(data.id)}</span>
        <span>نام و نام خانوادگی : {data.full_name}</span>
        <span>موبایل : {digitsEnToFa(data.phone_number)}</span>
        <span>
          تلفن : {data.telephone ? digitsEnToFa(data.telephone) : "ثبت نشده"}
        </span>
        <span>
          شماره حساب : {data.card_id ? digitsEnToFa(data.card_id) : "ثبت نشده"}
        </span>
        <span>شهر : {data.city ?? "ثبت نشده"}</span>
        <span>آدرس : {data.address ?? "ثبت نشده"}</span>
      </div>
    </div>
  );
}
