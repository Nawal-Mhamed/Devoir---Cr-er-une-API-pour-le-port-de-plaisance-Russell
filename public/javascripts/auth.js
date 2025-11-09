// Rendre les boutons "Modifier", "Supprimer" et "Ajouter" (sauf pour l'ajout de réservations) non visibles par le rôle utilisateur

document.addEventListener("DOMContentLoaded", () => {
  const userRole = document.body.dataset.role;

  console.log("Rôle détecté :", userRole);

  if (userRole !== "administrateur") {
    document
      .querySelectorAll(".edit, .delete, #btnAddUser, #btnAddCatway")
      .forEach((btn) => {
        btn.style.display = "none";
      });
  }
});

// Interception des réponses fetch

async function fetchWithAuth(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
    alert("Session expirée. Veuillez vous reconnecter.");
    window.location.href = "/";
    return;
  }

  return res;
}

// Vérification du token au chargement de la page

document.addEventListener("DOMContentLoaded", () => {
  const token = getCookie("token");
  if (!token) {
    window.location.href = "/";
  }
});
