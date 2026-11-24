"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, Check, AlertCircle } from "lucide-react";

export interface ColumnMappingField {
  sourceKey: string;
  sampleValue: string;
  targetField: string;
  required?: boolean;
}

export interface ColumnMapperProps {
  fields: ColumnMappingField[];
  targetSchema: Array<{ key: string; label: string; required?: boolean }>;
  onChange?: (mappings: Record<string, string>) => void;
}

export function ColumnMapper({
  fields,
  targetSchema,
  onChange
}: ColumnMapperProps) {
  const t = useTranslations("components");
  const [mappings, setMappings] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    fields.forEach((f) => {
      init[f.sourceKey] = f.targetField || "";
    });
    return init;
  });

  const handleSelect = (sourceKey: string, targetKey: string) => {
    const updated = { ...mappings, [sourceKey]: targetKey };
    setMappings(updated);
    onChange?.(updated);
  };

  return (
    <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4 space-y-3">
      <div className="border-b border-border-subtle pb-2">
        <h4 className="text-xs font-semibold text-text-main">{t("mapColumnsTitle")}</h4>
        <p className="text-[11px] text-text-muted">
          Match incoming file columns with platform target fields. Auto-mapping matched 84% of headers.
        </p>
      </div>

      <div className="divide-y divide-border-subtle">
        {fields.map((f) => {
          const mappedTarget = mappings[f.sourceKey];
          const isMapped = !!mappedTarget && mappedTarget !== "ignore";

          return (
            <div key={f.sourceKey} className="py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Source column info */}
              <div className="min-w-[180px] space-y-0.5">
                <span className="font-mono font-medium text-text-main bg-surface-base px-1.5 py-0.5 rounded border border-border-subtle">
                  {f.sourceKey}
                </span>
                <p className="text-[10px] text-text-muted truncate max-w-[200px]">
                  Sample: &quot;{f.sampleValue}&quot;
                </p>
              </div>

              {/* Arrow */}
              <ArrowRight className="h-3.5 w-3.5 text-text-muted rtl-flip shrink-0" />

              {/* Target Selector */}
              <div className="flex-1 min-w-[200px] flex items-center gap-2">
                <select
                  value={mappings[f.sourceKey] || ""}
                  onChange={(e) => handleSelect(f.sourceKey, e.target.value)}
                  className="w-full rounded-lg border border-border-subtle bg-surface-base px-2.5 py-1.5 text-xs text-text-main focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="">{t("selectTargetField")}</option>
                  <option value="ignore">{t("ignoreField")}</option>
                  {targetSchema.map((t) => (
                    <option key={t.key} value={t.key}>
                      {t.label} {t.required ? "*" : ""}
                    </option>
                  ))}
                </select>

                {isMapped ? (
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
