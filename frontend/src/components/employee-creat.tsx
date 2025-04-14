import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios, { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

const employeeSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  dateOfBirth: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Date de naissance invalide",
  }),
  entryDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Date d'entrée invalide",
  }),
  exitDate: z.string().optional().nullable(),
}).refine((data) => {
  if (!data.exitDate) return true;
  return new Date(data.exitDate) >= new Date(data.entryDate);
}, {
  path: ["exitDate"],
  message: "La date de sortie doit être postérieure à la date d'entrée",
});

type EmployeeFormData = z.infer<typeof employeeSchema>;
type ApiFieldErrors = Partial<Record<keyof EmployeeFormData, string>>;

export function CreateEmployeeDialog({ onCreated }: { onCreated?: () => void }) {
  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      entryDate: "",
      exitDate: "",
    },
  });

  const [open, setOpen] = useState(false);

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(import.meta.env.VITE_BASE_URL+"/employees", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (onCreated) onCreated();
      form.reset();
      setOpen(false);
      toast.success("Employé créé avec succès");
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosError = error as AxiosError<any>;
      const apiErrors = axiosError.response?.data?.data as ApiFieldErrors;

      if (apiErrors) {
        for (const key in apiErrors) {
          // eslint-disable-next-line no-prototype-builtins
          if (apiErrors.hasOwnProperty(key)) {
            form.setError(key as keyof EmployeeFormData, {
              type: "server",
              message: apiErrors[key as keyof EmployeeFormData],
            });
          }
        }
      }

      toast.error(axiosError.response?.data?.message || "Échec lors de la création de l'employé.");

      console.error("Erreur lors de la création de l'employé:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span>Ajouter un employé</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl font-semibold">Créer un employé</DialogTitle>
              <DialogDescription className="text-sm text-gray-500 mt-1">
                Remplissez les informations ci-dessous pour créer un nouvel employé.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input placeholder="Prénom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de naissance</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="entryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date d'entrée</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <FormField
              control={form.control}
              name="exitDate"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Date de sortie <span className="text-gray-500 text-xs">(facultatif)</span></FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>

            <DialogFooter className="mt-8">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting} className="min-w-24">
                {form.formState.isSubmitting ? "Création..." : "Créer l'employé"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
