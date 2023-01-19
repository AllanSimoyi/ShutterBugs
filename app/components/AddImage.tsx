import { Button, VStack } from "@chakra-ui/react";
import type { ChangeEvent } from "react";

interface Props {
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void
}

const fileInputStyle: React.CSSProperties = {
  position: "absolute",
  visibility: "hidden",
  opacity: 0,
  top: 0,
  left: 0
}

export function AddImage (props: Props) {
  const { handleChange } = props;

  return (
    <VStack align="stretch">
      <input
        type="file"
        capture="environment"
        accept="image/*"
        id="file"
        onChange={handleChange}
        style={fileInputStyle}
      />
      <label htmlFor="file" style={{ cursor: "pointer", display: "block" }}>
        <Button
          type="submit"
          w="100%"
          fontSize="lg"
          variant='solid'
          style={{ pointerEvents: "none" }}
        >
          Add Image
        </Button>
      </label>
    </VStack>
  )
}