import * as React from "react";

export function Select({
  value,
  onChange,
  children,
  className
}: {
  value: any;
  onChange: any;
  children: any;
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`border rounded-md px-3 py-2 text-sm ${className}`}
    >
      {children}
    </select>
  );
}
