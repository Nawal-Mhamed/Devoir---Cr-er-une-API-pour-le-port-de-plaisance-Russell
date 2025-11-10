// ======================================================
// CATWAY PAGES MANAGEMENT
// ======================================================
//
// Provides functionalities for managing catways:
// - Add/Edit modal initialization
// - "Back" button handling
// - "View" buttons to see catway details
// - Dynamic filtering by catway number
// - Opening modals for add/edit operations
// - Form submission for creating/updating catways
// ======================================================

import { initModal } from "./modals.js";
import { initBackButton, initViewButtons } from "./buttons.js";
import { initTableFilter, fetchWithAuth } from "./common.js";

// ======================================================
// MAIN INITIALIZATION
// ======================================================

document.addEventListener("DOMContentLoaded", () => {
  // ------------------------------------------------------
  // DOM element selection
  // ------------------------------------------------------

  const catwayModalTitle = document.getElementById("catwayModalTitle");
  const catwayIdInput = document.getElementById("catwayId");
  const catwayNumberInput = document.getElementById("catwayNumber");
  const catwayTypeInput = document.getElementById("catwayType");
  const catwayStateInput = document.getElementById("catwayState");

  const btnAdd = document.getElementById("btnAddCatway");
  const catwaysSection = document.getElementById("catways-section");

  // ------------------------------------------------------
  // Modal initialization (add / edit)
  // ------------------------------------------------------

  const {
    modal: catwayModal,
    formElem: catwayForm,
    showError,
    clearError,
  } = initModal("catwayModal", "catwayFormModal", "catwayError");

  // ------------------------------------------------------
  // "Back" and "View" buttons initialization
  // ------------------------------------------------------

  /** "Back" button redirects to full catway list */
  initBackButton("backToList", "/catways");

  /** "View" buttons redirect to the details page of the selected catway */
  initViewButtons(".catway-row", ".show-catway", (data) => {
    window.location.href = `/catways/${data.id}`;
  });

  // ------------------------------------------------------
  // Dynamic catway number filtering
  // ------------------------------------------------------

  /** Initialize search input for filtering catway by number */
  initTableFilter("catwaySearch", ".catway-row", {
    number: (row) => row.querySelector(".catway-number")?.textContent || "",
  });

  // ------------------------------------------------------
  // Add catway modal management
  // ------------------------------------------------------

  /** Opens the modal to add a new catway */
  if (btnAdd) {
    btnAdd.addEventListener("click", () => {
      clearError();

      catwayModalTitle.textContent = "Ajouter un catway";
      catwayIdInput.value = "";
      catwayNumberInput.value = "";
      catwayTypeInput.value = "long";
      catwayStateInput.value = "";

      catwayNumberInput.disabled = false;
      catwayTypeInput.disabled = false;

      catwayModal.show();
    });
  }

  // ------------------------------------------------------
  // Edit catway modal management
  // ------------------------------------------------------

  /** Opens the modal with existing catway data for editing. */
  if (catwaysSection) {
    catwaysSection.addEventListener("click", (event) => {
      const editBtn = event.target.closest(".edit-catway");
      if (!editBtn) return;

      clearError();
      const catway = editBtn.closest(".card");
      const catwayNumber = editBtn.dataset.id;
      if (!catway || !catwayNumber) {
        showError("Impossible de récupérer le catway.");
        return;
      }

      // Retrieve data from data-* attributes

      catwayModalTitle.textContent = "Modifier un catway";
      catwayIdInput.value = catwayNumber;
      catwayNumberInput.value = catwayNumber;
      catwayTypeInput.value = editBtn.dataset.type;
      catwayStateInput.value = editBtn.dataset.state;

      catwayNumberInput.disabled = true;
      catwayTypeInput.disabled = true;

      catwayModal.show();
    });
  }

  // ------------------------------------------------------
  // Form submission (add / edit) management
  // ------------------------------------------------------

  /** Submit form to create or update a catway */
  catwayForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearError();

    const id = catwayIdInput.value?.trim();
    const data = {
      catwayNumber: Number(catwayNumberInput.value),
      catwayType: catwayTypeInput.value,
      catwayState: catwayStateInput.value,
    };

    try {
      // Determine API endpoint and HTTP method
      const url = id ? `/catways/${id}` : "/catways";
      const method = id ? "PUT" : "POST";

      const res = await fetchWithAuth(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        catwayModal.hide();
        location.reload();
      } else {
        const payload = await res.json().catch(() => null);
        showError(payload?.message || "Erreur lors de l'enregistrement.");
      }
    } catch (err) {
      showError("Erreur réseau");
    }
  });
});
