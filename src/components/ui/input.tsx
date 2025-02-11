
import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn("border rounded-md p-2", className)} // Add your desired styles here
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };