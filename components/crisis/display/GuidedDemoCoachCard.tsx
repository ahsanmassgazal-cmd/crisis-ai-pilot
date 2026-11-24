"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Compass,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Lightbulb,
} from "lucide-react";
import { Ltr } from "@/components/common/Ltr";

interface StepInfo {
  step: number;
  timeRange: string;
  titleEn: string;
  titleAr: string;
  nextClickEn: string;
  nextClickAr: string;
  benefitEn: string;
  benefitAr: string;
}

const DEMO_STEPS: StepInfo[] = [
  {
    step: 1,
    timeRange: "0:00 - 1:00",
    titleEn: "Command Center Overview & Hero Metric",
    titleAr: "نظرة عامة على مركز القيادة ومؤشر الاحتواء القياسي",
    nextClickEn: "Point out the 41-second containment hero badge and 6 live KPI cards.",
    nextClickAr: "أشر إلى شارة احتواء الحادث في 41 ثانية والبطاقات الست لمؤشرات الأداء.",
    benefitEn: "Demonstrates 41-second automated containment vs 45-minute industry average.",
    benefitAr: "يبرز تحقيق الاحتواء في 41 ثانية مقارنة بالمعدل التقليدي البالغ 45 دقيقة.",
  },
  {
    step: 2,
    timeRange: "1:00 - 2:00",
    titleEn: "SEV1 SCADA Alert & Multi-Channel Broadcast",
    titleAr: "إنذار عالي الخطورة وبث الطوارئ متعدد القنوات",
    nextClickEn: "Open Incidents -> click 'SCADA Telemetry Anomaly (Sohar Plant)'.",
    nextClickAr: "افتح قائمة الحوادث -> انقر على 'عطل في نظام التحكم (محطة صحار)'.",
    benefitEn: "Instant multi-channel emergency broadcast with zero human bottleneck.",
    benefitAr: "بث فوري لطواقم الطوارئ عبر قنوات متعددة بدون أي تأخير يدوي.",
  },
  {
    step: 3,
    timeRange: "2:00 - 3:00",
    titleEn: "Responder 'I'm Safe' Live Sync",
    titleAr: "مزامنة تفاعل المستجيبين وإثبات السلامة لحظياً",
    nextClickEn: "Click 'Responder Phone Preview' and tap 'I'm safe' inside the mobile frame.",
    nextClickAr: "انقر على 'معاينة هاتف المستجيب' ثم اضغط 'أنا بأمان' داخل إطار الجوال.",
    benefitEn: "Live cross-tab headcount verification without calling individual staff.",
    benefitAr: "تأكيد لحظي لسلامة الطاقم والجاهزية بدون الحاجة إلى اتصالات هاتفية فردية.",
  },
  {
    step: 4,
    timeRange: "3:00 - 4:00",
    titleEn: "AI Copilot Draft with Approval Gate",
    titleAr: "صياغة المساعد الذكي مع بوابة الاعتماد الإلزامية",
    nextClickEn: "Open AI Copilot drawer and review drafted holding statement.",
    nextClickAr: "افتح درج المساعد الذكي وراجع بيان الإحاطة المصاغ آلياً.",
    benefitEn: "Bilingual incident statement generation in seconds with strict human sign-off.",
    benefitAr: "صياغة بيانات إعلامية ثنائية اللغة فورياً مع اشتراط موافقة قائد الحادث.",
  },
  {
    step: 5,
    timeRange: "4:00 - 5:00",
    titleEn: "Carrier Outage & Automated Route Failover",
    titleAr: "محاكاة تعطل البوابة والتحويل الآلي للمسار الاحتياطي",
    nextClickEn: "Open Presenter Panel and click 'Simulate Route A Outage'.",
    nextClickAr: "افتح لوحة العارض واضغط 'محاكاة تعطل المسار أ'.",
    benefitEn: "Resilient zero-loss failover prevents communications breakdown during network outages.",
    benefitAr: "استمرارية الاتصال دون فقدان أي رسالة بفضل التحويل الآلي للبوابة البديلة.",
  },
  {
    step: 6,
    timeRange: "5:00 - 6:00",
    titleEn: "Business Continuity & Critical Functions",
    titleAr: "استمرارية الأعمال والوظائف الحيوية والتعافي",
    nextClickEn: "Navigate to Continuity -> Critical Functions to show RTO compliance.",
    nextClickAr: "انتقل إلى استمرارية الأعمال -> الوظائف الحيوية لعرض الالتزام بزمن RTO.",
    benefitEn: "Guarantees RTO and MTPD alignment for critical national infrastructure assets.",
    benefitAr: "يضمن التوافق التام مع فترات التعافي المستهدفة للمنشآت الوطنية الحيوية.",
  },
  {
    step: 7,
    timeRange: "6:00 - 7:00",
    titleEn: "Cryptographic Audit Ledger Verification",
    titleAr: "التحقق المشفر من سجل التدقيق وسلسلة SHA-256",
    nextClickEn: "Navigate to Audit Trail -> click 'Verify Cryptographic Integrity'.",
    nextClickAr: "انتقل إلى سجل التدقيق -> اضغط 'التحقق من السلامة المشفرة'.",
    benefitEn: "Cryptographic tamper-evident chain protects organization against post-crisis liability.",
    benefitAr: "سلسلة سجل غير قابلة للتلاعب تحمي المنظمة قانونياً وتوثق كل قرار رسمياً.",
  },
  {
    step: 8,
    timeRange: "7:00 - 8:00",
    titleEn: "One-Click Executive Report Export (Shaped Arabic)",
    titleAr: "تصدير التقرير التنفيذي بنقرة واحدة (خط عربي متصل ومشكّل)",
    nextClickEn: "Navigate to Reports -> click 'Export Executive Pack (PDF)'.",
    nextClickAr: "انتقل إلى التقارير -> انقر على 'تصدير التقرير التنفيذي (PDF)'.",
    benefitEn: "Board-ready bilingual audit report generated instantly with native Arabic typography.",
    benefitAr: "تقرير ثنائي اللغة جاهز لمجلس الإدارة فوراً بحروف عربية متصلة ومطابقة للمواصفات.",
  },
];

