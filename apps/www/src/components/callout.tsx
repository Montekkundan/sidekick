import { cn } from "@repo/design-system/lib/utils";;
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/registry/new-york/ui/alert";

export function Callout({
  title,
  children,
  icon,
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof Alert> & {
  icon?: React.ReactNode;
  variant?: "default" | "info" | "warning";
}) {
  return (
    <Alert
      className={cn(
        "md:-mx-1 mt-6 w-auto border bg-background text-foreground",
        className
      )}
      data-variant={variant}
      {...props}
    >
      {icon}
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription className="text-card-foreground/80">
        {children}
      </AlertDescription>
    </Alert>
  );
}
