// ЭкоБетон v2 — клиентская логика

const DEFAULT_CENTER = [51.1694, 71.4491]; // Астана
const DEFAULT_ZOOM = 6;

const I18N = {
  ru: {
    hero_title: "Бетон, подобранный под ваш грунт",
    hero_text: "Отметьте точку на карте — мы получим реальные данные о почве и климате и рассчитаем состав экобетона с золой-уноса и стеклянной пылью.",
    step1: "Выберите точку", step2: "Узнайте свойства почвы", step3: "Получите состав",
    map_title: "Выберите точку на карте", locate: "Моё местоположение",
    map_hint: "Кликните по карте, чтобы получить данные о почве.",
    sulfate_input: "Сульфаты по лабораторному анализу, мг/кг (необязательно)",
    status: "Выбрана точка", loading: "Загружаем данные о почве и считаем состав… (до 30 секунд)",
    placeholder: "Кликните по карте — здесь появятся результаты.",
    soil_title: "Характеристики почвы", climate_title: "Климат и риски",
    soil_meta: "Данные SoilGrids усреднены по слою 0–100 см (сетка 250 м). Несущая способность — оценка, а не изыскания.",
    mix_title: "Состав экобетона на 1 м³",
    soil_type: "Тип грунта", bearing: "Несущая способность (оценка)", moisture: "Влажность", density: "Плотность сухого грунта",
    ph: "pH", clay: "Глина (<2 мкм)", silt: "Пыль (2–50 мкм)", soil_sand: "Песок (>50 мкм)", organic: "Органика",
    precip: "Осадки за год", aridity: "Индекс аридности (P/ET₀)", ft: "Циклы заморозки–оттаивания", tmin: "Мин. температура за год",
    sulfate_risk: "Риск сульфатной агрессии",
    risk_low: "низкий", risk_moderate: "умеренный", risk_high: "высокий", src_lab: "по анализу", src_est: "оценка",
    st_sand: "Песок", st_sandy_loam: "Супесь", st_loam: "Суглинок", st_clay: "Глина", st_gravelly: "Крупнообломочный грунт", st_peat: "Торф",
    cement: "Цемент", ash: "Зола-унос", glass: "Стеклянная пыль", sand: "Песок", gravel: "Щебень", water: "Вода",
    binder: "Вяжущее, всего", wb: "В/В (вода/вяжущее)", add_total: "Добавки, всего",
    additives: "Рекомендуемые добавки",
    ad_plasticizer: "Суперпластификатор", ad_air: "Воздухововлекающая", ad_waterproof: "Гидроизолирующая", ad_inhibitor: "Ингибитор коррозии",
    class_label: "Класс / марка", strength_label: "Прочность (28 сут, средняя)", durability: "Морозостойкость / водонепроницаемость",
    co2_label: "Экономия CO₂ против чистого цемента",
    u_bear: "кгс/см²", u_dens: "кг/м³", u_sulf: "мг/кг", u_kg: "кг", u_mpa: "МПа", u_mm: "мм", u_c: "°C", u_cyc: "в год", u_co2: "кг CO₂/м³",
    n_soil_weak: "Слабый грунт: принят класс B30, снижено В/В и добавлен суперпластификатор.",
    n_soil_mid: "Грунт средней несущей способности: состав усилен относительно базового (класс B25).",
    n_soil_strong: "Плотный грунт с высокой несущей способностью: допустим облегчённый состав (B20) с большей долей золы и стеклянной пыли.",
    n_wet_very: "Очень влажный грунт: ограничено В/В, добавлена гидроизолирующая добавка, водонепроницаемость W8.",
    n_wet_mid: "Повышенная влажность грунта: добавлена гидроизолирующая добавка, водонепроницаемость W6.",
    n_sulfate_high: "Высокий риск сульфатной агрессии: доля золы-уноса увеличена, В/В ≤ 0,45. Используйте сульфатостойкий цемент (ССПЦ / CEM I-SR).",
    n_sulfate_mod: "Умеренный риск сульфатов: доля золы-уноса увеличена, В/В ≤ 0,50.",
    n_sulfate_est: "Сульфаты оценены косвенно (климат и pH). Для проекта нужен лабораторный анализ грунта и воды — введите результат в поле под картой.",
    n_ph_acid: "Кислая среда (pH < 5,5): добавлен ингибитор коррозии арматуры; проверьте кислотную агрессивность грунтовых вод.",
    n_frost: "Много циклов замораживания–оттаивания ({ft} в год): назначена морозостойкость {f}, добавлен воздухововлекающий агент, общая доля золы и стекла ограничена.",
    n_cold: "Очень холодная зима: при зимнем бетонировании применяйте противоморозные добавки и прогрев — зола и стекло замедляют ранний набор прочности.",
    n_scm: "Замена цемента: зола-унос {a}% и стеклянная пыль {g}% от массы вяжущего.",
    n_scm_quality: "Зола-унос — с потерями при прокаливании не более 5–7 % (ГОСТ 25818); стекло — молоть до < 45 мкм, иначе возможна щелочно-силикатная реакция. Зола и стекло набирают прочность медленнее: ухаживайте за бетоном во влажном состоянии 7–14 суток.",
    w_moisture_estimated: "Спутниковые данные о влажности недоступны — влажность оценена по типу грунта.",
    w_climate_unavailable: "Климатические данные недоступны — риск сульфатов оценён только по pH и глинистости, морозные циклы не учтены.",
    err_bad_coords: "Некорректные координаты.", err_bad_sulfate: "Сульфаты: введите число от 0 до 100000 мг/кг.",
    err_no_soil_data: "Для этой точки нет данных о почве (вода, город, ледник). Выберите другую точку.",
    err_rate_limited: "Сервис SoilGrids временно ограничил запросы. Подождите минуту и повторите.",
    err_upstream_unavailable: "Сервис почвенных данных сейчас недоступен. Повторите позже.",
    err_internal: "Внутренняя ошибка сервера.",
    err_server: "Ошибка сервера",
    err_parse: "Сервер вернул некорректный ответ.",
    err_net: "Не удалось получить данные. Проверьте соединение и повторите попытку.",
    err_map: "Не удалось загрузить карту. Проверьте подключение к интернету.",
    err_geo: "Не удалось определить местоположение. Разрешите доступ или выберите точку на карте.",
    sources: "Источники: SoilGrids (ISRIC) — почва · Open-Meteo — влажность и климат · OpenStreetMap — карта.",
    footer: "ЭкоБетон · Результаты предварительные — перед строительством проверьте их у инженера и в лаборатории.",
  },
  en: {
    hero_title: "Concrete matched to your soil",
    hero_text: "Drop a pin on the map. We fetch real soil and climate data and calculate an eco-concrete mix with fly ash and glass powder.",
    step1: "Pick a point", step2: "See the soil data", step3: "Get the mix",
    map_title: "Pick a point on the map", locate: "My location",
    map_hint: "Click the map to get soil data.",
    sulfate_input: "Sulfates from a lab test, mg/kg (optional)",
    status: "Selected point", loading: "Loading soil data and calculating the mix… (up to 30 seconds)",
    placeholder: "Click the map — results will appear here.",
    soil_title: "Soil properties", climate_title: "Climate and risks",
    soil_meta: "SoilGrids data averaged over 0–100 cm (250 m grid). Bearing capacity is an estimate, not a site survey.",
    mix_title: "Eco-concrete mix per 1 m³",
    soil_type: "Soil type", bearing: "Bearing capacity (estimate)", moisture: "Moisture", density: "Dry soil density",
    ph: "pH", clay: "Clay (<2 µm)", silt: "Silt (2–50 µm)", soil_sand: "Sand (>50 µm)", organic: "Organic matter",
    precip: "Annual precipitation", aridity: "Aridity index (P/ET₀)", ft: "Freeze–thaw cycles", tmin: "Minimum temperature (year)",
    sulfate_risk: "Sulfate attack risk",
    risk_low: "low", risk_moderate: "moderate", risk_high: "high", src_lab: "lab test", src_est: "estimate",
    st_sand: "Sand", st_sandy_loam: "Sandy loam", st_loam: "Loam", st_clay: "Clay", st_gravelly: "Gravelly soil", st_peat: "Peat",
    cement: "Cement", ash: "Fly ash", glass: "Glass powder", sand: "Sand", gravel: "Gravel", water: "Water",
    binder: "Total binder", wb: "Water/binder ratio", add_total: "Additives, total",
    additives: "Recommended additives",
    ad_plasticizer: "Superplasticizer", ad_air: "Air-entraining agent", ad_waterproof: "Waterproofing admixture", ad_inhibitor: "Corrosion inhibitor",
    class_label: "Class / grade", strength_label: "Strength (28 d, mean)", durability: "Frost resistance / water tightness",
    co2_label: "CO₂ saved vs. cement-only concrete",
    u_bear: "kgf/cm²", u_dens: "kg/m³", u_sulf: "mg/kg", u_kg: "kg", u_mpa: "MPa", u_mm: "mm", u_c: "°C", u_cyc: "per year", u_co2: "kg CO₂/m³",
    n_soil_weak: "Weak soil: class B30 selected, lower W/B ratio and a superplasticizer added.",
    n_soil_mid: "Medium bearing capacity: the mix is strengthened versus the baseline (class B25).",
    n_soil_strong: "Dense soil with high bearing capacity: a lighter mix (B20) with more fly ash and glass powder is acceptable.",
    n_wet_very: "Very wet soil: W/B limited, waterproofing admixture added, water tightness W8.",
    n_wet_mid: "Elevated soil moisture: waterproofing admixture added, water tightness W6.",
    n_sulfate_high: "High sulfate attack risk: more fly ash, W/B ≤ 0.45. Use sulfate-resistant cement (SRPC / CEM I-SR).",
    n_sulfate_mod: "Moderate sulfate risk: more fly ash, W/B ≤ 0.50.",
    n_sulfate_est: "Sulfates are estimated indirectly (climate and pH). A lab test of soil and groundwater is needed for design — enter the result in the field under the map.",
    n_ph_acid: "Acidic soil (pH < 5.5): corrosion inhibitor added; check groundwater for acid attack.",
    n_frost: "Many freeze–thaw cycles ({ft} per year): frost grade {f}, air-entraining agent added, total fly ash + glass share limited.",
    n_cold: "Very cold winter: for winter pouring use anti-freeze admixtures and heating — fly ash and glass slow early strength gain.",
    n_scm: "Cement replacement: fly ash {a}% and glass powder {g}% by binder mass.",
    n_scm_quality: "Fly ash should have loss on ignition of at most 5–7 % (GOST 25818 / EN 450); grind glass to < 45 µm, otherwise alkali-silica reaction is possible. Ash and glass gain strength more slowly: moist-cure for 7–14 days.",
    w_moisture_estimated: "Satellite moisture data is unavailable — moisture is estimated from the soil type.",
    w_climate_unavailable: "Climate data is unavailable — sulfate risk is estimated from pH and clay only, freeze–thaw cycles are ignored.",
    err_bad_coords: "Invalid coordinates.", err_bad_sulfate: "Sulfates: enter a number from 0 to 100000 mg/kg.",
    err_no_soil_data: "No soil data for this point (water, city, glacier). Pick another point.",
    err_rate_limited: "SoilGrids temporarily rate-limited requests. Wait a minute and try again.",
    err_upstream_unavailable: "The soil data service is unavailable right now. Try again later.",
    err_internal: "Internal server error.",
    err_server: "Server error",
    err_parse: "The server returned an invalid response.",
    err_net: "Could not get the data. Check your connection and try again.",
    err_map: "Could not load the map. Check your internet connection.",
    err_geo: "Could not get your location. Allow access or pick a point on the map.",
    sources: "Sources: SoilGrids (ISRIC) — soil · Open-Meteo — moisture and climate · OpenStreetMap — map.",
    footer: "EcoBeton · Results are preliminary — have an engineer and a laboratory verify them before building.",
  },
  kk: {
    hero_title: "Топырағыңызға сай таңдалған бетон",
    hero_text: "Картадан нүктені белгілеңіз — біз топырақ пен климаттың нақты деректерін алып, күл мен шыны ұнтағы бар экобетон құрамын есептейміз.",
    step1: "Нүктені таңдаңыз", step2: "Топырақ қасиеттерін біліңіз", step3: "Құрамды алыңыз",
    map_title: "Картадан нүктені таңдаңыз", locate: "Менің орным",
    map_hint: "Топырақ деректерін алу үшін картаны басыңыз.",
    sulfate_input: "Зертханалық талдау бойынша сульфаттар, мг/кг (міндетті емес)",
    status: "Таңдалған нүкте", loading: "Топырақ деректерін жүктеп, құрамды есептеудеміз… (30 секундқа дейін)",
    placeholder: "Картаны басыңыз — нәтиже осында шығады.",
    soil_title: "Топырақ сипаттамалары", climate_title: "Климат және тәуекелдер",
    soil_meta: "SoilGrids деректері 0–100 см қабат бойынша орташаланған (250 м тор). Көтеру қабілеті — болжам, іздестіру емес.",
    mix_title: "1 м³ экобетон құрамы",
    soil_type: "Топырақ түрі", bearing: "Көтеру қабілеті (болжам)", moisture: "Ылғалдылық", density: "Құрғақ топырақ тығыздығы",
    ph: "pH", clay: "Саз (<2 мкм)", silt: "Шаң (2–50 мкм)", soil_sand: "Құм (>50 мкм)", organic: "Органика",
    precip: "Жылдық жауын-шашын", aridity: "Құрғақтық индексі (P/ET₀)", ft: "Қату–еру циклдері", tmin: "Жылдық ең төмен температура",
    sulfate_risk: "Сульфаттық агрессия қаупі",
    risk_low: "төмен", risk_moderate: "орташа", risk_high: "жоғары", src_lab: "талдау бойынша", src_est: "болжам",
    st_sand: "Құм", st_sandy_loam: "Құмайт", st_loam: "Сазды топырақ", st_clay: "Саз", st_gravelly: "Ірі жыныс топырақ", st_peat: "Шымтезек",
    cement: "Цемент", ash: "Ұшпа күл", glass: "Шыны ұнтағы", sand: "Құм", gravel: "Қиыршық тас", water: "Су",
    binder: "Байланыстырғыш, барлығы", wb: "Су/байланыстырғыш", add_total: "Қоспалар, барлығы",
    additives: "Ұсынылатын қоспалар",
    ad_plasticizer: "Суперпластификатор", ad_air: "Ауа тартқыш", ad_waterproof: "Гидроизоляциялық", ad_inhibitor: "Коррозия ингибиторы",
    class_label: "Класы / маркасы", strength_label: "Беріктік (28 тәулік, орташа)", durability: "Аязға төзімділік / су өткізбеушілік",
    co2_label: "Таза цементпен салыстырғанда CO₂ үнемі",
    u_bear: "кгс/см²", u_dens: "кг/м³", u_sulf: "мг/кг", u_kg: "кг", u_mpa: "МПа", u_mm: "мм", u_c: "°C", u_cyc: "жылына", u_co2: "кг CO₂/м³",
    n_soil_weak: "Әлсіз топырақ: B30 класы таңдалды, су/байланыстырғыш азайтылып, суперпластификатор қосылды.",
    n_soil_mid: "Көтеру қабілеті орташа топырақ: құрам базалықпен салыстырғанда күшейтілді (B25 класы).",
    n_soil_strong: "Көтеру қабілеті жоғары тығыз топырақ: күл мен шыны ұнтағының үлесі көбірек жеңілдетілген құрамға (B20) болады.",
    n_wet_very: "Өте ылғалды топырақ: су/байланыстырғыш шектелді, гидроизоляциялық қоспа қосылды, су өткізбеушілік W8.",
    n_wet_mid: "Топырақ ылғалдылығы жоғары: гидроизоляциялық қоспа қосылды, су өткізбеушілік W6.",
    n_sulfate_high: "Сульфаттық агрессия қаупі жоғары: күл үлесі көбейтілді, су/байланыстырғыш ≤ 0,45. Сульфатқа төзімді цемент қолданыңыз.",
    n_sulfate_mod: "Сульфат қаупі орташа: күл үлесі көбейтілді, су/байланыстырғыш ≤ 0,50.",
    n_sulfate_est: "Сульфаттар жанама түрде (климат пен pH) бағаланды. Жоба үшін топырақ пен судың зертханалық талдауы қажет — нәтижені картаның астындағы өріске енгізіңіз.",
    n_ph_acid: "Қышқыл орта (pH < 5,5): арматураның коррозия ингибиторы қосылды; жер асты суының қышқылдық агрессиясын тексеріңіз.",
    n_frost: "Қату–еру циклдері көп (жылына {ft}): аязға төзімділік {f}, ауа тартқыш қосылды, күл мен шыныны жалпы үлесі шектелді.",
    n_cold: "Қыс өте суық: қыста бетондағанда антифриз қоспаларын қолданыңыз және жылытыңыз — күл мен шыны ерте беріктікті баяулатады.",
    n_scm: "Цементті алмастыру: байланыстырғыш массасынан ұшпа күл {a}% және шыны ұнтағы {g}%.",
    n_scm_quality: "Ұшпа күлдің қызу кезіндегі шығыны 5–7 %-дан аспауы тиіс (ГОСТ 25818); шыныны 45 мкм-ден төмен ұнтақтаңыз, әйтпесе сілтілі-силикатты реакция мүмкін. Күл мен шыны беріктікті баяу жинайды: бетонды 7–14 тәулік ылғалды күйде күтіңіз.",
    w_moisture_estimated: "Ылғалдылықтың спутниктік деректері жоқ — ылғалдылық топырақ түрі бойынша бағаланды.",
    w_climate_unavailable: "Климат деректері жоқ — сульфат қаупі тек pH және сазды құрамға қарай бағаланды, қату–еру циклдері ескерілмеді.",
    err_bad_coords: "Координаттар қате.", err_bad_sulfate: "Сульфаттар: 0-ден 100000 мг/кг-ға дейінгі сан енгізіңіз.",
    err_no_soil_data: "Бұл нүкте үшін топырақ деректері жоқ (су, қала, мұздық). Басқа нүктені таңдаңыз.",
    err_rate_limited: "SoilGrids сұраныстарды уақытша шектеді. Бір минут күтіп, қайталаңыз.",
    err_upstream_unavailable: "Топырақ деректері сервисі қазір қолжетімсіз. Кейінірек қайталаңыз.",
    err_internal: "Сервердің ішкі қатесі.",
    err_server: "Сервер қатесі",
    err_parse: "Сервер қате жауап қайтарды.",
    err_net: "Деректерді алу мүмкін болмады. Байланысты тексеріп, қайталап көріңіз.",
    err_map: "Картаны жүктеу мүмкін болмады. Интернет байланысын тексеріңіз.",
    err_geo: "Орныңызды анықтау мүмкін болмады. Рұқсат беріңіз немесе картадан нүкте таңдаңыз.",
    sources: "Дереккөздер: SoilGrids (ISRIC) — топырақ · Open-Meteo — ылғалдылық және климат · OpenStreetMap — карта.",
    footer: "ЭкоБетон · Нәтижелер алдын ала — құрылыстан бұрын инженерге және зертханаға тексертіңіз.",
  },
};

