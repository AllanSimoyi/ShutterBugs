import { MenuItem } from "@chakra-ui/react";
import { Form } from "@remix-run/react";

export function Logout () {
  return (
    <Form action="/logout" method="post">
      <MenuItem type="submit" fontSize="sm">
        Log Out
      </MenuItem>
    </Form>
  )
}