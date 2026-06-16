"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border text-sm font-medium whitespace-nowrap transition-all duration-200 outline-none select-none focus-visible:ring-2 focus-visible:ring-[var(--color-action-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 rounded-[var(--radius-button)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-[var(--near-black)] text-white border-transparent hover:bg-[var(--color-action-primary)]",
        secondary: "bg-transparent text-[var(--color-action-primary)] border-[var(--color-action-primary)] hover:bg-[var(--color-action-primary)] hover:text-white",
        ghost: "bg-transparent text-[var(--near-black)] border-transparent hover:bg-gray-100",
        destructive: "bg-error/10 text-error border-error hover:bg-error/20",
        link: "text-[var(--color-action-primary)] underline-offset-4 hover:underline border-transparent bg-transparent",
      },
      size: {
        default: "h-10 px-6 py-3 gap-2",
        sm: "h-8 px-4 py-2 text-xs",
        lg: "h-12 px-8 py-4 text-base",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
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
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
