// import * as React from "react";
// import { Slot } from "@radix-ui/react-slot";
// import { cva } from "class-variance-authority";
// import { cn } from "@/lib/utils";

// // 1. تحديث أنماط الألوان لتعكس تصميم ESSEC Denim
// const buttonVariants = cva(
//     "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 " +
//     "disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 " +
//     "focus:outline-none drop-shadow-[var(--dropShadow)]" +
//     "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
//     {
//         variants: {
//             variant: {
//                 default:
//                     "bg-gradient-to-br from-[var(--main-color)] via-orange-500 to-gray-200  " +
//                     "hover:from-[var(--main-color-hover)] hover:via-orange-600 hover:to-gray-700 " +
//                     "text-white shadow-lg",

//                 destructive:
//                     "bg-gradient-to-br from-[var(--main-color)]/10 via-red-600 to-red-700 " +
//                     "hover:from-red-600 hover:via-red-700 hover:to-red-800 " +
//                     "text-white",

//                 outline:
//                     "bg-transparent border border-[var(--main-color)] text-[var(--main-color)] " +
//                     "hover:bg-[var(--main-color)]/10",

//                 secondary:
//                     "text-white bg-gray-800 hover:bg-gray-900 " +
//                     "focus:ring-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 " +
//                     "dark:focus:ring-gray-700 dark:border-gray-700",

//                 ghost: "hover:bg-accent/10",
//                 link: "text-primary underline-offset-4 hover:underline"
//             },
//             size: {
//                 default: "h-10 px-6 py-2.5 text-sm has-[>svg]:px-4",
//                 sm: "h-8 px-4 py-1.5 text-xs has-[>svg]:px-3",
//                 lg: "h-12 px-8 py-3 text-base has-[>svg]:px-5",
//                 icon: "size-10"
//             }
//         },
//         defaultVariants: {
//             variant: "default",
//             size: "default"
//         }
//     }
// );

// // 2. تعريف المكون بدون أنواع TypeScript
// const Button = React.forwardRef(({
//     className,
//     variant,
//     size,
//     asChild = false,
//     ...props
// }, ref) => {
//     const Comp = asChild ? Slot : "button";

//     return (
//         <Comp
//             type={props.type ?? "button"}
//             className={cn(buttonVariants({ variant, size, className }))}
//             ref={ref}
//             {...props}
//         />
//     );
// });
// Button.displayName = "Button";

// export { Button, buttonVariants };


import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 " +
    "disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 " +
    "focus:outline-none drop-shadow-[var(--dropShadow)] transition-all duration-300 hover:scale-105 inline-block" +
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    {
        variants: {
            variant: {
                default:
                    "bg-gradient-to-br from-[#FFD700] via-[#FFB300] to-[#996515] " +
                    "hover:from-[#FFC107] hover:via-[#FFD700] hover:to-[#CC9A06] " +
                    "text-white shadow-lg"
                ,

                destructive:
                    "bg-gradient-to-br from-red-600 via-red-700 to-red-800 " +
                    "hover:from-red-700 hover:via-red-800 hover:to-red-900 " +
                    "text-white",

                outline:
                    "bg-transparent border border-[var(--main-color)] text-[var(--main-color)] " +
                    "hover:bg-[var(--main-color)]/10 hover:bg-[var(--main-color)] hover:text-[var(--text-white)] transition-colors",

                secondary:
                    "text-white bg-gray-800 hover:bg-gray-900 " +
                    "focus:ring-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 " +
                    "dark:focus:ring-gray-700 dark:border-gray-700",

                ghost: "hover:bg-accent/10",
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

const Button = React.forwardRef(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";

        return (
            <Comp
                type={props.type ?? "button"}
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
