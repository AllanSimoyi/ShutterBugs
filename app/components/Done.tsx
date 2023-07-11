import { Check } from 'tabler-icons-react';

export function Done() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-4">
      <Check size={40} color={'green'} />
      <span className="text-lg">Upload Done</span>
    </div>
  );
}
