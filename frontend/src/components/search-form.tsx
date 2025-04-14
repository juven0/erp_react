"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { UserData } from "@/types/user";

const searchSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

type SearchFormData = z.infer<typeof searchSchema>;

export function EmployeeSearchSheet({ onResults }: { onResults: (data: UserData[]) => void }) {
  const [open, setOpen] = useState(false);

  const form = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  const onSubmit = async (data: SearchFormData) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(import.meta.env.VITE_BASE_URL+"/employees", {
        params: {
          ...data,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onResults(response.data.data.items)
      if(response.data.data.items.length>=1){
        toast.success(`Recherche réussie avec ${response.data.data.items.length} résultat(s)`);
      }else{
        toast.error("Pas de resultat.");
      }
      setOpen(false);
    } catch (error) {
    //   toast.error("Échec de la recherche d'employés.");
      console.error("Erreur recherche:", error);
    }
  };

  return (
    <Sheet  open={open}  onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">🔍 Rechercher</Button>
      </SheetTrigger>
      <SheetContent side="top" className="flex justify-center items-center ">
        <SheetHeader>
          <SheetTitle>Rechercher un employé</SheetTitle>
          <SheetDescription>
            Filtrez la liste selon le prénom ou le nom de famille.
          </SheetDescription>
        </SheetHeader>

        <Form  {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid  center h-full w-1/5  mx-9 gap-4 py-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input className="" placeholder="Jean" {...field} />
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
                    <Input placeholder="Dupont" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit">Lancer la recherche</Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
