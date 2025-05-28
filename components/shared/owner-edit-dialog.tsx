import { Owner } from '@prisma/client';
import { Pencil } from 'lucide-react';
import React from 'react';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { EditOwnerForm } from './edit-owner-form';
interface UserEditDialogProps {
  owner: Owner;
  onUpdate: (data: Partial<Owner>) => Promise<void>;
}

export const OwnerEditDialog = ({ owner, onUpdate }: UserEditDialogProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-blue-800 hover:bg-blue-900 cursor-pointer"
          variant="default"
          size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <EditOwnerForm
          owner={owner}
          onSubmit={async (data) => {
            await onUpdate(data);
            setIsOpen(false);
          }}
          onCancel={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
