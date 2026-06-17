"use client"

import { useState, useEffect, useRef } from "react";
import { useStore } from "@nanostores/react";
import { toast } from "sonner";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
} from "lucide-react";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  customerSearchQuery,
  customerLocationFilter,
  customerTypeFilter,
  customerCurrentPage,
} from "@/stores/adminStore";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: "CO" | "BR" | "EU" | "US";
  type: "retail" | "wholesale";
  status: "active" | "inactive";
  totalOrders: number;
  totalSpent: number;
  currency: string;
  lastOrder: string;
}

const PAGE_SIZE = 5;

const locationConfig: Record<
  string,
  { flag: string; label: string; bg: string; text: string }
> = {
  CO: { flag: "🇨🇴", label: "Colombia", bg: "bg-info/10", text: "text-info" },
  BR: { flag: "🇧🇷", label: "Brasil", bg: "bg-success/10", text: "text-success" },
  EU: { flag: "🇪🇺", label: "Europa", bg: "bg-accent/10", text: "text-accent" },
  US: { flag: "🇺🇸", label: "USA", bg: "bg-warning/10", text: "text-warning" },
};

const typeConfig = {
  retail: { bg: "bg-info/10", text: "text-info", label: "Minorista" },
  wholesale: { bg: "bg-tabacco/10", text: "text-tabacco", label: "Mayorista" },
};

function formatPrice(price: number, currency: string): string {
  if (currency === "BRL") {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  } else if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  }
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface CustomerTableClientProps {
  customers: Customer[];
}

