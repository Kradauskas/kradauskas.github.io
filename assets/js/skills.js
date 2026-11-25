const pradiniaiIgudziai = [
  { pavadinimas: "Python", busena: "Atlikta", xp: 60 },
  { pavadinimas: "HTML ir CSS", busena: "Atlikta", xp: 40 },
  { pavadinimas: "Git ir GitHub", busena: "Atlikta", xp: 20 },
  { pavadinimas: "JavaScript", busena: "Mokomasi", xp: 50 },
  { pavadinimas: "Mašininis mokymasis", busena: "Mokomasi", xp: 80 },
  { pavadinimas: "SQL duomenų bazės", busena: "Planuojama", xp: 30 },
  { pavadinimas: "Duomenų analizė (Pandas)", busena: "Planuojama", xp: 70 }
];

const busenos = ["Planuojama", "Mokomasi", "Atlikta"];

let igudziai = JSON.parse(localStorage.getItem("igudziai")) || structuredClone(pradiniaiIgudziai);

function piestiKorteles() {
  busenos.forEach(function (busena) {
    document.getElementById(busena.toLowerCase()).innerHTML = "";
  });

  igudziai.forEach(function (igudis) {
    const kortele = document.createElement("div");
    kortele.className = "kanban-kortele";

    const pavadinimas = document.createElement("h4");
    pavadinimas.textContent = igudis.pavadinimas;

    const xp = document.createElement("span");
    xp.className = "kanban-xp";
    xp.textContent = igudis.xp + " XP";

    const pasirinkimas = document.createElement("select");
    busenos.forEach(function (busena) {
      pasirinkimas.add(new Option(busena, busena, false, busena === igudis.busena));
    });
    pasirinkimas.addEventListener("change", function () {
      igudis.busena = pasirinkimas.value;
      atnaujinti();
    });

    kortele.append(pavadinimas, xp, pasirinkimas);
    document.getElementById(igudis.busena.toLowerCase()).append(kortele);
  });
}

function skaiciuotiXP() {
  let suma = 0;
  igudziai.forEach(function (igudis) {
    if (igudis.busena === "Atlikta") suma += igudis.xp;
  });
  return suma;
}

function gautiLygi(xp) {
  if (xp >= 300) return { lygis: 4, rangas: "Profesionalas", nuo: 300, iki: 300 };
  else if (xp >= 150) return { lygis: 3, rangas: "Specialistas", nuo: 150, iki: 300 };
  else if (xp >= 50) return { lygis: 2, rangas: "Praktikantas", nuo: 50, iki: 150 };
  else return { lygis: 1, rangas: "Pradedantysis", nuo: 0, iki: 50 };
}

function atnaujintiProgresa(xp, lygis) {
  let procentai = 100;
  if (lygis.lygis < 4) procentai = (xp - lygis.nuo) / (lygis.iki - lygis.nuo) * 100;

  document.getElementById("xp-suma").textContent = xp;
  document.getElementById("xp-lygis").textContent = lygis.lygis;
  document.getElementById("xp-rangas").textContent = lygis.rangas;
  document.getElementById("xp-juosta").style.width = procentai + "%";

  if (lygis.lygis < 4) {
    document.getElementById("xp-juostos-tekstas").textContent =
      xp + " / " + lygis.iki + " XP iki " + (lygis.lygis + 1) + " lygio (" + Math.round(procentai) + "%)";
  } else {
    document.getElementById("xp-juostos-tekstas").textContent = "Pasiektas maksimalus lygis (100%)";
  }
}

function atnaujintiStatistika() {
  const viso = igudziai.length;
  const atlikta = igudziai.filter(function (igudis) { return igudis.busena === "Atlikta"; }).length;

  document.getElementById("stat-viso").textContent = viso;
  document.getElementById("stat-atlikta").textContent = atlikta;
  document.getElementById("stat-procentai").textContent = Math.round(atlikta / viso * 100) + "%";

  return atlikta;
}

function atnaujintiIkonele(lygis) {
  const ikonele = document.getElementById("vartotojo-ikonele");

  if (lygis === 1) {
    ikonele.src = "assets/img/avataras-1.svg";
  } else if (lygis === 2) {
    ikonele.src = "assets/img/avataras-2.svg";
  } else if (lygis === 3) {
    ikonele.src = "assets/img/avataras-3.svg";
  } else {
    ikonele.src = "assets/img/avataras-4.svg";
  }
}

function atnaujintiPasiekimus(atlikta, lygis) {
  document.getElementById("pasiekimas-atradejas").classList.toggle("atrakintas", atlikta >= 1);
  document.getElementById("pasiekimas-meistras").classList.toggle("atrakintas", atlikta >= 4);
  document.getElementById("pasiekimas-ekspertas").classList.toggle("atrakintas", lygis === 4);
}

function atnaujinti() {
  localStorage.setItem("igudziai", JSON.stringify(igudziai));

  const xp = skaiciuotiXP();
  const lygis = gautiLygi(xp);

  piestiKorteles();
  atnaujintiProgresa(xp, lygis);
  const atlikta = atnaujintiStatistika();
  atnaujintiIkonele(lygis.lygis);
  atnaujintiPasiekimus(atlikta, lygis.lygis);
}

document.getElementById("atstatyti").addEventListener("click", function () {
  localStorage.removeItem("igudziai");
  igudziai = structuredClone(pradiniaiIgudziai);
  atnaujinti();
});

atnaujinti();