let lang = "ru";
try { lang = localStorage.getItem("lang") || (navigator.language || "ru").slice(0, 2); } catch (e) {}
if (!I18N[lang]) lang = "ru";
const t = (k) => I18N[lang][k] || k;
const fmt = (s, p) => s.replace(/\{(\w+)\}/g, (_, k) => (p && p[k] !== undefined ? p[k] : ""));

const $ = (id) => document.getElementById(id);
const mapStatusEl = $("map-status"), loadingEl = $("loading"), errorBoxEl = $("error-box");
const resultsEl = $("results"), placeholderEl = $("placeholder");

let map, marker, lastPoint = null, lastData = null, lastError = null, reqId = 0;

function applyLang() {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
  document.querySelectorAll(".lang button").forEach((b) => b.classList.toggle("active", b.dataset.lang === lang));
  document.title = "ЭкоБетон — " + t("hero_title");
  if (lastPoint) setStatus(); else mapStatusEl.textContent = t("map_hint");
  if (lastData) renderResults(lastData);
  if (lastError) showError(lastError);
}

function setLang(l) {
  lang = l;
  try { localStorage.setItem("lang", l); } catch (e) {}
  applyLang();
}

function initMap() {
  map = L.map("map").setView(DEFAULT_CENTER, DEFAULT_ZOOM);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);
  map.on("click", (e) => selectPoint(e.latlng.lat, e.latlng.lng));
}

