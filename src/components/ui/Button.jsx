import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-interactive",
  {
    variants: {
      variant: {
        // UPDATED: The default style now uses your theme's 'interactive' blue color
        default:
          "bg-interactive text-white shadow-sm hover:bg-interactive/90",

        // NEW: Added the 'cta' variant using your theme's vibrant accent color
        cta:
          "bg-accent-cta text-white shadow-sm hover:bg-accent-cta/90",

        // Your other variants
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-600/90",
        outline:
          "border border-black/20 bg-background shadow-sm hover:bg-black/5",
        ghost:
          "hover:bg-black/5",
        link: "text-interactive underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }
