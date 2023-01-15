import type { StackProps } from "@chakra-ui/react";
import { Button, HStack, Input } from "@chakra-ui/react";
import 'react-gallery-carousel/dist/index.css';
import { FormActionIdentifier, FormActionName } from "~/lib/forms.validations";

interface Props extends StackProps {
  postId: string;
  isSubmitting: boolean;
  commentRef: React.RefObject<HTMLInputElement>;
}

export function CommentOnPost (props: Props) {
  const { postId, isSubmitting, commentRef, ...restOfProps } = props;

  return (
    <HStack align="stretch" py={2} px={0} {...restOfProps}>
      <input
        type="hidden"
        name={FormActionName}
        value={FormActionIdentifier.Comment}
      />
      <input
        type="hidden"
        name="postId"
        value={postId}
      />
      <Input
        p={0}
        ref={commentRef}
        type="text"
        name="content"
        variant="unstyled"
        fontSize="sm"
        placeholder='Add a comment...'
        isDisabled={isSubmitting}
        isRequired
      />
      <Button
        type="submit"
        variant="ghost"
        fontSize="sm"
        isDisabled={isSubmitting}
      >
        {isSubmitting ? "Posting..." : "Post"}
      </Button>
    </HStack>
  )
}