function selectPoint(lat, lng) {
  lastPoint = { lat, lng };
  if (marker) marker.setLatLng([lat, lng]); else marker = L.marker([lat, lng]).addTo(map);
  setStatus();
  fetchAnalysis(lat, lng);
}

function setStatus() {
  mapStatusEl.textContent = `${t("status")}: ${lastPoint.lat.toFixed(5)}, ${lastPoint.lng.toFixed(5)}`;
}

function locateMe() {
  if (!navigator.geolocation) return showError("err_geo");
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      map.setView([latitude, longitude], 12);
      selectPoint(latitude, longitude);
    },
    () => showError("err_geo")
  );
}

function mockAnalysis(lat, lon) {
  // Stable but visibly different values for each selected point. No network requests.
  const seed = Math.abs(Math.floor(lat * 1009 + lon * 9176));
  const soilTypes = ["sand", "sandy_loam", "loam", "clay", "gravelly"];
  const soilType = soilTypes[seed % soilTypes.length];
  const clay = 12 + (seed % 32);
  const silt = 16 + (Math.floor(seed / 7) % 25);
  const sand = 100 - clay - silt;
  const moisture = 9 + (seed % 22);
  const sulfateText = $("sulfate-input").value.trim();
  const sulfateVal = sulfateText === "" ? null : Number(sulfateText);
  const sulfateRisk = sulfateVal === null ? ["low", "moderate", "high"][seed % 3] : sulfateVal > 2000 ? "high" : sulfateVal > 500 ? "moderate" : "low";
  const ashPct = 16 + (seed % 12), glassPct = 6 + (seed % 7), binder = 390;
  const ash = Math.round(binder * ashPct / 100), glass = Math.round(binder * glassPct / 100);
  const cement = binder - ash - glass;
  return {
    soil: { soil_type: soilType, bearing_capacity: +(1.4 + seed % 25 / 10).toFixed(1), moisture, density: 1380 + (seed % 330), ph: +(6.1 + seed % 22 / 10).toFixed(1), organic_matter: +(0.8 + seed % 21 / 10).toFixed(1), clay, silt, sand },
    climate: { precip_mm: 230 + seed % 240, aridity: +(0.3 + seed % 45 / 100).toFixed(2), freeze_thaw_cycles: 30 + seed % 45, tmin: -(18 + seed % 21) },
    sulfate: { risk: sulfateRisk, source: sulfateVal === null ? "estimate" : "lab", mg_kg: sulfateVal },
    mix: { cement_kg: cement, ash_pct: ashPct, ash_kg: ash, glass_pct: glassPct, glass_kg: glass, binder_kg: binder, sand_kg: 610 + seed % 100, gravel_kg: 980 + seed % 130, water_kg: 155 + seed % 30, water_binder_ratio: +( (155 + seed % 30) / binder).toFixed(2), additives: [], additives_total_kg: 0, strength_class: ["B20", "B25", "B30"][seed % 3], estimated_strength_mpa: 26 + seed % 15, frost_grade: "F" + (150 + (seed % 3) * 50), water_grade: "W" + (4 + (seed % 3) * 2), co2_saved_kg: 55 + seed % 45, notes: [] },
    warnings: []
  };
}

