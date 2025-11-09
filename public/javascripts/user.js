function setActiveLink(activeId) {
  const links = ["users", "documentation"];
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

function displayUsers(section, event) {
  event.preventDefault();

  const users = document.getElementById("users-section");
  const documentation = document.getElementById("documentation-section");

  if (section === "users") {
    documentation.setAttribute("style", "display: none;");
    users.removeAttribute("style");
    setActiveLink("users");
  } else {
    users.setAttribute("style", "display: none;");

    documentation.removeAttribute("style");
    setActiveLink("documentation");
  }
}

// Modales

document.addEventListener("DOMContentLoaded", () => {
  // Eléments

  const userForm = document.getElementById("userForm");
  const userModal = new bootstrap.Modal(document.getElementById("userModal"));
  const confirmDeleteModal = new bootstrap.Modal(
    document.getElementById("confirmDeleteModal")
  );
  const userModalTitle = document.getElementById("userModalTitle");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.querySelector(".password");
  const passwordValue = passwordInput.querySelector("input");
  const userEmailInput = document.getElementById("userEmail");
  const emailInput = document.getElementById("email");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

  let deletingEmail = null;

  // Helpers d'affichage

  const errorBox = document.getElementById("userError");

  function showError(message) {
    errorBox.textContent = message;
    errorBox.classList.remove("d-none");
  }

  function clearError() {
    errorBox.textContent = "";
    errorBox.classList.add("d-none");
  }

  // Ouvrir la modale d'ajout

  const btnAdd = document.getElementById("btnAddUser");
  if (btnAdd) {
    btnAdd.addEventListener("click", () => {
      userModalTitle.textContent = "Ajouter un utilisateur";
      usernameInput.value = "";
      emailInput.value = "";
      passwordValue.value = "";

      passwordInput.removeAttribute("style");
      userModal.show();
    });
  }

  // Ouvrir la modale de modification ou de suppression

  const usersSection = document.getElementById("users-section");
  if (usersSection) {
    usersSection.addEventListener("click", (event) => {
      const editBtn = event.target.closest(".edit-user");
      const deleteBtn = event.target.closest(".delete-user");

      // Bouton "Modifier"
      if (editBtn) {
        clearError();
        const user = editBtn.closest("tr") || editBtn.closest(".card");
        const userEmail = editBtn.dataset.email;
        if (!user || !userEmail) {
          showError("Impossible de récupérer l'utilisateur.");
          return;
        }

        const username = editBtn.dataset.username;
        const email = editBtn.dataset.email;

        userModalTitle.textContent = "Modifier un utilisateur";
        usernameInput.value = username;
        emailInput.value = email;
        userEmailInput.value = email;

        passwordInput.setAttribute("style", "display: none;");
        passwordInput.disabled = true;

        userModal.show();
        return;
      }

      // Bouton Supprimer
      if (deleteBtn) {
        deletingEmail = deleteBtn.dataset.email;
        confirmDeleteModal.show();
        return;
      }
    });
  }

  confirmDeleteBtn.addEventListener("click", async () => {
    if (!deletingEmail) return;
    try {
      const res = await fetch(`/users/${deletingEmail}`, { method: "DELETE" });
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

  userForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearError();
    const id = userEmailInput.value?.trim();
    const data = {
      username: usernameInput.value,
      email: emailInput.value,
      password: passwordInput.querySelector("input")?.value || undefined,
    };

    try {
      let res;
      if (!id) {
        // Ajout
        res = await fetch("/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } else {
        // Modification
        res = await fetch(`/users/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }

      if (res.ok) {
        userModal.hide();
        location.reload();
      } else {
        const payload = await res.json().catch(() => null);
        showError(payload?.message || "Erreur lors de l'enregistrement.");
        return;
      }

      userModal.hide();
      location.reload();
    } catch (err) {
      showError("Erreur réseau");
    }
  });

  // Recherche d'un utilisateur par email

  const searchInput = document.getElementById("userSearch");
  const searchButton = document.getElementById("btnSearchUser");

  // Fonction d'affichage d'un utilisateur en particulier

  function displayUserDetails(email) {
    window.location.href = `/users/${email}`;
  }

  searchButton.addEventListener("click", () => {
    const email = searchInput.value;
    if (!email) {
      alert("Veuillez entrer une adresse email valide.");
      return;
    }

    displayUserDetails(email);
  });

  // Gestion du bouton Retour

  const backBtn = document.getElementById("backToList");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "/users";
    });
  }

  // Gestion du bouton "Voir"

  const rows = document.querySelectorAll(".user-row");

  rows.forEach((row) => {
    const viewBtn = row.querySelector(".show-user");
    if (!viewBtn) return;

    const email = viewBtn.dataset.email;

    viewBtn.addEventListener("click", (e) => {
      displayUserDetails(email);
    });
  });
});
