import { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

interface TimerDropDownProps {
  time: number | null;
  onChange?: (seconds: number) => void;
}

const TimerDropDown = ({ time, onChange }: TimerDropDownProps) => {
  const [durationSec, setDurationSec] = useState<number | null>(time || null);

  const options = [
    { label: "20 seconds", value: 20 },
    { label: "30 seconds", value: 30 },
    { label: "60 seconds", value: 60 },
  ];

  return (
    <Menu as="div" className="relative inline-block">
      <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-[#F1F1F1] px-3 py-2 text-sm inset-ring-1 inset-ring-white/5 hover:bg-gray-300 transition-all duration-300 ease-in-out">
        {durationSec ? `${durationSec} seconds` : "Time Limit"}
        <ChevronDownIcon
          aria-hidden="true"
          className="-mr-1 size-5 text-gray-400"
        />
      </MenuButton>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-gray-800 outline-1 -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
      >
        <div className="py-1">
          {options.map((opt) => (
            <MenuItem key={opt.value}>
              {({ focus }) => (
                <button
                  onClick={() => {
                    setDurationSec(opt.value);
                    onChange && onChange(opt.value);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    focus ? "text-[#8F64E1]" : "text-gray-200"
                  }`}
                >
                  {opt.label}
                </button>
              )}
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
  );
};

export default TimerDropDown;
