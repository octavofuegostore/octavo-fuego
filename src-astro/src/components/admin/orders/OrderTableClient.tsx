"use client"

import { useState, useEffect, useRef } from "react";
import { useStore } from "@nanostores/react";
import { toast } from "sonner";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Check,
  Package,
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
  refreshTrigger,
  searchQuery,
  statusFilter,
  channelFilter,
  locationFilter,
  currentPage,
} from "@/stores/adminStore";

export interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  currency: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  channel: "whatsapp" | "web" | "manual";
  location: "CO-BOGOTA" | "BR-ACRE";
  createdAt: string;
  updatedAt: string;
}

const PAGE_SIZE = 5;

const statusConfig = {
  pending: { bg: "bg-warning/10", text: "text-warning", label: "Pendiente" },
  confirmed: { bg: "bg-info/10", text: "text-info", label: "Confirmada" },
  shipped: { bg: "bg-accent/10", text: "text-accent", label: "Enviada" },
  delivered: { bg: "bg-success/10", text: "text-success", label: "Entregada" },
  cancelled: { bg: "bg-error/10", text: "text-error", label: "Cancelada" },
};

const channelConfig = {
  whatsapp: { bg: "bg-success/10", text: "text-success", label: "WhatsApp" },
  web: { bg: "bg-info/10", text: "text-info", label: "Web" },
  manual: { bg: "bg-ceniza/10", text: "text-ceniza", label: "Manual" },
};

const locationConfig: Record<
  string,
  { bg: string; text: string }
