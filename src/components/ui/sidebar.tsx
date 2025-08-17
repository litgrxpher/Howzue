
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

type SidebarContextValue = {
  isCollapsed: boolean
  isMobile: boolean
  width: number
  widthIcon: number
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null)

export const useSidebar = () => {
  const context = React.useContext(SidebarContext)

  if (!context) {
    throw new Error("useSidebar must be used within a <SidebarProvider />")
  }

  return context
}

type SidebarProviderProps = React.PropsWithChildren<{
  isCollapsed: boolean
  isMobile: boolean
  width?: number
  widthIcon?: number
}>

export const SidebarProvider = React.forwardRef<
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

export const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    side?: "left" | "right"
    collapsible?: "icon" | "button"
    isCollapsed: boolean
    isMobile: boolean
    onCollapse?: (collapsed: boolean) => void
  }
>(
  (
    {
      className,
      side = "left",
      collapsible = "icon",
      onCollapse,
      isCollapsed,
      isMobile,
      ...props
    },
    ref
  ) => {

    const handleCollapse = React.useCallback(() => {
        onCollapse?.(!isCollapsed);
    },[isCollapsed, onCollapse])

    if (isMobile) {
      return null;
    }
    
    return (
      <SidebarProvider
        isCollapsed={isCollapsed}
        isMobile={isMobile}
      >
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
  onCollapse: () => void
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
      onClick={props.onCollapse}
    >
      <MoreHorizontal />
    </Button>
  )
}

SidebarCollapse.displayName = "SidebarCollapse"

export const SidebarHeader = React.forwardRef<
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

export const SidebarContent = React.forwardRef<
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

export const SidebarFooter = React.forwardRef<
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

export const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
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

export const SidebarMenuItem = React.forwardRef<
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

export const SidebarMenuButton = React.forwardRef<
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

export const SidebarTrigger = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const isMobile = useIsMobile();
    
    const sidebarContent = (
      <>
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
      </>
    );

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
          <SidebarProvider isCollapsed={!isOpen} isMobile={isMobile}>
            <div className="fixed inset-y-0 left-0 z-40 w-[var(--sidebar-width)] animate-in slide-in-from-left-full duration-300 sm:hidden bg-sidebar border-r">
                {sidebarContent}
            </div>
            <SidebarOverlay onCollapse={() => setIsOpen(false)} />
          </SidebarProvider>
        ) : null}
      </>
    )
  }
)

SidebarTrigger.displayName = "SidebarTrigger"
