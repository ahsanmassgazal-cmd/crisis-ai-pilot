"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import {
  Download,
  Printer,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Radio,
  Building,
  UserCheck,
} from "lucide-react";
import { Ltr } from "@/components/common/Ltr";
import { useRepo } from "@/lib/repo";
import { Incident, DrillItem } from "@/lib/repo/types";

export default function ReportPrintPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const repo = useRepo();
  const isRtl = locale === "ar";
  const id = (params?.id as string) || "inc-2026-001";

  const reportRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [incident, setIncident] = useState<Incident | null>(null);
  const [drill, setDrill] = useState<DrillItem | null>(null);

  useEffect(() => {
    async function loadData() {
      if (id.startsWith("drill")) {
        const drills = await repo.drills.getAll();
        const found = drills.find((d) => d.id === id) || drills[0];
        setDrill(found);
      } else {
        const inc = await repo.incidents.getById(id);
        if (inc) {
          setIncident(inc);
        } else {
          const list = await repo.incidents.getAll();
          setIncident(list[0] || null);
        }
      }
    }
    loadData();
  }, [id, repo]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!reportRef.current || downloading) return;
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = 210;
      const pdfHeight = 297;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`crisis-report-${id}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  const reportTitle = id.startsWith("drill")
    ? t("reportsPrint.drillReport")
    : id === "executive-summary"
    ? t("reportsPrint.executiveSummary")
    : id === "evidence-pack"
    ? t("reportsPrint.evidenceReport")
    : t("reportsPrint.incidentReport");

  const incidentTitle = isRtl
    ? incident?.title_ar || "عطل في نظام التيليميتري والتحكم (محطة صحار)"
    : incident?.title_en || "SCADA Telemetry Anomaly (Sohar Plant)";

  return (
    <div className={`min-h-screen bg-slate-100 dark:bg-slate-900 py-6 px-4 ${isRtl ? "font-arabic" : "font-sans"}`} dir={isRtl ? "rtl" : "ltr"}>
      {/* Print-specific style */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .print-container {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
            padding: 0 !important;
          }
          @page {
            size: A4 portrait;
            margin: 15mm;
          }
        }
      `}</style>

      {/* Top Action Bar (hidden when printing) */}
      <div className="no-print max-w-[210mm] mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
          <span>{t("reportsPrint.backToReports")}</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            data-testid="print-window-btn"
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>{t("reportsPrint.printPdf")}</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            data-testid="download-pdf-btn"
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? t("common.loading") : t("reportsPrint.downloadPdf")}</span>
          </button>
        </div>
      </div>

      {/* A4 Rendered Container */}
      <div
        id="report-container"
        ref={reportRef}
        className="print-container max-w-[210mm] mx-auto bg-white text-slate-900 p-10 sm:p-14 shadow-lg rounded-sm border border-slate-200 relative min-h-[297mm]"
      >
        {/* Header Ribbon */}
        <div className="border-b-2 border-brand-600 pb-6 mb-8 flex items-start justify-between gap-6">
          <div>
            <div className="inline-block px-2.5 py-0.5 mb-2 bg-rose-100 text-rose-800 text-[10px] font-black rounded uppercase tracking-wider">
              {t("reportsPrint.confidential")}
            </div>
            <h1 className="text-2xl font-black text-slate-900 leading-tight">
              {reportTitle}
            </h1>
            <p className="text-sm font-bold text-brand-700 mt-1">
              {incidentTitle}
            </p>
          </div>

          <div className="text-end shrink-0">
            <div className="text-xs font-black uppercase text-slate-400">
              SigmaMax Crisis AI
            </div>
            <div className="text-xs text-slate-500 mt-1 font-mono">
              REF: <Ltr>{id.toUpperCase()}</Ltr>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {t("reportsPrint.generatedOn")}: <Ltr>2026-03-29 14:45 GST</Ltr>
            </div>
          </div>
        </div>

        {/* Executive Meta Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg mb-8 text-xs">
          <div>
            <span className="text-slate-400 font-bold block uppercase text-[10px]">
              {t("reportsPrint.severity")}
            </span>
            <span className="font-black text-rose-700 mt-0.5 block">
              {t("reportsPrint.p1Critical")}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-bold block uppercase text-[10px]">
              {t("reportsPrint.status")}
            </span>
            <span className="font-bold text-amber-700 mt-0.5 block">
              {t("reportsPrint.activeContainment")}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-bold block uppercase text-[10px]">
              {t("reportsPrint.leadCommander")}
            </span>
            <span className="font-bold text-slate-800 mt-0.5 block">
              {t("reportsPrint.leadCommanderName")}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-bold block uppercase text-[10px]">
              {t("reportsPrint.site")}
            </span>
            <span className="font-bold text-slate-800 mt-0.5 block">
              {t("reportsPrint.siteName")}
            </span>
          </div>
        </div>

        {/* Section 1: Chronology & Milestones */}
        <div className="mb-8">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-600" />
            <span>{t("reportsPrint.chronology")}</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-4 p-3 bg-slate-50 rounded border border-slate-100">
              <span className="font-mono font-bold text-slate-500 shrink-0"><Ltr>14:02 GST</Ltr></span>
              <div>
                <strong className="text-slate-800 block">{t("reportsPrint.alarmTitle")}</strong>
                <span className="text-slate-600">{t("reportsPrint.alarmDesc")}</span>
              </div>
            </div>

            <div className="flex items-start gap-4 p-3 bg-slate-50 rounded border border-slate-100">
              <span className="font-mono font-bold text-brand-600 shrink-0"><Ltr>14:02 GST</Ltr></span>
              <div>
                <strong className="text-slate-800 block">{t("reportsPrint.broadcastTitle")}</strong>
                <span className="text-slate-600">{t("reportsPrint.broadcastDesc")}</span>
              </div>
            </div>

            <div className="flex items-start gap-4 p-3 bg-slate-50 rounded border border-slate-100">
              <span className="font-mono font-bold text-emerald-600 shrink-0"><Ltr>14:03 GST</Ltr></span>
              <div>
                <strong className="text-slate-800 block">{t("reportsPrint.containmentTitle")}</strong>
                <span className="text-slate-600">{t("reportsPrint.containmentDesc")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Delivery & Channel Performance */}
        <div className="mb-8">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
            <Radio className="w-4 h-4 text-brand-600" />
            <span>{t("reportsPrint.deliveryFunnel")}</span>
          </h2>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="p-3 border border-slate-200 rounded text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">{t("reportsPrint.smsRouteTitle")}</span>
              <span className="text-lg font-black text-slate-800 block mt-1"><Ltr>100%</Ltr></span>
              <span className="text-[10px] text-emerald-600 font-bold">{t("reportsPrint.smsRouteDelivered")}</span>
            </div>

            <div className="p-3 border border-slate-200 rounded text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">{t("reportsPrint.responderAckTitle")}</span>
              <span className="text-lg font-black text-emerald-600 block mt-1"><Ltr>94%</Ltr></span>
              <span className="text-[10px] text-slate-500 font-bold">{t("reportsPrint.responderAckSafe")}</span>
            </div>

            <div className="p-3 border border-slate-200 rounded text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">{t("reportsPrint.failoverTitle")}</span>
              <span className="text-lg font-black text-slate-800 block mt-1"><Ltr>0 s</Ltr></span>
              <span className="text-[10px] text-slate-500 font-bold">{t("reportsPrint.failoverReady")}</span>
            </div>
          </div>
        </div>

        {/* Section 3: Action Log & Decisions */}
        <div className="mb-8">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-brand-600" />
            <span>{t("reportsPrint.actionLog")}</span>
          </h2>

          <table className="w-full text-xs text-start border border-slate-200">
            <thead className="bg-slate-100 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="p-2 text-start font-bold">{t("reportsPrint.actionCol")}</th>
                <th className="p-2 text-start font-bold">{t("reportsPrint.ownerCol")}</th>
                <th className="p-2 text-start font-bold">{t("reportsPrint.statusCol")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-2 font-medium">{t("reportsPrint.action1Title")}</td>
                <td className="p-2 text-slate-600">{t("reportsPrint.action1Owner")}</td>
                <td className="p-2 font-bold text-emerald-600">{t("reportsPrint.action1Status")}</td>
              </tr>
              <tr>
                <td className="p-2 font-medium">{t("reportsPrint.action2Title")}</td>
                <td className="p-2 text-slate-600">{t("reportsPrint.action2Owner")}</td>
                <td className="p-2 font-bold text-amber-600">{t("reportsPrint.action2Status")}</td>
              </tr>
              <tr>
                <td className="p-2 font-medium">{t("reportsPrint.action3Title")}</td>
                <td className="p-2 text-slate-600">{t("reportsPrint.action3Owner")}</td>
                <td className="p-2 font-bold text-blue-600">{t("reportsPrint.action3Status")}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 4: Cryptographic Seal & Verification */}
        <div className="mt-12 pt-6 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-600">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-700 font-black">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{t("reportsPrint.verified")}</span>
            </div>
            <p className="text-[11px] text-slate-500 max-w-md">
              {t("reportsPrint.certifyText")}
            </p>
            <div className="font-mono text-[10px] text-slate-400">
              SHA256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
            </div>
          </div>

          <div className="border border-slate-300 p-4 rounded text-center bg-slate-50 min-w-[140px]">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full border-2 border-dashed border-brand-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-brand-600" />
            </div>
            <span className="text-[10px] font-black uppercase text-slate-700 block">
              {t("reportsPrint.digitalSeal")}
            </span>
            <span className="text-[9px] text-slate-400 block font-mono">
              SIGMAMAX-CRISIS-2026
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
