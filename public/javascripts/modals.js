// ======================================================
// CENTRALIZED BOOTSTRAP MODAL UTILITIES
// ======================================================
//
// provides reusable modal helpers for forms, error messages
// and delete confirmations across all pages.
// ======================================================

// -----------------------------------------------------
// Generic form modals (Add / Edit)
// -----------------------------------------------------

/**
 * Initializes a generic Bootstrap modal for add/edit forms.
 * @param {string} modalId - Modal's DOM ID.
 * @param {string} formId - Form's DOM ID inside the modal.
 * @param {string} errorId - DOM ID for displaying error messages.
 * @returns {Object} - Useful references for the modal and error helpers.
 */
export function initModal(modalId, formId, errorId) {
  const modalElem = document.getElementById(modalId);
  const formElem = document.getElementById(formId);
  const errorElem = document.getElementById(errorId);
  const modal = new bootstrap.Modal(modalElem);

  /** Displays an error message inside the modal.
   * @param {string} msg - Error message to display.
   */
  function showError(msg) {
    if (errorElem) {
      errorElem.textContent = msg;
      errorElem.classList.remove("d-none");
    }
  }

  /** Clears any previously displayed error message. */
  function clearError() {
    if (errorElem) {
      errorElem.textContent = "";
      errorElem.classList.add("d-none");
    }
  }

  return { modal, formElem, showError, clearError };
}

// -----------------------------------------------------
// Delete confirmation modal
// -----------------------------------------------------

/**
 * Initializes a Bootstrap modal for delete confirmation.
 * @returns {Function} openConfirmModal - Function to open the modal with message and callback.
 */
export function initConfirmDeleteModal() {
  const confirmDeleteModal = new bootstrap.Modal(
    document.getElementById("confirmDeleteModal")
  );
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  let deleteCallback = null;

  /**
   * Opens the delete confirmation modal.
   * @param {string} message - Message to display in the modal.
   * @param {Function} callback - Function to execute after confirmation.
   */
  function openConfirmModal(message, callback) {
    const msgElem = document.getElementById("confirmDeleteMessage");
    if (msgElem) msgElem.textContent = message;
    deleteCallback = callback;
    confirmDeleteModal.show();
  }

  // Executes the callback when the confirm button is clicked.
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener("click", async () => {
      if (typeof deleteCallback === "function") {
        try {
          await deleteCallback();
          confirmDeleteModal.hide();
        } catch (err) {
          console.error(err);
          alert("Erreur lors de la suppression");
        }
      }
    });
  }

  return openConfirmModal;
}
