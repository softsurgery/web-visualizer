import {
  CheckboxFieldProps,
  Field,
  FieldVariant,
  FormStructure,
  TextFieldProps,
} from "@/components/shared/form-builder/types";
import { UrlStore } from "@/hooks/stores";

interface UseEditUrlFormStructureProps {
  store: UrlStore;
}

export const useEditUrlFormStructure = ({
  store,
}: UseEditUrlFormStructureProps) => {
  const getError = (err?: string[]) => (err?.[0] ? err[0] : undefined);

  const nameField: Field<TextFieldProps> = {
    id: "edit-name",
    label: "Name",
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: "Name",
    description: "Enter a display name for the website.",
    error: getError(store.updateDtoErrors?.name),
    props: {
      value: store.updateDto.name || undefined,
      onChange: (value) => {
        store.setNested("updateDto.name", value);
        store.setNested("updateDtoErrors.name", []);
      },
      autoFocus: true,
    },
  };

  const urlField: Field<TextFieldProps> = {
    id: "edit-url",
    label: "URL",
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: "https://example.com",
    description: "Enter the full website URL (e.g. https://example.com).",
    error: getError(store.updateDtoErrors?.url),
    props: {
      value: store.updateDto.url || undefined,
      onChange: (value) => {
        store.setNested("updateDto.url", value);
        store.setNested("updateDtoErrors.url", []);
      },
    },
  };

  const pointToCenterField: Field<CheckboxFieldProps> = {
    id: "edit-pointToCenter",
    label: "Positioning",
    variant: FieldVariant.CHECKBOX,
    required: false,
    description: "Point to Center (Scroll vertically to center of iframe)",
    props: {
      checked: store.updateDto.pointToCenter,
      onCheckedChange: (checked) => {
        store.setNested("updateDto.pointToCenter", Boolean(checked));
      },
    },
  };

  const editUrlFormStructure: FormStructure = {
    orientation: "horizontal",
    fieldsets: [
      {
        rows: [
          { fields: [nameField] },
          { fields: [urlField] },
          { fields: [pointToCenterField] },
        ],
      },
    ],
  };

  return {
    editUrlFormStructure,
  };
};