function fetchAnalysis(lat, lon) {
  ++reqId;
  const sulfate = $("sulfate-input").value.trim();
  if (sulfate !== "" && (!Number.isFinite(Number(sulfate)) || Number(sulfate) < 0 || Number(sulfate) > 100000)) {
    showError("err_bad_sulfate"); return;
  }
  lastData = mockAnalysis(lat, lon);
  lastError = null;
  renderResults(lastData);
}

function showLoading() {
  lastData = null; lastError = null;
  loadingEl.classList.remove("hidden");
  [errorBoxEl, resultsEl, placeholderEl].forEach((el) => el.classList.add("hidden"));
}

// msg — ключ перевода (t вернёт сам текст, если ключа нет)
function showError(msg) {
  lastError = msg;
  [loadingEl, resultsEl, placeholderEl].forEach((el) => el.classList.add("hidden"));
  errorBoxEl.textContent = `⚠️ ${t(msg)}`;
  errorBoxEl.classList.remove("hidden");
}

function renderResults(data) {
  [loadingEl, errorBoxEl, placeholderEl].forEach((el) => el.classList.add("hidden"));
  const w = $("warnings");
  w.innerHTML = (data.warnings || []).map((k) => `<li>${t("w_" + k)}</li>`).join("");
  w.classList.toggle("hidden", !(data.warnings || []).length);
  renderSoil(data.soil);
  renderClimate(data.climate, data.sulfate);
  renderMix(data.mix);
  resultsEl.classList.remove("hidden");
}

