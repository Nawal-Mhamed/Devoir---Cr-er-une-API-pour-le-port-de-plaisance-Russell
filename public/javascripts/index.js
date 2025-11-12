// =========================================================================
// MAIN NAVIGATION AND CONTENT SWITCHING
// =========================================================================
//
// Handles dynamic content rendering and active link management for the
// home, login and documentation sections.
// =========================================================================

/**
 * Utility functions for the home page
 * @module homepage
 */

// -----------------------------------------------------
// Active link management in navbar
// -----------------------------------------------------

/**
 * Updates the active link in the navbar.
 * @param {string} activeId  - ID of the link to activate.
 */
function setActiveLink(activeId) {
  const links = ["home", "connexion", "documentation"];
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

// -----------------------------------------------------
// Conditional section display management
// -----------------------------------------------------

/**
 * Dynamically switches the main content section.
 * @param {string} section  - Target section: "home", "login" or "documentation".
 * @param {Event} event - Click event to prevent default navigation.
 */
function displaySection(section, event) {
  event.preventDefault();

  const main = document.getElementById("content");

  // Home section
  if (section === "accueil") {
    main.innerHTML = `      <div
        class="card w-75 mx-auto my-5 shadow p-3 mb-5 bg-body-tertiary rounded"
      >
        <div class="card-body">
          <h1 class="card-title text-center my-5">Port de Plaisance Russel</h1>

          <section>
            <h2 class="card-subtitle mb-2 text-body-secondary text-center mb-5">
              Bienvenue au Port de Plaisance Russel !
            </h2>
            <article class="card-text">
              <p>
                Ce site a été conçu afin de faciliter la gestion des
                réservations de catway du Port de Plaisance Russell.
              </p>
              <p>
                Pour pouvoir l'utiliser, vous devez commencer par vous
                <a href="#" class="card-link" onclick="displaySection('connexion', event)">connecter</a> à la base de
                données.
              </p>
            </article>
          </section>
        </div>
      </div>`;
    setActiveLink("home");

    // Login section
  } else if (section === "connexion") {
    main.innerHTML = `
    <section class="card my-5 p-5 mx-auto mw-100">
      <h2 class="text-center mb-5 card-title">Se connecter</h2>
        <form method="post" action="/login" id="loginForm">

          <div class="mb-3">
            <label for="email" class="form-label">Email *</label>
            <input
              type="email"
              class="form-control"
              id="email"
              name="email"
              ariaDescribedBy="emailHelp"
              required
            />
            <p id="emailHelp" class="form-text">
              Nous ne communiquerons jamais votre adresse e-mail à des tiers.
            </p>
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">Mot de passe *</label>
            <input type="password" class="form-control" id="password" name="password" required />
          </div>
          <div class="mb-3">
            <p class="form-text">Les champs suivis d'une * sont obligatoires</p>
          </div>
          <div class="d-grid d-md-block mx-auto text-center">
            <button type="submit" class="btn btn-primary mx-auto">Se connecter</button>
          </div>
          </form>
          <div id="errorBox" class="alert alert-danger mt-3 d-none"></div>
      </section>`;

    setActiveLink("connexion");

    const form = document.getElementById("loginForm");
    const errorBox = document.getElementById("errorBox");

    if (form) {
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        errorBox.classList.add("d-none");
        errorBox.textContent = "";

        const data = {
          email: form.email.value,
          password: form.password.value,
        };

        try {
          const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

          const result = await response.json();

          if (result.success) {
            window.location.href = result.redirectUrl;
          } else {
            errorBox.textContent = result.message;
            errorBox.classList.remove("d-none");
          }
        } catch (err) {
          errorBox.textContent =
            "Erreur serveur. Veuillez réessayer plus tard.";
          errorBox.classList.remove("d-none");
        }
      });
    }

    // Documentation section
  } else {
    const main = document.getElementById("content");

    main.innerHTML = `<iframe id="documentation" src="/docs/index.html" style="width:100%; height:80vh; border:none;"></iframe>`;
    setActiveLink("documentation");
  }
}

// -----------------------------------------------------
// Logout alert fade-out
// -----------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const alert = document.getElementById("logoutAlert");

  if (!alert) return;

  setTimeout(() => {
    alert.classList.add("fade-out");
    setTimeout(() => alert.remove(), 500);
  }, 3000);
});

// -----------------------------------------------------
// Login alert wrong ids
// -----------------------------------------------------
