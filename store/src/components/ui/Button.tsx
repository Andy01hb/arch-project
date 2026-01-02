import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "outline" | "glow" | "default";
    size?: "sm" | "md" | "lg" | "icon";
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {

        // Map 'default' to 'primary' for compatibility if needed
        const safeVariant = variant === 'default' ? 'primary' : variant;

        const variants = {
            primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] border border-blue-500/50",
            secondary: "bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700",
            ghost: "bg-transparent hover:bg-zinc-800/50 text-zinc-300 hover:text-white",
            outline: "bg-transparent border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500",
            glow: "bg-white text-black hover:bg-gray-100 shadow-[0_0_20px_rgba(255,255,255,0.3)]",
            default: "bg-blue-600 text-white" // Fallback
        };

        const sizes = {
            sm: "h-8 px-3 text-xs",
            md: "h-10 px-4 py-2 text-sm",
            lg: "h-12 px-8 text-base",
            icon: "h-10 w-10 p-0 flex items-center justify-center",
        };

        return (
            <button
                ref={ref}
                className={cn(
                    "relative inline-flex items-center justify-center rounded-md font-medium transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none active:scale-95",
                    variants[safeVariant],
                    sizes[size],
                    className
                )}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";

export { Button };
