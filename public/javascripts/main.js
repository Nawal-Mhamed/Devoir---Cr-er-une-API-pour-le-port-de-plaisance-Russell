// ======================================================
// MAIN SCRIPT FOR THE APPLICATION
// ======================================================
//
// Provides global features available on all pages:
// - Hides admin-only buttons for regular users
// - Initializes the confirmation modal for deletions
// - Sets up all "Delete" buttons with proper behavior
// ======================================================

import { hideAdminButtons, initDeleteButton } from "./buttons.js";
import { initConfirmDeleteModal } from "./modals.js";
import { handleNavClick } from "./common.js";

// -----------------------------------------------------
// Main initialization
// -----------------------------------------------------

/** Initializes global page features for all pages */

// Retrieve user role from body data attribute
const role = document.body.dataset.role;

// Hide admin-only buttons if the user is not an administrator
hideAdminButtons(role);

// Initialize the delete confirmation modal and attach delete buttons only if it exists

const confirmModalElement = document.getElementById("confimDeleteModal");
if (confirmModalElement) {
  const openConfirmModal = initConfirmDeleteModal();
  initDeleteButton(openConfirmModal);
}

document.querySelectorAll(".nav-link[data-section]").forEach((a) => {
  a.addEventListener("click", handleNavClick);
});
