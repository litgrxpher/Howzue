"use client"

import * as React from "react"
import { MoreHorizontal, X } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip"
import { Button, type ButtonProps } from "./button"

const SIDEBAR_WIDTH_VAR = "--sidebar-width"
const SIDEBAR_WIDTH_ICON_VAR = "--sidebar-width-icon"
const SIDEBAR_COLLAPSED = "data-sidebar-collapsed"

type SidebarContextValue = {
  isCollapsed: boolean
  isMobile: boolean
  width: number
  widthIcon: number
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null)

const useSidebar = () => {
  const context = React.useContext(SidebarContext)

  if (!context) {
    throw new Error("useSidebar must be used within a <SidebarProvider />")
  }

  return context
}

type SidebarProviderProps = React.PropsWithChildren<{
  isCollapsed?: boolean
  isMobile?: boolean
  width?: number
  widthIcon?: number
}>

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  SidebarProviderProps
>(({ isCollapsed = false, isMobile = false, ...props }, ref) => {
  const width = props.width ?? 256
  const widthIcon = props.widthIcon ?? 48

  return (
    <SidebarContext.Provider
      value={React.useMemo(
        () => ({
          isCollapsed,
          isMobile,
          width,
          widthIcon,
        }),
        [isCollapsed, isMobile, width, widthIcon]
      )}
    >
      <div
        ref={ref}
        className="group/provider"
        data-sidebar-collapsed={isCollapsed}
        style={
          {
            [SIDEBAR_WIDTH_VAR]: `${width}px`,
            [SIDEBAR_WIDTH_ICON_VAR]: `${widthIcon}px`,
          } as React.CSSProperties
        }
      >
        {props.children}
      </div>
    </SidebarContext.Provider>
  )
})

SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    side?: "left" | "right"
    collapsible?: "icon" | "button"
    onCollapse?: (collapsed: boolean) => void
  }
>(
  (
    {
      className,
      side = "left",
      collapsible,
      onCollapse,
      "data-collapsed": dataCollapsed,
      ...props
    },
    ref
  ) => {
    const isClient = typeof window !== "undefined"
    const [isCollapsed, setIsCollapsed] = React.useState(
      dataCollapsed ?? false
    )
    const isMobile = useMediaQuery("(max-width: 640px)")
    const [isOverlay, setIsOverlay] = React.useState(isMobile)

    const handleCollapse = React.useCallback(
      (collapsed: boolean) => {
        setIsCollapsed(collapsed)
        onCollapse?.(collapsed)
      },
      [onCollapse]
    )

    React.useEffect(() => {
      setIsOverlay(isMobile)
    }, [isMobile])

    if (!isClient) {
      return null
    }

    return (
      <SidebarProvider
        isCollapsed={isCollapsed}
        isMobile={isMobile}
      >
        {isOverlay ? (
          <SidebarOverlay onCollapse={() => handleCollapse(false)} />
        ) : null}
        <div
          ref={ref}
          className={cn(
            "fixed inset-y-0 z-40 hidden h-full flex-col border-border bg-sidebar transition-all duration-300 ease-in-out sm:flex",
            side === "left" && "left-0 border-r",
            side === "right" && "right-0 border-l",
            isCollapsed
              ? "w-[var(--sidebar-width-icon)]"
              : "w-[var(--sidebar-width)]",
            className
          )}
          data-collapsed={isCollapsed}
          {...props}
        >
          {props.children}
          {collapsible && (
            <SidebarCollapse
              collapsible={collapsible}
              side={side}
              isCollapsed={isCollapsed}
              onCollapse={handleCollapse}
            />
          )}
        </div>
      </SidebarProvider>
    )
  }
)

Sidebar.displayName = "Sidebar"

const SidebarOverlay = (props: { onCollapse: () => void }) => {
  return (
    <div
      className="fixed inset-0 z-30 bg-black/50 sm:hidden"
      onClick={props.onCollapse}
    />
  )
}

SidebarOverlay.displayName = "SidebarOverlay"

const SidebarCollapse = (props: {
  side: "left" | "right"
  isCollapsed: boolean
  collapsible?: "icon" | "button"
  onCollapse: (collapsed: boolean) => void
}) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "absolute bottom-2 z-50",
        props.side === "left" && "left-2",
        props.side === "right" && "right-2",
        props.collapsible === "button" && "sm:hidden"
      )}
      onClick={() => props.onCollapse(!props.isCollapsed)}
    >
      <MoreHorizontal />
    </Button>
  )
}

SidebarCollapse.displayName = "SidebarCollapse"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex h-14 items-center p-2", className)}
      {...props}
    >
      {props.children}
    </div>
  )
})

SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex-1 overflow-y-auto overflow-x-hidden",
        className
      )}
      {...props}
    >
      {props.children}
    </div>
  )
})

SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("mt-auto flex h-14 items-center p-2", className)}
      {...props}
    >
      {props.children}
    </div>
  )
})

SidebarFooter.displayName = "SidebarFooter"

const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    /**
     * Set to true to display a separator between each menu item.
     * @default false
     * @type boolean
     */
    separator?: boolean
  }
>(({ className, separator = false, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col",
        separator && "[&>*]:border-b",
        className
      )}
      {...props}
    >
      {props.children}
    </div>
  )
})

SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("p-1 text-sidebar-foreground", className)}
      {...props}
    />
  )
})

SidebarMenuItem.displayName = "SidebarMenuItem"

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & {
    isActive?: boolean
    tooltip?: {
      children: React.ReactNode
      props?: React.ComponentProps<typeof TooltipContent>
    }
  }
>(({ isActive, tooltip, ...props }, ref) => {
  const { isCollapsed } = useSidebar()
  const button = (
    <Button
      ref={ref}
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "h-full w-full justify-start transition-all duration-300 ease-in-out",
        !isCollapsed && "gap-2"
      )}
      {...props}
    >
      {props.children}
    </Button>
  )

  if (isCollapsed && tooltip) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent {...tooltip.props}>{tooltip.children}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return button
})

SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarTrigger = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const isMobile = useMediaQuery("(max-width: 640px)")
    const [isOpen, setIsOpen] = React.useState(false)

    if (!isMobile) {
      return null
    }

    return (
      <>
        <Button
          ref={ref}
          {...props}
          onClick={() => setIsOpen(true)}
        />
        {isOpen ? (
          <div className="fixed inset-y-0 left-0 z-40 w-[var(--sidebar-width)] animate-in slide-in-from-left-full duration-300 sm:hidden">
            <div className="absolute right-2 top-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X />
              </Button>
            </div>
            {props.children}
          </div>
        ) : null}
        {isOpen ? <SidebarOverlay onCollapse={() => setIsOpen(false)} /> : null}
      </>
    )
  }
)

SidebarTrigger.displayName = "SidebarTrigger"

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    side?: "left" | "right"
  }
>(({ className, side = "left", ...props }, ref) => {
  const { isCollapsed } = useSidebar()
  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-300 ease-in-out",
        isCollapsed
          ? `pl-[var(--sidebar-width-icon)]`
          : `pl-[var(--sidebar-width)]`,
        className
      )}
      {...props}
    />
  )
})

SidebarInset.displayName = "SidebarInset"

function useMediaQuery(query: string) {
  const [value, setValue] = React.useState(false)

  React.useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches)
    }

    const result = matchMedia(query)
    result.addEventListener("change", onChange)
    setValue(result.matches)

    return () => result.removeEventListener("change", onChange)
  }, [query])

  return value
}

export {
  SidebarProvider,
  useSidebar,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
}
