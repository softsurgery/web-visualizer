import {
  Field,
  FieldVariant,
  FormStructure,
  TextFieldProps,
} from "@/components/shared/form-builder/types";
import { GroupStore } from "@/hooks/stores";

interface UseEditGroupFormStructureProps {
  store: GroupStore;
}

export const useEditGroupFormStructure = ({
  store,
}: UseEditGroupFormStructureProps) => {
  const getError = (err?: string[]) => (err?.[0] ? err[0] : undefined);

  const groupNameField: Field<TextFieldProps> = {
    id: "editGroupName",
    label: "Group Name",
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: "Group Name",
    description: "Update the name of the URL group.",
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

  const editGroupFormStructure: FormStructure = {
    orientation: "horizontal",
    fieldsets: [
      {
        rows: [
          {
            fields: [groupNameField],
          },
        ],
      },
    ],
  };

  return {
    editGroupFormStructure,
  };
};
