interface Props {
  children: React.ReactNode | string | string[];
}

export function InlineAlert(props: Props) {
  const { children } = props;
  return (
    <div className="flex flex-row items-center justify-start space-x-4 rounded-md border-l-2 border-l-red-600 bg-red-400/10 p-6 shadow-lg">
      {typeof children === 'string' && (
        <span className="text-red-500">{children}</span>
      )}
      {children instanceof Array && (
        <div className="flex flex-col items-start space-y-0">
          {children.map((child, index) => (
            <span key={index} className="text-red-500">
              {child || "Please ensure you've provided valid input"}
            </span>
          ))}
        </div>
      )}
      {typeof children !== 'string' && !(children instanceof Array) && children}
    </div>
  );
}
