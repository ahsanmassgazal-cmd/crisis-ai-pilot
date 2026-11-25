const fs = require('fs');

const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'));
const ar = JSON.parse(fs.readFileSync('messages/ar.json', 'utf8'));

en.app.demoBannerText = "Demo · sample data · try anything";
en.app.resetDemo = "Reset Demo";
en.app.bookCall = "Book a Call";

ar.app.demoBannerText = "نسخة تجريبية · بيانات محاكاة · يمكنك تجربة كافة الميزات";
ar.app.resetDemo = "إعادة ضبط البيانات";
ar.app.bookCall = "حجز جلسة استشارية";

en.landing = {
  badge: "Autonomous Command System",
  title: "Autonomous Crisis Management & Continuity Command",
  subtitle: "Bilingual enterprise platform for real-time incident coordination, automated operational playbooks, and immutable audit governance.",
  exploreTitle: "Explore Demo Workspace",
  exploreBadge: "Public showcase · No login needed",
  exploreDesc: "Full interactive command environment with simulated GCC industrial scenarios.",
  exploreBullet1: "248 responders & 40 critical sites pre-configured with reachability metrics",
  exploreBullet2: "Live incident room with AI copilot, approvals gate & automated playbooks",
  exploreBullet3: "Cryptographic SHA-256 audit ledger, live sync & bilingual executive PDF reports",
  exploreButton: "Launch Demo Command Center",
  signInTitle: "Sign In to Workspace",
  signInBadge: "Authorised team only",
  signInDesc: "Access your designated enterprise crisis operations console.",
  signInBullet1: "Role-gated operational consoles for Commanders, Responders, and Owners",
  signInBullet2: "Active enterprise telemetry, encrypted alert dispatch & regulatory compliance",
  signInBullet3: "Isolated multi-tenant data architecture with strict zero-trust boundary",
  signInButton: "Sign In to Workspace",
  privacyTitle: "Your Data Stays Private",
  privacyDesc: "Real enterprise workspaces and public demo sessions run in completely isolated environments. No operational data is ever shared or exposed to public demonstrators.",
  systemStatus: "All Systems Operational · GCC Infrastructure",
  builtFor: "Built for Critical Infrastructure, Utilities & Regulated Enterprises",
  contact: "Contact SigmaMax AI",
  footerNotice: "SigmaMax AI Solutions — Enterprise Crisis Command Platform"
};

ar.landing = {
  badge: "منظومة القيادة الذاتية",
  title: "منظومة القيادة الذاتية لإدارة الأزمات واستمرارية الأعمال",
  subtitle: "منصة مؤسسية ثنائية اللغة للتنسيق الفوري أثناء الطوارئ، وتفعيل أدلة الاستجابة المؤتمتة، وسجلات التدقيق الرقمية المشفرة.",
  exploreTitle: "استكشاف مساحة العرض التجريبية",
  exploreBadge: "عرض تجريبي عام · بدون تسجيل دخول",
  exploreDesc: "بيئة قيادة تفاعلية كاملة مع سيناريوهات استجابة تحاكي منشآت البنية التحتية الخليجية.",
  exploreBullet1: "248 مستجيباً و 40 موقعاً حيوياً مجهزة بمؤشرات الاتصال والوصول",
  exploreBullet2: "غرفة طوارئ تفاعلية مع مساعد الذكاء الاصطناعي وصندوق الموافقات وأدلة الاستجابة",
  exploreBullet3: "سجل تدقيق رقمي مشفر (SHA-256) ومزامنة فورية وتقارير تنفيذية ثنائية اللغة",
  exploreButton: "تشغيل مركز القيادة التجريبي",
  signInTitle: "تسجيل الدخول إلى بيئة العمل",
  signInBadge: "لفريق العمل المصرح لهم فقط",
  signInDesc: "الدخول إلى منصة العمليات التشغيلية المخصصة للمؤسسة.",
  signInBullet1: "لوحات تحكم محددة الصلاحيات لقادة الحوادث، والمستجيبين، وإدارة المنصة",
  signInBullet2: "ربط تشغيلي فوري، وإرسال تنبيهات طوارئ مشفرة، وتوافق مع المعايير الدولية",
  signInBullet3: "عزل رقمي كامل للبيانات المؤسسية مع التزام تام بسياسات انعدام الثقة (Zero Trust)",
  signInButton: "تسجيل الدخول إلى بيئة العمل",
  privacyTitle: "بياناتك محمية ومصانة",
  privacyDesc: "بيئات العمل المؤسسية الفعلية ومنصة العرض التجريبي تعملان في بيئات معزولة تماماً، ولا تتم مشاركة أو كشف أي بيانات تشغيلية حقيقية للمستخدمين التجريبيين.",
  systemStatus: "جميع الأنظمة تعمل بكفاءة · البنية التحتية الخليجية",
  builtFor: "مصممة للمنشآت الحيوية وقطاعات الطاقة والمياه والجهات الخاضعة للتنظيم",
  contact: "تواصل مع SigmaMax AI",
  footerNotice: "SigmaMax AI Solutions — المنصة المؤسسية لإدارة الأزمات والطوارئ"
};

en.login = {
  ...en.login,
  title: "Enterprise Sign In",
  subtitle: "Access your designated crisis management operations console.",
  demoNotice: "For public evaluation, explore the unrestricted demo workspace.",
  quickRoleTitle: "Authorised Evaluator Role Access",
  roleOwner: "Platform Owner",
  roleManager: "Crisis Manager",
  roleResponder: "First Responder",
  roleStakeholder: "Executive Stakeholder",
  emailLabel: "Work Email",
  emailPlaceholder: "name@organization.com",
  passwordLabel: "Password",
  passwordPlaceholder: "••••••••••••",
  submit: "Authenticate & Enter",
  backToDemo: "Return to Public Demo",
  invalidCredentials: "Authentication error: Please check your email or password.",
  authenticatedAs: "Authenticated as",
  privacyNote: "Encrypted session. Access logs recorded in cryptographic ledger."
};

ar.login = {
  ...ar.login,
  title: "تسجيل الدخول المؤسسي",
  subtitle: "الدخول إلى منصة العمليات المخصصة لإدارة الأزمات.",
  demoNotice: "للتقييم العام المباشر، يمكنك استكشاف مساحة العرض التجريبية بدون قيود.",
  quickRoleTitle: "الدخول المباشر بحسب الأدوار المصرحة",
  roleOwner: "مالك المنصة",
  roleManager: "قائد إدارة الأزمات",
  roleResponder: "المستجيب الأول",
  roleStakeholder: "القيادات التنفيذية وأصحاب المصلحة",
  emailLabel: "البريد الإلكتروني المهني",
  emailPlaceholder: "name@organization.com",
  passwordLabel: "كلمة المرور",
  passwordPlaceholder: "••••••••••••",
  submit: "التحقق والدخول",
  backToDemo: "العودة إلى العرض التجريبي",
  invalidCredentials: "خطأ في تسجيل الدخول: يرجى التأكد من صحة البريد الإلكتروني أو كلمة المرور.",
  authenticatedAs: "تم تسجيل الدخول بصلاحية",
  privacyNote: "جلسة مشفرة ومؤمنة. تسجل عمليات الدخول في سجل التدقيق الرقمي المشفر."
};

fs.writeFileSync('messages/en.json', JSON.stringify(en, null, 2) + '\n', 'utf8');
fs.writeFileSync('messages/ar.json', JSON.stringify(ar, null, 2) + '\n', 'utf8');
console.log('Translations merged successfully.');
