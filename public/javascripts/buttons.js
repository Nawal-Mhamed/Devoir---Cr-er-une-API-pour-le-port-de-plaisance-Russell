// ======================================================
// GENEREIC BUTTONS MANAGEMENT ACCROSS THE APPLICATION
// ======================================================
//
// Provides commons buttons behaviors across all pages:
// - "Back" button
// - "Show" buttons (show details of an item)
// - "Delete" button
// - Hiding admin-only buttons for non-admin users
// ======================================================

/** Buttons utilities for all pages
 * @module buttons
 */

import { fetchWithAuth } from "./common.js";

// ----------------------------------------------
// "Back" button management
// ----------------------------------------------

/**
 * Initialize a "Back" button that redirects to a specified URL
 * @param {string} backBtnId - ID of the button element
 * @param {string} url - URL to navigate to on click
 */
export function initBackButton(backBtnId, url) {
  const backBtn = document.getElementById(backBtnId);
  if (!backBtn) return;
  backBtn.addEventListener("click", () => {
    window.location.href = url;
  });
}

// ----------------------------------------------
// "View" buttons management
// ----------------------------------------------

/**
 * Initialize "View" buttons for each row to redirect to a detail view
 * @param {string} rowSelector - Selector for row elements
 * @param {string} viewSelector - Selector for the "View" button inside the row
 * @param {function} callback - Function to execute on click (receives button dataset)
 */
export function initViewButtons(rowSelector, viewSelector, callback) {
  const rows = document.querySelectorAll(rowSelector);
  rows.forEach((row) => {
    const btn = row.querySelector(viewSelector);
    if (!btn) return;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      callback(btn.dataset);
    });
  });
}

// ----------------------------------------------
// "Delete" buttons management
// ----------------------------------------------

/**
 * Initialize "Delete" buttons for all entity types.
 * Requires a confirmation modal to handle deletion.
 * @param {Function} openConfirmModal - Function to open the confirmation modal
 */
export function initDeleteButton(openConfirmModal) {
  // Mapping pour le message à afficher
  const entityLabels = {
    catway: "ce catway",
    reservation: "cette réservation",
    user: "cet utilisateur",
  };

  document.querySelectorAll(".delete").forEach((btn) => {
    btn.addEventListener("click", () => {
      const entityType = btn.dataset.entityType;
      const entityId = btn.dataset.id || btn.dataset.email;
      const subId = btn.dataset.subId;

      // Constructing the API call URL
      let url =
        entityType === "reservation" && subId
          ? `/catways/${entityId}/reservations/${subId}`
          : `/${entityType}s/${entityId}`;

      // Constructing the message to show
      const label = entityLabels[entityType] || "élément";
      const message = `Voulez-vous vraiment supprimer ${label} ?`;

      // Callback executed upon confirmation
      openConfirmModal(message, async () => {
        const res = await fetchWithAuth(url, { method: "DELETE" });
        if (res.ok || res.status === 204) {
          window.location.href =
            entityType === "reservation" && subId
              ? `/catways/0/reservations`
              : `/${entityType}s`;
        } else {
          const txt = await res.text();
          throw new Error(txt || "Erreur serveur");
        }
      });
    });
  });
}

// --------------------------------------
// Admin buttons visibility
// --------------------------------------

/**
 * Hide admin-only buttons (edit/delete/add) for non-admin users
 * The "add" button for the reservations is not concerned.
 * @param {string} role - Current user's role.
 */
export function hideAdminButtons(role) {
  if (role !== "administrateur") {
    document
      .querySelectorAll(".edit, .delete, #btnAddUser, #btnAddCatway")
      .forEach((btn) => {
        btn.style.display = "none";
      });
  }
}
