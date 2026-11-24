import React from "react";
import { useTranslations } from "next-intl";
import { Ltr } from "@/components/common/Ltr";

interface PivotRow {
  dimension: string;
  sms: number;
  email: number;
  teams: number;
  total: number;
}

interface PivotTableProps {
  rows: PivotRow[];
  title?: string;
  className?: string;
}

export const PivotTable: React.FC<PivotTableProps> = ({
  rows,
  title = "Channel Delivery Breakdown by Site / Department",
  className = "",
}) => {
  const t = useTranslations("components");
  return (
    <div className={`p-4 rounded-card bg-app-surface border border-app-border space-y-3 ${className}`}>
      <h3 className="font-bold text-xs text-app-text">{title}</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-start">
          <thead className="border-b border-app-border bg-app-surface-subtle text-app-muted">
            <tr>
              <th className="py-2 px-3 text-start font-semibold">{t("entityGroup")}</th>
              <th className="py-2 px-3 text-end font-semibold">SMS</th>
              <th className="py-2 px-3 text-end font-semibold">Email</th>
              <th className="py-2 px-3 text-end font-semibold">Teams</th>
              <th className="py-2 px-3 text-end font-bold text-app-text">{t("total")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-app-border font-mono">
            {rows.map((r, idx) => (
              <tr key={idx} className="hover:bg-app-surface-subtle">
                <td className="py-2.5 px-3 font-sans font-medium text-app-text">{r.dimension}</td>
                <td className="py-2.5 px-3 text-end text-app-muted"><Ltr>{r.sms}</Ltr></td>
                <td className="py-2.5 px-3 text-end text-app-muted"><Ltr>{r.email}</Ltr></td>
                <td className="py-2.5 px-3 text-end text-app-muted"><Ltr>{r.teams}</Ltr></td>
                <td className="py-2.5 px-3 text-end font-bold text-brand-600"><Ltr>{r.total}</Ltr></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