interface GuidedDemoCoachCardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuidedDemoCoachCard: React.FC<GuidedDemoCoachCardProps> = ({
  isOpen,
  onClose,
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  if (!isOpen) return null;

  const currentStep = DEMO_STEPS[currentStepIdx];

  const handlePrev = () => {
    if (currentStepIdx > 0) setCurrentStepIdx(currentStepIdx - 1);
  };

  const handleNext = () => {
    if (currentStepIdx < DEMO_STEPS.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    }
  };

  return (
    <div
      data-testid="guided-demo-coach-card"
      className="fixed bottom-20 end-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 border-2 border-brand-500 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-300"
    >
      {/* Top Banner */}
      <div className="bg-brand-600 text-white px-4 py-2.5 flex items-center justify-between text-xs font-bold">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-brand-200 animate-spin-slow" />
          <span>{t("guidedDemo.title")}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">
            <Ltr>{currentStep.timeRange}</Ltr>
          </span>
          <button
            onClick={onClose}
            aria-label={t("guidedDemo.stop")}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 space-y-3 text-xs">
        {/* Step Indicator & Title */}
        <div>
          <div className="text-[10px] font-black uppercase text-brand-600 dark:text-brand-400 mb-0.5">
            {t("guidedDemo.step")} <Ltr>{currentStep.step}</Ltr> / <Ltr>{DEMO_STEPS.length}</Ltr>
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
            {isRtl ? currentStep.titleAr : currentStep.titleEn}
          </h3>
        </div>

        {/* Next Action Box */}
        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-bold mb-1 text-[11px]">
            <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? "rotate-180" : ""}`} />
            <span>{t("guidedDemo.nextAction")}</span>
          </div>
          <p className="text-slate-700 dark:text-slate-300 font-medium">
            {isRtl ? currentStep.nextClickAr : currentStep.nextClickEn}
          </p>
        </div>

        {/* Executive Value Box */}
        <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold mb-1 text-[11px]">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>{t("guidedDemo.valuePitch")}</span>
          </div>
          <p className="text-emerald-900 dark:text-emerald-200 font-semibold">
            {isRtl ? currentStep.benefitAr : currentStep.benefitEn}
          </p>
        </div>
      </div>

      {/* Footer Navigation Buttons */}
      <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentStepIdx === 0}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors"
        >
          <ChevronLeft className={`w-3.5 h-3.5 ${isRtl ? "rotate-180" : ""}`} />
          <span>{t("guidedDemo.prevStep")}</span>
        </button>

        <button
          onClick={handleNext}
          disabled={currentStepIdx === DEMO_STEPS.length - 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white disabled:opacity-40 transition-colors shadow-sm"
        >
          <span>{t("guidedDemo.nextStep")}</span>
          <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? "rotate-180" : ""}`} />
        </button>
      </div>
    </div>
  );
};
