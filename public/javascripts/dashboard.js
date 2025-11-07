function setActiveLink(activeId) {
  const links = ["dashboard", "documentation"];
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

function displayDashboard(section, event) {
  event.preventDefault();

  const dashboard = document.getElementById("dashboard-section");
  const documentation = document.getElementById("documentation-section");

  if (section === "dashboard") {
    documentation.setAttribute("style", "display: none;");
    dashboard.removeAttribute("style");
    setActiveLink("dashboard");
  } else {
    dashboard.setAttribute("style", "display: none;");

    documentation.removeAttribute("style");
    setActiveLink("documentation");
  }
}
