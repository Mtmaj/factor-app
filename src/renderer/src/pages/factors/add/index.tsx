import { EntryFactor } from "../component/entry-factor";

export default function CreateFactor() {
  return (
    <div className="w-full flex flex-col items-start gap-y-[20px]">
      <h1 className="text-[18px] font-semibold">ساخت فاکتور جدید</h1>
      <EntryFactor />
    </div>
  );
}
