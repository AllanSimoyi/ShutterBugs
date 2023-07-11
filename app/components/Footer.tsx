import { CenteredView } from './CenteredView';

interface Props {
  appTitle: string;
}

export function Footer(_: Props) {
  return (
    <div className="flex flex-col items-stretch border-t border-stone-200 bg-white/80 backdrop-blur-sm">
      <CenteredView className="p-4">
        <div className="flex flex-col items-start gap-1 lg:flex-row lg:gap-4">
          <div className="grow" />
          <a
            className="text-sm text-stone-600 transition-all duration-300 hover:underline"
            href="https://allansimoyi.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Developed By Allan Simoyi
          </a>
        </div>
      </CenteredView>
    </div>
  );
}
