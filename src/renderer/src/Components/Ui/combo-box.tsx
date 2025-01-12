import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/Components/Ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/Components/Ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/Ui/popover";

export function Combobox({
  list,
  triggerKey,
  data,
  setData,
  placeholder,
  componentList,
}: {
  list: any[];
  triggerKey: string;
  data: any;
  setData: (val: any) => void;
  placeholder: string;
  componentList?: JSX.Element;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between rounded-full"
        >
          {data != null ? data[triggerKey] : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput className="gap-x-[5px]" placeholder="جست و جو ..." />
          <CommandList>
            {componentList}
            <CommandEmpty>کاربری پیدا نشد</CommandEmpty>
            <CommandGroup>
              {list.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item[triggerKey]}
                  onSelect={() => {
                    setData(item);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "ml-2 h-4 w-4",
                      data && item.id === data.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item[triggerKey]}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
