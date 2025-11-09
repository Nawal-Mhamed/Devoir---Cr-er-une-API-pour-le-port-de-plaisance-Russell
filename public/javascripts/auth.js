// Récupérer le cookie

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

// Décodage du token

function parseJWT(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (err) {
    console.error("Erreur de décodage du token : ", err);
    return null;
  }
}

// Rendre les boutons "Modifier", "Supprimer" et "Ajouter" (sauf pour l'ajout de réservations) non visibles par le rôle utilisateur

document.addEventListener("DOMContentLoaded", () => {
  const token = getCookie("token");
  const decoded = token ? parseJWT(token) : null;
  const userRole = decoded?.role;

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

// // Vérification du token au chargement de la page

// document.addEventListener("DOMContentLoaded", () => {
//   const token = getCookie("token");
//   if (!token) {
//     window.location.href = "/";
//   }
// });
