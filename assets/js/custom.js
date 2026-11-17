/**
 * 11 laboratorinis darbas: JavaScript formos
 * Kontaktų formos duomenų surinkimas, validacija realiu laiku,
 * telefono numerio formatavimas ir formos išvalymas.
 */
(function () {
  "use strict";

  const form = document.getElementById("contact-form");
  if (!form) return;

  const submitBtn = document.getElementById("cf-submit");
  const clearBtn = document.getElementById("cf-clear");
  const result = document.getElementById("cf-result");

  const fields = {
    vardas: document.getElementById("cf-vardas"),
    pavarde: document.getElementById("cf-pavarde"),
    email: document.getElementById("cf-email"),
    telefonas: document.getElementById("cf-telefonas"),
    adresas: document.getElementById("cf-adresas"),
    q1: document.getElementById("cf-q1"),
    q2: document.getElementById("cf-q2"),
    q3: document.getElementById("cf-q3"),
  };

  const ratingKeys = ["q1", "q2", "q3"];

  // Lauko pavadinimai rezultatų išvedimui
  const labels = {
    vardas: "Vardas",
    pavarde: "Pavardė",
    email: "El. paštas",
    telefonas: "Tel. numeris",
    adresas: "Adresas",
    q1: "Svetainės dizainas",
    q2: "Informacijos naudingumas",
    q3: "Ar rekomenduotumėte mane",
  };

  // Laukai, kuriuos vartotojas jau palietė: klaidos rodomos tik jiems
  const touched = new Set();

  /* ---------------------------------------------------------------------
   * Validacija
   * ------------------------------------------------------------------- */

  const LETTERS_ONLY = /^\p{L}+$/u;
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const PHONE = /^\+370 6\d{2} \d{5}$/;

  // Grąžina klaidos tekstą arba tuščią eilutę, jei laukas teisingas
  function validate(key) {
    const value = fields[key].value.trim();

    if (value === "") return "Šis laukas privalomas.";

    switch (key) {
      case "vardas":
      case "pavarde":
        return LETTERS_ONLY.test(value) ? "" : "Galima naudoti tik raides.";
      case "email":
        return EMAIL.test(value) ? "" : "Neteisingas el. pašto formatas (pvz. vardas@pastas.lt).";
      case "telefonas":
        return PHONE.test(value) ? "" : "Įveskite visą numerį: +370 6xx xxxxx.";
      case "q1":
      case "q2":
      case "q3": {
        const n = Number(value);
        return Number.isInteger(n) && n >= 1 && n <= 10 ? "" : "Įvertinimas turi būti sveikasis skaičius nuo 1 iki 10.";
      }
      default:
        return "";
    }
  }

  function showFieldState(key) {
    const input = fields[key];
    const errorBox = input.parentElement.querySelector(".cv-error");
    const error = validate(key);
    const show = touched.has(key);

    input.classList.toggle("is-invalid", show && error !== "");
    input.classList.toggle("is-valid", show && error === "");
    input.setAttribute("aria-invalid", show && error !== "" ? "true" : "false");
    errorBox.textContent = show ? error : "";
  }

  // „Siųsti“ aktyvus tik kai visi laukai užpildyti ir be klaidų
  function updateSubmitState() {
    const allValid = Object.keys(fields).every((key) => validate(key) === "");
    submitBtn.disabled = !allValid;
  }

  /* ---------------------------------------------------------------------
   * Telefono numerio formatavimas: +370 6xx xxxxx
   * ------------------------------------------------------------------- */

  const PHONE_PREFIX = "+370 ";
  const PHONE_DIGITS = 8; // 6xx xxxxx

  function formatPhone(raw) {
    let digits = raw.replace(/\D/g, "");

    if (raw.startsWith("+370")) {
      digits = digits.slice(3);
    } else if (digits.startsWith("370")) {
      digits = digits.slice(3);
    } else if (digits.startsWith("8")) {
      digits = digits.slice(1); // vietinis formatas 86xxxxxxx
    }

    digits = digits.slice(0, PHONE_DIGITS);
    if (digits === "") return "";
    if (digits.length <= 3) return PHONE_PREFIX + digits;
    return PHONE_PREFIX + digits.slice(0, 3) + " " + digits.slice(3);
  }

  // Leidžiama įvesti tik skaitmenis
  fields.telefonas.addEventListener("beforeinput", (e) => {
    if (e.data && /\D/.test(e.data) && e.inputType !== "insertFromPaste") {
      e.preventDefault();
    }
  });

  fields.telefonas.addEventListener("input", () => {
    fields.telefonas.value = formatPhone(fields.telefonas.value);
  });

  /* ---------------------------------------------------------------------
   * Įvykiai
   * ------------------------------------------------------------------- */

  Object.keys(fields).forEach((key) => {
    const input = fields[key];

    input.addEventListener("input", () => {
      touched.add(key);
      showFieldState(key);
      updateSubmitState();
    });

    input.addEventListener("blur", () => {
      touched.add(key);
      showFieldState(key);
    });
  });

  // Duomenų surinkimas į objektą
  function collectData() {
    const data = {};
    Object.keys(fields).forEach((key) => {
      const value = fields[key].value.trim();
      data[key] = ratingKeys.includes(key) ? Number(value) : value;
    });
    return data;
  }

  function average(data) {
    const sum = ratingKeys.reduce((acc, key) => acc + data[key], 0);
    return sum / ratingKeys.length;
  }

  function renderResult(data, avg) {
    result.replaceChildren();

    Object.keys(labels).forEach((key) => {
      const p = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = labels[key] + ": ";
      p.append(strong, String(data[key]));
      result.append(p);
    });

    const avgLine = document.createElement("p");
    avgLine.className = "cv-average";
    avgLine.textContent = `${data.vardas} ${data.pavarde}: ${avg.toFixed(1)}`;
    result.append(avgLine);

    result.hidden = false;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // puslapis neperkraunamas

    Object.keys(fields).forEach((key) => {
      touched.add(key);
      showFieldState(key);
    });
    updateSubmitState();
    if (submitBtn.disabled) return;

    const data = collectData();
    const avg = average(data);
    data.vidurkis = Number(avg.toFixed(1));

    console.log("Formos duomenys:", data);
    renderResult(data, avg);
  });

  // Formos išvalymas: laukai, rezultatai, vidurkis ir klaidos
  clearBtn.addEventListener("click", () => {
    form.reset();
    touched.clear();
    Object.keys(fields).forEach((key) => showFieldState(key));
    result.replaceChildren();
    result.hidden = true;
    updateSubmitState();
    fields.vardas.focus();
  });

  updateSubmitState();
})();
