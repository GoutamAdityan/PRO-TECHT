import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { PanelLeft } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// --- Context for Sidebar State ---
interface SidebarContextProps {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
  openMobile: boolean;
  setOpenMobile: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

// --- Sidebar Provider ---
export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [openMobile, setOpenMobile] = React.useState(false);

  React.useEffect(() => {
    if (isMobile) {
      setIsExpanded(false);
    }
  }, [isMobile]);

  const contextValue = React.useMemo(
    () => ({ isExpanded, setIsExpanded, isMobile, openMobile, setOpenMobile }),
    [isExpanded, isMobile, openMobile]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
    </SidebarContext.Provider>
  );
}

// --- Main Sidebar Component ---
const W_COLLAPSED = 64;
const W_EXPANDED = 240;

export const Sidebar = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, children, ...props }, ref) => {
    const { isExpanded, setIsExpanded, isMobile, openMobile, setOpenMobile } = useSidebar();

    React.useEffect(() => {
      document.body.style.setProperty("--sb-w", `${isExpanded ? W_EXPANDED : W_COLLAPSED}px`);
    }, [isExpanded]);

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile}>
          <SheetContent
            side="left"
            className="w-[--sidebar-width-mobile] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
            style={{ "--sidebar-width-mobile": `${W_EXPANDED}px` } as React.CSSProperties}
          >
            <nav ref={ref} className="flex h-full w-full flex-col" {...props}>
              {children}
            </nav>
          </SheetContent>
        </Sheet>
      );
    }

    return (
      <nav
        ref={ref}
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out overflow-hidden flex flex-col",
          className
        )}
        style={{ width: isExpanded ? W_EXPANDED : W_COLLAPSED }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        onFocusCapture={() => setIsExpanded(true)}
        onBlurCapture={() => setIsExpanded(false)}
        aria-expanded={isExpanded}
        {...props}
      >
        {children}
      </nav>
    );
  }
);
Sidebar.displayName = "Sidebar";


// --- Sidebar Menu Button ---
const sidebarMenuButtonVariants = cva(
    "flex w-full items-center gap-3 rounded-lg p-3 text-left text-sm outline-none ring-sidebar-ring transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground",
);

export const SidebarMenuButton = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    isActive?: boolean;
    label: string;
  }
>(({ className, isActive, label, children, ...props }, ref) => {
  const { isExpanded } = useSidebar();

  return (
    <a
      ref={ref}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants(), !isExpanded && "justify-center", className)}
      title={isExpanded ? undefined : label}
      {...props}
    >
      {children}
      {label && (
        <span
          className={cn(
            "label whitespace-nowrap transition-all duration-200",
            isExpanded
              ? "opacity-100 visible w-auto max-w-none ml-2"
              : "opacity-0 invisible w-0 max-w-0 overflow-hidden m-0 p-0 pointer-events-none"
          )}
          aria-hidden={!isExpanded}
        >
          {label}
        </span>
      )}
    </a>
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";


// --- Other components (simplified or kept as is) ---

export const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        const { isExpanded } = useSidebar();
        return (
            <div
            ref={ref}
            className={cn(
                "flex flex-col gap-2 p-4 transition-all duration-300 ease-in-out",
                isExpanded ? "items-start" : "items-center",
                className
            )}
            {...props}
            />
        );
    }
);
SidebarHeader.displayName = "SidebarHeader";

export const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        const { isExpanded } = useSidebar();
        return (
            <div
            ref={ref}
            className={cn(
                "flex flex-col gap-2 mt-auto transition-all duration-300 ease-in-out",
                isExpanded ? "items-start p-4" : "items-center p-3",
                className
            )}
            {...props}
            />
        );
    }
);
SidebarFooter.displayName = "SidebarFooter";


export const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
        ref={ref}
        className={cn("flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden p-2", className)}
        {...props}
        />
    )
);
SidebarContent.displayName = "SidebarContent";

export const SidebarMenu = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
    ({ className, ...props }, ref) => (
        <ul ref={ref} className={cn("flex w-full min-w-0 flex-col gap-1", className)} {...props} />
    )
);
SidebarMenu.displayName = "SidebarMenu";

export const SidebarMenuItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
    ({ className, ...props }, ref) => (
        <li ref={ref} className={cn("group/menu-item relative", className)} {...props} />
    )
);
SidebarMenuItem.displayName = "SidebarMenuItem";


export const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { setOpenMobile } = useSidebar();
  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7 md:hidden", className)}
      onClick={(event) => {
        onClick?.(event);
        setOpenMobile(true);
      }}
      {...props}
    >
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

// --- Inset for main content ---
export const SidebarInset = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("transition-all duration-300 ease-in-out", className)}
        style={{ paddingLeft: `var(--sb-w, ${W_COLLAPSED}px)` }}
        {...props}
      />
    );
  }
);
SidebarInset.displayName = "SidebarInset";
