"use client";

import * as React from "react";
import { z } from "zod";
import { Button } from "@/registry/new-york/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card";
import { Input } from "@/registry/new-york/ui/input";
import { Label } from "@/registry/new-york/ui/label";
import { Textarea } from "@/registry/new-york/ui/textarea";

const exampleFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
});

export function ExampleForm() {
  const [pending, setPending] = React.useState(false);
  const [state, setState] = React.useState({
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
    success: false,
    errors: {
      name: "",
      email: "",
      message: "",
    },
  });

  const handleSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setPending(true);

      const formData = new FormData(e.target as HTMLFormElement);
      const data = Object.fromEntries(formData.entries());
      const result = exampleFormSchema.safeParse(data);

      if (!result.success) {
        setState({
          ...state,
          errors: Object.fromEntries(
            Object.entries(result.error.flatten().fieldErrors).map(
              ([key, value]) => [key, value?.[0] ?? ""]
            )
          ) as Record<keyof typeof state.errors, string>,
        });
        setPending(false);
        return;
      }

      setPending(false);
    },
    [state]
  );

  return (
    <form className="w-full max-w-sm" onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>How can we help?</CardTitle>
          <CardDescription>
            Need help with your project? We&apos;re here to assist you.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div
            className="group/field grid gap-2"
            data-invalid={!!state.errors?.name}
          >
            <Label
              className="group-data-[invalid=true]/field:text-destructive"
              htmlFor="name"
            >
              Name <span aria-hidden="true">*</span>
            </Label>
            <Input
              aria-errormessage="error-name"
              aria-invalid={!!state.errors?.name}
              className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
              defaultValue={state.defaultValues.name}
              disabled={pending}
              id="name"
              name="name"
              placeholder="Lee Robinson"
            />
            {state.errors?.name && (
              <p className="text-destructive text-sm" id="error-name">
                {state.errors.name}
              </p>
            )}
          </div>
          <div
            className="group/field grid gap-2"
            data-invalid={!!state.errors?.email}
          >
            <Label
              className="group-data-[invalid=true]/field:text-destructive"
              htmlFor="email"
            >
              Email <span aria-hidden="true">*</span>
            </Label>
            <Input
              aria-errormessage="error-email"
              aria-invalid={!!state.errors?.email}
              className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
              defaultValue={state.defaultValues.email}
              disabled={pending}
              id="email"
              name="email"
              placeholder="leerob@acme.com"
            />
            {state.errors?.email && (
              <p className="text-destructive text-sm" id="error-email">
                {state.errors.email}
              </p>
            )}
          </div>
          <div
            className="group/field grid gap-2"
            data-invalid={!!state.errors?.message}
          >
            <Label
              className="group-data-[invalid=true]/field:text-destructive"
              htmlFor="message"
            >
              Message <span aria-hidden="true">*</span>
            </Label>
            <Textarea
              aria-errormessage="error-message"
              aria-invalid={!!state.errors?.message}
              className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
              defaultValue={state.defaultValues.message}
              disabled={pending}
              id="message"
              name="message"
              placeholder="Type your message here..."
            />
            {state.errors?.message && (
              <p className="text-destructive text-sm" id="error-message">
                {state.errors.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button disabled={pending} size="sm" type="submit">
            {pending ? "Sending..." : "Send Message"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
