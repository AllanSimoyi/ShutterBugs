interface Props {
  title: string;
}

export function AppTitle({ title }: Props) {
  return <h1 className="text-lg text-stone-600">{title}</h1>;
}
