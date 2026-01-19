import { createCatalog } from "@json-render/core";
import { z } from "zod";

/**
 * Dashboard component catalog
 *
 * This defines the ONLY components that the AI can generate.
 * It acts as a guardrail - the AI cannot create arbitrary HTML/CSS.
 *
 * Note: OpenAI structured output requires all fields to be required.
 * Use .nullable() instead of .optional() for optional fields.
 */
export const dashboardCatalog = createCatalog({
  name: "dashboard",
  components: {
    // Layout Components
    Card: {
      props: z.object({
        className: z.string().nullable(),
      }),
      hasChildren: true,
      description:
        "A card container. Use CardHeader, CardContent, CardFooter as children.",
    },
    CardHeader: {
      props: z.object({
        className: z.string().nullable(),
      }),
      hasChildren: true,
      description: "Header for the Card.",
    },
    CardTitle: {
      props: z.object({
        className: z.string().nullable(),
        children: z.string().nullable(),
      }),
      hasChildren: true,
      description: "Title for the Card header.",
    },
    CardDescription: {
      props: z.object({
        className: z.string().nullable(),
        children: z.string().nullable(),
      }),
      hasChildren: true,
      description: "Description for the Card header.",
    },
    CardContent: {
      props: z.object({
        className: z.string().nullable(),
      }),
      hasChildren: true,
      description: "Content area of the Card.",
    },
    CardFooter: {
      props: z.object({
        className: z.string().nullable(),
      }),
      hasChildren: true,
      description: "Footer area of the Card.",
    },
    Separator: {
      props: z.object({
        orientation: z.enum(["horizontal", "vertical"]).nullable(),
        className: z.string().nullable(),
      }),
      description: "A visual separator.",
    },
    ScrollArea: {
      props: z.object({
        className: z.string().nullable(),
      }),
      hasChildren: true,
      description: "A scrollable area.",
    },

    // Form Components
    Label: {
      props: z.object({
        htmlFor: z.string().nullable(),
        className: z.string().nullable(),
        children: z.string().nullable(),
      }),
      hasChildren: true,
      description: "Label for a form control.",
    },
    Input: {
      props: z.object({
        type: z
          .enum(["text", "email", "password", "number", "tel", "url"])
          .nullable(),
        placeholder: z.string().nullable(),
        defaultValue: z.string().nullable(),
        name: z.string().nullable(),
        disabled: z.boolean().nullable(),
        className: z.string().nullable(),
      }),
      description: "A basic text input field.",
    },
    Textarea: {
      props: z.object({
        placeholder: z.string().nullable(),
        defaultValue: z.string().nullable(),
        name: z.string().nullable(),
        rows: z.number().nullable(),
        disabled: z.boolean().nullable(),
        className: z.string().nullable(),
      }),
      description: "A multi-line text input.",
    },
    Button: {
      props: z.object({
        variant: z
          .enum([
            "default",
            "destructive",
            "outline",
            "secondary",
            "ghost",
            "link",
          ])
          .nullable(),
        children: z.string().nullable(),
        size: z.enum(["default", "sm", "lg", "icon"]).nullable(),
        type: z.enum(["button", "submit", "reset"]).nullable(),
        disabled: z.boolean().nullable(),
        className: z.string().nullable(),
      }),
      hasChildren: true,
      description: "A clickable button.",
    },
    Checkbox: {
      props: z.object({
        id: z.string().nullable(),
        name: z.string().nullable(),
        checked: z.boolean().nullable(),
        disabled: z.boolean().nullable(),
        className: z.string().nullable(),
      }),
      description: "A checkbox input.",
    },
    Switch: {
      props: z.object({
        id: z.string().nullable(),
        name: z.string().nullable(),
        checked: z.boolean().nullable(),
        disabled: z.boolean().nullable(),
        className: z.string().nullable(),
      }),
      description: "A toggle switch.",
    },
    RadioGroup: {
      props: z.object({
        defaultValue: z.string().nullable(),
        name: z.string().nullable(),
        disabled: z.boolean().nullable(),
        className: z.string().nullable(),
      }),
      hasChildren: true,
      description: "A group of radio buttons.",
    },
    RadioGroupItem: {
      props: z.object({
        value: z.string(),
        id: z.string().nullable(),
        disabled: z.boolean().nullable(),
        className: z.string().nullable(),
      }),
      description: "An item within a RadioGroup.",
    },
    Select: {
      props: z.object({
        name: z.string().nullable(),
        defaultValue: z.string().nullable(),
        disabled: z.boolean().nullable(),
      }),
      hasChildren: true,
      description:
        "A select dropdown. MUST contain SelectTrigger and SelectContent.",
    },
    SelectTrigger: {
      props: z.object({
        className: z.string().nullable(),
      }),
      hasChildren: true,
      description: "The trigger button for a Select. MUST contain SelectValue.",
    },
    SelectValue: {
      props: z.object({
        placeholder: z.string().nullable(),
      }),
      description: "Displays the selected value in a SelectTrigger.",
    },
    SelectContent: {
      props: z.object({
        className: z.string().nullable(),
      }),
      hasChildren: true,
      description: "The content container for Select items.",
    },
    SelectItem: {
      props: z.object({
        value: z.string(),
        disabled: z.boolean().nullable(),
        className: z.string().nullable(),
      }),
      hasChildren: true,
      description: "An option within a Select.",
    },

    // Feedback Components
    Alert: {
      props: z.object({
        variant: z.enum(["default", "destructive"]).nullable(),
        className: z.string().nullable(),
      }),
      hasChildren: true,
      description: "An alert message related to a task.",
    },
    AlertTitle: {
      props: z.object({
        className: z.string().nullable(),
      }),
      hasChildren: true,
      description: "The title of an Alert.",
    },
    AlertDescription: {
      props: z.object({
        className: z.string().nullable(),
      }),
      hasChildren: true,
      description: "The description of an Alert.",
    },
    Badge: {
      props: z.object({
        variant: z
          .enum(["default", "destructive", "outline", "secondary"])
          .nullable(),
        className: z.string().nullable(),
        children: z.string().nullable(),
      }),
      hasChildren: true,
      description: "A small status badge.",
    },
    Progress: {
      props: z.object({
        value: z.number().nullable(),
        className: z.string().nullable(),
      }),
      description: "A progress bar.",
    },
    Skeleton: {
      props: z.object({
        className: z.string().nullable(),
      }),
      description: "A placeholder for loading content.",
    },
    Spinner: {
      props: z.object({
        size: z.enum(["sm", "default", "lg", "icon"]).nullable(),
        className: z.string().nullable(),
      }),
      description: "A loading spinner.",
    },

    // Navigation Components
    Tabs: {
      props: z.object({
        defaultValue: z.string().nullable(),
        className: z.string().nullable(),
      }),
      hasChildren: true,
      description: "A set of layered sections of content.",
    },
    TabsList: {
      props: z.object({
        className: z.string().nullable(),
      }),
      hasChildren: true,
      description: "Container for TabsTrigger items.",
    },
    TabsTrigger: {
      props: z.object({
        value: z.string(),
        disabled: z.boolean().nullable(),
        className: z.string().nullable(),
      }),
      hasChildren: true,
      description: "A trigger to activate a Tab.",
    },
    TabsContent: {
      props: z.object({
        value: z.string(),
        className: z.string().nullable(),
      }),
      hasChildren: true,
      description: "The content associated with a TabsTrigger.",
    },
    Accordion: {
      props: z.object({
        type: z.enum(["single", "multiple"]),
        collapsible: z.boolean().nullable(),
        defaultValue: z.string().nullable(),
        className: z.string().nullable(),
      }),
      hasChildren: true,
      description: "A vertically stacked set of interactive headings.",
    },
    AccordionItem: {
      props: z.object({
        value: z.string(),
        className: z.string().nullable(),
      }),
      hasChildren: true,
      description: "An item in the Accordion.",
    },
    AccordionTrigger: {
      props: z.object({
        className: z.string().nullable(),
      }),
      hasChildren: true,
      description: "The trigger that toggles the AccordionItem.",
    },
    AccordionContent: {
      props: z.object({
        className: z.string().nullable(),
      }),
      hasChildren: true,
      description: "The content of the AccordionItem.",
    },
    Breadcrumb: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Breadcrumb navigation.",
    },
    BreadcrumbList: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "List of breadcrumbs.",
    },
    BreadcrumbItem: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Individual breadcrumb item.",
    },
    BreadcrumbLink: {
      props: z.object({
        href: z.string().nullable(),
        className: z.string().nullable(),
      }),
      hasChildren: true,
      description: "Link within a breadcrumb.",
    },
    BreadcrumbPage: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Current page in breadcrumbs.",
    },
    BreadcrumbSeparator: {
      props: z.object({ className: z.string().nullable() }),
      description: "Visual separator for breadcrumbs.",
    },
    BreadcrumbEllipsis: {
      props: z.object({ className: z.string().nullable() }),
      description: "Ellipsis for collapsed breadcrumbs.",
    },
    NavigationMenu: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Fullscreen navigation menu.",
    },
    NavigationMenuList: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "List of navigation items.",
    },
    NavigationMenuItem: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Individual navigation item.",
    },
    NavigationMenuTrigger: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Trigger for navigation content.",
    },
    NavigationMenuContent: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Content for navigation item.",
    },
    NavigationMenuLink: {
      props: z.object({
        href: z.string().nullable(),
        className: z.string().nullable(),
      }),
      hasChildren: true,
      description: "Link in navigation menu.",
    },
    Pagination: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Pagination wrapper.",
    },
    PaginationContent: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Pagination content area.",
    },
    PaginationItem: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Pagination item.",
    },
    PaginationLink: {
      props: z.object({
        isActive: z.boolean().nullable(),
        size: z.enum(["default", "sm", "lg", "icon"]).nullable(),
        className: z.string().nullable(),
      }),
      hasChildren: true,
      description: "Link to a page.",
    },
    PaginationNext: {
      props: z.object({ className: z.string().nullable() }),
      description: "Next page button.",
    },
    PaginationPrevious: {
      props: z.object({ className: z.string().nullable() }),
      description: "Previous page button.",
    },
    PaginationEllipsis: {
      props: z.object({ className: z.string().nullable() }),
      description: "Ellipsis for skipped pages.",
    },

    // Components (Groups / Misc)
    Avatar: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description:
        "An image element with a fallback for representing the user.",
    },
    AvatarImage: {
      props: z.object({
        src: z.string(),
        alt: z.string().nullable(),
        className: z.string().nullable(),
      }),
      description: "The image of the avatar.",
    },
    AvatarFallback: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Fallback text when image fails.",
    },
    AspectRatio: {
      props: z.object({
        ratio: z.number().nullable(),
        className: z.string().nullable(),
      }),
      hasChildren: true,
      description: "Displays content within a desired ratio.",
    },
    Collapsible: {
      props: z.object({
        open: z.boolean().nullable(),
        defaultOpen: z.boolean().nullable(),
        className: z.string().nullable(),
      }),
      hasChildren: true,
      description: "Interactive component which expands/collapses a panel.",
    },
    CollapsibleTrigger: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Trigger to toggle collapsible.",
    },
    CollapsibleContent: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Content that expands/collapses.",
    },
    HoverCard: {
      props: z.object({
        openDelay: z.number().nullable(),
        closeDelay: z.number().nullable(),
      }),
      hasChildren: true,
      description: "Preview content available behind a link.",
    },
    HoverCardTrigger: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Trigger for hover card.",
    },
    HoverCardContent: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Content of hover card.",
    },
    Menubar: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Horizontal menu bar.",
    },
    MenubarMenu: {
      props: z.object({}),
      hasChildren: true,
      description: "Menu in menubar.",
    },
    MenubarTrigger: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Trigger for menubar menu.",
    },
    MenubarContent: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Content for menubar menu.",
    },
    MenubarItem: {
      props: z.object({
        inset: z.boolean().nullable(),
        className: z.string().nullable(),
      }),
      hasChildren: true,
      description: "Item in menubar.",
    },
    MenubarSeparator: {
      props: z.object({ className: z.string().nullable() }),
      description: "Separator in menubar.",
    },
    Popover: {
      props: z.object({}),
      hasChildren: true,
      description: "Displays rich content in a portal.",
    },
    PopoverTrigger: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Trigger for popover.",
    },
    PopoverContent: {
      props: z.object({
        className: z.string().nullable(),
        align: z.enum(["center", "start", "end"]).nullable(),
      }),
      hasChildren: true,
      description: "Content of popover.",
    },
    Slider: {
      props: z.object({
        defaultValue: z.array(z.number()).nullable(),
        max: z.number().nullable(),
        min: z.number().nullable(),
        step: z.number().nullable(),
        className: z.string().nullable(),
      }),
      description: "Input control for selecting a value from a range.",
    },
    Toggle: {
      props: z.object({
        variant: z.enum(["default", "outline"]).nullable(),
        size: z.enum(["default", "sm", "lg"]).nullable(),
        className: z.string().nullable(),
      }),
      hasChildren: true,
      description: "Two-state button.",
    },
    ToggleGroup: {
      props: z.object({
        type: z.enum(["single", "multiple"]),
        variant: z.enum(["default", "outline"]).nullable(),
        size: z.enum(["default", "sm", "lg"]).nullable(),
        className: z.string().nullable(),
      }),
      hasChildren: true,
      description: "Set of two-state buttons.",
    },
    ToggleGroupItem: {
      props: z.object({
        value: z.string(),
        className: z.string().nullable(),
      }),
      hasChildren: true,
      description: "Item in toggle group.",
    },
    Tooltip: {
      props: z.object({}),
      hasChildren: true,
      description: "Popup that displays information related to an element.",
    },
    TooltipProvider: {
      props: z.object({
        delayDuration: z.number().nullable(),
        skipDelayDuration: z.number().nullable(),
        disableHoverableContent: z.boolean().nullable(),
      }),
      hasChildren: true,
      description:
        "Global provider for tooltips. Wrap your app or section in this.",
    },
    TooltipTrigger: {
      props: z.object({}),
      hasChildren: true,
      description: "Trigger for tooltip.",
    },
    TooltipContent: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Content of tooltip.",
    },

    // Command / Combobox
    Command: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Fast, composable, unstyled command menu.",
    },
    CommandInput: {
      props: z.object({
        placeholder: z.string().nullable(),
        className: z.string().nullable(),
      }),
      description: "Input for command menu.",
    },
    CommandList: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "List of command items.",
    },
    CommandEmpty: {
      props: z.object({}),
      hasChildren: true,
      description: "Shown when no results found.",
    },
    CommandGroup: {
      props: z.object({
        heading: z.string().nullable(),
        className: z.string().nullable(),
      }),
      hasChildren: true,
      description: "Group of command items.",
    },
    CommandItem: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Individual command item.",
    },

    // Dialogs & Overlays
    Dialog: {
      props: z.object({
        open: z.boolean().nullable(),
        defaultOpen: z.boolean().nullable(),
      }),
      hasChildren: true,
      description: "Window overlaid on primary content. ",
    },
    DialogTrigger: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Trigger to open dialog.",
    },
    DialogContent: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Content of dialog.",
    },
    DialogHeader: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Header of dialog.",
    },
    DialogFooter: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Footer of dialog.",
    },
    DialogTitle: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Title of dialog.",
    },
    DialogDescription: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Description of dialog.",
    },
    Sheet: {
      props: z.object({
        open: z.boolean().nullable(),
        defaultOpen: z.boolean().nullable(),
      }),
      hasChildren: true,
      description: "Sheet overlaid on primary content.",
    },
    SheetTrigger: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Trigger to open sheet.",
    },
    SheetContent: {
      props: z.object({
        side: z.enum(["top", "bottom", "left", "right"]).nullable(),
        className: z.string().nullable(),
      }),
      hasChildren: true,
      description: "Content of sheet.",
    },
    SheetHeader: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Header of sheet.",
    },
    SheetFooter: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Footer of sheet.",
    },
    SheetTitle: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Title of sheet.",
    },
    SheetDescription: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Description of sheet.",
    },
    AlertDialog: {
      props: z.object({
        open: z.boolean().nullable(),
        defaultOpen: z.boolean().nullable(),
      }),
      hasChildren: true,
      description: "Alert dialog.",
    },
    AlertDialogTrigger: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Trigger to open alert dialog.",
    },
    AlertDialogContent: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Content of alert dialog.",
    },
    AlertDialogHeader: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Header of alert dialog.",
    },
    AlertDialogFooter: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Footer of alert dialog.",
    },
    AlertDialogTitle: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Title of alert dialog.",
    },
    AlertDialogDescription: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Description of alert dialog.",
    },
    AlertDialogAction: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Action button in alert dialog.",
    },
    AlertDialogCancel: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Cancel button in alert dialog.",
    },
    Drawer: {
      props: z.object({
        open: z.boolean().nullable(),
        defaultOpen: z.boolean().nullable(),
      }),
      hasChildren: true,
      description: "Drawer component.",
    },
    DrawerTrigger: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Trigger for drawer.",
    },
    DrawerContent: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Content of drawer.",
    },
    DrawerHeader: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Header of drawer.",
    },
    DrawerFooter: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Footer of drawer.",
    },
    DrawerTitle: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Title of drawer.",
    },
    DrawerDescription: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Description of drawer.",
    },

    // Extras
    Carousel: {
      props: z.object({
        opts: z.any().nullable(),
        plugins: z.any().nullable(),
        orientation: z.enum(["horizontal", "vertical"]).nullable(),
        className: z.string().nullable(),
      }),
      hasChildren: true,
      description: "Carousel with motion.",
    },
    CarouselContent: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Container for carousel items.",
    },
    CarouselItem: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Individual carousel item.",
    },
    CarouselPrevious: {
      props: z.object({ className: z.string().nullable() }),
      description: "Previous button for carousel.",
    },
    CarouselNext: {
      props: z.object({ className: z.string().nullable() }),
      description: "Next button for carousel.",
    },
    Table: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Data table.",
    },
    TableHeader: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Header section of table.",
    },
    TableBody: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Body section of table.",
    },
    TableFooter: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Footer section of table.",
    },
    TableHead: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Header cell of table.",
    },
    TableRow: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Row of table.",
    },
    TableCell: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Cell of table.",
    },
    ResizablePanelGroup: {
      props: z.object({
        direction: z.enum(["vertical", "horizontal"]),
        className: z.string().nullable(),
      }),
      hasChildren: true,
      description: "Group of resizable panels.",
    },
    ResizablePanel: {
      props: z.object({
        defaultSize: z.number().nullable(),
        minSize: z.number().nullable(),
        maxSize: z.number().nullable(),
        className: z.string().nullable(),
      }),
      hasChildren: true,
      description: "Resizable panel area.",
    },
    ResizableHandle: {
      props: z.object({
        withHandle: z.boolean().nullable(),
        className: z.string().nullable(),
      }),
      description: "Handle to resize panels.",
    },
    Sidebar: {
      props: z.object({
        variant: z.enum(["sidebar", "floating", "inset"]).nullable(),
        className: z.string().nullable(),
      }),
      hasChildren: true,
      description: "Sidebar container.",
    },
    SidebarContent: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
    },
    SidebarHeader: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
    },
    SidebarFooter: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
    },
    SidebarGroup: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
    },
    SidebarTrigger: {
      props: z.object({ className: z.string().nullable() }),
      description: "Trigger to toggle sidebar.",
    },
    InputOTP: {
      props: z.object({
        maxLength: z.number(),
        className: z.string().nullable(),
      }),
      hasChildren: true,
      description: "OTP Input container.",
    },
    InputOTPGroup: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
    },
    InputOTPSlot: {
      props: z.object({ index: z.number(), className: z.string().nullable() }),
    },
    InputOTPSeparator: {
      props: z.object({}),
    },
    ContextMenuItem: {
      props: z.object({
        inset: z.boolean().nullable(),
        className: z.string().nullable(),
      }),
      hasChildren: true,
    },
    ContextMenuTrigger: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
    },
    ContextMenuContent: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
    },
    ContextMenu: {
      props: z.object({}),
      hasChildren: true,
      description: "Context menu.",
    },

    // Custom/Composite
    ButtonGroup: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Group of buttons.",
    },
    InputGroup: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Group of input elements.",
    },
    InputGroupInput: {
      props: z.object({
        placeholder: z.string().nullable(),
        className: z.string().nullable(),
      }),
      description: "Input within an input group.",
    },
    InputGroupText: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Text affix within an input group.",
    },
    InputGroupButton: {
      props: z.object({
        variant: z.string().nullable(),
        className: z.string().nullable(),
      }),
      hasChildren: true,
      description: "Button within an input group.",
    },
    Field: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Form field wrapper.",
    },
    FieldLabel: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Label for field.",
    },
    FieldDescription: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Description for field.",
    },
    FieldGroup: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Group of form fields with proper spacing.",
    },
    FieldSeparator: {
      props: z.object({
        className: z.string().nullable(),
        children: z.string().nullable(),
      }),
      hasChildren: true,
      description: "Visual separator with optional text between fields.",
    },
    Item: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
    },
    ItemTitle: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
    },
    ItemDescription: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
    },
    Empty: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Empty state container.",
    },
    EmptyTitle: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
    },
    EmptyDescription: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
    },
    EmptyMedia: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
    },
    Kbd: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Keyboard shortcut display.",
    },
    DropdownMenu: {
      props: z.object({}),
      hasChildren: true,
      description: "Dropdown menu.",
    },
    DropdownMenuTrigger: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Trigger for dropdown.",
    },
    DropdownMenuContent: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
      description: "Content of dropdown.",
    },
    DropdownMenuItem: {
      props: z.object({
        inset: z.boolean().nullable(),
        className: z.string().nullable(),
      }),
      hasChildren: true,
      description: "Item in dropdown.",
    },
    DropdownMenuLabel: {
      props: z.object({
        inset: z.boolean().nullable(),
        className: z.string().nullable(),
      }),
      hasChildren: true,
      description: "Label in dropdown.",
    },
    DropdownMenuSeparator: {
      props: z.object({ className: z.string().nullable() }),
      description: "Separator in dropdown.",
    },
    DropdownMenuCheckboxItem: {
      props: z.object({
        checked: z.boolean().nullable(),
        className: z.string().nullable(),
      }),
      hasChildren: true,
    },
    DropdownMenuRadioGroup: {
      props: z.object({
        value: z.string().nullable(),
        className: z.string().nullable(),
      }),
      hasChildren: true,
    },
    DropdownMenuRadioItem: {
      props: z.object({ value: z.string(), className: z.string().nullable() }),
      hasChildren: true,
    },
    Calendar: {
      props: z.object({
        mode: z.enum(["single", "multiple", "range"]).nullable(),
        selected: z.any().nullable(),
        className: z.string().nullable(),
      }),
      description: "Date picker calendar.",
    },
    NativeSelect: {
      props: z.object({ className: z.string().nullable() }),
      hasChildren: true,
    },
    NativeSelectOption: {
      props: z.object({ value: z.string(), className: z.string().nullable() }),
      hasChildren: true,
    },
    Sonner: {
      props: z.object({}),
      description: "Toast provider.",
    },
    // Native Elements
    div: {
      props: z.object({
        className: z.string().nullable(),
      }),
      hasChildren: true,
      description: "Generic layout container.",
    },
  },
  validation: "strict",
});

// Export the component list for the AI prompt
export const componentList = dashboardCatalog.componentNames as string[];
