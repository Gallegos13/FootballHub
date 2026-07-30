import { useState, useRef, useEffect, useMemo } from "react";
import { Lock, ShieldCheck, CheckCircle2, XCircle, RotateCcw } from "lucide-react";

function onlyDigits(v) {
  return v.replace(/\D/g, "");
}

function detectBrand(digits) {
  if (/^4/.test(digits)) return "visa";
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(digits)) return "mastercard";
  if (/^3[47]/.test(digits)) return "amex";
  if (/^6(011|5)/.test(digits)) return "discover";
  return "generic";
}

const BRAND_META = {
  visa: { label: "Visa", groups: [4, 4, 4, 4], cvvLen: 3 },
  mastercard: { label: "Mastercard", groups: [4, 4, 4, 4], cvvLen: 3 },
  amex: { label: "American Express", groups: [4, 6, 5], cvvLen: 4 },
  discover: { label: "Discover", groups: [4, 4, 4, 4], cvvLen: 3 },
  generic: { label: "Tarjeta", groups: [4, 4, 4, 4], cvvLen: 3 },
};

function formatCardNumber(digits, brand) {
  const groups = BRAND_META[brand].groups;
  let out = [];
  let i = 0;
  for (const g of groups) {
    const chunk = digits.slice(i, i + g);
    if (!chunk) break;
    out.push(chunk);
    i += g;
  }
  return out.join(" ");
}

function luhnValid(digits) {
  if (digits.length < 12) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

function formatExpiry(raw) {
  const d = onlyDigits(raw).slice(0, 4);
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
}

function expiryValid(raw) {
  const m = raw.match(/^(\d{2})\/(\d{2})$/);
  if (!m) return false;
  const month = parseInt(m[1], 10);
  const year = 2000 + parseInt(m[2], 10);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const expDate = new Date(year, month, 0, 23, 59, 59);
  return expDate >= now;
}

function randomId(prefix) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 10; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `${prefix}-${s}`;
}

const PROCESSING_STEPS = [
  "Validando datos de la tarjeta",
  "Conectando con el banco emisor",
  "Confirmando la transacción",
];

