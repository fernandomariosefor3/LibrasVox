/**
 * Ícones SVG das Configurações de Mão (CM) da Libras.
 * Cada forma é uma representação simplificada da posição real dos dedos.
 * viewBox="0 0 60 80" — palma na base, dedos apontando para cima.
 */

type Props = {
  cm: string;
  className?: string;
};

export function HandShapeIcon({ cm, className = 'w-20 h-28' }: Props) {
  return (
    <svg
      viewBox="0 0 60 80"
      className={className}
      aria-label={`Configuração de mão ${cm}`}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {shapeFor(cm.toUpperCase())}
    </svg>
  );
}

function shapeFor(cm: string) {
  switch (cm) {
    case 'B': return <CMB />;
    case '5': return <CM5 />;
    case 'A': return <CMA />;
    case 'S': return <CMS />;
    case 'C': return <CMC />;
    case 'O': return <CMO />;
    case 'D': return <CMD />;
    case 'V': return <CMV />;
    case 'L': return <CML />;
    case 'Y': return <CMY />;
    case 'G': return <CMG />;
    case 'F': return <CMF />;
    case 'I': return <CMI />;
    case 'R': return <CMR />;
    case 'W': return <CMW />;
    case 'X': return <CMX />;
    default:  return <CMB />;
  }
}

/* ─── Palma base (reutilizada em todas as CMs) ─────────────────────── */
const Palm = () => <rect x="9" y="43" width="42" height="32" rx="10" />;
const Thumb = ({ angle = 0 }: { angle?: number }) => (
  <rect
    x="2" y="50" width="13" height="24" rx="6.5"
    transform={`rotate(${angle} 8.5 62)`}
  />
);

/* ─── Dedos abertos (B e 5) ─────────────────────────────────────────── */
const FingerOpen = ({ x, y = 0 }: { x: number; y?: number }) => (
  <rect x={x} y={5 + y} width="9" height={38 - y} rx="4.5" />
);
/* Dedo fechado (apenas nó visível na palma) */
const FingerClosed = ({ x }: { x: number }) => (
  <rect x={x} y="40" width="9" height="8" rx="4" />
);

/* ─────────────────── B — aberta, dedos juntos ──────────────────────── */
function CMB() {
  return (
    <>
      <Palm />
      <Thumb angle={-15} />
      <FingerOpen x={10} y={3} />
      <FingerOpen x={21} y={0} />
      <FingerOpen x={32} y={2} />
      <rect x="42" y="10" width="8" height="35" rx="4" />
    </>
  );
}

/* ─────────────────── 5 — aberta, dedos afastados ──────────────────── */
function CM5() {
  return (
    <>
      <Palm />
      {/* Thumb muito aberto */}
      <rect x="0" y="46" width="13" height="22" rx="6.5" transform="rotate(-35 6.5 57)" />
      <FingerOpen x={8} y={2} />
      <FingerOpen x={21} y={0} />
      <FingerOpen x={34} y={1} />
      <FingerOpen x={47} y={5} />
    </>
  );
}

/* ─────────────────── A — punho fechado, polegar ao lado ────────────── */
function CMA() {
  return (
    <>
      {/* Punho */}
      <rect x="8" y="22" width="44" height="52" rx="12" />
      {/* Quatro dedos dobrados visíveis no topo */}
      <rect x="10" y="18" width="9" height="14" rx="4.5" />
      <rect x="21" y="16" width="9" height="14" rx="4.5" />
      <rect x="32" y="17" width="9" height="14" rx="4.5" />
      <rect x="42" y="19" width="8" height="14" rx="4" />
      {/* Polegar ao lado */}
      <rect x="1" y="38" width="13" height="22" rx="6.5" />
    </>
  );
}

/* ─────────────────── S — punho, polegar sobre dedos ───────────────── */
function CMS() {
  return (
    <>
      <rect x="8" y="22" width="44" height="52" rx="12" />
      <rect x="10" y="18" width="9" height="14" rx="4.5" />
      <rect x="21" y="16" width="9" height="14" rx="4.5" />
      <rect x="32" y="17" width="9" height="14" rx="4.5" />
      <rect x="42" y="19" width="8" height="14" rx="4" />
      {/* Polegar cruzado sobre os dedos */}
      <rect x="10" y="30" width="32" height="11" rx="5.5" />
    </>
  );
}

/* ─────────────────── C — dedos curvados em C ──────────────────────── */
function CMC() {
  return (
    <>
      {/* Arco superior (ponta dos dedos) */}
      <path d="M 50 14 Q 55 8 50 2 Q 45 -4 36 2 Q 27 -4 18 2 Q 9 8 8 16" strokeWidth="10" stroke="currentColor" fill="none" strokeLinecap="round" />
      {/* Arco inferior (palma) */}
      <path d="M 8 16 Q 6 28 8 40 Q 10 52 16 58 Q 24 65 32 65 Q 44 65 50 56 Q 56 47 54 40" strokeWidth="10" stroke="currentColor" fill="none" strokeLinecap="round" />
    </>
  );
}

/* ─────────────────── O — dedos em O com polegar ───────────────────── */
function CMO() {
  return (
    <>
      {/* Oval formado pelos dedos */}
      <ellipse cx="30" cy="35" rx="22" ry="28" fill="none" stroke="currentColor" strokeWidth="10" />
    </>
  );
}

