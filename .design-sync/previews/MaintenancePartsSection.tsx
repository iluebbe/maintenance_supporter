/** MaintenancePartsSection — spare parts with stock badges, identifiers,
 * storage location, shopping link and the inventory-value chip. Parts arrive
 * as a prop (the panel feeds them from the object payload). */
import * as React from "react";
import { dsDemoHass, dsProps } from "maintenance-supporter-frontend";

const PARTS = [
  {
    id: "p_filter", name: "HEPA filter H13", vendor: "Daikin", mpn: "KAF970A46",
    stock: 2, reorder_threshold: 1, restock_quantity: 2, unit: "pcs",
    storage_location: "Utility shelf", cost: 12.5, auto_buy_task: true,
    shopping_url: "https://example.com/shop/kaf970a46", is_low: false,
  },
  {
    id: "p_brush", name: "Main brush", vendor: "Roborock", mpn: "8.02-0561",
    stock: 0, reorder_threshold: 1, restock_quantity: 1, unit: "pcs",
    storage_location: "Utility shelf", cost: 18.9, auto_buy_task: true,
    shopping_url: "https://example.com/shop/main-brush", is_low: true,
  },
  {
    id: "p_chlorine", name: "Chlorine tabs", gtin: "4006381333931",
    stock: 14, reorder_threshold: 5, unit: "tabs",
    storage_location: "Garden shed", cost: 0.8, is_low: false,
  },
];

export const Inventory = () => (
  <maintenance-parts-section
    ref={dsProps({
      hass: dsDemoHass(),
      entryId: "demo_hvac",
      parts: PARTS,
      canWrite: true,
      currencySymbol: "€",
    })}
    style={{ display: "block", width: 640 }}
  />
);

export const ReadOnly = () => (
  <maintenance-parts-section
    ref={dsProps({
      hass: dsDemoHass(),
      entryId: "demo_hvac",
      parts: PARTS,
      canWrite: false,
      currencySymbol: "€",
    })}
    style={{ display: "block", width: 640 }}
  />
);
