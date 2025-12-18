'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#8B4513] focus-visible:ring-offset-[#FFF8DC] dark:focus-visible:ring-offset-[#1a1a1a] active:scale-[0.98] transform transition-transform duration-150",
  {
    variants: {
      variant: {
        default: 'bg-[#8B4513] text-white hover:bg-[#A0522D] shadow-md hover:shadow-lg',
        primary: 'bg-[#D4A574] text-[#5D4037] hover:bg-[#BC8F5F] shadow-md hover:shadow-lg',
        secondary: 'bg-[#EFEBE9] text-[#5D4037] hover:bg-[#D7CCC8]',
        outline: 'border border-[#D4A574] text-[#5D4037] hover:bg-[#FFF8F0]',
        ghost: 'text-[#5D4037] hover:bg-[#EFEBE9]',
        link: 'text-[#8B4513] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
      fullWidth: {
        true: 'w-full',
      },
      rounded: {
        full: 'rounded-full',
        lg: 'rounded-lg',
        md: 'rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      rounded: 'lg',
    },
  },
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  rounded?: 'full' | 'lg' | 'md'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      children,
      disabled,
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      rounded,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'
    const isDisabled = disabled || isLoading

    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn('inline-block', { 'w-full': fullWidth })}
      >
        <Comp
          ref={ref}
          className={cn(
            buttonVariants({
              variant,
              size,
              className,
              fullWidth,
              rounded,
            }),
            'relative overflow-hidden',
            {
              'cursor-not-allowed opacity-70': isDisabled,
              'cursor-pointer': !isDisabled,
            },
          )}
          disabled={isDisabled}
          {...props}
        >
          <span className={cn('flex items-center gap-2', { 'opacity-0': isLoading })}>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
            {isLoading && (
              <motion.span
                className="absolute inset-0 flex items-center justify-center bg-white/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.span
                  className="h-4 w-4 rounded-full border-2 border-t-transparent border-current"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              </motion.span>
            )}
          </span>
        </Comp>
      </motion.div>
    )
  },
)

Button.displayName = 'Button'

export { Button, buttonVariants }
