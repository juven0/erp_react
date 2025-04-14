import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { UserData } from "@/types/user"
import axios from "axios"
import { EmployeeActions } from "./employee-action"
import { CreateEmployeeDialog } from "./employee-creat"
import { EmployeeSearchSheet } from "./search-form"
import { toast } from "sonner"

export function DataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  
  const [data, setData] = React.useState<UserData[]>([])
  const [page, setPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)

  const fetchData = async (pageNumber: number) => {
    const token = localStorage.getItem("authToken")
    try {
      const res = await axios.get(import.meta.env.VITE_BASE_URL+`/employees?page=${pageNumber}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      setData(res.data.data.items)
      setPage(res.data.data.currentPage)
      setTotalPages(res.data.data.totalPages)
    } catch (err) {
      console.error("Erreur de récupération des données", err)
    }
  }

  React.useEffect(() => {
    fetchData(page)
  }, [page])

  const handleDelete = async (userId: string) => {
    const token = localStorage.getItem("authToken")
    try {
      await axios.delete(import.meta.env.VITE_BASE_URL+`/employees/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      fetchData(page)
      toast.success("Employer Suprimer avec succes")
    } catch (error) {
      toast.error("Échec de la suppresion  d'employés.");
      console.error("Erreur lors de la suppression :", error)
    }
  }

  const handleUpdate = async (data: UserData) => {
    const token = localStorage.getItem("authToken")
    try {
      await axios.put(import.meta.env.VITE_BASE_URL+`/employees/${data.id}`,data,  {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      fetchData(page)
      toast.success("Employer mis a jours avec succes")
    } catch (error) {
      toast.error("Échec de la suppresion  d'employés.");
      console.error("Erreur lors de la suppression :", error)
    }
  }


  const columns: ColumnDef<UserData>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "firstName",
      header: () => <div className="flex items-center gap-1">👤 Prénom</div>,
      cell: ({ row }) => <div>{row.getValue("firstName")}</div>,
    },
    {
      accessorKey: "lastName",
      header: () => <div className="flex items-center gap-1">👤 Nom</div>,
      cell: ({ row }) => <div>{row.getValue("lastName")}</div>,
    },
    {
      accessorKey: "dateOfBirth",
      header: () => <div className="flex items-center gap-1">📅 Naissance</div>,
      cell: ({ row }) => <div>{row.getValue("dateOfBirth")}</div>,
    },
    {
      accessorKey: "entryDate",
      header: () => <div className="flex items-center gap-1">📥 Entrée</div>,
      cell: ({ row }) => <div>{row.getValue("entryDate")}</div>,
    },
    {
      accessorKey: "exitDate",
      header: () => <div className="flex items-center gap-1">📤 Sortie</div>,
      cell: ({ row }) => <div>{row.getValue("exitDate") ?? "-"}</div>,
    },
    {
        accessorKey: "actions",
  header: () => <div className="text-right">Actions</div>,
  cell: ({ row }) => {
    const user = row.original as UserData

    return (
      <div className="flex justify-end gap-2">
         <EmployeeActions
        user={user}
        onUpdate={(updatedUser) => {
          handleUpdate(updatedUser)
        }}
        onDelete={(userId) => {
          handleDelete(userId)
        }}
        />
      </div>
    )
  },}
  ]

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
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="rounded-md border relative flex flex-col gap-4 overflow-auto px-4 lg:px-6 ">
      <div className="flex justify-between items-center py-4">
        <Input
          placeholder="Filtrer par prénom..."
          value={(table.getColumn("firstName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("firstName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex w-2/8 justify-around relative h-[50px] "><EmployeeSearchSheet onResults={setData}/> <CreateEmployeeDialog /></div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-100 dark:bg-gray-800 text-muted-foreground text-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-left px-4 py-2 align-middle whitespace-nowrap"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getFilteredRowModel().rows.length ? (
              table.getFilteredRowModel().rows.map((row) => (
                
                <TableRow
                  key={row.id}
                  onClick={()=>console.log(row)}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-accent/50 transition-colors data-[state=selected]:bg-purple-100 dark:data-[state=selected]:bg-purple-900"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="text-left px-4 py-2 text-sm text-foreground align-middle whitespace-nowrap max-w-[220px] overflow-x-auto"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Aucun résultat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
      </div>
      <div className=" w-full  space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} sur {table.getFilteredRowModel().rows.length} sélectionné(s).
        </div>
        <Pagination className="">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (page > 1) setPage(page - 1)
                }}
              />
            </PaginationItem>
            {Array.from({ length: totalPages-1 }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={page === i + 1}
                  onClick={(e) => {
                    e.preventDefault()
                    setPage(i + 1)
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (totalPages >page) setPage(page + 1)
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