const item = (label, value, cls = "") =>
  `<div class="item"><span class="label">${label}</span><span class="value ${cls}">${value}</span></div>`;

function renderSoil(s) {
  $("soil-grid").innerHTML = [
    item(t("soil_type"), t("st_" + s.soil_type)),
    item(t("bearing"), `≈ ${s.bearing_capacity} ${t("u_bear")}`),
    item(t("moisture"), `${s.moisture} %`),
    item(t("density"), `${s.density} ${t("u_dens")}`),
    item(t("ph"), s.ph),
    item(t("organic"), `${s.organic_matter} %`),
    item(t("clay"), `${s.clay} %`),
    item(t("silt"), `${s.silt} %`),
    item(t("soil_sand"), `${s.sand} %`),
  ].join("");
}

function renderClimate(c, sulfate) {
  const rows = [];
  if (c) {
    rows.push(
      item(t("precip"), `${c.precip_mm} ${t("u_mm")}`),
      item(t("aridity"), c.aridity ?? "—"),
      item(t("ft"), `${c.freeze_thaw_cycles} ${t("u_cyc")}`),
      item(t("tmin"), `${c.tmin} ${t("u_c")}`)
    );
  }
  const src = sulfate.source === "lab" ? `${sulfate.mg_kg} ${t("u_sulf")}, ${t("src_lab")}` : t("src_est");
  rows.push(item(t("sulfate_risk"), `${t("risk_" + sulfate.risk)} <small>(${src})</small>`, "risk-" + sulfate.risk));
  $("climate-grid").innerHTML = rows.join("");
}

