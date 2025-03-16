import React, { ForwardedRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  labelText?: string;
  name: string;
  error?: boolean;
  helperText?: string;
  type?: string;
  placeholder?: string;
  requiredMarker?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      labelText,
      name,
      error,
      helperText,
      type = "text",
      placeholder,
      requiredMarker,
      ...rest
    },
    ref: ForwardedRef<HTMLInputElement>
  ) => {
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
        <div className="relative">
          <input
            ref={ref}
            className={`input ${error && "error-border"}`}
            type={type}
            placeholder={placeholder}
            id={name}
            name={name}
            {...rest}
          />
          {/* Error Message */}
          <span className={`error-text ${error ? "visible" : "invisible"}`}>
            {helperText || " "}
          </span>
        </div>
      </>
    );
  }
);

Input.displayName = "Input";

export default Input;
