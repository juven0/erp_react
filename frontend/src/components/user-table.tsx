import * as React from "react";
import axios from "axios";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,    
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
  } from "@tanstack/react-table";
import { ArrowUpDown,  User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";

export type User = {
  username: string;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "username",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Username
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span>{row.getValue("username")}</span>,
  },
];

export function UserCardList() {
  const [data, setData] = React.useState<User[] >([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(import.meta.env.VITE_BASE_URL+"/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data.data);
        console.log(response.data.data)
      } catch (error) {
        console.error("Erreur de récupération des utilisateurs:", error);
      }
    };
    fetchData();
  }, []);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(), 
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrer par username..."
          value={(table.getColumn("username")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("username")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
       
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {table.getFilteredRowModel().rows.map((row) => (
          <Card key={row.id} className="shadow-sm">
            <CardHeader className="flex flex-col items-center gap-2">
              <Avatar className="bg-muted text-muted-foreground">
                <AvatarFallback>
                  <User className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <CardTitle>{row.getValue("username")}</CardTitle>
                <CardDescription>Utilisateur inscrit</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Nom d'utilisateur : {row.getValue("username")}</p>
            </CardContent>
            <CardFooter>

            </CardFooter>
          </Card>
        ))}
        {table.getRowModel().rows.length === 0 && (
          <p className="text-center w-full col-span-full">Aucun résultat.</p>
        )}
      </div>    
    </div>
  );
}
