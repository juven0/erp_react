
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { UpdateEmployeeSheet } from "./sheet-update"

type UserData = {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  entryDate: string
  exitDate: string | null
}

type Props = {
  user: UserData
  onUpdate: (updatedUser: UserData) => void
  onDelete: (userId: string) => void
}

export function EmployeeActions({ user, onUpdate, onDelete }: Props) {
  return (
    <div className="flex items-center gap-2 justify-end">
      <UpdateEmployeeSheet user={user} onUpdate={onUpdate} />

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-medium">{user.firstName} {user.lastName}</span> from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(user.id)}>
              Confirm Deletion
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
