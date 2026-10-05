import {
  Field,
  FieldVariant,
  FormStructure,
  TextFieldProps,
} from "@/components/shared/form-builder/types";
import { GroupStore } from "@/hooks/stores";

interface UseAddGroupFormStructureProps {
  store: GroupStore;
}

export const useAddGroupFormStructure = ({
  store,
}: UseAddGroupFormStructureProps) => {
  const getError = (err?: string[]) => (err?.[0] ? err[0] : undefined);

  const groupNameField: Field<TextFieldProps> = {
    id: "groupName",
    label: "Group Name",
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: "New Group Name",
    description: "Enter a name for the new URL group.",
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

  const addGroupFormStructure: FormStructure = {
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
    addGroupFormStructure,
  };
};
