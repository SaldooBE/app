import * as React from "react"

import { cn } from "@/lib/utils"

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
}

const Chart = React.forwardRef<HTMLDivElement, ChartProps>(
  ({ className, title, description, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("space-y-3", className)}
        {...props}
      >
        {title && (
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-base font-medium">{title}</h3>
              {description && (
                <p className="text-sm text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
          </div>
        )}
        <div className="h-[200px] w-full">
          {children || (
            <div className="flex h-full w-full items-center justify-center rounded-md border border-dashed">
              <div className="flex flex-col items-center gap-1 text-center">
                <p className="text-sm text-muted-foreground">
                  Grafiek data nog niet beschikbaar
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
)
Chart.displayName = "Chart"

export { Chart }
