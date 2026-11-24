import { describe, it, expect } from "vitest";
import en from "@/messages/en.json";
import ar from "@/messages/ar.json";

describe("Group O: Bilingual Internationalization & Glossary (Spec 9)", () => {
  it("ensures all top-level keys in en.json exist in ar.json", () => {
    const enKeys = Object.keys(en);
    const arKeys = Object.keys(ar);

    for (const key of enKeys) {
      expect(arKeys).toContain(key);
    }
  });

  it("matches essential crisis glossary terms in Arabic", () => {
    // Spec 9 Glossary: Incident -> حادثة / حالة طارئة, Commander -> قائد الحادثة, Plans/Playbooks -> أدلة الاستجابة وخطط الطوارئ
    expect(ar.nav.incidents).toMatch(/(الحوادث|حوادث)/);
    expect(ar.nav.plans).toMatch(/(الأدلة|خطط)/);
    expect(ar.roles.commander).toMatch(/قائد/);
  });
});
