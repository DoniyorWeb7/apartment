import { User } from '@prisma/client';
import { Pencil } from 'lucide-react';
import React from 'react';

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EditUserForm } from './edit-user-form';
import { Button } from '../ui/button';
interface UserEditDialogProps {
  user: User;
  onUpdate: (data: Partial<User>) => Promise<void>;
  onResUser: () => void;
}

export const UserEditDialog = ({ user, onUpdate, onResUser }: UserEditDialogProps) => {
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
        <DialogTitle>Изменить пользователя</DialogTitle>
        <EditUserForm
          user={user}
          onResUser={onResUser}
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
