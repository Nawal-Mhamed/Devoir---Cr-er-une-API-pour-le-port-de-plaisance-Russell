// Rendre les boutons "Modifier", "Supprimer" et "Ajouter" (sauf pour l'ajout de réservations) non visibles par le rôle utilisateur

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

function parseJWT(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (err) {
    return null;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const token = getCookie("token");
  const decoded = token ? parseJWT(token) : null;
  const isAdmin = decoded?.role === "administrateur";

  if (!isAdmin) {
    document
      .querySelectorAll(".edit, .delete, #btnAddUser, #btnAddCatway")
      .forEach((btn) => (btn.style.display = "none"));
  }
});