export default function Pasarela({ productName, amount, currency, onSuccess }) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [focused, setFocused] = useState(null);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [result, setResult] = useState(null);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const digits = onlyDigits(cardNumber);
  const brand = detectBrand(digits);
  const meta = BRAND_META[brand];

  const errors = useMemo(() => {
    const e = {};
    if (touched.cardNumber) {
      if (!digits) e.cardNumber = "Ingresa el número de tarjeta";
      else if (digits.length < 12 || !luhnValid(digits)) e.cardNumber = "Número de tarjeta inválido";
    }
    if (touched.cardName && !cardName.trim()) e.cardName = "Ingresa el nombre del titular";
    if (touched.expiry) {
      if (!expiry) e.expiry = "Ingresa la vigencia";
      else if (!expiryValid(expiry)) e.expiry = "Fecha inválida o vencida";
    }
    if (touched.cvv) {
      if (!cvv) e.cvv = "Ingresa el CVV";
      else if (cvv.length < meta.cvvLen) e.cvv = `Debe tener ${meta.cvvLen} dígitos`;
    }
    return e;
  }, [touched, digits, cardName, expiry, cvv, meta.cvvLen]);

  const isValid =
    digits.length >= 12 &&
    luhnValid(digits) &&
    cardName.trim().length > 1 &&
    expiryValid(expiry) &&
    cvv.length === meta.cvvLen;

  function markAllTouched() {
    setTouched({ cardNumber: true, cardName: true, expiry: true, cvv: true });
  }

  function handleSubmit(e) {
    e.preventDefault();
    markAllTouched();
    if (!isValid || status === "processing") return;

    setStatus("processing");
    setStepIndex(0);

    PROCESSING_STEPS.forEach((_, i) => {
      const t = setTimeout(() => setStepIndex(i), i * 750);
      timers.current.push(t);
    });

    const finalT = setTimeout(() => {
      const last4 = digits.slice(-4);
      let outcome = { ok: true, reason: null };
      if (last4 === "0002") outcome = { ok: false, reason: "Fondos insuficientes" };
      else if (last4 === "0069") outcome = { ok: false, reason: "La tarjeta ha expirado" };
      else if (last4 === "0127") outcome = { ok: false, reason: "Código de seguridad incorrecto" };

      if (outcome.ok) {
        setStatus("success");
        const tx = {
          id: randomId("BV"),
          date: new Date(),
          last4,
          brand: meta.label,
          amount,
        };
        setResult(tx);
      } else {
        setStatus("declined");
        setResult({ reason: outcome.reason });
      }
    }, PROCESSING_STEPS.length * 750 + 500);
    timers.current.push(finalT);
  }

  function resetForm() {
    setCardNumber("");
    setCardName("");
    setExpiry("");
    setCvv("");
    setTouched({});
    setStatus("idle");
    setResult(null);
    setFocused(null);
  }

  const handleSuccessContinue = () => {
    if (onSuccess && result) {
      onSuccess(result);
    }
  };

  return (
    <div className="bv-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap');

        .bv-root {
          --bg: #020617;
          --panel: #0f172a;
          --panel-2: #0a0f1e;
          --border: #1e293b;
          --text: #e2e8f0;
          --text-dim: #94a3b8;
          --accent: #2563eb;
          --accent-soft: #2563eb33;
          --teal: #2563eb;
          --success: #3b82f6;
          --danger: #f87171;
          font-family: 'Inter', sans-serif;
          color: var(--text);
          min-height: 100%;
          width: 100%;
          padding: 44px 20px;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          position: relative;
          isolation: isolate;
          overflow-x: hidden;
          background:
            radial-gradient(680px 420px at 18% 0%, rgba(37,99,235,0.15), transparent 60%),
            radial-gradient(900px 560px at 100% 100%, rgba(37,99,235,0.10), transparent 55%),
            var(--bg);
        }
        .bv-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 34px 34px;
          -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 20%, black, transparent 75%);
          mask-image: radial-gradient(ellipse 70% 60% at 50% 20%, black, transparent 75%);
          pointer-events: none;
          z-index: 0;
        }
        .bv-root *:focus-visible {
          outline: 2px solid var(--teal);
          outline-offset: 2px;
        }
        @media (prefers-reduced-motion: reduce) {
          .bv-root * { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
        }
        .bv-root * { box-sizing: border-box; }
        @keyframes bvRise {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .bv-shell {
          width: 100%;
          max-width: 920px;
        }
        .bv-brand {
          display: flex;
          align-items: center;
          gap: 11px;
          margin-bottom: 30px;
          animation: bvRise 0.5s ease both;
        }
        .bv-brand-mark {
          width: 32px; height: 32px;
          border-radius: 9px;
          background: linear-gradient(150deg, #3b82f6, var(--accent) 45%, #1d4ed8);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 3px 14px var(--accent-soft), inset 0 1px 0 rgba(255,255,255,0.35);
          position: relative;
          overflow: hidden;
        }
        .bv-brand-mark::after {
          content: '';
          position: absolute;
          top: -50%; left: -20%;
          width: 40%; height: 200%;
          background: rgba(255,255,255,0.35);
          transform: rotate(20deg);
        }
        .bv-brand-name {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 19px;
          letter-spacing: 0.01em;
        }
        .bv-brand-tag {
          color: var(--text-dim);
          font-size: 12px;
          margin-left: 2px;
          padding-top: 1px;
        }
        .bv-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 28px;
        }
        @media (min-width: 760px) {
          .bv-grid { grid-template-columns: 380px 1fr; }
        }
        @media (max-width: 480px) {
          .bv-root { padding: 24px 12px; }
          .bv-panel { padding: 20px 16px; }
          .bv-brand { margin-bottom: 20px; }
          .bv-brand-name { font-size: 17px; }
          .bv-card-face { padding: 16px; }
          .bv-order-amount { font-size: 18px; }
        }

        .bv-card-stage {
          perspective: 1400px;
          margin-bottom: 20px;
          position: relative;
        }
        .bv-dial {
          position: absolute;
          top: 50%; left: 50%;
          width: 150%;
          transform: translate(-50%, -50%);
          opacity: 0.5;
          pointer-events: none;
          z-index: 0;
        }
        .bv-card-3d {
          position: relative;
          z-index: 1;
          width: 100%;
          aspect-ratio: 1.586;
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(.2,.8,.2,1);
          animation: bvRise 0.6s 0.05s cubic-bezier(.2,.8,.2,1) both;
        }
        .bv-card-3d.flipped { transform: rotateY(180deg); }
        .bv-card-3d:not(.flipped):hover { transform: rotateY(0deg) rotateX(3deg) rotateY(-4deg) translateY(-2px); }
        .bv-card-face {
          position: absolute; inset: 0;
          border-radius: 16px;
          backface-visibility: hidden;
          background: linear-gradient(150deg, #2b3244 0%, #454e66 55%, #2b3244 100%);
          border: 1px solid #4a5468;
          box-shadow: 0 22px 44px -18px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.06);
          padding: 22px 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
        }
        .bv-card-face::before {
          content: '';
          position: absolute;
          top: -60%; left: -20%;
          width: 140%; height: 140%;
          background: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.08), transparent 55%);
          pointer-events: none;
        }
        .bv-card-face::after {
          content: '';
          position: absolute;
          top: -120%; left: -60%;
          width: 45%; height: 340%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent);
          transform: rotate(20deg);
          transition: transform 1.1s ease;
          pointer-events: none;
        }
        .bv-card-3d:not(.flipped):hover .bv-card-face::after { transform: rotate(20deg) translateX(260%); }
        .bv-card-top { display: flex; justify-content: space-between; align-items: flex-start; }
        .bv-chip {
          width: 44px; height: 34px;
          filter: drop-shadow(0 2px 3px rgba(0,0,0,0.35));
          position: relative;
          overflow: visible;
        }
        .bv-chip-shine {
          transform: translateX(-60%);
          transition: transform 1.1s ease;
        }
        .bv-card-3d:not(.flipped):hover .bv-chip-shine { transform: translateX(60%); }
        .bv-card-brand {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600;
          font-size: 13px;
          color: #f3f1ea;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          opacity: 0.9;
        }
        .bv-card-number {
          font-family: 'JetBrains Mono', monospace;
          font-size: clamp(16px, 4.6vw, 21px);
          letter-spacing: 0.08em;
          color: #f6f4ee;
          text-shadow: 0 1px 1px rgba(0,0,0,0.3);
          min-height: 26px;
          transition: text-shadow 0.25s;
          width: fit-content;
        }
        .bv-card-number.active,
        .bv-card-value.active {
          text-shadow: 0 0 14px rgba(242,169,59,0.55), 0 1px 1px rgba(0,0,0,0.3);
        }
        .bv-card-value {
          transition: text-shadow 0.25s;
          width: fit-content;
        }
        .bv-card-bottom { display: flex; justify-content: space-between; align-items: flex-end; }
        .bv-card-label {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #b9c0d1;
          margin-bottom: 4px;
        }
        .bv-card-value {
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          color: #f3f1ea;
          text-transform: uppercase;
        }
        .bv-card-back {
          transform: rotateY(180deg);
          background: linear-gradient(150deg, #2b3244 0%, #454e66 55%, #2b3244 100%);
          padding: 0;
        }
        .bv-back-strip {
          height: 42px;
          background: #0d1017;
          margin-top: 22px;
        }
        .bv-back-cvv-row {
          margin: 22px 24px 0;
          display: flex;
          justify-content: flex-end;
        }
        .bv-back-cvv-box {
          background: #f3f1ea;
          border-radius: 4px;
          padding: 8px 14px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          letter-spacing: 0.2em;
          color: #1a1a1a;
          min-width: 60px;
          text-align: right;
        }
        .bv-back-note {
          margin: 16px 24px;
          font-size: 9px;
          color: #b9c0d1;
          line-height: 1.5;
        }

        .bv-sandbox-note {
          background: var(--panel-2);
          border: 1px dashed var(--border);
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 12px;
          color: var(--text-dim);
          line-height: 1.6;
          animation: bvRise 0.6s 0.15s cubic-bezier(.2,.8,.2,1) both;
        }
        .bv-sandbox-note code {
          color: #3b82f6;
          font-family: 'JetBrains Mono', monospace;
        }

        .bv-panel {
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 18px;
          padding: 28px;
          box-shadow: 0 30px 60px -30px rgba(0,0,0,0.6);
          animation: bvRise 0.6s 0.1s cubic-bezier(.2,.8,.2,1) both;
        }
        .bv-order-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 18px;
          margin-bottom: 22px;
          border-bottom: 1px solid var(--border);
        }
        .bv-order-name { font-size: 14px; color: var(--text-dim); }
        .bv-order-amount {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 22px;
          font-weight: 700;
        }
        .bv-field { margin-bottom: 16px; }
        .bv-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .bv-label {
          display: block;
          font-size: 12px;
          color: var(--text-dim);
          margin-bottom: 6px;
        }
        .bv-input {
          width: 100%;
          background: var(--panel-2);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 12px 14px;
          color: var(--text);
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
        }
        .bv-input::placeholder { color: #4d5567; }
        .bv-input:hover { border-color: #303952; }
        .bv-input.mono { font-family: 'JetBrains Mono', monospace; letter-spacing: 0.04em; }
        .bv-input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-soft);
        }
        .bv-input.error { border-color: var(--danger); }
        .bv-error-text { font-size: 11px; color: var(--danger); margin-top: 5px; }
        .bv-submit {
          width: 100%;
          margin-top: 8px;
          background: #1d4ed8;
          color: #ffffff;
          border: none;
          border-radius: 12px;
          padding: 14px;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          position: relative;
          overflow: hidden;
          isolation: isolate;
          transition: all 0.15s, transform 0.1s;
          box-shadow: 0 4px 14px rgba(29,78,216,0.3);
        }
        .bv-submit:hover:not(:disabled) { background: #1e3a8a; transform: scale(1.01); box-shadow: 0 6px 20px rgba(29,78,216,0.4); }
        .bv-submit:active:not(:disabled) { transform: scale(0.99); }
        .bv-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          filter: none;
          box-shadow: none;
        }
        .bv-secure-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 11px;
          color: var(--text-dim);
          margin-top: 14px;
        }

        .bv-status-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 30px 10px;
          min-height: 260px;
        }
        .bv-steps { margin-top: 22px; width: 100%; max-width: 280px; text-align: left; }
        @keyframes bvDial {
          0% { transform: rotate(0deg); }
          40% { transform: rotate(300deg); }
          60% { transform: rotate(260deg); }
          100% { transform: rotate(620deg); }
        }
        .bv-dial-spin {
          width: 56px; height: 56px;
          border-radius: 50%;
          border: 2px solid var(--border);
          border-top-color: var(--accent);
          border-right-color: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: bvDial 2.2s cubic-bezier(.5,.05,.5,.95) infinite;
        }
        .bv-step {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: var(--text-dim);
          padding: 6px 0;
          transition: color 0.3s;
        }
        .bv-step.active { color: var(--text); }
        .bv-step.done { color: var(--success); }
        .bv-step-dot {
          width: 15px; height: 15px;
          border-radius: 50%;
          background: var(--border);
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s;
        }
        .bv-step.active .bv-step-dot { background: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }
        .bv-step.done .bv-step-dot { background: var(--success); }
        @keyframes bvPop {
          0% { opacity: 0; transform: scale(0.6) rotate(-6deg); }
          60% { opacity: 1; transform: scale(1.08) rotate(-6deg); }
          100% { opacity: 1; transform: scale(1) rotate(-6deg); }
        }
        .bv-stamp {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 0.14em;
          padding: 6px 14px;
          border-radius: 6px;
          border: 2px solid currentColor;
          margin-bottom: 4px;
          display: inline-block;
          transform: rotate(-6deg);
          animation: bvPop 0.5s cubic-bezier(.3,1.4,.4,1) both;
        }
        .bv-stamp.ok { color: var(--success); }
        .bv-stamp.no { color: var(--danger); }
        .bv-result-icon { animation: bvPop 0.45s cubic-bezier(.3,1.4,.4,1) both; }
        .bv-result-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 20px;
          font-weight: 700;
          margin: 14px 0 6px;
        }
        .bv-result-sub { color: var(--text-dim); font-size: 13px; max-width: 300px; }
        .bv-receipt {
          margin-top: 22px;
          width: 100%;
          max-width: 320px;
          background: var(--panel-2);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px 18px 14px;
          text-align: left;
          animation: bvRise 0.5s 0.1s ease both;
          position: relative;
        }
        .bv-receipt::after {
          content: '';
          position: absolute;
          left: 14px; right: 14px; bottom: -1px;
          height: 1px;
          background-image: linear-gradient(90deg, var(--border) 60%, transparent 0%);
          background-size: 8px 1px;
          background-repeat: repeat-x;
        }
        .bv-receipt-row {
          display: flex;
          justify-content: space-between;
          font-size: 12.5px;
          padding: 7px 2px;
          border-bottom: 1px dashed var(--border);
          color: var(--text-dim);
          border-radius: 5px;
          transition: background 0.15s;
        }
        .bv-receipt-row:hover { background: rgba(255,255,255,0.03); }
        .bv-receipt-row:last-child { border-bottom: none; }
        .bv-receipt-row b { color: var(--text); font-weight: 600; }
        .bv-again {
          margin-top: 20px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: 1px solid var(--border);
          color: var(--text-dim);
          padding: 9px 16px;
          border-radius: 8px;
          font-size: 13px;
          cursor: pointer;
        }
        .bv-again:hover { color: var(--text); border-color: var(--text-dim); }
        @media (max-width: 380px) {
          .bv-root { padding: 28px 14px; }
          .bv-panel { padding: 20px; }
          .bv-field-row { grid-template-columns: 1fr; gap: 16px; }
          .bv-receipt { max-width: 100%; }
          .bv-status-wrap { padding: 20px 8px; min-height: 220px; }
          .bv-result-title { font-size: 17px; }
        }
      `}</style>

      <div className="bv-shell">
        <div className="bv-brand">
          <div className="bv-brand-mark">
            <Lock size={15} color="#ffffff" strokeWidth={2.5} />
          </div>
          <span className="bv-brand-name">Bóveda Pay</span>
          <span className="bv-brand-tag">· pasarela simulada</span>
        </div>

        <div className="bv-grid">
          <div>
            <div className="bv-card-stage">
              <svg className="bv-dial" viewBox="0 0 200 200" fill="none">
                <circle cx="100" cy="100" r="98" stroke="#2563eb" strokeOpacity="0.15" />
                <circle cx="100" cy="100" r="80" stroke="#2563eb" strokeOpacity="0.12" />
                <circle cx="100" cy="100" r="4" fill="#2563eb" fillOpacity="0.25" />
                {Array.from({ length: 24 }).map((_, i) => {
                  const angle = (i / 24) * Math.PI * 2;
                  const r1 = 88, r2 = i % 6 === 0 ? 78 : 84;
                  const x1 = 100 + r1 * Math.cos(angle);
                  const y1 = 100 + r1 * Math.sin(angle);
                  const x2 = 100 + r2 * Math.cos(angle);
                  const y2 = 100 + r2 * Math.sin(angle);
                  return (
                    <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2563eb" strokeOpacity="0.18" strokeWidth="1.5" />
                  );
                })}
              </svg>
              <div className={`bv-card-3d ${focused === "cvv" ? "flipped" : ""}`}>
                <div className="bv-card-face">
                  <div className="bv-card-top">
                    <svg className="bv-chip" viewBox="0 0 44 34" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="chipBody" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#eeddab" />
                          <stop offset="100%" stopColor="#b9924a" />
                        </linearGradient>
                        <clipPath id="chipClip">
                          <rect x="0.5" y="0.5" width="43" height="33" rx="7" />
                        </clipPath>
                      </defs>
                      <rect x="0.5" y="0.5" width="43" height="33" rx="7" fill="url(#chipBody)" stroke="#00000040" />
                      <g clipPath="url(#chipClip)" opacity="0.55">
                        <line x1="15" y1="0.5" x2="15" y2="33.5" stroke="#00000030" strokeWidth="0.75" />
                        <line x1="29" y1="0.5" x2="29" y2="33.5" stroke="#00000030" strokeWidth="0.75" />
                        <line x1="0.5" y1="17" x2="43.5" y2="17" stroke="#00000030" strokeWidth="0.75" />
                        <rect className="bv-chip-shine" x="-30" y="-10" width="12" height="60" fill="rgba(255,255,255,0.5)" transform="rotate(24 22 17)" />
                      </g>
                    </svg>
                    <span className="bv-card-brand">{digits ? meta.label : "Bóveda"}</span>
                  </div>
                  <div className={`bv-card-number ${focused === "cardNumber" ? "active" : ""}`}>
                    {cardNumber ? formatCardNumber(digits, brand) : "•••• •••• •••• ••••"}
                  </div>
                  <div className="bv-card-bottom">
                    <div>
                      <div className="bv-card-label">Titular</div>
                      <div className={`bv-card-value ${focused === "cardName" ? "active" : ""}`}>
                        {cardName || "NOMBRE APELLIDO"}
                      </div>
                    </div>
                    <div>
                      <div className="bv-card-label">Vigencia</div>
                      <div className={`bv-card-value ${focused === "expiry" ? "active" : ""}`}>
                        {expiry || "MM/AA"}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bv-card-face bv-card-back">
                  <div className="bv-back-strip" />
                  <div className="bv-back-cvv-row">
                    <div className="bv-back-cvv-box">{cvv || "•••"}</div>
                  </div>
                  <div className="bv-back-note">
                    Esta tarjeta es parte de una simulación y no está vinculada a ninguna cuenta bancaria real.
                  </div>
                </div>
              </div>
            </div>

            <div className="bv-sandbox-note">
              Entorno de pruebas. Cualquier número de tarjeta válido funciona.
              Termina en <code>0002</code> para fondos insuficientes, <code>0069</code> para tarjeta
              vencida, <code>0127</code> para CVV incorrecto — cualquier otro final aprueba el pago.
            </div>
          </div>

          <div className="bv-panel">
            {status === "idle" && (
              <>
                <div className="bv-order-row">
                  <span className="bv-order-name">{productName}</span>
                  <span className="bv-order-amount">
                    ${Number(amount).toLocaleString("es-MX")} {currency}
                  </span>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="bv-field">
                    <label className="bv-label">Número de tarjeta</label>
                    <input
                      className={`bv-input mono ${errors.cardNumber ? "error" : ""}`}
                      inputMode="numeric"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      maxLength={brand === "amex" ? 17 : 19}
                      onFocus={() => setFocused("cardNumber")}
                      onBlur={() => { setFocused(null); setTouched(t => ({ ...t, cardNumber: true })); }}
                      onChange={(e) => {
                        const d = onlyDigits(e.target.value).slice(0, brand === "amex" ? 15 : 16);
                        setCardNumber(formatCardNumber(d, detectBrand(d)));
                      }}
                    />
                    {errors.cardNumber && <div className="bv-error-text">{errors.cardNumber}</div>}
                  </div>

                  <div className="bv-field">
                    <label className="bv-label">Nombre del titular</label>
                    <input
                      className={`bv-input ${errors.cardName ? "error" : ""}`}
                      placeholder="Como aparece en la tarjeta"
                      value={cardName}
                      onFocus={() => setFocused("cardName")}
                      onBlur={() => { setFocused(null); setTouched(t => ({ ...t, cardName: true })); }}
                      onChange={(e) => setCardName(e.target.value.toUpperCase().slice(0, 26))}
                    />
                    {errors.cardName && <div className="bv-error-text">{errors.cardName}</div>}
                  </div>

                  <div className="bv-field-row">
                    <div className="bv-field">
                      <label className="bv-label">Vigencia</label>
                      <input
                        className={`bv-input mono ${errors.expiry ? "error" : ""}`}
                        inputMode="numeric"
                        placeholder="MM/AA"
                        value={expiry}
                        maxLength={5}
                        onFocus={() => setFocused("expiry")}
                        onBlur={() => { setFocused(null); setTouched(t => ({ ...t, expiry: true })); }}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      />
                      {errors.expiry && <div className="bv-error-text">{errors.expiry}</div>}
                    </div>
                    <div className="bv-field">
                      <label className="bv-label">CVV</label>
                      <input
                        className={`bv-input mono ${errors.cvv ? "error" : ""}`}
                        inputMode="numeric"
                        placeholder={meta.cvvLen === 4 ? "1234" : "123"}
                        value={cvv}
                        maxLength={meta.cvvLen}
                        onFocus={() => setFocused("cvv")}
                        onBlur={() => { setFocused(null); setTouched(t => ({ ...t, cvv: true })); }}
                        onChange={(e) => setCvv(onlyDigits(e.target.value).slice(0, meta.cvvLen))}
                      />
                      {errors.cvv && <div className="bv-error-text">{errors.cvv}</div>}
                    </div>
                  </div>

                  <button className="bv-submit" type="submit" disabled={status === "processing"}>
                    <Lock size={14} />
                    Pagar ${Number(amount).toLocaleString("es-MX")} {currency}
                  </button>
                  <div className="bv-secure-note">
                    <ShieldCheck size={13} />
                    Simulación cifrada — no se procesan pagos reales
                  </div>
                </form>
              </>
            )}

            {status === "processing" && (
              <div className="bv-status-wrap">
                <div className="bv-dial-spin">
                  <Lock size={18} color="#2563eb" strokeWidth={2.2} />
                </div>
                <div className="bv-result-title">Procesando pago</div>
                <div className="bv-result-sub">Esto puede tardar unos segundos.</div>
                <div className="bv-steps">
                  {PROCESSING_STEPS.map((s, i) => {
                    const state = i < stepIndex ? "done" : i === stepIndex ? "active" : "";
                    return (
                      <div key={s} className={`bv-step ${state}`}>
                        <span className="bv-step-dot">
                          {state === "done" && <CheckCircle2 size={11} color="var(--panel)" strokeWidth={3} />}
                        </span>
                        {s}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {status === "success" && result && (
              <div className="bv-status-wrap">
                <span className="bv-stamp ok">APROBADO</span>
                <CheckCircle2 size={36} color="var(--success)" className="bv-result-icon" />
                <div className="bv-result-title">Pago aprobado</div>
                <div className="bv-result-sub">Tu transacción se completó correctamente.</div>
                <div className="bv-receipt">
                  <div className="bv-receipt-row"><span>Folio</span><b>{result.id}</b></div>
                  <div className="bv-receipt-row"><span>Tarjeta</span><b>{result.brand} •••• {result.last4}</b></div>
                  <div className="bv-receipt-row"><span>Monto</span><b>${Number(result.amount).toLocaleString("es-MX")} {currency}</b></div>
                </div>
                <button className="bv-again" onClick={handleSuccessContinue}>
                  <RotateCcw size={13} /> Ver mis compras
                </button>
                <button className="bv-again" onClick={resetForm} style={{ marginTop: 8 }}>
                  Hacer otro pago
                </button>
              </div>
            )}

            {status === "declined" && result && (
              <div className="bv-status-wrap">
                <span className="bv-stamp no">RECHAZADO</span>
                <XCircle size={36} color="var(--danger)" className="bv-result-icon" />
                <div className="bv-result-title">Pago rechazado</div>
                <div className="bv-result-sub">{result.reason}. Verifica los datos o intenta con otra tarjeta.</div>
                <button className="bv-again" onClick={resetForm}>
                  <RotateCcw size={13} /> Intentar de nuevo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}