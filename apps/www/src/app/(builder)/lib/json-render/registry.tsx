import type { Action } from "@json-render/core";
import {
  type ComponentRegistry,
  type ComponentRenderProps,
  useDataBinding,
  useDataValue,
} from "@json-render/react";
import { Badge } from "@repo/design-system/components/ui/badge";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@repo/design-system/components/ui/card";
import { Input } from "@repo/design-system/components/ui/input";
import { Separator } from "@repo/design-system/components/ui/separator";
import { Textarea } from "@repo/design-system/components/ui/textarea";
import { cn } from "@repo/design-system/lib/utils";
import type * as React from "react";

type Props = ComponentRenderProps<Record<string, unknown>>;

type ButtonVariant = React.ComponentProps<typeof Button>["variant"];
type ButtonSize = React.ComponentProps<typeof Button>["size"];
type SeparatorOrientation = React.ComponentProps<
  typeof Separator
>["orientation"];
type BadgeVariant = React.ComponentProps<typeof Badge>["variant"];

const GAP_CLASSES: Record<string, string> = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
};

const ALIGN_CLASSES: Record<string, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

function getString(props: Record<string, unknown>, key: string) {
  const value = props[key];
  return typeof value === "string" ? value : undefined;
}

function getNumber(props: Record<string, unknown>, key: string) {
  const value = props[key];
  return typeof value === "number" ? value : undefined;
}

function getAction(
  props: Record<string, unknown>,
  key: string
): Action | undefined {
  const value = props[key];
  if (!value || typeof value !== "object") {
    return undefined;
  }
  const record = value as Record<string, unknown>;
  return typeof record.name === "string" ? (value as Action) : undefined;
}

function renderTextVariant(
  variant: string | undefined,
  content: React.ReactNode
) {
  switch (variant) {
    case "h1":
      return <h1 className="font-semibold text-2xl">{content}</h1>;
    case "h2":
      return <h2 className="font-semibold text-xl">{content}</h2>;
    case "h3":
      return <h3 className="font-semibold text-lg">{content}</h3>;
    case "caption":
      return <p className="text-muted-foreground text-xs">{content}</p>;
    default:
      return <p className="text-foreground text-sm">{content}</p>;
  }
}

const CardComponent = ({ element, children }: Props) => (
  <Card className={getString(element.props, "className")}>{children}</Card>
);

const CardHeaderComponent = ({ element, children }: Props) => (
  <CardHeader className={getString(element.props, "className")}>
    {children}
  </CardHeader>
);

const CardContentComponent = ({ element, children }: Props) => (
  <CardContent className={getString(element.props, "className")}>
    {children}
  </CardContent>
);

const CardFooterComponent = ({ element, children }: Props) => (
  <CardFooter className={getString(element.props, "className")}>
    {children}
  </CardFooter>
);

const ColumnComponent = ({ element, children }: Props) => {
  const gap = GAP_CLASSES[getString(element.props, "gap") ?? "md"] ?? "gap-4";
  const align =
    ALIGN_CLASSES[getString(element.props, "align") ?? "start"] ??
    "items-start";

  return (
    <div
      className={cn(
        "flex flex-col",
        gap,
        align,
        getString(element.props, "className")
      )}
    >
      {children}
    </div>
  );
};

const RowComponent = ({ element, children }: Props) => {
  const gap = GAP_CLASSES[getString(element.props, "gap") ?? "md"] ?? "gap-4";
  const align =
    ALIGN_CLASSES[getString(element.props, "align") ?? "center"] ??
    "items-center";

  return (
    <div
      className={cn(
        "flex flex-row",
        gap,
        align,
        getString(element.props, "className")
      )}
    >
      {children}
    </div>
  );
};

const TextComponent = ({ element }: Props) => {
  const valuePath = getString(element.props, "valuePath");
  const boundValue = useDataValue<unknown>(valuePath ?? "");

  const text =
    valuePath && boundValue !== undefined && boundValue !== null
      ? String(boundValue)
      : (getString(element.props, "text") ?? "");

  const className = getString(element.props, "className");
  const variant = getString(element.props, "variant");

  return <div className={className}>{renderTextVariant(variant, text)}</div>;
};

const ButtonComponent = ({ element, onAction }: Props) => {
  const label = getString(element.props, "label") ?? "Button";
  const action = getAction(element.props, "action");

  const variant = getString(element.props, "variant") as
    | ButtonVariant
    | undefined;
  const size = getString(element.props, "size") as ButtonSize | undefined;

  return (
    <Button
      className={getString(element.props, "className")}
      onClick={() => {
        if (action) {
          onAction?.(action);
        }
      }}
      size={size}
      variant={variant}
    >
      {label}
    </Button>
  );
};

const InputComponent = ({ element }: Props) => {
  const valuePath = getString(element.props, "valuePath") ?? "";
  const [value, setValue] = useDataBinding<string>(valuePath);

  return (
    <Input
      className={getString(element.props, "className")}
      onChange={(event) => setValue(event.target.value)}
      placeholder={getString(element.props, "placeholder")}
      type={getString(element.props, "type")}
      value={value ?? ""}
    />
  );
};

const TextareaComponent = ({ element }: Props) => {
  const valuePath = getString(element.props, "valuePath") ?? "";
  const [value, setValue] = useDataBinding<string>(valuePath);

  return (
    <Textarea
      className={getString(element.props, "className")}
      onChange={(event) => setValue(event.target.value)}
      placeholder={getString(element.props, "placeholder")}
      rows={getNumber(element.props, "rows")}
      value={value ?? ""}
    />
  );
};

const SeparatorComponent = ({ element }: Props) => {
  const orientation = getString(element.props, "orientation") as
    | SeparatorOrientation
    | undefined;

  return (
    <Separator
      className={getString(element.props, "className")}
      orientation={orientation}
    />
  );
};

const BadgeComponent = ({ element }: Props) => {
  const variant = getString(element.props, "variant") as
    | BadgeVariant
    | undefined;

  return (
    <Badge className={getString(element.props, "className")} variant={variant}>
      {getString(element.props, "text") ?? "Badge"}
    </Badge>
  );
};

export const builderRegistry: ComponentRegistry = {
  Card: CardComponent,
  CardHeader: CardHeaderComponent,
  CardContent: CardContentComponent,
  CardFooter: CardFooterComponent,
  Column: ColumnComponent,
  Row: RowComponent,
  Text: TextComponent,
  Button: ButtonComponent,
  Input: InputComponent,
  Textarea: TextareaComponent,
  Separator: SeparatorComponent,
  Badge: BadgeComponent,
};
