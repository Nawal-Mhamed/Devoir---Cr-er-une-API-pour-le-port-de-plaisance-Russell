function setActiveLink(activeId) {
  const links = ["reservations", "documentation"];
  links.forEach((id) => {
    const link = document.getElementById(id);
    if (id === activeId) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    } else {
      link.classList.remove("active");
      link.removeAttribute("aria-current");
    }
  });
}

function displayReservations(section, event) {
  event.preventDefault();

  const reservations = document.getElementById("reservations-section");
  const documentation = document.getElementById("documentation-section");

  if (section === "reservations") {
    documentation.setAttribute("style", "display: none;");
    reservations.removeAttribute("style");
    setActiveLink("reservations");
  } else {
    reservations.setAttribute("style", "display: none;");

    documentation.removeAttribute("style");
    setActiveLink("documentation");
  }
}

// Modales

document.addEventListener("DOMContentLoaded", () => {
  // Eléments

  const searchForm = document.getElementById("searchForm");
  const reservationModal = new bootstrap.Modal(
    document.getElementById("reservationModal")
  );
  const reservationForm = document.getElementById("reservationForm");
  const reservationModalTitle = document.getElementById(
    "reservationModalTitle"
  );
  const reservationError = document.getElementById("reservationError");
  const idReservationInput = document.getElementById("idReservationInput");
  const catwayInput = document.getElementById("formCatwayNumber");
  const clientInput = document.getElementById("formClientName");
  const boatInput = document.getElementById("formBoatName");
  const startInput = document.getElementById("formStartDate");
  const endInput = document.getElementById("formEndDate");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

  // Gestion de l'affichage des erreurs

  function showError(msg) {
    reservationError.textContent = msg;
    reservationError.classList.remove("d-none");
  }

  function clearError() {
    reservationError.textContent = "";
    reservationError.classList.add("d-none");
  }

  // Formulaire de recherche : vérification de la valeur de catway entrée

  searchForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const catwayValue = document.getElementById("filterCatway").value;
    const idReservation = document
      .getElementById("filterIdReservation")
      .value.trim();

    if (!catwayValue) {
      e.preventDefault();
      alert("Le numéro de catway est requis.");
    }

    if (idReservation) {
      window.location.href = `/catways/${catwayValue}/reservations/${idReservation}`;
    } else {
      window.location.href = `/catways/${catwayValue}/reservations`;
    }
  });

  // Redirection vers l'affichage de toutes les réservations

  const btnShowAll = document.getElementById("btnShowAll");
  btnShowAll?.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "/catways/0/reservations";
  });

  // Ajout

  const btnAdd = document.getElementById("btnAddReservation");
  btnAdd?.addEventListener("click", () => {
    clearError();
    reservationModalTitle.textContent = "Ajouter une réservation";
    idReservationInput.value = "";
    catwayInput.value = "";
    clientInput.value = "";
    boatInput.value = "";
    startInput.value = "";
    endInput.value = "";
    btnDelete.classList.add("d-none");
    reservationModal.show();
  });

  // Ouvrir la modale de modification ou de suppression

  const reservationsSection = document.getElementById("reservations-section");
  if (reservationsSection) {
    reservationsSection.addEventListener("click", (event) => {
      const editBtn = event.target.closest(".edit-reservation");
      const deleteBtn = event.target.closest(".delete-reservation");

      // Bouton Modifier
      if (editBtn) {
        clearError();
        const reservation = editBtn.closest("tr") || editBtn.closest(".card");
        const idReservation = editBtn.dataset.id;
        if (!reservation || !idReservation) {
          showError("Impossible de récupérer la réservation.");
          return;
        }

        const reservationCatway =
          reservation.querySelector("td:nth-child(1)")?.textContent?.trim() ||
          editBtn.dataset.catway;
        const reservationClient =
          reservation.querySelector("td:nth-child(2)")?.textContent?.trim ||
          editBtn.dataset.client;
        const reservationBoat =
          reservation.querySelector("td:nth-child(3)")?.textContent?.trim() ||
          editBtn.dataset.boat;
        const reservationStart =
          reservation.querySelector("td:nth-child(4)")?.textContent?.trim() ||
          editBtn.dataset.startDate;
        const reservationEnd =
          reservation.querySelector("td:nth-child(5)")?.textContent?.trim() ||
          editBtn.dataset.endDate;

        reservationModalTitle.textContent = "Modifier la réservation";
        catwayInput.value = reservationCatway;
        clientInput.value = reservationClient;
        boatInput.value = reservationBoat;
        startInput.value = reservationStart;
        endInput.value = reservationEnd;

        reservationModal.show();
        return;
      }

      // Bouton Supprimer

      if (deleteBtn) {
        deletingId = deleteBtn.dataset.id;
        confirmDeleteModal.show();
        return;
      }
    });
  }
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener("click", async () => {
      if (!deletingId) return;
      try {
        const res = await fetch(`/catways/${catwayNum}/reservations/${id}`, {
          method: "DELETE",
        });
        if (res.status === 204 || res.ok) {
          confirmDeleteModal.hide();
          location.reload();
        } else {
          const txt = await res.text();
          showError("Erreur suppression : " + txt);
        }
      } catch (err) {
        showError("Erreur réseau");
      }
    });
  } else {
    return;
  }

  // Envoi du formulaire d'ajout / de modification
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

    // Changement d'URL lors de l'envoi du formulaire

    const baseCatway = data.catwayNumber;
    const url = id
      ? `/catways/${baseCatway}/reservations/${id}`
      : `/catways/${baseCatway}/reservations`;
    const method = id ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
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
      location.reload();
    } catch (err) {
      showError("Erreur réseau");
    }
  });

  // Gestion du bouton Retour

  const backBtn = document.getElementById("backToList");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      const catwayNumber = document.getElementById("backToList").dataset.catway;
      window.location.href = `/catways/${catwayNumber}/reservations`;
    });
  }

  // Fonction d'affichage d'une réservation en particulier

  function displayReservationDetails(number, id) {
    window.location.href = `/catways/${number}/reservations/${id}`;
  }

  // Gestion du bouton "Voir"

  const rows = document.querySelectorAll(".reservation-row");

  rows.forEach((row) => {
    const viewBtn = row.querySelector(".show-reservation");
    if (!viewBtn) return;

    const number = viewBtn.dataset.catway;
    const id = viewBtn.dataset.id;

    if (!number || !id) {
      console.warn("Aucune donnée pour ce bouton :", viewBtn);
      return;
    } else {
      console.log(number);
      console.log(id);
    }

    viewBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log(`Redirection vers /catways/${number}/reservations/${id}`);
      displayReservationDetails(number, id);
    });
  });
});
