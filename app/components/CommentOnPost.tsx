import { Button, CardFooter, HStack, Input, useToast } from "@chakra-ui/react";
import { Form, useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";
import 'react-gallery-carousel/dist/index.css';
import { FormActionIdentifier, FormActionName } from "~/lib/forms.validations";

interface Props {
  postId: string;
}

export function CommentOnPost (props: Props) {
  const { postId } = props;

  const fetcher = useFetcher();
  const toast = useToast();
  const commentRef = useRef<HTMLInputElement>(null);

  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (fetcher.data?.errorMessage) {
      toast({
        title: fetcher.data?.errorMessage,
        status: "error",
        isClosable: true,
      });
    }
  }, [fetcher.data?.errorMessage, toast]);

  useEffect(() => {
    if (isSubmitting && commentRef.current) {
      commentRef.current.value = "";
    }
  }, [isSubmitting]);

  return (
    <Form method="post">
      <CardFooter flexDirection="column" alignItems="stretch" py={2} px={0}>
        <HStack align="stretch">
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
      </CardFooter>
    </Form>
  )
}