> = {
  "CO-BOGOTA": { bg: "bg-info/10", text: "text-info" },
  "BR-ACRE": { bg: "bg-success/10", text: "text-success" },
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

interface OrderTableClientProps {
  orders: Order[];
}

export default function OrderTableClient({ orders }: OrderTableClientProps) {
  const [localOrders, setLocalOrders] = useState<Order[]>(orders);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Store subscriptions
  const $searchQuery = useStore(searchQuery);
  const $statusFilter = useStore(statusFilter);
  const $channelFilter = useStore(channelFilter);
  const $locationFilter = useStore(locationFilter);
  const $currentPage = useStore(currentPage);
  const $refreshTrigger = useStore(refreshTrigger);

  // Debounce search input
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // Sync orders when refreshTrigger changes
  useEffect(() => {
    if ($refreshTrigger > 0) {
      setLocalOrders([...orders]);
    }
  }, [$refreshTrigger, orders]);

  // Handle search with debounce
  const handleSearchChange = (value: string) => {
    searchQuery.set(value);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      setDebouncedSearch(value);
      currentPage.set(1);
    }, 300);
  };

  // Filter orders
  const filteredOrders = localOrders.filter((order) => {
    const searchLower = debouncedSearch.toLowerCase();
    const matchesSearch =
      !debouncedSearch ||
      order.id.toLowerCase().includes(searchLower) ||
      order.customer.name.toLowerCase().includes(searchLower) ||
      order.customer.email.toLowerCase().includes(searchLower);

    const matchesStatus = !$statusFilter || order.status === $statusFilter;
    const matchesChannel = !$channelFilter || order.channel === $channelFilter;
    const matchesLocation =
      !$locationFilter || order.location.startsWith($locationFilter);

    return matchesSearch && matchesStatus && matchesChannel && matchesLocation;
  });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);
  const startIndex = ($currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, filteredOrders.length);
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  // Handlers
  const handleConfirm = (orderId: string) => {
    setLocalOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: "confirmed" as const } : o
      )
    );
    refreshTrigger.set(Date.now());
    toast.success(`Orden ${orderId} confirmada`);
  };

  const handleShip = (orderId: string) => {
    setLocalOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: "shipped" as const } : o
      )
    );
    refreshTrigger.set(Date.now());
    toast.success(`Orden ${orderId} marcada como enviada`);
  };

  const handleViewOrder = (orderId: string) => {
    window.location.href = `/admin/ordenes/${orderId}`;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      currentPage.set(page);
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
      if ($currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if ($currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        pages.push($currentPage - 1);
        pages.push($currentPage);
        pages.push($currentPage + 1);
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
                placeholder="Buscar órdenes..."
                value={$searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-papel rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tabacco/20 focus:border-tabacco transition-colors"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            {/* Status Filter */}
            <select
              value={$statusFilter}
              onChange={(e) => {
                statusFilter.set(e.target.value);
                currentPage.set(1);
              }}
              className="px-3 py-2 border border-papel rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tabacco/20 focus:border-tabacco"
            >
              <option value="">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="confirmed">Confirmada</option>
              <option value="shipped">Enviada</option>
              <option value="delivered">Entregada</option>
              <option value="cancelled">Cancelada</option>
            </select>

            {/* Channel Filter */}
            <select
              value={$channelFilter}
              onChange={(e) => {
                channelFilter.set(e.target.value);
                currentPage.set(1);
              }}
              className="px-3 py-2 border border-papel rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tabacco/20 focus:border-tabacco"
            >
              <option value="">Todos los canales</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="web">Web</option>
              <option value="manual">Manual</option>
            </select>

            {/* Location Filter */}
            <select
              value={$locationFilter}
              onChange={(e) => {
                locationFilter.set(e.target.value);
                currentPage.set(1);
              }}
              className="px-3 py-2 border border-papel rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tabacco/20 focus:border-tabacco"
            >
              <option value="">Todas las ubicaciones</option>
              <option value="CO">CO</option>
              <option value="BR">BR</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders table */}
      <div className="overflow-x-auto">
        {filteredOrders.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-ceniza">
              {localOrders.length === 0
                ? "No hay órdenes todavía"
                : "No hay órdenes que coincidan con tus filtros"}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center">Estado</TableHead>
                <TableHead className="text-center">Canal</TableHead>
                <TableHead className="text-center">Ubicación</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.map((order) => {
                const status = statusConfig[order.status];
                const channel = channelConfig[order.channel];
                const location = locationConfig[order.location];

                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium font-mono text-humo">
                      {order.id}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-humo">
                          {order.customer.name}
                        </p>
                        <p className="text-xs text-ceniza">
                          {order.customer.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-ceniza">
                        {order.items.length}{" "}
                        {order.items.length === 1 ? "producto" : "productos"}
                      </div>
                      <div className="text-xs text-ceniza mt-0.5">
                        {order.items[0].name}
                        {order.items.length > 1 && ` +${order.items.length - 1}`}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-humo">
                      {formatPrice(order.total, order.currency)}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}
                      >
                        {status.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${channel.bg} ${channel.text}`}
                      >
                        {channel.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${location.bg} ${location.text}`}
                      >
                        {order.location}
                      </span>
                    </TableCell>
                    <TableCell className="text-ceniza">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewOrder(order.id)}
                          className="p-1.5 text-ceniza hover:text-humo hover:bg-papel rounded-lg transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {order.status === "pending" && (
                          <button
                            onClick={() => handleConfirm(order.id)}
                            className="p-1.5 text-ceniza hover:text-success hover:bg-success/10 rounded-lg transition-colors"
                            title="Confirmar"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {order.status === "confirmed" && (
                          <button
                            onClick={() => handleShip(order.id)}
                            className="p-1.5 text-ceniza hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                            title="Marcar como enviada"
                          >
                            <Package className="w-4 h-4" />
                          </button>
                        )}
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
      {filteredOrders.length > 0 && (
        <div className="p-4 border-t border-papel">
          <div className="flex items-center justify-between">
            <p className="text-sm text-ceniza">
              Mostrando {startIndex + 1}-{endIndex} de {filteredOrders.length}{" "}
              órdenes
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange($currentPage - 1)}
                disabled={$currentPage === 1}
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
                      page === $currentPage
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
                onClick={() => handlePageChange($currentPage + 1)}
                disabled={$currentPage === totalPages}
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