/* ─────────────────── D — indicador estendido ──────────────────────── */
function CMD() {
  return (
    <>
      <Palm />
      {/* Indicador estendido */}
      <rect x="20" y="4" width="9" height="42" rx="4.5" />
      {/* Demais dedos fechados */}
      <FingerClosed x={10} />
      <FingerClosed x={31} />
      <FingerClosed x={42} />
      <Thumb angle={-10} />
    </>
  );
}

/* ─────────────────── V — indicador e médio em V ───────────────────── */
function CMV() {
  return (
    <>
      <Palm />
      {/* Indicador */}
      <rect x="14" y="5" width="9" height="42" rx="4.5" transform="rotate(-8 18.5 26)" />
      {/* Médio */}
      <rect x="30" y="5" width="9" height="42" rx="4.5" transform="rotate(8 34.5 26)" />
      {/* Anelar e mínimo fechados */}
      <FingerClosed x={39} />
      <FingerClosed x={8} />
      <Thumb angle={-15} />
    </>
  );
}

/* ─────────────────── L — polegar e indicador em L ─────────────────── */
function CML() {
  return (
    <>
      <Palm />
      {/* Indicador apontando para cima */}
      <rect x="20" y="4" width="9" height="42" rx="4.5" />
      {/* Demais fechados */}
      <FingerClosed x={10} />
      <FingerClosed x={31} />
      <FingerClosed x={42} />
      {/* Polegar estendido horizontalmente para a esquerda */}
      <rect x="0" y="49" width="24" height="11" rx="5.5" />
    </>
  );
}

/* ─────────────────── Y — polegar e mínimo estendidos ──────────────── */
function CMY() {
  return (
    <>
      <Palm />
      {/* Mínimo estendido para cima */}
      <rect x="42" y="8" width="8" height="38" rx="4" />
      {/* Demais fechados */}
      <FingerClosed x={10} />
      <FingerClosed x={21} />
      <FingerClosed x={32} />
      {/* Polegar estendido horizontalmente para esquerda */}
      <rect x="0" y="49" width="24" height="11" rx="5.5" />
    </>
  );
}

/* ─────────────────── G — indicador e polegar horizontais ──────────── */
function CMG() {
  return (
    <>
      <Palm />
      {/* Indicador horizontal para direita */}
      <rect x="25" y="48" width="33" height="10" rx="5" />
      {/* Polegar horizontal para esquerda, paralelo */}
      <rect x="2" y="36" width="30" height="10" rx="5" />
      {/* Demais fechados */}
      <FingerClosed x={10} />
      <FingerClosed x={32} />
      <FingerClosed x={42} />
    </>
  );
}

/* ─────────────────── F — 3 dedos abertos, polegar+indicador tocando ─ */
function CMF() {
  return (
    <>
      <Palm />
      {/* Círculo formado por indicador + polegar */}
      <circle cx="17" cy="54" r="8" fill="none" stroke="currentColor" strokeWidth="5" />
      {/* Médio aberto */}
      <rect x="22" y="6" width="9" height="38" rx="4.5" />
      {/* Anelar aberto */}
      <rect x="33" y="8" width="9" height="36" rx="4.5" />
      {/* Mínimo aberto */}
      <rect x="43" y="12" width="8" height="32" rx="4" />
    </>
  );
}

/* ─────────────────── I — mínimo estendido ──────────────────────────── */
function CMI() {
  return (
    <>
      <Palm />
      <FingerClosed x={10} />
      <FingerClosed x={21} />
      <FingerClosed x={32} />
      {/* Mínimo estendido */}
      <rect x="42" y="8" width="8" height="38" rx="4" />
      {/* Polegar */}
      <Thumb angle={-5} />
    </>
  );
}

/* ─────────────────── R — indicador e médio cruzados ───────────────── */
function CMR() {
  return (
    <>
      <Palm />
      {/* Indicador */}
      <rect x="14" y="5" width="9" height="42" rx="4.5" transform="rotate(10 18.5 26)" />
      {/* Médio cruzado sobre indicador */}
      <rect x="26" y="5" width="9" height="42" rx="4.5" transform="rotate(-10 30.5 26)" />
      <FingerClosed x={38} />
      <FingerClosed x={8} />
      <Thumb angle={-10} />
    </>
  );
}

/* ─────────────────── W — indicador, médio, anelar abertos ─────────── */
function CMW() {
  return (
    <>
      <Palm />
      {/* Três dedos abertos */}
      <rect x="12" y="5" width="9" height="42" rx="4.5" transform="rotate(-6 16.5 26)" />
      <rect x="24" y="4" width="9" height="42" rx="4.5" />
      <rect x="35" y="5" width="9" height="42" rx="4.5" transform="rotate(6 39.5 26)" />
      <FingerClosed x={8} />
      <FingerClosed x={45} />
      <Thumb angle={-15} />
    </>
  );
}

/* ─────────────────── X — indicador dobrado/gancho ─────────────────── */
function CMX() {
  return (
    <>
      <Palm />
      {/* Indicador dobrado em gancho */}
      <path d="M 24 44 L 24 22 Q 24 10 32 8 Q 40 6 40 14" strokeWidth="9" stroke="currentColor" fill="none" strokeLinecap="round" />
      <FingerClosed x={10} />
      <FingerClosed x={32} />
      <FingerClosed x={42} />
      <Thumb angle={-10} />
    </>
  );
}
