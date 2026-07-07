import { useEffect, useState } from "react";
import icono from "../assets/icono.png";

/* ============================================================
   IMÁGENES — pega aquí tus links de Cloudinary.
   Mientras una URL esté vacía (""), esa casilla muestra un
   recordatorio "+ Agrega tu imagen" en su lugar, así sabés
   exactamente qué falta subir. El logo de la portada NO necesita
   nada: ya usa tu archivo assets/icono.png.
   ============================================================ */

// Perfumes Nicho — 1 foto (por ahora solo tenés Xerjoff Erba Pura).
// Si más adelante agregás más marcas de nicho, convertí esto en un
// arreglo (["url1","url2","url3"]) y la diapositiva se acomoda sola.
const IMG_NICHO = "https://res.cloudinary.com/ddk3il6zx/image/upload/v1783461773/Xerjoff_ErbaPura_mbedga.jpg";

// Perfumes de Diseñador — 3 fotos. Sugerencia: Jean Paul Gaultier
// Le Male, Armani Stronger With You Intensely, Dior Sauvage.
const IMG_DISENADOR = ["https://res.cloudinary.com/ddk3il6zx/image/upload/v1781831179/JEAN_PAUL_GAULTIER_LE_MALE_LE_PARFUM_uasgw4.jpg", "https://res.cloudinary.com/ddk3il6zx/image/upload/v1782113134/VALENTINO_UOMO_BORN_IN_ROMA_INTENSE_xgmo9p.jpg", "https://res.cloudinary.com/ddk3il6zx/image/upload/v1781466093/DIOR_SAUVAGE_EDP_ki4zj4.jpg"];

// Perfumes Árabes — 3 fotos. Sugerencia: Rasasi Hawas Ice,
// Afnan 9pm, Lattafa/Armaf estilo "garrafa" (ej. Odyssey).
const IMG_ARABE = ["https://res.cloudinary.com/ddk3il6zx/image/upload/v1781157607/ARMAF_ODYSSEY_MANDARIN_SKY_200ML_mgsul9.jpg", "https://res.cloudinary.com/ddk3il6zx/image/upload/v1781204609/AFNAN_9PM_swqmri.jpg", "https://res.cloudinary.com/ddk3il6zx/image/upload/v1782108353/LATTAFA_QAED_AL_FURSAN_UNTAMED_pu1gsp.jpg"];

// Decant — 1 foto de atomizadores/decants pequeños (5ml/10ml).
const IMG_DECANT = "https://res.cloudinary.com/ddk3il6zx/image/upload/v1783454604/Decants_beqzhx.png";

// Notas del perfume — opcional. Una composición de cítricos,
// flores y maderas/especias (como la pirámide olfativa clásica).
const IMG_NOTAS = "https://res.cloudinary.com/ddk3il6zx/image/upload/v1783454464/Notas_x9bpfb.png";

/* ============================================================ */

function ImgCelda({ src, alt, className }) {
  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      {src ? (
        <img src={src} alt={alt} className="max-h-full max-w-full object-contain" />
      ) : (
        <span className="text-[9px] tracking-[2px] uppercase text-gray-300 text-center px-2">
          + Agrega tu imagen
        </span>
      )}
    </div>
  );
}

function SlidePortada() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-8 py-12">
      <img src={icono} alt="Pura Vida Fragance" className="w-32 md:w-40 mb-8 object-contain" />
      <h3 className="text-3xl md:text-4xl font-light text-[#1B1B1B] tracking-wide mb-3"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Diccionario de la Perfumería
      </h3>
      <p className="text-[11px] tracking-[4px] uppercase text-gray-400">
        Todo lo que debés saber antes de elegir tu fragancia
      </p>
    </div>
  );
}

function ImagenesCategoria({ imagenes, alt, className }) {
  const lista = Array.isArray(imagenes) ? imagenes : [imagenes ?? ""];
  const cols = lista.length === 1 ? "grid-cols-1" : lista.length === 2 ? "grid-cols-2" : "grid-cols-3";
  return (
    <div className={`grid ${cols} gap-px bg-[#EBEBEB] ${className}`}>
      {lista.map((src, i) => (
        <ImgCelda key={i} src={src} alt={`${alt} ${i + 1}`} className="h-full bg-[#FAFAFA]" />
      ))}
    </div>
  );
}