export default function CustomerTableClient({
  customers,
}: CustomerTableClientProps) {
  const [localCustomers, setLocalCustomers] = useState<Customer[]>(customers);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Store subscriptions
  const $customerSearchQuery = useStore(customerSearchQuery);
  const $customerLocationFilter = useStore(customerLocationFilter);
  const $customerTypeFilter = useStore(customerTypeFilter);
  const $customerCurrentPage = useStore(customerCurrentPage);

  // Debounce search input
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // Sync customers when prop changes
  useEffect(() => {
    setLocalCustomers([...customers]);
  }, [customers]);

  // Handle search with debounce
  const handleSearchChange = (value: string) => {
    customerSearchQuery.set(value);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      setDebouncedSearch(value);
      customerCurrentPage.set(1);
    }, 300);
  };

  // Filter customers
  const filteredCustomers = localCustomers.filter((customer) => {
    const searchLower = debouncedSearch.toLowerCase();
    const matchesSearch =
      !debouncedSearch ||
      customer.name.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.id.toLowerCase().includes(searchLower);

    const matchesLocation =
      !$customerLocationFilter || customer.location === $customerLocationFilter;
    const matchesType =
      !$customerTypeFilter || customer.type === $customerTypeFilter;

    return matchesSearch && matchesLocation && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / PAGE_SIZE);
  const startIndex = ($customerCurrentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, filteredCustomers.length);
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

  // Handlers
  const handleViewCustomer = (customerId: string) => {
    window.location.href = `/admin/clientes/${customerId}`;
  };

  const handleEditCustomer = (customerId: string) => {
    const customer = localCustomers.find((c) => c.id === customerId);
    if (customer) {
      // Dispatch event for existing ClienteForm modal
      window.dispatchEvent(
        new CustomEvent("edit-customer", { detail: customer })
      );
      toast.info(`Editando cliente: ${customer.name}`);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      customerCurrentPage.set(page);
    }
  };

  // Get page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if ($customerCurrentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if ($customerCurrentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        pages.push($customerCurrentPage - 1);
        pages.push($customerCurrentPage);
        pages.push($customerCurrentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      {/* Header with search and filters */}
      <div className="p-6 border-b border-papel">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ceniza" />
              <input
                type="text"
                placeholder="Buscar clientes..."
                value={$customerSearchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-papel rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tabacco/20 focus:border-tabacco transition-colors"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            {/* Location Filter */}
            <select
              value={$customerLocationFilter}
              onChange={(e) => {
                customerLocationFilter.set(e.target.value);
                customerCurrentPage.set(1);
              }}
              className="px-3 py-2 border border-papel rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tabacco/20 focus:border-tabacco"
            >
              <option value="">Todas las ubicaciones</option>
              <option value="CO">Colombia</option>
              <option value="BR">Brasil</option>
              <option value="EU">Europa</option>
              <option value="US">USA</option>
            </select>

            {/* Type Filter */}
            <select
              value={$customerTypeFilter}
              onChange={(e) => {
                customerTypeFilter.set(e.target.value);
                customerCurrentPage.set(1);
              }}
              className="px-3 py-2 border border-papel rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tabacco/20 focus:border-tabacco"
            >
              <option value="">Todos los tipos</option>
              <option value="retail">Minorista</option>
              <option value="wholesale">Mayorista</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers table */}
      <div className="overflow-x-auto">
        {filteredCustomers.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-ceniza">
              {localCustomers.length === 0
                ? "No hay clientes todavía"
                : "No hay clientes que coincidan con tus filtros"}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead className="text-center">Ubicación</TableHead>
                <TableHead className="text-center">Tipo</TableHead>
                <TableHead className="text-center">Órdenes</TableHead>
                <TableHead className="text-right">Total Gastado</TableHead>
                <TableHead>Última Orden</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCustomers.map((customer) => {
                const location = locationConfig[customer.location];
                const type = typeConfig[customer.type];

                return (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-tabacco/10 rounded-full flex items-center justify-center">
                          <span className="text-tabacco font-medium text-sm">
                            {customer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-humo">
                            {customer.name}
                          </p>
                          <p className="text-xs text-ceniza">ID: {customer.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm text-humo">{customer.email}</p>
                        <p className="text-xs text-ceniza">{customer.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${location.bg} ${location.text}`}
                      >
                        {location.flag} {location.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${type.bg} ${type.text}`}
                      >
                        {type.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-center font-medium text-humo">
                      {customer.totalOrders}
                    </TableCell>
                    <TableCell className="text-right font-medium text-humo">
                      {formatPrice(customer.totalSpent, customer.currency)}
                    </TableCell>
                    <TableCell className="text-ceniza">
                      {formatDate(customer.lastOrder)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewCustomer(customer.id)}
                          className="p-1.5 text-ceniza hover:text-humo hover:bg-papel rounded-lg transition-colors"
                          title="Ver perfil"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditCustomer(customer.id)}
                          className="p-1.5 text-ceniza hover:text-tabacco hover:bg-tabacco/10 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {filteredCustomers.length > 0 && (
        <div className="p-4 border-t border-papel">
          <div className="flex items-center justify-between">
            <p className="text-sm text-ceniza">
              Mostrando {startIndex + 1}-{endIndex} de{" "}
              {filteredCustomers.length} clientes
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange($customerCurrentPage - 1)}
                disabled={$customerCurrentPage === 1}
                className="px-3 py-1.5 border border-papel rounded-lg text-sm text-ceniza hover:bg-papel transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {getPageNumbers().map((page, index) =>
                typeof page === "number" ? (
                  <button
                    key={`page-${page}`}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      page === $customerCurrentPage
                        ? "bg-tabacco text-white"
                        : "border border-papel text-ceniza hover:bg-papel transition-colors"
                    }`}
                  >
                    {page}
                  </button>
                ) : (
                  <span key={`ellipsis-${index}`} className="px-2 text-ceniza">
                    {page}
                  </span>
                )
              )}

              <button
                onClick={() => handlePageChange($customerCurrentPage + 1)}
                disabled={$customerCurrentPage === totalPages}
                className="px-3 py-1.5 border border-papel rounded-lg text-sm text-ceniza hover:bg-papel transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}