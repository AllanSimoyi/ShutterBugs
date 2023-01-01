import { Checkbox, HStack, Text } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { useField } from "./ActionContextProvider";

interface Props {
  name: string;
  children: string;
}

export function CustomCheckbox (props: Props) {
  const { name, children } = props;

  const { value, error: errors } = useField<boolean>(name);
  const [checked, setChecked] = useState(value || false);

  const handleOnChange = useCallback(() => {
    setChecked(prevState => !prevState);
  }, []);

  return (
    <HStack align="center" spacing={2}>
      <input
        type="hidden"
        name={name}
        value={checked ? "true" : "false"}
      />
      <Checkbox
        w={"100%"}
        colorScheme="red"
        isChecked={checked}
        isInvalid={!!errors?.length}
        onChange={handleOnChange}
      >
        <Text fontSize="sm">
          {children}
        </Text>
      </Checkbox>
    </HStack>
  )
}