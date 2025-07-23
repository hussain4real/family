import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { CheckCircle, XCircle, X } from "lucide-react"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "text-destructive-foreground [&>svg]:text-current *:data-[slot=alert-description]:text-destructive-foreground/80",
        success:
          "border-green-200 bg-green-50 text-green-800 [&>svg]:text-green-600",
        error:
          "border-red-200 bg-red-50 text-red-800 [&>svg]:text-red-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

// FlashAlert component with auto-hide functionality
interface FlashAlertProps {
  status: 'success' | 'error';
  message: string;
  details?: React.ReactNode;
  autoHide?: boolean;
  autoHideDelay?: number;
  onDismiss?: () => void;
  className?: string;
}

function FlashAlert({
  status,
  message,
  details,
  autoHide = true,
  autoHideDelay = 5000,
  onDismiss,
  className
}: FlashAlertProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (autoHide && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, autoHideDelay);

      return () => clearTimeout(timer);
    }
  }, [autoHide, autoHideDelay, isVisible, onDismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) {
    return null;
  }

  const variant = status === 'success' ? 'success' : 'error';
  const Icon = status === 'success' ? CheckCircle : XCircle;

  return (
    <Alert variant={variant} className={cn('transition-all duration-300 ease-in-out', className)}>
      <Icon className="h-4 w-4" />
      <div className="flex-1 grid gap-1">
        <AlertTitle>
          {status === 'success' ? 'Success!' : 'Error!'}
        </AlertTitle>
        <AlertDescription>
          <div>{message}</div>
          {details && <div className="mt-1">{details}</div>}
        </AlertDescription>
      </div>
      <button
        onClick={handleDismiss}
        className="ml-auto opacity-70 hover:opacity-100 transition-opacity self-start"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </Alert>
  );
}

export { Alert, AlertTitle, AlertDescription, FlashAlert }
