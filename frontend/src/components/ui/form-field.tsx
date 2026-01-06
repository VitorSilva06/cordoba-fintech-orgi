import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

/* ==========================================================================
   Form Field Wrapper
   ========================================================================== */

interface FormFieldContextValue {
  id: string;
  error?: string;
  disabled?: boolean;
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null);

function useFormField() {
  const context = React.useContext(FormFieldContext);
  if (!context) {
    throw new Error("useFormField must be used within a FormField");
  }
  return context;
}

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  error?: string;
  disabled?: boolean;
}

function FormField({ 
  className, 
  error,
  disabled,
  children,
  ...props 
}: FormFieldProps) {
  const id = React.useId();

  return (
    <FormFieldContext.Provider value={{ id, error, disabled }}>
      <div
        data-slot="form-field"
        className={cn("space-y-1.5", className)}
        {...props}
      >
        {children}
      </div>
    </FormFieldContext.Provider>
  );
}

/* ==========================================================================
   Form Label
   ========================================================================== */

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      variant: {
        default: "text-gray-700 dark:text-gray-200",
        error: "text-red-600 dark:text-red-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface FormLabelProps 
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {
  required?: boolean;
  optional?: boolean;
}

function FormLabel({ 
  className, 
  variant,
  required,
  optional,
  children,
  ...props 
}: FormLabelProps) {
  const { id, error } = React.useContext(FormFieldContext) ?? {};

  return (
    <label
      data-slot="form-label"
      htmlFor={id}
      className={cn(
        labelVariants({ variant: error ? "error" : variant }),
        "flex items-center gap-1",
        className
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="text-red-500 dark:text-red-400" aria-hidden="true">*</span>
      )}
      {optional && (
        <span className="text-gray-400 dark:text-gray-500 text-xs font-normal ml-1">(opcional)</span>
      )}
    </label>
  );
}

/* ==========================================================================
   Form Description / Hint
   ========================================================================== */

function FormDescription({ 
  className, 
  children,
  ...props 
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="form-description"
      className={cn(
        "text-xs text-gray-500 dark:text-gray-400",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

/* ==========================================================================
   Form Error Message
   ========================================================================== */

interface FormErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  icon?: boolean;
}

function FormError({ 
  className, 
  icon = true,
  children,
  ...props 
}: FormErrorProps) {
  const { error } = React.useContext(FormFieldContext) ?? {};
  const message = children ?? error;
  
  if (!message) return null;

  return (
    <p
      data-slot="form-error"
      role="alert"
      className={cn(
        "flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400",
        "animate-fade-in",
        className
      )}
      {...props}
    >
      {icon && <AlertCircle className="size-3.5 shrink-0" />}
      {message}
    </p>
  );
}

/* ==========================================================================
   Form Success Message
   ========================================================================== */

interface FormSuccessProps extends React.HTMLAttributes<HTMLParagraphElement> {
  icon?: boolean;
}

function FormSuccess({ 
  className, 
  icon = true,
  children,
  ...props 
}: FormSuccessProps) {
  if (!children) return null;

  return (
    <p
      data-slot="form-success"
      className={cn(
        "flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400",
        "animate-fade-in",
        className
      )}
      {...props}
    >
      {icon && <CheckCircle2 className="size-3.5 shrink-0" />}
      {children}
    </p>
  );
}

/* ==========================================================================
   Form Info Message
   ========================================================================== */

interface FormInfoProps extends React.HTMLAttributes<HTMLParagraphElement> {
  icon?: boolean;
}

function FormInfo({ 
  className, 
  icon = true,
  children,
  ...props 
}: FormInfoProps) {
  if (!children) return null;

  return (
    <p
      data-slot="form-info"
      className={cn(
        "flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400",
        className
      )}
      {...props}
    >
      {icon && <Info className="size-3.5 shrink-0" />}
      {children}
    </p>
  );
}

/* ==========================================================================
   Input Group (for prefix/suffix icons or addons)
   ========================================================================== */

interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg";
}

function InputGroup({ 
  className, 
  size = "default",
  children,
  ...props 
}: InputGroupProps) {
  return (
    <div
      data-slot="input-group"
      data-size={size}
      className={cn(
        "relative flex items-center",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface InputPrefixProps extends React.HTMLAttributes<HTMLDivElement> {}

function InputPrefix({ 
  className, 
  children,
  ...props 
}: InputPrefixProps) {
  return (
    <div
      data-slot="input-prefix"
      className={cn(
        "absolute left-3 flex items-center justify-center pointer-events-none",
        "text-gray-500 dark:text-gray-400",
        "[&_svg]:size-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface InputSuffixProps extends React.HTMLAttributes<HTMLDivElement> {
  clickable?: boolean;
}

function InputSuffix({ 
  className, 
  clickable,
  children,
  ...props 
}: InputSuffixProps) {
  return (
    <div
      data-slot="input-suffix"
      className={cn(
        "absolute right-3 flex items-center justify-center",
        "text-gray-500 dark:text-gray-400",
        "[&_svg]:size-4",
        !clickable && "pointer-events-none",
        clickable && "cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/* ==========================================================================
   Compound Form Layout
   ========================================================================== */

interface FormRowProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4;
}

function FormRow({ 
  className, 
  cols = 2,
  children,
  ...props 
}: FormRowProps) {
  return (
    <div
      data-slot="form-row"
      className={cn(
        "grid gap-4",
        cols === 1 && "grid-cols-1",
        cols === 2 && "grid-cols-1 sm:grid-cols-2",
        cols === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        cols === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface FormSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

function FormSection({ 
  className, 
  title,
  description,
  children,
  ...props 
}: FormSectionProps) {
  return (
    <div
      data-slot="form-section"
      className={cn("space-y-4", className)}
      {...props}
    >
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

interface FormActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "left" | "center" | "right" | "between";
}

function FormActions({ 
  className, 
  align = "right",
  children,
  ...props 
}: FormActionsProps) {
  return (
    <div
      data-slot="form-actions"
      className={cn(
        "flex flex-wrap gap-3 pt-4",
        align === "left" && "justify-start",
        align === "center" && "justify-center",
        align === "right" && "justify-end",
        align === "between" && "justify-between",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export {
  FormField,
  FormLabel,
  FormDescription,
  FormError,
  FormSuccess,
  FormInfo,
  InputGroup,
  InputPrefix,
  InputSuffix,
  FormRow,
  FormSection,
  FormActions,
  useFormField,
};
