interface Props {
  children: number;
}

export function NumLikes(props: Props) {
  const { children } = props;

  if (!children) {
    return null;
  }

  return (
    <span>
      <b>{children}</b> {children === 1 ? 'like' : 'likes'}
    </span>
  );
}
