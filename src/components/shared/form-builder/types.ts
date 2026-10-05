import { CheckedState } from "@radix-ui/react-checkbox";

export interface FormStructure {
  title?: {
    value: string;
    className?: string;
  };
  description?: {
    value: string;
    className?: string;
  };
  orientation?: "vertical" | "horizontal";
  includeHeader?: boolean;
  fieldsets: Fieldset[];
  toggleableFieldsets?: boolean;
  gap?: number;
}

export interface Fieldset {
  title?: {
    value: string;
    className?: string;
  };
  description?: {
    value: string;
    className?: string;
  };
  component?: React.ReactNode;
  includeHeader?: boolean;
  rows: FieldsetRow[];
  gap?: number;
}

export interface FieldsetRow {
  className?: string;
  fields: Field[];
  gap?: number;
}

export enum FieldVariant {
  TEXT = "text",
  EMAIL = "email",
  URL = "url",
  TEL = "tel",
  NUMBER = "number",
  SELECT = "select",
  DATE = "date",
  CHECKBOX = "checkbox",
  RADIO = "radio",
  PASSWORD = "password",
  SWITCH = "switch",
  TEXTAREA = "textarea",
  CUSTOM = "custom",
  EMPTY = "empty",
}

export interface Field<T = any> {
  id: string;
  label?: string;
  className?: string;
  wrapperClassName?: string;
  variant: FieldVariant;
  required?: boolean;
  description?: string;
  placeholder?: string;
  hidden?: boolean;
  pending?: boolean;
  error?: string;
  props?: T;
}

export interface BaseFieldProps {
  disabled?: boolean;
  autoFocus?: boolean;
}

export interface TextFieldProps extends BaseFieldProps {
  value?: string | null;
  onChange?: (e: string) => void;
  maxLength?: number;
}

export interface EmailFieldProps extends BaseFieldProps {
  value?: string | null;
  onChange?: (e: string) => void;
}

export interface TelFieldProps extends BaseFieldProps {
  value?: string | null;
  onChange?: (e: string) => void;
}

export interface NumberFieldProps extends BaseFieldProps {
  value?: number | null;
  onChange?: (e: number | undefined) => void;
  min?: number;
  max?: number;
}

export interface PasswordFieldProps extends BaseFieldProps {
  value?: string;
  onChange?: (e: string) => void;
}

export interface DateFieldProps extends BaseFieldProps {
  value?: Date | null;
  onDateChange?: (e: Date | null) => void;
  nullable?: boolean;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectFieldProps extends BaseFieldProps {
  value?: string | null;
  onValueChange?: (value: string) => void;
  options?: SelectOption[];
  nullable?: boolean;
}

export interface RadioFieldProps extends BaseFieldProps {
  value?: string;
  onValueChange?: (value: string) => void;
  options?: SelectOption[];
  spread?: "horizontal" | "vertical";
}

export interface CheckboxFieldProps extends BaseFieldProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (e: CheckedState) => void;
}

export interface SwitchFieldProps extends BaseFieldProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (e: boolean) => void;
}

export interface TextareaFieldProps extends BaseFieldProps {
  value?: string;
  onChange?: (e: string) => void;
  cols?: number;
  rows?: number;
  resizable?: boolean;
  maxLength?: number;
}

export interface CustomFieldProps extends BaseFieldProps {
  className?: string;
  children: React.ReactNode;
  includeLabel?: boolean;
}

export interface EmptyFieldProps {}
