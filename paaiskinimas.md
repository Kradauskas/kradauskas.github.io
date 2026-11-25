# 12 LD – Įgūdžių progreso modulis (paaiškinimas)

## Kas padaryta

**Privaloma dalis**
- Nauja skiltis **„Pažanga“** (`#pazanga`) ir nuoroda navigacijoje (trofėjaus ikonėlė).
- **Skill Kanban** lenta: 3 stulpeliai – Planuojama, Mokomasi, Atlikta.
- 7 įgūdžiai JS masyve (objektai su `pavadinimas`, `busena`, `xp`), XP nuo 20 iki 80, iš viso **350 XP** (≥ 300).
- Kortelės kuriamos **tik su JavaScript** (`createElement`), HTML'e jų nėra.
- Kiekvienoje kortelėje – `select` su 3 būsenomis. Pakeitus kortelė iškart persikelia į kitą stulpelį.
- XP skaičiuojamas tik iš „Atlikta“, lygis ir rangas pagal lentelę, progreso juosta, statistika.
- 4 ikonėlės `assets/img/avataras-1..4.svg`, keičiamos per `if / else`.
- 8 atskiros funkcijos (reikėjo bent 3).

**Papildoma dalis**
- **Local Storage** – būsenos išsaugomos ir po perkrovimo atkuriamos. Jei nieko neišsaugota, imami pradiniai duomenys.
- **3 pasiekimai** – rodomi visada, neatrakinti pilki ir permatomi, atrakinti auksiniai. Jei sąlyga nebetenkinama, vėl užsirakina.
- Papildomai: mygtukas **„Atstatyti pradinę būseną“**, patogu demonstruojant.

## Failai
| Failas | Kas jame |
|---|---|
| `index.html` | nauja skiltis + nuoroda meniu + `<script src="assets/js/skills.js">` |
| `assets/js/skills.js` | visa modulio logika |
| `assets/css/custom.css` | stiliai (failo gale) |
| `assets/img/avataras-1..4.svg` | ikonėlės kiekvienam lygiui |

## Kaip veikia kodas (paprastai)

Visa idėja: **yra vienas masyvas `igudziai` – tai „tiesa“.** Kai kas nors pasikeičia, pakeičiam masyvą ir iškviečiam `atnaujinti()`, kuri viską perpiešia iš naujo.

```
vartotojas pakeičia select'ą
      ↓
igudis.busena = nauja reikšmė
      ↓
atnaujinti()  →  išsaugo į localStorage
              →  piestiKorteles()
              →  skaiciuotiXP() → gautiLygi()
              →  atnaujintiProgresa()
              →  atnaujintiStatistika()
              →  atnaujintiIkonele()
              →  atnaujintiPasiekimus()
```

Funkcijos po vieną:

- **`piestiKorteles()`** – išvalo visus 3 stulpelius ir kiekvienam įgūdžiui sukuria kortelę (`h4` pavadinimas, `span` XP, `select` būsena). Kortelė dedama į stulpelį, kurio `id` sutampa su būsena (`"Atlikta".toLowerCase()` → `#atlikta`).
- **`skaiciuotiXP()`** – sudeda XP tik tų įgūdžių, kurių būsena „Atlikta“.
- **`gautiLygi(xp)`** – `if / else` grandinė: grąžina lygį, rangą ir lygio ribas (`nuo`, `iki`).
- **`atnaujintiProgresa()`** – juostos plotis = `(xp - nuo) / (iki - nuo) * 100`. Pvz. 100 XP → (100-50)/(150-50) = **50%**. 4 lygyje visada 100%.
- **`atnaujintiStatistika()`** – viso, atlikta, procentai (`atlikta / viso * 100`).
- **`atnaujintiIkonele(lygis)`** – `if / else` pakeičia `img.src`.
- **`atnaujintiPasiekimus()`** – `classList.toggle("atrakintas", sąlyga)`: jei sąlyga `true`, klasė uždedama, jei `false`, nuimama. Todėl pasiekimas pats „užsirakina“ atgal.
- **`atnaujinti()`** – viską sujungia.

Local Storage viena eilute:
```js
let igudziai = JSON.parse(localStorage.getItem("igudziai")) || structuredClone(pradiniaiIgudziai);
```
Jei saugykloje nieko nėra, `getItem` grąžina `null`, `JSON.parse(null)` irgi `null`, todėl `||` paima pradinius duomenis.

## Kodėl taip
- **Viskas perpiešiama iš naujo**, o ne kortelė „perkeliama“ rankiniu būdu. Taip neįmanoma, kad ekranas ir duomenys išsiskirtų: mažėjant XP viskas perskaičiuojama lygiai taip pat kaip didėjant.
- **`select`, o ne mygtukai** – leidžia pasirinkti bet kurią iš 3 būsenų vienu paspaudimu.
- **`textContent`, ne `innerHTML`** kortelių tekstui – saugiau, tekstas neinterpretuojamas kaip HTML.
- **`structuredClone`** pradiniams duomenims – kad „Atstatyti“ grąžintų tikrai pradinę būseną (kitaip būtų pakeistas originalus masyvas).

## Įdomios vietos, kurias verta papasakoti dėstytojai
1. **„Vienas duomenų šaltinis“ (single source of truth)** – taip veikia React/Vue: duomenys → vaizdas. Čia tas pats principas, tik be bibliotekų.
2. **`classList.toggle(klasė, sąlyga)`** – antras parametras leidžia viena eilute ir atrakinti, ir užrakinti pasiekimą, be `if`.
3. **`JSON.parse(null) || ...`** gudrybė Local Storage atvejui.
4. **Progreso juostos animacija** – JS tik keičia `width`, o sklandų judėjimą daro CSS `transition: width 0.6s`.
5. **Kortelės „įkritimo“ animacija** – kiekviena naujai sukurta kortelė gauna CSS `@keyframes`, todėl persikėlimas matosi vizualiai.
6. **Ikonėlės** sukurtos su užduotyje nurodytu generatoriumi (getavataaars.com). Personažas „auga“ kartu su lygiu: 1 – juodi marškinėliai, paprasta šypsena; 2 – megztinis su apykakle, šelmiška šypsena; 3 – nupliko, užsiaugino barzdelę, mirkteli; 4 – didelė barzda, akiniai nuo saulės, švarkas – tikras profesionalas.

## Kaip demonstruoti
1. Atidaryti „Pažanga“ – pradžioje 120 XP, 2 lygis „Praktikantas“, juosta 70%.
2. JavaScript → „Atlikta“: 170 XP, 3 lygis, keičiasi ikonėlė, atsirakina „Įgūdžių meistras“ (4 atlikti).
3. Viską į „Atlikta“: 350 XP, 4 lygis, juosta 100%, „Įgūdžių ekspertas“.
4. **F5** – viskas lieka (Local Storage).
5. Python → „Planuojama“: XP sumažėja, lygis krenta, „ekspertas“ vėl užsirakina.
6. „Atstatyti pradinę būseną“.
