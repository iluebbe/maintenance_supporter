/** MsTextfield — the library's outlined form field. */
import * as React from "react";

export const Text = () => (
  <ms-textfield label="Task name" value="Clean air filter" style={{ width: 260 }} />
);

export const NumberWithHelper = () => (
  <ms-textfield label="Cost" type="number" step="0.01" min="0" value="24.90" helper="EUR" style={{ width: 200 }} />
);

export const DateField = () => (
  <ms-textfield label="Completed on" type="date" value="2026-08-06" style={{ width: 200 }} />
);

export const WithValidation = () => (
  <ms-textfield label="Serial number" pattern="[A-Z]{2}-[0-9]{4}" helper="Format: XX-0000" value="DK-2231" style={{ width: 260 }} />
);
