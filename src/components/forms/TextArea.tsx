import React, { ForwardedRef, InputHTMLAttributes } from "react";

interface TextAreaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  labelText?: string;
  name: string;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
  requiredMarker?: boolean;
  rows?: number;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      labelText,
      name,
      error,
      helperText,
      placeholder,
      requiredMarker,
      rows = 3,
      ...rest
    },
    ref: ForwardedRef<HTMLTextAreaElement>
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
          <textarea
            ref={ref}
            className={`input ${error && "error-border"}`}
            placeholder={placeholder}
            id={name}
            name={name}
            rows={rows}
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

TextArea.displayName = "TextArea";

export default TextArea;
