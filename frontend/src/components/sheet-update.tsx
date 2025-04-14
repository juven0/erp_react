import * as React from "react"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type UserData = {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  entryDate: string
  exitDate: string | null
}

export function UpdateEmployeeSheet({
  user,
  onUpdate,
}: {
  user: UserData
  onUpdate: (updatedUser: UserData) => void
}) {
  const [formData, setFormData] = React.useState<UserData>(user)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate(formData)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="text-blue-600 hover:text-blue-800">
          Edit
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full p-4 sm:w-[500px]">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl font-semibold">Update Employee</SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            Modify employee details and save your changes.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { label: "First Name", name: "firstName", type: "text" },
            { label: "Last Name", name: "lastName", type: "text" },
            { label: "Date of Birth", name: "dateOfBirth", type: "date" },
            { label: "Entry Date", name: "entryDate", type: "date" },
            { label: "Exit Date", name: "exitDate", type: "date" },
          ].map((field) => (
            <div key={field.name} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={field.name} className="text-right text-sm font-medium">
                {field.label}
              </Label>
              <Input
                id={field.name}
                name={field.name}
                type={field.type}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                value={(formData as any)[field.name] || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          ))}

          <SheetFooter className="pt-6">
            <SheetClose asChild>
              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
