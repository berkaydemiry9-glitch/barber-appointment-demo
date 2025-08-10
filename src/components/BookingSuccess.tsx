import React from "react";

interface Props {
  onNew?: () => void;
  code?: string; // Booking kodu varsa
}

const BookingSuccess: React.FC<Props> = ({ onNew, code }) => {
  return (
    <div className="step-panel success-panel">
      <h2 className="success-title h1-brand--flat">Randevun Onaylandı</h2>
      <p className="success-subtext">
        Teşekkürler{code ? ` (#${code})`: ""}. Hatırlatma SMS/e‑posta gönderimi ayarlarını daha sonra düzenleyebilirsin.
      </p>
      <div className="success-actions">
        <button className="btn" onClick={onNew}>Yeni Randevu Al</button>
      </div>
    </div>
  );
};

export default BookingSuccess;
