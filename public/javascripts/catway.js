function setActiveLink(activeId) {
  const links = ["catways", "documentation"];
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

function displayCatways(section, event) {
  event.preventDefault();

  const catways = document.getElementById("catways-section");

  const documentation = document.getElementById("documentation-section");

  if (section === "catways") {
    documentation.setAttribute("style", "display: none;");

    catways.removeAttribute("style");
    setActiveLink("catways");
  } else {
    catways.setAttribute("style", "display: none;");

    documentation.removeAttribute("style");
    setActiveLink("documentation");
  }
}

// Modales

document.addEventListener("DOMContentLoaded", () => {
  // Eléments

  const catwayForm = document.getElementById("catwayForm");
  const catwayModal = new bootstrap.Modal(
    document.getElementById("catwayModal")
  );
  const confirmDeleteModal = new bootstrap.Modal(
    document.getElementById("confirmDeleteModal")
  );
  const catwayModalTitle = document.getElementById("catwayModalTitle");
  const catwayIdInput = document.getElementById("catwayId");
  const catwayNumberInput = document.getElementById("catwayNumber");
  const catwayTypeInput = document.getElementById("catwayType");
  const catwayStateInput = document.getElementById("catwayState");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

  let deletingId = null;

  // Helpers d'affichage

  const errorBox = document.getElementById("catwayError");

  function showError(message) {
    errorBox.textContent = message;
    errorBox.classList.remove("d-none");
  }

  function clearError() {
    errorBox.textContent = "";
    errorBox.classList.add("d-none");
  }

  // Ouvrir la modale d'ajout

  const btnAdd = document.getElementById("btnAddCatway");
  if (btnAdd) {
    btnAdd.addEventListener("click", () => {
      catwayModalTitle.textContent = "Ajouter un catway";
      catwayIdInput.value = "";
      catwayNumberInput.value = "";
      catwayTypeInput.value = "long";
      catwayStateInput.value = "";

      catwayNumberInput.disabled = false;
      catwayTypeInput.disabled = false;

      clearError();
      catwayModal.show();
    });
  }

  // Ouvrir la modale de modification ou de suppression

  const catwaysSection = document.getElementById("catways-section");
  if (catwaysSection) {
    catwaysSection.addEventListener("click", (event) => {
      const editBtn = event.target.closest(".edit-catway");
      const deleteBtn = event.target.closest(".delete-catway");

      // Bouton Modifier
      if (editBtn) {
        clearError();
        const catway = editBtn.closest("tr") || editBtn.closest(".card");
        const catwayNumber = editBtn.dataset.id;
        if (!catway || !catwayNumber) {
          showError("Impossible de récupérer le catway.");
          return;
        }

        const catwayType =
          catway.querySelector("td:nth-child(2)")?.textContent?.trim() ||
          editBtn.dataset.type;
        const catwayState =
          catway.querySelector("td:nth-child(3)")?.textContent?.trim() ||
          editBtn.dataset.state;

        catwayModalTitle.textContent = "Modifier un catway";
        catwayIdInput.value = catwayNumber;
        catwayNumberInput.value = catwayNumber;
        catwayTypeInput.value = catwayType;
        catwayStateInput.value = catwayState;

        catwayNumberInput.disabled = true;
        catwayTypeInput.disabled = true;

        catwayModal.show();
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

  confirmDeleteBtn.addEventListener("click", async () => {
    if (!deletingId) return;
    try {
      const res = await fetchWithAuth(`/catways/${deletingId}`, {
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

  // Envoi de l'ajout / la modification

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
      let res;
      if (!id) {
        // Ajout
        res = await fetchWithAuth("/catways", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } else {
        // Modification
        res = await fetchWithAuth(`/catways/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }

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

  // Recherche d'un catway par numéro

  const searchInput = document.getElementById("catwaySearch");

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim();
    const rows = document.querySelectorAll(".catway-row");

    rows.forEach((row) => {
      const number = row.querySelector(".catway-number")?.textContent || "";
      if (number.includes(query)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  });

  // Fonction d'affichage d'un catway en particulier

  function displayCatwayDetails(number) {
    window.location.href = `/catways/${number}`;
  }

  // Gestion du bouton Retour

  const backBtn = document.getElementById("backToList");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "/catways";
    });
  }

  // Gestion du bouton "Voir"

  const rows = document.querySelectorAll(".catway-row");

  rows.forEach((row) => {
    const viewBtn = row.querySelector(".show-catway");
    if (!viewBtn) return;

    const id = viewBtn.dataset.id;

    viewBtn.addEventListener("click", (e) => {
      displayCatwayDetails(id);
    });
  });
});
