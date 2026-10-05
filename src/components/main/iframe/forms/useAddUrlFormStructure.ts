import {
  CheckboxFieldProps,
  Field,
  FieldVariant,
  FormStructure,
  TextFieldProps,
} from "@/components/shared/form-builder/types";
import { UrlStore } from "@/hooks/stores";

interface UseAddUrlFormStructureProps {
  store: UrlStore;
}

export const useAddUrlFormStructure = ({
  store,
}: UseAddUrlFormStructureProps) => {
  const getError = (err?: string[]) => (err?.[0] ? err[0] : undefined);

  const nameField: Field<TextFieldProps> = {
    id: "name",
    label: "Name",
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: "Name",
    description: "Enter a display name for the website.",
    error: getError(store.createDtoErrors?.name),
    props: {
      value: store.createDto.name || undefined,
      onChange: (value) => {
        store.setNested("createDto.name", value);
        store.setNested("createDtoErrors.name", []);
      },
      autoFocus: true,
    },
  };

  const urlField: Field<TextFieldProps> = {
    id: "url",
    label: "URL",
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: "https://example.com",
    description: "Enter the full website URL (e.g. https://example.com).",
    error: getError(store.createDtoErrors?.url),
    props: {
      value: store.createDto.url || undefined,
      onChange: (value) => {
        store.setNested("createDto.url", value);
        store.setNested("createDtoErrors.url", []);
      },
    },
  };

  const pointToCenterField: Field<CheckboxFieldProps> = {
    id: "pointToCenter",
    label: "Positioning",
    variant: FieldVariant.CHECKBOX,
    required: false,
    description: "Point to Center (Scroll vertically to center of iframe)",
    props: {
      checked: store.createDto.pointToCenter,
      onCheckedChange: (checked) => {
        store.setNested("createDto.pointToCenter", Boolean(checked));
      },
    },
  };

  const addUrlFormStructure: FormStructure = {
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
    addUrlFormStructure,
  };
};
