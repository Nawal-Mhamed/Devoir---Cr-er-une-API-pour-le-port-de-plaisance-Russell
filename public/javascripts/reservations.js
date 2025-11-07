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
  const btnShowAll = document.getElementById("btnShowAll");
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
  const btnAdd = document.getElementById("btnAddReservation");
  const btnDelete = document.getElementById("btnDeleteReservation");
  const rows = document.querySelectorAll(".reservation-row");

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
    const catwayValue = document.getElementById("filterCatway").value;

    if (!catwayValue) {
      e.preventDefault();
      alert("Le numéro de catway est requis.");
    }

    searchForm.action = `/catways/${catwayValue}/reservations/search`;
  });

  // Redirection vers l'affichage de toutes les réservations

  btnShowAll?.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "/catways/0/reservations";
  });

  // Ajout

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

  // Cliquer sur une ligne ouvre la modale de modification
  rows.forEach((row) => {
    row.addEventListener("click", async () => {
      clearError();
      const idReservation = row.dataset.id;

      const rowCatway = row.dataset.catway;

      try {
        const res = await fetch(
          `/catways/${rowCatway}/reservations/${idReservation}`
        );
        if (!res.ok) {
          alert("Impossible de récupérer la réservation.");
          return;
        }
        const r = await res.json();

        reservationModalTitle.textContent = "Modifier la réservation";
        idReservationInput.value = r._id;
        catwayInput.value = r.catwayNumber;
        clientInput.value = r.clientName;
        boatInput.value = r.boatName;
        startInput.value = new Date(r.startDate).toISOString().slice(0, 10);
        endInput.value = new Date(r.endDate).toISOString().slice(0, 10);
        btnDelete.classList.remove("d-none");
        reservationModal.show();
      } catch (err) {
        alert("Erreur réseau");
      }
    });
  });

  // Suppression
  btnDelete?.addEventListener("click", async (e) => {
    e.preventDefault();
    const id = idReservationInput.value;
    if (!id) return;

    const catwayNum = catwayInput.value;
    if (!confirm("Confirmer la suppression de cette réservation ?")) return;
    try {
      const res = await fetch(`/catways/${catwayNum}/reservations/${id}`, {
        method: "DELETE",
      });
      if (res.ok || res.status === 204) {
        reservationModal.hide();
        location.reload();
      } else {
        const txt = await res.text();
        showError(txt || "Erreur lors de la suppression");
      }
    } catch (err) {
      showError("Erreur réseau");
    }
  });

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
      showError("Erreu réseau");
    }
  });
});
