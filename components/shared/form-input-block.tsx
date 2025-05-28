import React from 'react';
import { Input } from '../ui/input';

interface Props extends React.ComponentProps<'input'> {
  label: string;
  error?: string;
  placeholder: string;
}

export const FormInputBlock: React.FC<Props> = ({
  label,
  error,
  placeholder,
  ...inputProps
}: Props) => {
  return (
    <div className="flex flex-col gap-1 mb-3">
      <label className="mb-1" htmlFor={'adres'}>
        {label}
      </label>
      <Input {...inputProps} id="adres" type="text" placeholder={placeholder} />

      <div className="text-red-500 text-[14px]">
        {error && <p className="text-red-500 text-[14px]">{error}</p>}
      </div>
    </div>
  );
};
