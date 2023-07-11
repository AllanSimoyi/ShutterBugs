interface Props {
  message: string;
}
export function EmptyList(props: Props) {
  const { message } = props;
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <span className="text-lg text-white/50">{message}</span>
    </div>
  );
}