function SlideCategoria({ titulo, bullets, imagenes, alt }) {
  return (
    <div className="h-full grid md:grid-cols-2 gap-10 items-stretch content-stretch px-8 py-10 md:px-14">
      <div className="flex flex-col justify-center">
        <h3 className="text-3xl md:text-4xl font-light text-[#1B1B1B] tracking-wide mb-6"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {titulo}
        </h3>
        <ul className="space-y-2.5">
          {bullets.map((b, i) => (
            <li key={i} className="flex gap-3 text-sm text-gray-600 leading-relaxed">
              <span className="text-[#1B1B1B] mt-0.5 flex-shrink-0">—</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
      <ImagenesCategoria imagenes={imagenes} alt={alt} className="h-64 md:h-full" />
    </div>
  );
}

function SlideDecant() {
  const puntos = [
    "Probar la fragancia en tu propia piel antes de invertir en la botella completa.",
    "Llevar tu perfume favorito de viaje cómodamente.",
    "Coleccionar y conocer variedad de aromas a una fracción de su costo.",
  ];
  return (
    <div className="h-full grid md:grid-cols-2 gap-10 items-stretch content-stretch px-8 py-10 md:px-14">
      <div className="flex flex-col justify-center">
        <h3 className="text-3xl md:text-4xl font-light text-[#1B1B1B] tracking-wide mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Decant
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          Es una cantidad pequeña de perfume original que se trasvasa cuidadosamente
          desde su frasco comercial a un atomizador más pequeño (como decants de 5 ml o 10 ml).
        </p>
        <p className="text-[10px] tracking-[3px] uppercase text-gray-400 mb-3">¿Para qué sirve?</p>
        <ul className="space-y-2.5">
          {puntos.map((b, i) => (
            <li key={i} className="flex gap-3 text-sm text-gray-600 leading-relaxed">
              <span className="text-[#1B1B1B] mt-0.5 flex-shrink-0">—</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
      <ImgCelda src={IMG_DECANT} alt="Decants Pura Vida Fragance" className="h-56 md:h-full bg-[#FAFAFA]" />
    </div>
  );
}

function SlideNotas() {
  const grupos = [
    { label: "Notas de Salida", color: "#E8B33D", texto: "Las primeras impresiones. Duran los primeros minutos tras aplicar el perfume." },
    { label: "Notas de Corazón", color: "#C9527A", texto: "El alma de la fragancia. Definen la familia olfativa y se perciben tras unas horas." },
    { label: "Notas de Fondo", color: "#7A5230", texto: "La base del perfume. Son las esencias más pesadas que fijan el aroma y perduran por días en ropa o piel." },
  ];
  return (
    <div className="h-full grid md:grid-cols-2 gap-10 items-stretch content-stretch px-8 py-10 md:px-14">
      <div className="flex flex-col justify-center">
        <h3 className="text-3xl md:text-4xl font-light text-[#1B1B1B] tracking-wide mb-6"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Notas del Perfume
        </h3>
        <div className="space-y-5">
          {grupos.map((g) => (
            <div key={g.label} className="flex gap-3">
              <div className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: g.color }} />
              <div>
                <p className="text-xs font-medium text-[#1B1B1B] mb-1">{g.label}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{g.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ImgCelda src={IMG_NOTAS} alt="Notas aromáticas" className="h-56 md:h-full bg-[#FAFAFA]" />
    </div>
  );
}

function Botella({ pct, rango, nombreCorto, nombreLargo }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-14 md:w-16 flex flex-col items-center">
        <div className="w-8 md:w-9 h-6 md:h-7 rounded-t-md"
          style={{ background: "linear-gradient(180deg, #C9A876, #8B6F47)" }} />
        <div className="w-3 h-1.5 bg-[#8B6F47]" />
        <div className="relative w-full h-28 md:h-32 border border-[#D8D8D8] bg-[#F5F5F2] rounded-b-md overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0"
            style={{ height: `${pct}%`, background: "linear-gradient(180deg, #F2C879, #D9A24B)" }} />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-1">
            <span className="text-[10px] md:text-[11px] font-semibold text-[#1B1B1B] leading-none">{rango}</span>
            <span className="text-[6px] md:text-[7px] text-gray-500 mt-1 tracking-wide">Concentration</span>
          </div>
        </div>
      </div>
      <div className="text-center">
        <p className="text-[11px] md:text-xs font-medium text-[#1B1B1B]">{nombreCorto}</p>
        <p className="text-[8px] md:text-[9px] text-gray-400">{nombreLargo}</p>
      </div>
    </div>
  );
}

function SlideConcentraciones() {
  const datos = [
    { pct: 65, rango: "20-40%", nombreCorto: "Extrait", nombreLargo: "Extrait De Parfum" },
    { pct: 40, rango: "15-20%", nombreCorto: "EDP", nombreLargo: "Eau De Parfum" },
    { pct: 25, rango: "7-15%", nombreCorto: "EDT", nombreLargo: "Eau De Toilette" },
    { pct: 12, rango: "3-7%", nombreCorto: "Cologne", nombreLargo: "Eau De Cologne" },
    { pct: 5, rango: "1-3%", nombreCorto: "Fraiche", nombreLargo: "Eau De Fraiche" },
  ];
  return (
    <div className="h-full flex flex-col items-center justify-center px-8 py-10 text-center">
      <h3 className="text-3xl md:text-4xl font-light text-[#1B1B1B] tracking-wide mb-10"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Concentraciones de Perfume
      </h3>
      <div className="flex flex-wrap justify-center gap-6 md:gap-10">
        {datos.map(d => <Botella key={d.nombreCorto} {...d} />)}
      </div>
    </div>
  );
}

const slides = [
  <SlidePortada key="portada" />,
  <SlideCategoria key="nicho" titulo="Perfumes Nicho" alt="Perfume nicho"
    bullets={[
      "Exclusividad y propuestas de autor.",
      "Materias primas de altísima calidad y rareza.",
      "Producciones limitadas, no masivas.",
      "Enfoque en la originalidad del aroma sobre las tendencias.",
    ]}
    imagenes={IMG_NICHO} />,
  <SlideCategoria key="disenador" titulo="Perfumes de Diseñador" alt="Perfume de diseñador"
    bullets={[
      "Creados por las casas de moda más reconocidas del mundo.",
      "Pensados para agradar a un público amplio y versátil.",
      "Mayor disponibilidad en el mercado global.",
      "Fórmulas comerciales muy exitosas y populares.",
    ]}
    imagenes={IMG_DISENADOR} />,
  <SlideCategoria key="arabe" titulo="Perfumes Árabes" alt="Perfume árabe"
    bullets={[
      "Excelente relación precio-calidad.",
      "Fórmulas con gran fijación y durabilidad en piel.",
      "Proyección marcada (se hacen notar al caminar).",
      "Inspirados frecuentemente en grandes éxitos de diseñador y nicho.",
    ]}
    imagenes={IMG_ARABE} />,
  <SlideDecant key="decant" />,
  <SlideNotas key="notas" />,
  <SlideConcentraciones key="concentraciones" />,
];

export default function DiccionarioCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = slides.length;

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIndex(i => (i + 1) % total), 6000);
    return () => clearInterval(t);
  }, [paused, total]);

  const ir = (i) => setIndex(((i % total) + total) % total);

  return (
    <section className="max-w-6xl mx-auto px-6 pb-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}>

      <div className="border-t border-[#EBEBEB] pt-16 mb-10">
        <p className="text-[10px] tracking-[5px] uppercase text-gray-500 mb-2">Aprende</p>
        <h2 className="text-4xl font-light text-[#1B1B1B] tracking-wide"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Diccionario de la Perfumería
        </h2>
      </div>

      <div className="relative border border-[#EBEBEB] overflow-hidden h-[380px] md:h-[400px]">
        <div className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}>
          {slides.map((slide, i) => (
            <div key={i} className="w-full h-full flex-shrink-0 overflow-hidden">
              {slide}
            </div>
          ))}
        </div>

        <button onClick={() => ir(index - 1)} aria-label="Anterior"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white/90 border border-[#D0D0D0] hover:border-[#1B1B1B] transition-colors">
          <i className="ti ti-chevron-left text-sm" />
        </button>
        <button onClick={() => ir(index + 1)} aria-label="Siguiente"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white/90 border border-[#D0D0D0] hover:border-[#1B1B1B] transition-colors">
          <i className="ti ti-chevron-right text-sm" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 mt-6">
        {slides.map((_, i) => (
          <button key={i} onClick={() => ir(i)} aria-label={`Ir a la diapositiva ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-[#1B1B1B]" : "w-1.5 bg-[#D0D0D0] hover:bg-[#999]"}`} />
        ))}
      </div>
    </section>
  );
}