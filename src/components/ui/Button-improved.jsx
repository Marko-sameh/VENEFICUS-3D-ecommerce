import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 " +
    "disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 " +
    "focus:outline-none focus:ring-2 focus:ring-[var(--main-color)]/20 focus:ring-offset-2 " +
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    {
        variants: {
            variant: {
                default:
                    "bg-gradient-to-br from-[var(--main-color)] via-red-700 to-black " +
                    "hover:from-[var(--main-color-hover)] hover:via-red-800 hover:to-black/90 " +
                    "text-[var(--text-white)] shadow-lg",
                destructive:
                    "bg-gradient-to-br from-red-600 via-red-700 to-red-800 " +
                    "hover:from-red-700 hover:via-red-800 hover:to-red-900 " +
                    "text-[var(--text-white)]",
                outline:
                    "bg-transparent border border-[var(--main-color)] text-[var(--main-color)] " +
                    "hover:bg-[var(--main-color)] hover:text-[var(--text-white)] transition-colors",
                secondary:
                    "text-[var(--text-white)] bg-[var(--gray-dark)] hover:bg-[var(--gray)] " +
                    "focus:ring-[var(--gray)]/30",
                ghost: "hover:bg-[var(--gray-light)] text-[var(--text-primary)]",
                link: "text-[var(--main-color)] underline-offset-4 hover:underline"
            },
            size: {
                default: "h-10 px-6 py-2.5 text-sm has-[>svg]:px-4",
                sm: "h-8 px-4 py-1.5 text-xs has-[>svg]:px-3",
                lg: "h-12 px-8 py-3 text-base has-[>svg]:px-5",
                icon: "size-10"
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default"
        }
    }
);

const Button = React.memo(React.forwardRef(
    ({ className, variant, size, asChild = false, children, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";

        return (
            <Comp
                type={props.type ?? "button"}
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            >
                {children}
            </Comp>
        );
    }
));

Button.displayName = "Button";

export { Button, buttonVariants };