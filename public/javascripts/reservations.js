// ======================================================
// RESERVATION PAGES MANAGEMENT
// ======================================================
//
// Provides functionalities for managing reservations:
// - Initialize add/edit modals
// - "Back" and "View" buttons management
// - Multi-criteria filters (ID / Client / Boat)
// - "Show All" button to reset filters
// - Add / edit reservations via modal
// ======================================================

import { initModal } from "./modals.js";
import { initBackButton, initViewButtons } from "./buttons.js";
import { initMultiFilter, fetchWithAuth } from "./common.js";

// ======================================================
// MAIN INITIALIZATION
// ======================================================

document.addEventListener("DOMContentLoaded", () => {
  // ------------------------------------------------------
  // DOM element selection
  // ------------------------------------------------------

  const {
    modal: reservationModal,
    formElem: reservationForm,
    showError,
    clearError,
  } = initModal("reservationModal", "reservationFormModal", "reservationError");

  const catwayForm = document.getElementById("catwayForm");
  const reservationModalTitle = document.getElementById(
    "reservationModalTitle"
  );
  const reservationsSection = document.getElementById("reservations-section");

  const idReservationInput = document.getElementById("idReservationInput");
  const catwayInput = document.getElementById("formCatwayNumber");
  const clientInput = document.getElementById("formClientName");
  const boatInput = document.getElementById("formBoatName");
  const startInput = document.getElementById("formStartDate");
  const endInput = document.getElementById("formEndDate");

  const btnAdd = document.getElementById("btnAddReservation");
  const btnShowAll = document.getElementById("btnShowAll");

  // ------------------------------------------------------
  // "Back" and "View" buttons management
  // ------------------------------------------------------

  /**
   * "Back" button redirects to the reservation list of the current catway.
   * Defaults to /catways/0/reservations if no catway is specified.
   */
  initBackButton(
    "backToList",
    `/catways/${
      document.getElementById("backToList")?.dataset.catway || 0
    }/reservations`
  );

  /** "View" buttons redirect to a reservation's detail page.*/
  initViewButtons(".reservation-row", ".show-reservation", (data) => {
    window.location.href = `/catways/${data.catway}/reservations/${data.id}`;
  });

  // ------------------------------------------------------
  // Catway filter form management
  // ------------------------------------------------------

  /** Filters reservations by catway number via form submission */
  catwayForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const catwayValue = document.getElementById("filterCatway").value.trim();
    if (catwayValue) {
      window.location.href = `/catways/${catwayValue}/reservations`;
    }
  });

  // ------------------------------------------------------
  // Multi-field filters (ID / Client / Boat) management
  // ------------------------------------------------------

  const filterId = document.getElementById("filterIdReservation");
  const filterClient = document.getElementById("filterClient");
  const filterBoat = document.getElementById("filterBoat");

  /**
   * Initializes dynamic multi-criteria filtering:
   * - Reservation ID
   * - Client name
   * - Boat name
   */
  if (filterId || filterClient || filterBoat) {
    initMultiFilter(".reservation-row", {
      "reservation-id": document.getElementById("filterIdReservation"),
      "client-name": document.getElementById("filterClient"),
      "boat-name": document.getElementById("filterBoat"),
    });
  }

  // ------------------------------------------------------
  // "Show All" button
  // ------------------------------------------------------

  /** Redirects to the full list of reservations (all catways). */
  btnShowAll?.addEventListener("click", (e) => {
    window.location.href = "/catways/0/reservations";
  });

  // ------------------------------------------------------
  // Add reservation modal management
  // ------------------------------------------------------

  /** Opens the modal to create a new reservation */
  btnAdd?.addEventListener("click", () => {
    reservationModalTitle.textContent = "Ajouter une réservation";
    idReservationInput.value = "";
    catwayInput.value = "";
    clientInput.value = "";
    boatInput.value = "";
    startInput.value = "";
    endInput.value = "";

    clearError();

    btnDelete.classList.add("d-none");
    reservationModal.show();
  });

  // ------------------------------------------------------
  // Edit reservation modal management
  // ------------------------------------------------------

  /** Opens the modal with existing reservation data for editing. */
  if (reservationsSection) {
    reservationsSection.addEventListener("click", (event) => {
      const editBtn = event.target.closest(".edit-reservation");
      if (!editBtn) return;

      reservationModalTitle.textContent = "Modifier la réservation";
      catwayInput.value = editBtn.dataset.catway;
      clientInput.value = editBtn.dataset.client;
      boatInput.value = editBtn.dataset.boat;
      startInput.value = editBtn.dataset.startdate;
      endInput.value = editBtn.dataset.enddate;

      clearError();
      reservationModal.show();
    });
  }

  // ------------------------------------------------------
  // Submit reservation form
  // ------------------------------------------------------

  /**
   * Submit reservation data to create or update a reservation.
   * @param {SubmitEvent} e - Form submission event.
   */
  reservationForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearError();
    const id = idReservationInput.value;
    const data = {
      catwayNumber: Number(catwayInput.value),
      clientName: clientInput.value.trim(),
      boatName: boatInput.value.trim(),
      startDate: startInput.value,
      endDate: endInput.value,
    };

    // Validate required fields
    if (
      !data.catwayNumber ||
      !data.clientName ||
      !data.boatName ||
      !data.startDate ||
      !data.endDate
    ) {
      showError("Tous les champs sont requis.");
      return;
    }

    // Determine API endpoint and method

    const pathParts = window.location.pathname.split("/");
    const originalCatway = Number(pathParts[2]);
    const baseCatway = data.catwayNumber;

    const isUpdate = Boolean(id);
    const url = isUpdate
      ? `/catways/${originalCatway}/reservations/${id}`
      : `/catways/${baseCatway}/reservations`;
    const method = id ? "PUT" : "POST";

    try {
      const res = await fetchWithAuth(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        showError(
          payload?.message ||
            (await res.text()) ||
            "Erreur lors de l'enregistrement"
        );
        return;
      }
      reservationModal.hide();

      // Redirect to the correct catway if catway number has changed
      if (isUpdate && baseCatway !== originalCatway) {
        window.location.href = `/catways/${data.catwayNumber}/reservations`;
      } else {
        location.reload();
      }
    } catch (err) {
      showError("Erreur réseau");
    }
  });
});
