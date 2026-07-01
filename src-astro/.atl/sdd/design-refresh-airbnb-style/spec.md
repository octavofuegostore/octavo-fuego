# Delta for Intermediate Tables

## Purpose

This specification documents the updated intermediate tables for F5 — migrating from incorrect table names (bodega_items, precios_mayorista) to correct table structure (items_inventario, niveles_inventario, listas_precio) and incorporating the existing gramos_disponibles view for optimized stock queries.

## Specs Created

**Change**: f5-intermediate-tables

### Specs Written
| Domain | Type | Requirements | Scenarios |
|--------|------|-------------|-----------|
| intermediate-tables | Delta | 3 added, 2 modified, 1 removed | 7 total |

### Coverage
- Happy paths: 4 covered
- Edge cases: 2 covered  
- Error states: 1 covered

### Next Step
Ready for design (sdd-design). If design already exists, ready for tasks (sdd-tasks).

## Added Requirements

### Requirement: Use `gramos_disponibles` View for Stock Queries

The system MUST use the existing `gramos_disponibles` view for stock queries instead of manual joins.

#### Scenario: Querying `gramos_disponibles` Returns Computed Stock + Alert

- GIVEN a variant ID and warehouse ID
- WHEN querying the `gramos_disponibles` view
- THEN the system returns computed `gramos_disponibles` and `alerta_stock_bajo` fields
- AND the result includes related `productos` and `bodegas` data for display

### Requirement: Product-Variant Mapping Table

The system SHALL use `items_inventario` table for product-to-variant mapping.

#### Scenario: Creating Item Mapping

- GIVEN a variant ID and SKU
- WHEN creating an item mapping in `items_inventario`
- THEN the system creates a new item with variant_id and sku
- AND returns the item ID for future references

#### Scenario: Retrieving Variant SKU

- GIVEN an item ID
- WHEN querying `items_inventario`
- THEN the system returns the associated variant_id and sku
- AND allows lookup of variant details via the variant_id

### Requirement: Stock Levels by Warehouse

The system MUST track inventory levels per warehouse in the `niveles_inventario` table.

#### Scenario: Creating Stock Level Record

- GIVEN item_id, bodega_id, current stock, reserves, and threshold
- WHEN inserting a stock level record
- THEN the system creates a new inventory level with all metrics
- AND automatically computes `alerta_stock_bajo` based on threshold

#### Scenario: Updating Stock Levels

- GIVEN item_id, bodega_id, and new stock quantity
- WHEN updating stock levels
- THEN the system updates the `gramos_stock` field
- AND recomputes `alerta_stock_bajo` if threshold exceeded

## Modified Requirements

### Requirement: Wholesale Pricing Table

The system SHALL use `listas_precio` table for wholesale pricing, storing customer group prices per variant.

(Previously: pricing stored in `precios_mayorista` table)

#### Scenario: Creating Price List Entry

- GIVEN customer group ID, variant ID, prices in COP/BRL/USD, and minimum grams
- WHEN creating a price list entry
- THEN the system stores the data in `listas_precio`
- AND enables lookup by group_id for customer-specific pricing

#### Scenario: Retrieving Variant Prices

- GIVEN a customer group ID
- WHEN querying `listas_precio`
- THEN the system returns all variant prices for that group
- AND includes the minimum grams requirement

## REMOVED Requirements

### Requirement: Bodega Items Table

(Reason: Table name `bodega_items` does not exist; correct table is `items_inventario` for product-variant mapping)
(Migration: Update all references from `bodega_items` to `items_inventario`)

### Requirement: Precios Mayorista Table

(Reason: Table name `precios_mayorista` does not exist; correct table is `listas_precio` for wholesale pricing)
(Migration: Update all references from `precios_mayorista` to `listas_precio`)
