import React from "react";

type Props = {
  text: string;
  type?: "success" | "warn" | "error" | "info";
  className?: string;
};

const typeClasses = {
  success: "bg-green-100 text-green-800",
  warn: "bg-yellow-100 text-yellow-800",
  error: "bg-red-100 text-red-800",
  info: "bg-blue-100 text-blue-800",
};

const Label: React.FC<Props> = ({ text, type = "info", className = "" }) => {
  const classes = `inline-block px-3 py-1 rounded-full text-sm font-semibold ${typeClasses[type]} ${className}`;

  return <span className={classes}>{text}</span>;
};

export default Label;
