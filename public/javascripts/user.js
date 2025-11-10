// ======================================================
// USER PAGES MANAGEMENT
// ======================================================
//
// Provides functionalities for managing users:
// - Initialize add/edit modals
// - "Back" and "View" buttons management
// - Filter users by email
// - Add, edit and update user accounts
// - Automatic redirection if email is changed
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

  const {
    modal: userModal,
    formElem: userForm,
    showError,
    clearError,
  } = initModal("userModal", "userFormModal", "userError");

  const userModalTitle = document.getElementById("userModalTitle");
  const usersSection = document.getElementById("users-section");

  const usernameInput = document.getElementById("username");
  const passwordInput = document.querySelector(".password");
  const passwordValue = passwordInput.querySelector("input");
  const userEmailInput = document.getElementById("userEmailInput");
  const emailInput = document.getElementById("email");
  const roleInput = document.getElementById("role");

  const btnAdd = document.getElementById("btnAddUser");

  // ------------------------------------------------------
  // "Back" and "View" buttons management
  // ------------------------------------------------------

  /**
   * "Back" button redirects to the full users list.
   */
  initBackButton("backToList", `/users`);

  /** "View" buttons redirect to the details page of the selected user */
  initViewButtons(".user-row", ".show-user", (data) => {
    window.location.href = `/users/${data.email}`;
  });

  // ======================================================
  // Email filter
  // ======================================================

  /** Initializes dynamic filtering of users by email. */
  initTableFilter("userSearch", ".user-row", {
    email: (row) => row.querySelector(".user-email")?.textContent || "",
  });

  // ======================================================
  // Add user modal management
  // ======================================================

  /**
   *  Opens the modal to add a new user.
   */
  btnAdd?.addEventListener("click", () => {
    userModalTitle.textContent = "Ajouter un utilisateur";
    usernameInput.value = "";
    emailInput.value = "";
    passwordValue.value = "";
    roleInput.value = "utilisateur";

    clearError();

    // Show the password field when adding new users
    passwordInput.removeAttribute("style");

    userModal.show();
  });

  // ======================================================
  // Edit user modal management
  // ======================================================

  /**
   * Opens the modal with existing user data for editing.
   */
  if (usersSection) {
    usersSection.addEventListener("click", (event) => {
      const editBtn = event.target.closest(".edit-user");
      if (!editBtn) return;

      const user = editBtn.closest(".card");
      const userEmail = editBtn.dataset.email;
      if (!user || !userEmail) {
        showError("Impossible de récupérer l'utilisateur.");
        return;
      }

      userModalTitle.textContent = "Modifier un utilisateur";

      usernameInput.value = editBtn.dataset.username;
      userEmailInput.value = editBtn.dataset.email;
      emailInput.value = editBtn.dataset.email;
      roleInput.value = editBtn.dataset.role;

      // Hide password field when editing
      passwordInput.setAttribute("style", "display: none;");

      // Lock password field and role field to avoid mistakes.
      passwordInput.disabled = true;
      roleInput.disabled = true;

      clearError();
      userModal.show();
    });
  }

  // ======================================================
  // Submit add/edit user form
  // ======================================================

  /**
   * Submit the form data to create or update a user.
   * Automatically redirects if the email address has changed.
   * @param {SubmitEvent} event - Evénement de soumission du formulaire.
   */
  userForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearError();

    const originalEmail = userEmailInput.value?.trim();
    const data = {
      username: usernameInput.value,
      email: emailInput.value,
      password: passwordInput.querySelector("input")?.value || undefined,
      role: roleInput.value,
    };

    // Determine URL and HTTP method
    const url = originalEmail ? `/users/${originalEmail}` : `/users`;
    const method = originalEmail ? "PUT" : "POST";

    try {
      const res = await fetchWithAuth(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        showError(payload?.message || "Erreur lors de l'enregistrement.");
        return;
      }

      userModal.hide();

      // Redirect to the new user if email has changed
      if (originalEmail && originalEmail !== data.email) {
        window.location.href = `/users/${data.email}`;
      } else {
        location.reload();
      }
    } catch (err) {
      showError("Erreur réseau");
    }
  });
});
