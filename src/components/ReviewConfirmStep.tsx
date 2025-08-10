import React from "react";

export interface BookingDraft {
  services: { id: string; name: string; durationMin: number }[];
  barber?: { id: string; name: string };
  dateISO?: string;          // "2025-08-15"
  timeLabel?: string;        // "1:00 PM"
  phone?: string;
  email?: string;
  notes?: string;
  totalDurationMin: number;
}

interface Props {
  draft: BookingDraft;
  onEditSection: (section: "services"|"schedule"|"barber"|"details") => void;
  onConfirm: () => Promise<void> | void;
  confirming: boolean;
  error?: string | null;
}

const ReviewConfirmStep: React.FC<Props> = ({
  draft,
  onEditSection,
  onConfirm,
  confirming,
  error
}) => {
  const serviceNames = draft.services.map(s => s.name).join(", ");
  const durationLabel = `${draft.totalDurationMin} dk`;
  return (
    <div className="step-panel confirm-panel">
      <div className="confirm-header">
        <h2 className="confirm-title h1-brand--flat">Randevunu Kontrol Et</h2>
        <p className="confirm-subtext">
          Aşağıdaki bilgileri onayla. Düzenlemek istediğin alanın kartına tıkla.
        </p>
      </div>

      <div className="confirm-grid">
        <ConfirmCard
          label="SERVICES"
          value={serviceNames}
          meta={durationLabel}
          onEdit={() => onEditSection("services")}
        />
        <ConfirmCard
          label="BARBER"
          value={draft.barber?.name || "-"}
          onEdit={() => onEditSection("barber")}
        />
        <ConfirmCard
          label="DATE"
          value={draft.dateISO || "-"}
          onEdit={() => onEditSection("schedule")}
        />
        <ConfirmCard
          label="TIME"
            value={draft.timeLabel || "-"}
          onEdit={() => onEditSection("schedule")}
        />
        <ConfirmCard
          label="PHONE"
          value={draft.phone || "-"}
          onEdit={() => onEditSection("details")}
        />
        <ConfirmCard
          label="EMAIL"
          value={draft.email || "-"}
          onEdit={() => onEditSection("details")}
        />
        {draft.notes ? (
          <ConfirmCard
            label="NOTES"
            value={draft.notes}
            onEdit={() => onEditSection("details")}
            full
          />
        ) : null}
      </div>

      {error && <div className="confirm-error">{error}</div>}

      <div className="confirm-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => onEditSection("details")}
          disabled={confirming}
        >
          Geri Dön
        </button>
        <button
          type="button"
          className="btn"
          onClick={onConfirm}
          disabled={confirming}
        >
          {confirming ? "Onaylanıyor..." : "RANDEVUYU ONAYLA"}
        </button>
      </div>

      <p className="confirm-disclaimer">
        Onayla butonuna basarak <a href="/terms" target="_blank" rel="noopener noreferrer">hizmet koşulları</a> ve
        <a href="/privacy" target="_blank" rel="noopener noreferrer"> gizlilik politikasını</a> kabul etmiş olursun.
      </p>
    </div>
  );
};

interface CardProps {
  label: string;
  value: React.ReactNode;
  meta?: string;
  onEdit?: () => void;
  full?: boolean;
}
const ConfirmCard: React.FC<CardProps> = ({ label, value, meta, onEdit, full }) => (
  <div className={`confirm-card${full ? " confirm-card--full":""}`} onClick={onEdit}>
    <div className="confirm-card-label-row">
      <span className="confirm-card-label">{label}</span>
      {onEdit && <button type="button" className="confirm-edit" onClick={(e) => { e.stopPropagation(); onEdit(); }}>Değiştir</button>}
    </div>
    <div className="confirm-card-value">{value}</div>
    {meta && <div className="confirm-card-meta">{meta}</div>}
  </div>
);

export default ReviewConfirmStep;
