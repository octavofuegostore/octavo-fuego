"use client"

import { useState, useEffect, useRef } from "react";
import { useStore } from "@nanostores/react";
import { toast } from "sonner";
import { Search, ChevronLeft, ChevronRight, Eye, Pencil, Package } from "lucide-react";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  productSearchQuery,
  productCategoryFilter,
  productStatusFilter,
  productCurrentPage,
} from "@/stores/adminStore";

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  priceCOP: number;
  priceBRL: number;
  priceUSD: number;
  stockCO: number;
  stockBR: number;
  status: "active" | "inactive" | "out_of_stock";
}

const PAGE_SIZE = 5;

const statusConfig = {
  active: { bg: "bg-success/10", text: "text-success", label: "Activo" },
  inactive: { bg: "bg-ceniza/10", text: "text-ceniza", label: "Inactivo" },
  out_of_stock: { bg: "bg-error/10", text: "text-error", label: "Agotado" },
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

function getStockBadge(stock: number): { bg: string; text: string; label: string } {
  if (stock === 0) {
    return { bg: "bg-error/10", text: "text-error", label: `${stock}` };
  }
  if (stock <= 10) {
    return { bg: "bg-warning/10", text: "text-warning", label: `${stock}` };
  }
  return { bg: "bg-success/10", text: "text-success", label: `${stock}` };
}

interface ProductTableClientProps {
  products: Product[];
}

export default function ProductTableClient({ products }: ProductTableClientProps) {
  const [localProducts, setLocalProducts] = useState<Product[]>(products);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Store subscriptions
  const $productSearchQuery = useStore(productSearchQuery);
  const $productCategoryFilter = useStore(productCategoryFilter);
  const $productStatusFilter = useStore(productStatusFilter);
  const $productCurrentPage = useStore(productCurrentPage);

  // Debounce ref
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // Sync products when prop changes
  useEffect(() => {
    setLocalProducts([...products]);
  }, [products]);

  // Handle search with debounce
  const handleSearchChange = (value: string) => {
    productSearchQuery.set(value);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      setDebouncedSearch(value);
      productCurrentPage.set(1);
    }, 300);
  };

  // Filter products
  const filteredProducts = localProducts.filter((product) => {
    const searchLower = debouncedSearch.toLowerCase();
    const matchesSearch =
      !debouncedSearch ||
      product.name.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower);

    const matchesCategory =
      !$productCategoryFilter ||
      product.category.toLowerCase() === $productCategoryFilter.toLowerCase();

    const matchesStatus = !$productStatusFilter || product.status === $productStatusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const startIndex = ($productCurrentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, filteredProducts.length);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Handlers
  const handleViewProduct = (productId: string) => {
    window.location.href = `/admin/inventario/${productId}`;
  };

  const handleEditProduct = (productId: string) => {
    window.location.href = `/admin/inventario/${productId}/editar`;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      productCurrentPage.set(page);
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
      if ($productCurrentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if ($productCurrentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        pages.push($productCurrentPage - 1);
        pages.push($productCurrentPage);
        pages.push($productCurrentPage + 1);
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
                placeholder="Buscar productos..."
                value={$productSearchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-papel rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tabacco/20 focus:border-tabacco transition-colors"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            {/* Category Filter */}
            <select
              value={$productCategoryFilter}
              onChange={(e) => {
                productCategoryFilter.set(e.target.value);
                productCurrentPage.set(1);
              }}
              className="px-3 py-2 border border-papel rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tabacco/20 focus:border-tabacco"
            >
              <option value="">Todas</option>
              <option value="Cera de Ducha">Cera de Ducha</option>
              <option value="Sabonete">Sabonete</option>
              <option value="Packs">Packs</option>
              <option value="Accesorios">Accesorios</option>
            </select>

            {/* Status Filter */}
            <select
              value={$productStatusFilter}
              onChange={(e) => {
                productStatusFilter.set(e.target.value);
                productCurrentPage.set(1);
              }}
              className="px-3 py-2 border border-papel rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tabacco/20 focus:border-tabacco"
            >
              <option value="">Todos</option>
              <option value="active">Activo</option>
              <option value="out_of_stock">Agotado</option>
              <option value="inactive">Inactivo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products table */}
      <div className="overflow-x-auto">
        {filteredProducts.length === 0 ? (
          <div className="py-12 text-center">
            <Package className="w-12 h-12 text-ceniza mx-auto mb-3" />
            <p className="text-ceniza">
              {localProducts.length === 0
                ? "No hay productos todavía"
                : "No hay productos que coincidan con tus filtros"}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Precio CO</TableHead>
                <TableHead className="text-right">Precio BR</TableHead>
                <TableHead className="text-center">Stock CO</TableHead>
                <TableHead className="text-center">Stock BR</TableHead>
                <TableHead className="text-center">Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.map((product) => {
                const status = statusConfig[product.status];
                const stockCOBadge = getStockBadge(product.stockCO);
                const stockBRBadge = getStockBadge(product.stockBR);

                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-papel rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="w-5 h-5 text-ceniza" />
                        </div>
                        <div>
                          <p className="font-medium text-humo">{product.name}</p>
                          <p className="text-xs text-ceniza">ID: {product.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-ceniza">
                      {product.sku}
                    </TableCell>
                    <TableCell className="text-ceniza">
                      {product.category}
                    </TableCell>
                    <TableCell className="text-right font-medium text-humo">
                      {formatPrice(product.priceCOP, "COP")}
                    </TableCell>
                    <TableCell className="text-right font-medium text-humo">
                      {formatPrice(product.priceBRL, "BRL")}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${stockCOBadge.bg} ${stockCOBadge.text}`}
                      >
                        {stockCOBadge.label}g
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${stockBRBadge.bg} ${stockBRBadge.text}`}
                      >
                        {stockBRBadge.label}g
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}
                      >
                        {status.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewProduct(product.id)}
                          className="p-1.5 text-ceniza hover:text-humo hover:bg-papel rounded-lg transition-colors"
                          title="Ver"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditProduct(product.id)}
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
      {filteredProducts.length > 0 && (
        <div className="p-4 border-t border-papel">
          <div className="flex items-center justify-between">
            <p className="text-sm text-ceniza">
              Mostrando {startIndex + 1}-{endIndex} de {filteredProducts.length}{" "}
              productos
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange($productCurrentPage - 1)}
                disabled={$productCurrentPage === 1}
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
                      page === $productCurrentPage
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
                onClick={() => handlePageChange($productCurrentPage + 1)}
                disabled={$productCurrentPage === totalPages}
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