function renderMix(m) {
  const kg = t("u_kg");
  $("mix-grid").innerHTML = [
    item(t("cement"), `${m.cement_kg} ${kg}`),
    item(`${t("ash")} (${m.ash_pct}%)`, `${m.ash_kg} ${kg}`),
    item(`${t("glass")} (${m.glass_pct}%)`, `${m.glass_kg} ${kg}`),
    item(t("binder"), `${m.binder_kg} ${kg}`),
    item(t("sand"), `${m.sand_kg} ${kg}`),
    item(t("gravel"), `${m.gravel_kg} ${kg}`),
    item(t("water"), `${m.water_kg} ${kg}`),
    item(t("wb"), m.water_binder_ratio),
  ].join("");

  // Слои-«образец»: доля каждого компонента по массе
  const parts = [
    [t("gravel"), m.gravel_kg, "#b7bcb6"],
    [t("sand"), m.sand_kg, "#e4d8b8"],
    [t("cement"), m.cement_kg, "#8d8a7e"],
    [t("ash"), m.ash_kg, "#5f6b73"],
    [t("glass"), m.glass_kg, "#9ad0c2"],
    [t("water"), m.water_kg, "#8fc3d6"],
  ];
  const total = parts.reduce((a, p) => a + Number(p[1] || 0), 0) || 1;
  $("strata").innerHTML = parts
    .map((p) => `<span style="flex-basis:${(p[1] / total) * 100}%;background:${p[2]}"></span>`)
    .join("");
  $("legend").innerHTML = parts
    .map((p) => `<li><i style="background:${p[2]}"></i>${p[0]} ${Math.round((p[1] / total) * 100)}%</li>`)
    .join("");

  const ads = m.additives || [];
  $("additives-block").innerHTML = ads.length
    ? `<h3>${t("additives")} — ${m.additives_total_kg} ${kg}</h3><ul class="additives-list">${ads
        .map((a) => `<li>${t("ad_" + a.code)}: ${a.kg} ${kg}</li>`)
        .join("")}</ul>`
    : "";

  $("strength-class").textContent = m.strength_class;
  $("strength-value").textContent = `${m.estimated_strength_mpa} ${t("u_mpa")}`;
  $("durability-value").textContent = `${m.frost_grade} / ${m.water_grade}`;
  $("co2-value").textContent = `${m.co2_saved_kg} ${t("u_co2")}`;
  $("notes-list").innerHTML = (m.notes || []).map((n) => `<li>${fmt(t("n_" + n.code), n.params)}</li>`).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".lang button").forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));
  $("locate-btn").addEventListener("click", locateMe);
  // при вводе лабораторных сульфатов — пересчитать текущую точку
  $("sulfate-input").addEventListener("change", () => { if (lastPoint) fetchAnalysis(lastPoint.lat, lastPoint.lng); });
  applyLang();
  try { initMap(); } catch (err) { showError("err_map"); }
});

