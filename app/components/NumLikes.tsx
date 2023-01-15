interface Props {
  children: number;
}

export function NumLikes (props: Props) {
  const { children } = props;
  return (
    <>
      <b>{children}</b> {children === 1 ? "like" : "likes"}
    </>
  )
}