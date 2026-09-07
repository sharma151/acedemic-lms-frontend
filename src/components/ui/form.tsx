import { zodResolver } from "@hookform/resolvers/zod";
import { Slot } from "@radix-ui/react-slot";
import React, { forwardRef, useImperativeHandle } from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  SubmitHandler,
  UseFormProps,
  UseFormReturn,
  useForm,
  useFormContext,
} from "react-hook-form";
import { ZodType, z } from "zod";

import { cn } from "@/lib/utils";
import { Label } from "./label";

/**
 * Helper to locate, scroll to, and focus the first visible form error.
 * Caches bounding rects to prevent layout thrashing during sorting.
 */
const scrollToAndFocusFirstError = (formElement: HTMLFormElement | null) => {
  const root = formElement || document;
  const errorMessages = root.querySelectorAll('[id$="-form-item-message"]');
  if (!errorMessages.length) return;

  // Cache bounding rects upfront to optimize performance
  const visibleErrorsWithRects = Array.from(errorMessages)
    .map((el) => ({ el: el as HTMLElement, rect: el.getBoundingClientRect() }))
    .filter(({ rect }) => rect.width > 0 || rect.height > 0);

  if (!visibleErrorsWithRects.length) return;

  // Sort by highest position on the viewport
  visibleErrorsWithRects.sort((a, b) => a.rect.top - b.rect.top);

  const topErrorMessage = visibleErrorsWithRects[0].el;
  const formItem = topErrorMessage.parentElement;

  // Scroll target element into view
  const targetToScroll = formItem || topErrorMessage;
  targetToScroll.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });

  // Shift focus to the first interactive input element inside the FormItem
  if (formItem) {
    const focusableSelectors =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusable = formItem.querySelector(focusableSelectors) as HTMLElement;

    if (focusable) {
      focusable.focus({ preventScroll: true });
    }
  }
};

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

const FormField = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(error && "text-red-500 dark:text-red-500", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm leading-normal text-slate-500", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn(
        "text-xs font-medium text-red-500 dark:text-red-500",
        className,
      )}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

type FormProps<TFormValues extends FieldValues, Schema> = {
  onSubmit: SubmitHandler<TFormValues>;
  onError?: import("react-hook-form").SubmitErrorHandler<TFormValues>;
  schema: Schema;
  className?: string;
  children: (methods: UseFormReturn<TFormValues>) => React.ReactNode;
  options?: UseFormProps<TFormValues>;
  id?: string;
  autoComplete?: React.FormHTMLAttributes<HTMLFormElement>["autoComplete"];
  /** When true (default false), discourages password manager autofill/save prompts on the form. */
  ignorePasswordManager?: boolean;
  /** When set, form submit/validation only runs when the native submitter (e.g. button) matches this selector. Use to avoid stray submits from nested modals/dialogs. */
  submitOnlyFromSelector?: string;
};

// eslint-disable-next-line react/display-name
const Form = forwardRef(
  <
    Schema extends ZodType<any, any, any>,
    TFormValues extends FieldValues = z.infer<Schema>,
  >(
    {
      onSubmit,
      children,
      className,
      options,
      id,
      schema,
      onError,
      submitOnlyFromSelector,
    }: FormProps<TFormValues, Schema>,
    ref: React.ForwardedRef<UseFormReturn<TFormValues>>,
  ) => {
    const form = useForm<TFormValues>({
      shouldFocusError: false,
      ...options,
      resolver: zodResolver(schema) as any,
      mode: options?.mode ?? "onSubmit",
    });

    useImperativeHandle(ref, () => form);

    return (
      <FormProvider {...form}>
        <form
          id={id}
          className={cn("min-w-0 space-y-6", className)}
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();

            const submitter = (
              e as React.FormEvent<HTMLFormElement> & {
                submitter?: HTMLElement;
              }
            ).submitter;

            if (
              submitOnlyFromSelector &&
              (!submitter || !submitter.closest(submitOnlyFromSelector))
            ) {
              return;
            }

            form.handleSubmit(onSubmit, (errors, event) => {
              if (onError) {
                onError(errors, event);
              }

              setTimeout(() => {
                const formElement = id ? document.getElementById(id) : null;
                scrollToAndFocusFirstError(formElement as HTMLFormElement);
              }, 100);
            })(e);
          }}
        >
          {children(form)}
        </form>
      </FormProvider>
    );
  },
) as unknown as (<
  Schema extends ZodType<any, any, any>,
  TFormValues extends FieldValues = z.infer<Schema>,
>(
  props: FormProps<TFormValues, Schema> & {
    ref?: React.ForwardedRef<UseFormReturn<TFormValues>>;
  },
) => React.ReactElement) & { displayName?: string };

Form.displayName = "Form";

export {
  useFormField,
  Form,
  FormProvider,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
