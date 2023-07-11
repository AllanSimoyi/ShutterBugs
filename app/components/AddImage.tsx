import type { ChangeEvent } from 'react';

interface Props {
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function AddImage(props: Props) {
  const { handleChange } = props;

  return (
    <div className="flex flex-col items-stretch">
      <input
        id="file"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        className="invisible absolute left-0 top-0 opacity-0"
      />
      <label className="block cursor-pointer" htmlFor="file">
        <button
          type="submit"
          className="pointer-events-none w-full rounded bg-stone-200 p-6 text-lg shadow-md"
        >
          Add Image
        </button>
      </label>
    </div>
  );
}