// Clearly identify generated values regardless of selected language.
const originalApplyLang = applyLang;
applyLang = function () {
  originalApplyLang();
  const messages = {
    ru: ["ДЕМО · Синтетические данные, не для строительства", "Выберите точку на карте — мгновенно покажем пример характеристик грунта, климата и состава экобетона.", "Демонстрационные показатели созданы программно и не являются результатами исследований.", "Источник карты: OpenStreetMap. Все показатели грунта, климата и смеси — синтетические демонстрационные значения."],
    kk: ["ДЕМО · Жасанды деректер, құрылысқа қолдануға болмайды", "Картадан нүкте таңдаңыз — топырақ, климат және экобетон құрамының үлгісі бірден көрсетіледі.", "Бұл көрсеткіштер бағдарламалық түрде жасалған және зерттеу нәтижелері емес.", "Карта дереккөзі: OpenStreetMap. Топырақ, климат және қоспа мәндері — жасанды демо деректер."],
    en: ["DEMO · Synthetic data, not for construction", "Select a map point to instantly see example soil, climate and eco-concrete values.", "These values are generated examples, not field or laboratory measurements.", "Map source: OpenStreetMap. All soil, climate and mix values are synthetic demonstration data."]
  };
  const m = messages[lang] || messages.ru;
  $("demo-notice").textContent = m[0];
  document.querySelector('[data-i18n="hero_text"]').textContent = m[1];
  document.querySelector('[data-i18n="soil_meta"]').textContent = m[2];
  document.querySelector('[data-i18n="sources"]').textContent = m[3];
};
