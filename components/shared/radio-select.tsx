import React from 'react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

export const RadioSelect: React.FC<Props> = ({ value, onChange, error }) => {
  return (
    <div className="mb-4">
      <p className="mb-2 font-medium">Роль</p>
      <RadioGroup value={value} onValueChange={onChange} className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="USER" id="user" />
          <Label htmlFor="user">User</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="ADMIN" id="admin" />
          <Label htmlFor="admin">Admin</Label>
        </div>
      </RadioGroup>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};
