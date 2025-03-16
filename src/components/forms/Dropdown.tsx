import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

type Option = {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
};

interface DropdownProps {
  options: Option[];
  onChange: (value: string | number) => void;
  name: string;
  placeholder?: string;
  selectedItem?: string | number | null;
  className?: string;
  position?: string;
  hoverExpand?: boolean;
  labelText?: string;
  error?: boolean;
  helperText?: string;
  requiredMarker?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  onChange,
  name,
  placeholder,
  selectedItem,
  className = "",
  position = "top-[55px]",
  hoverExpand = false,
  labelText,
  error,
  helperText,
  requiredMarker,
}) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close the dropdown on outside click
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const onSelect = (value: string | number) => {
    onChange(value);
    setIsOpen(false);
  };

  const value = options?.find((opt) => opt.value === selectedItem)?.label || "";

  return (
    <>
      {labelText && (
        <label
          htmlFor={name}
          className={`label inline-block mb-1 ${
            requiredMarker ? "required-marker" : ""
          }`}
        >
          {labelText}
        </label>
      )}
      <div
        className="relative w-full"
        ref={dropdownRef}
        onMouseLeave={() => hoverExpand && setIsOpen(false)}
      >
        <input
          type="text"
          className={`input text-sm cursor-default ${className} ${
            error && "error-border"
          }`}
          onClick={toggleDropdown}
          onMouseOver={() => hoverExpand && setIsOpen(true)}
          placeholder={placeholder}
          value={value}
          name={name}
          readOnly
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <ChevronDownIcon
            className={`h-5 w-5 transition-transform duration-300 text-slate-500 stroke-2 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        <div
          className={`absolute ${position} min-w-full bg-white max-h-56 rounded-md border border-[#B0B0B0] ease-in-out-transition shadow-md z-20 overflow-auto ${
            isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onMouseEnter={() => hoverExpand && setIsOpen(true)}
        >
          <ul>
            {options.map((option) => (
              <li
                className={`flex items-center space-x-3 text-sm hover:bg-primary/20 px-2 py-2 cursor-pointer ${
                  option.value === selectedItem
                    ? "text-[#404D61]"
                    : "text-gray-500"
                }`}
                key={option.value}
                onClick={() => onSelect(option.value)}
              >
                <span>{option.icon}</span>
                <span>{option.label}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Error Message */}
        <span className={`error-text ${error ? "visible" : "invisible"}`}>
          {helperText || " "}
        </span>
      </div>
    </>
  );
};

export default Dropdown;
