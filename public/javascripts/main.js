// ======================================================
// MAIN SCRIPT FOR THE APPLICATION
// ======================================================
//
// Provides global features available on all pages:
// - Hides admin-only buttons for regular users
// - Initializes the confirmation modal for deletions
// - Sets up all "Delete" buttons with proper behavior
// ======================================================

/**
 * Main script for the app
 * @module main
 */

import { hideAdminButtons, initDeleteButton } from "./buttons.js";
import { initConfirmDeleteModal } from "./modals.js";
import { handleNavClick } from "./common.js";

// -----------------------------------------------------
// Main initialization
// -----------------------------------------------------

console.log("Fichier [main.js] chargé !");

/** Initializes global page features for all pages */

// Retrieve user role and user email from body data attribute
const role = document.body.dataset.role;

// Hide admin-only buttons if the user is not an administrator
hideAdminButtons(role);

// Initialize the delete confirmation modal and attach delete buttons only if it exists

const confirmModalElement = document.getElementById("confirmDeleteModal");
if (confirmModalElement) {
  const openConfirmModal = initConfirmDeleteModal();
  initDeleteButton(openConfirmModal);

  console.log(document.querySelectorAll(".delete-reservation"));
}

console.log(confirmModalElement);

document.querySelectorAll(".nav-link[data-section]").forEach((a) => {
  a.addEventListener("click", handleNavClick);
});

// Disable striped mode and hover mode on table on mobile devices
function toggleStripedAndHoverOnMobile() {
  const isMobile = window.innerWidth < 768;

  const tables = document.querySelectorAll("table.responsive-table");

  tables.forEach((table) => {
    if (isMobile) {
      table.classList.remove("table-striped", "table-hover");
    } else {
      table.classList.add("table-striped", "table-hover");
    }
  });
}

window.addEventListener("load", toggleStripedAndHoverOnMobile);
window.addEventListener("resize", toggleStripedAndHoverOnMobile);
