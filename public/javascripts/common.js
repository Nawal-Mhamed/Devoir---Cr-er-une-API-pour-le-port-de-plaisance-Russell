// ======================================================
// SHARED UTILITY FUNCTIONS
// ======================================================
//
// Centralize reused functions in multiple pages:
// - Active link management in the navbar
// - Conditional section display
// - Table filters (single and multiple fields)
// - Temporary logout alert hiding
// - Fetch requests with session authentication
// ======================================================

/**
 * Shared utility functions
 * @module common
 */

// -----------------------------------------------------
// Active link management in navbar
// -----------------------------------------------------

/**
 * Updates the active link in the navigation bar
 * @param {string} activeId - ID of the link to activate.
 */
export function setActiveLink(activeId) {
  document.querySelectorAll(".nav-link").forEach((link) => {
    if (link.id === activeId) {
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
 * Only shows the requested section and hides all others.
 * @param {string} section - Section name (e.g. "users", "catways").
 * @returns {boolean} - true if the section was found and displayed.
 */
export function displaySection(section) {
  const allSections = ["dashboard", "catways", "reservations", "users"];
  const targetId = `${section}-section`;
  const docId = "documentation-section";

  // Hide all sections
  allSections.forEach((s) => {
    const el = document.getElementById(`${s}-section`);
    if (el) el.style.display = "none";
  });

  // Special case: JSDoc documentation
  if (section === "documentation") {
    const doc = document.getElementById(docId);
    if (doc) {
      doc.style.display = "";
    }
  } else {
    const doc = document.getElementById(docId);
    if (doc) doc.style.display = "none";

    const target = document.getElementById(targetId);
    if (target) {
      target.style.display = "";
    } else {
      return false;
    }
  }

  setActiveLink(section);
  return true;
}

// -----------------------------------------------------
// Navbar link click handler management
// -----------------------------------------------------

/**
 * Prevents default navigation for internal links.
 * @param {MouseEvent} event - Click event on a navbar link.
 */
export function handleNavClick(event) {
  const a = event.currentTarget || event.target.closest("a");

  if (!a) return;

  const section = a.dataset.section;

  if (section === "documentation") {
    event.preventDefault();
    const success = displaySection("documentation");

    return false;
  }
}

//  -----------------------------------------------------
// Table filtering
//  -----------------------------------------------------

/**
 * Enables single-field filtering on a table.
 * @param {string} inputId - ID of the search input element.
 * @param {string} rowSelector - Selector for rows/items to filter.
 * @param {Object} getters - Key/value mapping of functions to extract searchable fields.
 */
export function initTableFilter(inputId, rowSelector, getters) {
  const input = document.getElementById(inputId);
  if (!input) return;

  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    const rows = document.querySelectorAll(rowSelector);

    rows.forEach((row) => {
      let match = true;
      for (const key in getters) {
        const value = getters[key](row)?.toLowerCase() || "";
        if (!value.includes(query)) match = false;
      }
      row.style.display = match ? "" : "none";
    });
  });
}

/**
 * Enables multi-field filtering on a table.
 * @param {string} rowSelector - Selector for rows/items to filter.
 * @param {Object} filters - Mapping of keys to input DOM elements for each criterion.
 */
export function initMultiFilter(rowSelector, filters) {
  Object.values(filters).forEach((input) => {
    input.addEventListener("input", () => {
      const rows = document.querySelectorAll(rowSelector);
      rows.forEach((row) => {
        const show = Object.entries(filters).every(([key, input]) => {
          const value = input.value.trim().toLowerCase();
          const cell =
            row.querySelector(`.${key}`)?.textContent.trim().toLowerCase() ||
            "";
          return cell.includes(value);
        });
        row.style.display = show ? "" : "none";
      });
    });
  });
}

// -----------------------------------------------------
// Temporary logout alert hiding
// -----------------------------------------------------

const logoutAlert = document.getElementById("logoutAlert");
if (logoutAlert) {
  setTimeout(() => (logoutAlert.style.display = "none"), 3000);
}

// -----------------------------------------------------
// Fetch wrapper with authentification
// -----------------------------------------------------

/**
 * Wrapper around fetch() that includes session cookies.
 * @param {string} url - Target URL.
 * @param {Object} options - Fetch options (method, headers, etc.).
 * @returns {Promise<Response>} Fetch API Response.
 */
export async function fetchWithAuth(url, options = {}) {
  options.credentials = "include";
  const res = await fetch(url, options);
  return res;
}
