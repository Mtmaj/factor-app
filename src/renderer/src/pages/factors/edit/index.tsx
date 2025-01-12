import { useCustomer } from "@/hooks/useCustomer";
import { useFactor } from "@/hooks/useFactor";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import { useParams } from "react-router";
import { EntryFactor } from "../component/entry-factor";

export default function EditFactor() {
  const params = useParams();
  const factorId = params.factorId;
  const factor = useFactor(factorId ?? "");
  const customer = useCustomer(
    (factor ?? { customer_id: "" }).customer_id ?? ""
  );
  if (!factor) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span>۴۰۴ فاکتور مدنظر موجود نیست</span>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span>۴۰۴ کاربر مدنظر موجود نیست</span>
      </div>
    );
  }
  return (
    <div className="w-full flex flex-col items-start gap-y-[20px]">
      <h1 className="text-[18px] font-semibold">
        ویرایش فاکتور به شناسه {digitsEnToFa(factor.id)}
      </h1>
      <EntryFactor factorDefaultValue={factor} id={factorId} />
    </div>
  );
}
