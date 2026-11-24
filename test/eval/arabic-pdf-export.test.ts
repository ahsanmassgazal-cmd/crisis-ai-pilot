import { describe, it, expect } from "vitest";
import { exportToArabicPdf } from "@/lib/engine/export";

describe("Arabic PDF Export (RTL & Typography)", () => {
  it("generates Arabic PDF with RTL viewer preference and IBM Plex Sans Arabic font", () => {
    const result = exportToArabicPdf({
      title_en: "Incident SitRep INC-2026-001",
      title_ar: "تقرير الموقف التنفيذي للحادث INC-2026-001",
      locale: "ar",
      incidentNumber: "INC-2026-001",
      author: "Eng. Salem Al-Harthy",
      content: [
        { section: "الملخص", text: "تم تفعيل خطة الطوارئ لاحتواء خلل شبكة التحكم SCADA." },
        { section: "الموقع", text: "محطة تحلية مياه صحار" },
      ],
    });

    expect(result.metadata.direction).toBe("rtl");
    expect(result.metadata.fontFamily).toContain("IBM Plex Sans Arabic");
    expect(result.metadata.hasArabicSupport).toBe(true);
    expect(result.pdfRaw).toContain("/Direction /R2L");
    expect(result.pdfRaw).toContain("IBMPlexSansArabic");
    expect(result.pdfRaw).toContain("تقرير الموقف التنفيذي");
    expect(result.pdfBuffer.byteLength).toBeGreaterThan(0);
  });

  it("generates English PDF with LTR viewer preference and standard typography", () => {
    const result = exportToArabicPdf({
      title_en: "Incident SitRep INC-2026-001",
      title_ar: "تقرير الموقف التنفيذي للحادث INC-2026-001",
      locale: "en",
      incidentNumber: "INC-2026-001",
      author: "Eng. Salem Al-Harthy",
      content: [
        { section: "Executive Summary", text: "SCADA containment emergency plan activated." },
      ],
    });

    expect(result.metadata.direction).toBe("ltr");
    expect(result.metadata.fontFamily).toContain("Inter");
    expect(result.pdfRaw).toContain("/Direction /L2R");
    expect(result.pdfRaw).toContain("Incident SitRep");
    expect(result.pdfBuffer.byteLength).toBeGreaterThan(0);
  });
});
