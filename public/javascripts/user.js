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

// Afficher la bonne page de réservation

const reservations = document.getElementById("reservations");

function getReservations(event) {
  event.preventDefault();

  // Question 1 (obligatoire)
  const catwayId = prompt(
    "De quel catway souhaitez-vous voir les réservation ?"
  );
  if (!catwayId) {
    alert("Vous devez préciser un catway !");
    return;
  }

  // Question 2 (optionnelle)
  const reservationId = prompt("Quel est l'identifiant de la réservation ?");

  // Redirection

  if (reservationId) {
    window.location.href = `/catways/${catwayId}/reservations/${reservationId}`;
  } else {
    window.location.href = `/catways/${catwayId}/reservations`;
  }
}

reservations.addEventListener("click", getReservations);
