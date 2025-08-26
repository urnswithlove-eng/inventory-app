import React from "react";

export default function Input({ label, ...props }: any) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        {...props}
        className="w-full p-2 border rounded-lg"
      />
    </div>
  );
}
