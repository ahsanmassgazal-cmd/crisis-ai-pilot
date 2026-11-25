const fs = require('fs');

// 1. Generate 40 Sites
const SITES_40 = [
  // Oman
  { id: "site-sohar", tenant_id: "gulf_water", name_en: "Sohar Desalination & Energy Facility", name_ar: "محطة صحار لتحلية المياه وتوليد الطاقة", city: "Sohar", country: "Oman", lat: 24.364, lng: 56.7468, criticality: "tier1", active_incidents_count: 1 },
  { id: "site-muscat-hq", tenant_id: "gulf_water", name_en: "Muscat Central Operations & Plant 1", name_ar: "مركز العمليات الرئيسي ومحطة مسقط 1", city: "Muscat", country: "Oman", lat: 23.588, lng: 58.3829, criticality: "tier1", active_incidents_count: 0 },
  { id: "site-salalah", tenant_id: "gulf_water", name_en: "Salalah Coastal Pumping Hub", name_ar: "مركز ضخ صلالة الساحلي", city: "Salalah", country: "Oman", lat: 17.0151, lng: 54.0924, criticality: "tier2", active_incidents_count: 0 },
  { id: "site-nizwa", tenant_id: "gulf_water", name_en: "Nizwa Interior Reservoir & Storage", name_ar: "خزان ومستودع نزوى الإقليمي", city: "Nizwa", country: "Oman", lat: 22.9333, lng: 57.5333, criticality: "tier2", active_incidents_count: 0 },
  { id: "site-sur", tenant_id: "gulf_water", name_en: "Sur Water Purification Station", name_ar: "محطة تنقية المياه بصور", city: "Sur", country: "Oman", lat: 22.5667, lng: 59.5289, criticality: "tier3", active_incidents_count: 0 },
  { id: "site-duqm", tenant_id: "gulf_water", name_en: "Duqm Port Utility Grid Hub", name_ar: "مجمع خدمات ميناء الدقم الصناعي", city: "Duqm", country: "Oman", lat: 19.6644, lng: 57.7036, criticality: "tier1", active_incidents_count: 0 },
  { id: "site-buraimi", tenant_id: "gulf_water", name_en: "Buraimi Border Water Pumping Facility", name_ar: "محطة ضخ المياه الحدودية بالبريمي", city: "Buraimi", country: "Oman", lat: 24.2509, lng: 55.7606, criticality: "tier2", active_incidents_count: 0 },
  { id: "site-khasab", tenant_id: "gulf_water", name_en: "Musandam Khasab Desalination Unit", name_ar: "وحدة تحلية خصب بمحافظة مسندم", city: "Khasab", country: "Oman", lat: 26.1798, lng: 56.2486, criticality: "tier2", active_incidents_count: 0 },
  { id: "site-rustaq", tenant_id: "gulf_water", name_en: "Rustaq Regional Aquifer Station", name_ar: "محطة خزانات الرستاق الجوفية", city: "Rustaq", country: "Oman", lat: 23.3907, lng: 57.4244, criticality: "tier3", active_incidents_count: 0 },
  { id: "site-ibra", tenant_id: "gulf_water", name_en: "Sharqiyah North Ibra Grid Hub", name_ar: "محطة شبكة إبراء بشمال الشرقية", city: "Ibra", country: "Oman", lat: 22.6906, lng: 58.5334, criticality: "tier3", active_incidents_count: 0 },
  { id: "site-barka", tenant_id: "gulf_water", name_en: "Barka Strategic Desalination Plant 2", name_ar: "محطة بركاء الاستراتيجية لتحلية المياه 2", city: "Barka", country: "Oman", lat: 23.7083, lng: 58.0772, criticality: "tier1", active_incidents_count: 0 },
  { id: "site-ibri", tenant_id: "gulf_water", name_en: "Dhahirah Ibri Solar-Powered Pumping Hub", name_ar: "مركز ضخ عبري الشمسي بالظاهرة", city: "Ibri", country: "Oman", lat: 23.2257, lng: 56.5159, criticality: "tier2", active_incidents_count: 0 },
  { id: "site-saham", tenant_id: "gulf_water", name_en: "Saham Coastal Pipeline Sub-Station", name_ar: "محطة خطوط الأنابيب الساحلية بصحم", city: "Saham", country: "Oman", lat: 24.1722, lng: 56.8886, criticality: "tier3", active_incidents_count: 0 },
  { id: "site-suwaiq", tenant_id: "gulf_water", name_en: "Suwaiq Agricultural Grid Relay", name_ar: "مركز شبكة السويق للري الزراعي", city: "Suwaiq", country: "Oman", lat: 23.8494, lng: 57.4386, criticality: "tier3", active_incidents_count: 0 },
  { id: "site-shinas", tenant_id: "gulf_water", name_en: "Shinas Northern Maritime Terminal", name_ar: "المحطة البحرية الشمالية بشناص", city: "Shinas", country: "Oman", lat: 24.7431, lng: 56.4678, criticality: "tier3", active_incidents_count: 0 },
  { id: "site-qurayyat", tenant_id: "gulf_water", name_en: "Qurayyat Sea-Intake Filtration Station", name_ar: "محطة مآخذ مياه البحر بقريات", city: "Qurayyat", country: "Oman", lat: 23.2667, lng: 58.9167, criticality: "tier2", active_incidents_count: 0 },
  { id: "site-bahla", tenant_id: "gulf_water", name_en: "Bahla Heritage Oasis Reservoir", name_ar: "مستودع واحة بهلاء التاريخية", city: "Bahla", country: "Oman", lat: 22.9667, lng: 57.3000, criticality: "tier3", active_incidents_count: 0 },
  { id: "site-mudhaibi", tenant_id: "gulf_water", name_en: "Mudhaibi Deep Wellfield Operations", name_ar: "عمليات آبار المضيبي العميقة", city: "Mudhaibi", country: "Oman", lat: 22.5833, lng: 58.1333, criticality: "tier3", active_incidents_count: 0 },
  { id: "site-masirah", tenant_id: "gulf_water", name_en: "Masirah Island Desalination Unit", name_ar: "محطة تحلية مياه جزيرة مصيرة", city: "Masirah", country: "Oman", lat: 20.6500, lng: 58.9000, criticality: "tier2", active_incidents_count: 0 },
  { id: "site-alwusta", tenant_id: "gulf_water", name_en: "Haima Central Desert Pumping Base", name_ar: "قاعدة ضخ هيماء الصحراوية بالوسطى", city: "Haima", country: "Oman", lat: 19.9500, lng: 56.2833, criticality: "tier3", active_incidents_count: 0 },

  // Regional GCC
  { id: "site-dubai", tenant_id: "gulf_water", name_en: "Dubai Jebel Ali Regional Energy Gateway", name_ar: "بوابة جبل علي الإقليمية للطاقة بدبي", city: "Dubai", country: "United Arab Emirates", lat: 25.0112, lng: 55.0617, criticality: "tier1", active_incidents_count: 0 },
  { id: "site-abudhabi", tenant_id: "gulf_water", name_en: "Abu Dhabi Taweelah Desalination Hub", name_ar: "مجمع الطويلة لتحلية المياه بأبوظبي", city: "Abu Dhabi", country: "United Arab Emirates", lat: 24.7617, lng: 54.6939, criticality: "tier1", active_incidents_count: 0 },
  { id: "site-sharjah", tenant_id: "gulf_water", name_en: "Sharjah Hamriyah Free Zone Utility Facility", name_ar: "منشأة الحمرية للخدمات بالشارقة", city: "Sharjah", country: "United Arab Emirates", lat: 25.4667, lng: 55.4833, criticality: "tier2", active_incidents_count: 0 },
  { id: "site-riyadh", tenant_id: "gulf_water", name_en: "Riyadh Central Strategic Water Reservoirs", name_ar: "الخزانات الاستراتيجية الكبرى بالرياض", city: "Riyadh", country: "Saudi Arabia", lat: 24.7136, lng: 46.6753, criticality: "tier1", active_incidents_count: 0 },
  { id: "site-jeddah", tenant_id: "gulf_water", name_en: "Jeddah Red Sea Coastal RO Plant", name_ar: "محطة البحر الأحمر للتناضح العكسي بجدة", city: "Jeddah", country: "Saudi Arabia", lat: 21.5433, lng: 39.1728, criticality: "tier1", active_incidents_count: 0 },
  { id: "site-dammam", tenant_id: "gulf_water", name_en: "Dammam Industrial Port Pumping Terminal", name_ar: "محطة ميناء الدمام الصناعي للضخ", city: "Dammam", country: "Saudi Arabia", lat: 26.4207, lng: 50.0888, criticality: "tier2", active_incidents_count: 0 },
  { id: "site-khobar", tenant_id: "gulf_water", name_en: "Khobar Coastal Desalination Complex", name_ar: "مجمع الخبر الساحلي لتحلية المياه", city: "Khobar", country: "Saudi Arabia", lat: 26.2886, lng: 50.2134, criticality: "tier2", active_incidents_count: 0 },
  { id: "site-jubail", tenant_id: "gulf_water", name_en: "Jubail Industrial Petrochemical Grid", name_ar: "شبكة الجبيل الصناعية للبتروكيماويات", city: "Jubail", country: "Saudi Arabia", lat: 27.0046, lng: 49.6586, criticality: "tier1", active_incidents_count: 0 },
  { id: "site-doha", tenant_id: "gulf_water", name_en: "Doha Ras Abu Fontas Water Facility", name_ar: "محطة رأس أبو فنطاس لتحلية المياه بالدوحة", city: "Doha", country: "Qatar", lat: 25.2048, lng: 51.6022, criticality: "tier1", active_incidents_count: 0 },
  { id: "site-manama", tenant_id: "gulf_water", name_en: "Manama Hidd Power & Desalination Plant", name_ar: "محطة الحد للطاقة وتحلية المياه بالمنامة", city: "Manama", country: "Bahrain", lat: 26.2167, lng: 50.6500, criticality: "tier1", active_incidents_count: 0 },
  { id: "site-kuwait", tenant_id: "gulf_water", name_en: "Kuwait City Doha West Thermal RO Hub", name_ar: "مجمع الدوحة الغربية الحراري بالكويت", city: "Kuwait City", country: "Kuwait", lat: 29.3759, lng: 47.9774, criticality: "tier1", active_incidents_count: 0 },

  // International Energy & Critical Hubs
  { id: "site-london", tenant_id: "gulf_water", name_en: "London Global Energy & Trading Center", name_ar: "مركز لندن الدولي لتجارة الطاقة", city: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278, criticality: "tier1", active_incidents_count: 0 },
  { id: "site-houston", tenant_id: "gulf_water", name_en: "Houston Energy Corridor Operational Hub", name_ar: "مقر هيوستن لعمليات ممر الطاقة", city: "Houston", country: "United States", lat: 29.7604, lng: -95.3698, criticality: "tier1", active_incidents_count: 0 },
  { id: "site-rotterdam", tenant_id: "gulf_water", name_en: "Rotterdam Europoort Petrochemical Logistics", name_ar: "مجمع يوروبورت للبتروكيماويات بروتردام", city: "Rotterdam", country: "Netherlands", lat: 51.9244, lng: 4.4777, criticality: "tier1", active_incidents_count: 0 },
  { id: "site-singapore", tenant_id: "gulf_water", name_en: "Singapore Jurong Island Terminal Hub", name_ar: "محطة جزيرة جورونغ للطاقة بسنغافورة", city: "Singapore", country: "Singapore", lat: 1.2721, lng: 103.7042, criticality: "tier1", active_incidents_count: 0 },
  { id: "site-tokyo", tenant_id: "gulf_water", name_en: "Tokyo Bay Coastal SCADA Monitoring Center", name_ar: "مركز مراقبة سكادا الساحلي بخليج طوكيو", city: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503, criticality: "tier2", active_incidents_count: 0 },
  { id: "site-sydney", tenant_id: "gulf_water", name_en: "Sydney Botany Industrial Support Base", name_ar: "قاعدة بوتاني للدعم الصناعي بسيدني", city: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093, criticality: "tier2", active_incidents_count: 0 },
  { id: "site-frankfurt", tenant_id: "gulf_water", name_en: "Frankfurt European Data & SCADA Backup Center", name_ar: "مركز فرانكفورت لبيانات سكادا الاحتياطية", city: "Frankfurt", country: "Germany", lat: 50.1109, lng: 8.6821, criticality: "tier1", active_incidents_count: 0 },
  { id: "site-paris", tenant_id: "gulf_water", name_en: "Paris Engineering Logistics & Standards Unit", name_ar: "وحدة باريس الهندسية للمعايير واللوجستيات", city: "Paris", country: "France", lat: 48.8566, lng: 2.3522, criticality: "tier3", active_incidents_count: 0 },
  { id: "site-amsterdam", tenant_id: "gulf_water", name_en: "Amsterdam North Sea Environmental Station", name_ar: "محطة بحر الشمال البيئية بأمستردام", city: "Amsterdam", country: "Netherlands", lat: 52.3676, lng: 4.9041, criticality: "tier2", active_incidents_count: 0 }
];

// 2. Generate 30 Playbooks
const PLANS_30 = [
  { id: "CP-CYBER-01", tenant_id: "gulf_water", category: "cyber", title_en: "Industrial OT / SCADA Cyber Attack Response", title_ar: "دليل الاستجابة للهجمات السيبرانية على شبكات التحكم SCADA", severity_default: "critical", owner_role: "commander", steps_count: 10, version: "2.4" },
  { id: "CP-FIRE-01", tenant_id: "gulf_water", category: "fire", title_en: "Chemical Storage & Refinery Fire Evacuation", title_ar: "خطة إخلاء حريق مستودعات الكيماويات ومحطات التكرير", severity_default: "critical", owner_role: "commander", steps_count: 8, version: "1.8" },
  { id: "CP-POWER-01", tenant_id: "gulf_water", category: "power", title_en: "Total Power Blackout & Generator Failover", title_ar: "إجراءات الانقطاع الشامل للكهرباء وتشغيل المولدات الاحتياطية", severity_default: "high", owner_role: "continuity", steps_count: 8, version: "3.1" },
  { id: "CP-FLOOD-01", tenant_id: "gulf_water", category: "weather", title_en: "Tropical Cyclone & Coastal Storm Surge Preparedness", title_ar: "خطة الطوارئ للأنواء المناخية الاستثنائية والفيضانات الساحلية", severity_default: "high", owner_role: "commander", steps_count: 12, version: "2.0" },
  { id: "CP-SUPPLY-01", tenant_id: "gulf_water", category: "supply", title_en: "Critical Chemical Reagent Supply Chain Continuity", title_ar: "خطة استدامة توريد الكواشف الكيميائية الحيوية البديلة", severity_default: "medium", owner_role: "continuity", steps_count: 7, version: "1.2" },
  { id: "CP-WATER-01", tenant_id: "gulf_water", category: "environmental", title_en: "High-Pressure Main Transmission Pipeline Rupture", title_ar: "إجراءات الطوارئ لانفجار خطوط نقل المياه الرئيسية عالية الضغط", severity_default: "critical", owner_role: "commander", steps_count: 9, version: "2.1" },
  { id: "CP-COMM-01", tenant_id: "gulf_water", category: "comms", title_en: "Telecommunications & TETRA Radio Grid Disruption", title_ar: "خطة مجابهة انقطاع شبكات الاتصالات اللاسلكية وتيترا", severity_default: "medium", owner_role: "comms", steps_count: 6, version: "1.5" },
  { id: "CP-HEALTH-01", tenant_id: "gulf_water", category: "environmental", title_en: "Regional Biological / Potable Water Contamination Protocol", title_ar: "بروتوكول احتواء التلوث البيولوجي لمياه الشرب البلدية", severity_default: "critical", owner_role: "commander", steps_count: 11, version: "2.3" },
  { id: "CP-IT-01", tenant_id: "gulf_water", category: "cyber", title_en: "Cloud Data Center Enterprise Ransomware Quarantine", title_ar: "خطة عزل برمجيات الفدية بمراكز البيانات السحابية", severity_default: "critical", owner_role: "commander", steps_count: 9, version: "2.0" },
  { id: "CP-ENV-01", tenant_id: "gulf_water", category: "environmental", title_en: "Seawater Intake Harmful Algal Bloom (Red Tide) Emergency", title_ar: "خطة طوارئ ظاهرة المد الأحمر وتلوث مآخذ مياه البحر", severity_default: "high", owner_role: "continuity", steps_count: 8, version: "1.6" },
  { id: "CP-SEC-01", tenant_id: "gulf_water", category: "security", title_en: "Critical Infrastructure Physical Perimeter Intrusion", title_ar: "إجراءات التعامل مع اختراق الحرم الأمني للمنشآت الحيوية", severity_default: "high", owner_role: "commander", steps_count: 7, version: "1.4" },
  { id: "CP-GRID-01", tenant_id: "gulf_water", category: "power", title_en: "National High-Voltage Interconnection Substation Trip", title_ar: "بروتوكول تعطل محطات التحويل الكهربائي الفائق للربط الوطني", severity_default: "high", owner_role: "continuity", steps_count: 8, version: "2.2" },
  { id: "CP-PIPE-01", tenant_id: "gulf_water", category: "environmental", title_en: "Strategic Aqueduct Desalination Pipeline Depressurization", title_ar: "خطة مجابهة هبوط ضغط خطوط النقل المائي الاستراتيجية", severity_default: "medium", owner_role: "commander", steps_count: 6, version: "1.1" },
  { id: "CP-GAS-01", tenant_id: "gulf_water", category: "power", title_en: "Turbine Natural Gas Supply Curtailment & Liquid Fuel Switch", title_ar: "خطة التحول للوقود السائل عند نقص إمدادات الغاز الطبيعي", severity_default: "high", owner_role: "continuity", steps_count: 9, version: "1.7" },
  { id: "CP-CHLOR-01", tenant_id: "gulf_water", category: "health", title_en: "Gaseous Chlorine Cylinder Rupture HAZMAT Evacuation", title_ar: "خطة إخلاء طوارئ تسرب غاز الكلور والمواد الخطرة", severity_default: "critical", owner_role: "commander", steps_count: 10, version: "2.5" },
  { id: "CP-PUMP-01", tenant_id: "gulf_water", category: "supply", title_en: "Reverse Osmosis High-Pressure Membrane Total Fouling", title_ar: "إجراءات الانسداد الكلي لأغشية التناضح العكسي عالية الضغط", severity_default: "medium", owner_role: "continuity", steps_count: 6, version: "1.3" },
  { id: "CP-PORT-01", tenant_id: "gulf_water", category: "security", title_en: "Marine Offloading Jetty Tanker Impact & Oil Spill Containment", title_ar: "خطة احتواء الانسكابات النفطية واصطدام الناقلات بالأرصفة", severity_default: "critical", owner_role: "commander", steps_count: 10, version: "2.0" },
  { id: "CP-SAT-01", tenant_id: "gulf_water", category: "comms", title_en: "Undersea Fiber Cable Severance & Satellite Failover", title_ar: "خطة التحول للاتصالات الفضائية عند انقطاع الكابلات البحرية", severity_default: "high", owner_role: "comms", steps_count: 7, version: "1.9" },
  { id: "CP-QUAKE-01", tenant_id: "gulf_water", category: "weather", title_en: "Seismic Ground Motion Structural Integrity Assessment", title_ar: "بروتوكول السلامة الإنشائية وتقييم أثر الهزات الأرضية", severity_default: "medium", owner_role: "continuity", steps_count: 8, version: "1.2" },
  { id: "CP-HEAT-01", tenant_id: "gulf_water", category: "weather", title_en: "Extreme Summer Ambient Heat Turbine Derating Protocol", title_ar: "إجراءات التعامل مع درجات الحرارة القصوى وانخفاض كفاءة التوربينات", severity_default: "low", owner_role: "continuity", steps_count: 5, version: "1.0" },
  { id: "CP-LABOR-01", tenant_id: "gulf_water", category: "health", title_en: "Critical Control Room Operator Epidemic Quarantine & Relay", title_ar: "خطة عزل واستبدال مشغلي غرف التحكم عند الأوبئة الصحية", severity_default: "high", owner_role: "continuity", steps_count: 8, version: "2.1" },
  { id: "CP-FIN-01", tenant_id: "gulf_water", category: "it", title_en: "Enterprise ERP & Customer Billing Infrastructure Outage", title_ar: "خطة استمرارية أنظمة الفوترة والمحاسبة المؤسسية", severity_default: "medium", owner_role: "continuity", steps_count: 6, version: "1.4" },
  { id: "CP-REG-01", tenant_id: "gulf_water", category: "legal", title_en: "Unannounced Regulatory Compliance Audit Inspection Protocol", title_ar: "بروتوكول التعامل مع التفتيش والتدقيق الرقابي غير المعلن", severity_default: "low", owner_role: "commander", steps_count: 5, version: "1.1" },
  { id: "CP-DRONE-01", tenant_id: "gulf_water", category: "security", title_en: "Unauthorized Drone Overflight & Visual Surveillance Defense", title_ar: "إجراءات الرصد والتعامل مع الطائرات المسيرة غير المصرحة", severity_default: "high", owner_role: "commander", steps_count: 7, version: "1.5" },
  { id: "CP-CBRN-01", tenant_id: "gulf_water", category: "security", title_en: "National Strategic Asset CBRN Threat Alert Response", title_ar: "دليل الاستجابة للتهديدات الكيميائية والبيولوجية والإشعاعية CBRN", severity_default: "critical", owner_role: "commander", steps_count: 12, version: "3.0" },
  { id: "CP-BLACK-01", tenant_id: "gulf_water", category: "power", title_en: "Black Start Islanded Power Generation Protocol", title_ar: "بروتوكول إعادة التشغيل الذاتي المعزول (Black Start)", severity_default: "critical", owner_role: "commander", steps_count: 10, version: "2.3" },
  { id: "CP-FLEET-01", tenant_id: "gulf_water", category: "supply", title_en: "Emergency Potable Water Trucking Fleet Mobilization", title_ar: "خطة التوزيع الميداني الطارئ لناقلات مياه الشرب", severity_default: "medium", owner_role: "continuity", steps_count: 6, version: "1.2" },
  { id: "CP-SEW-01", tenant_id: "gulf_water", category: "environmental", title_en: "Industrial Effluent Neutralization Tank Overflow Bypass", title_ar: "خطة احتواء فيضان خزانات معالجة المخلفات الصناعية", severity_default: "high", owner_role: "continuity", steps_count: 7, version: "1.4" },
  { id: "CP-INSIDER-01", tenant_id: "gulf_water", category: "cyber", title_en: "Malicious Insider Telemetry Falsification Containment", title_ar: "خطة احتواء تلاعب القياسات عن بعد من قبل جهة داخلية", severity_default: "critical", owner_role: "commander", steps_count: 8, version: "2.0" },
  { id: "CP-RECOV-01", tenant_id: "gulf_water", category: "continuity", title_en: "Post-Crisis Safe Normalization & De-escalation Protocol", title_ar: "دليل خفض حالة الطوارئ واستعادة العمليات التشغيلية الطبيعية", severity_default: "low", owner_role: "continuity", steps_count: 6, version: "1.0" }
];

// 3. Generate 12 Drills spanning 12 months
const DRILLS_12 = [
  { id: "drl-01", tenant_id: "gulf_water", title_en: "Q4 Unannounced SCADA Intrusion Simulation", title_ar: "تمرين محاكاة الاختراق السيبراني غير المعلن للربع الرابع", date: "2026-11-02", type: "unannounced", participants_count: 42, score_percent: 94, status: "completed" },
  { id: "drl-02", tenant_id: "gulf_water", title_en: "Sohar Chlorine Vapor Release Multi-Agency Evacuation", title_ar: "تمرين إخلاء تسرب الكلور بمحطة صحار بمشاركة الدفاع المدني", date: "2026-10-14", type: "full_scale", participants_count: 86, score_percent: 89, status: "completed" },
  { id: "drl-03", tenant_id: "gulf_water", title_en: "Executive Board Cyber Ransomware Tabletop Exercise", title_ar: "تمرين طاولة للإدارة التنفيذية: فدية برمجية سيبرانية", date: "2026-09-22", type: "tabletop", participants_count: 14, score_percent: 96, status: "completed" },
  { id: "drl-04", tenant_id: "gulf_water", title_en: "Muscat Regional Grid Blackout Failover Verification", title_ar: "اختبار انقطاع الكهرباء التام وتشغيل المولدات بشبكة مسقط", date: "2026-08-30", type: "full_scale", participants_count: 38, score_percent: 92, status: "completed" },
  { id: "drl-05", tenant_id: "gulf_water", title_en: "Tropical Cyclone Heavy Flooding Emergency Readiness", title_ar: "تمرين الجاهزية الميدانية للأنواء المناخية والفيضانات", date: "2026-07-18", type: "full_scale", participants_count: 55, score_percent: 91, status: "completed" },
  { id: "drl-06", tenant_id: "gulf_water", title_en: "Salalah Coastal Pumping Pipeline Rupture Response", title_ar: "محاكاة انفجار خط أنابيب الضخ الساحلي بصلالة", date: "2026-06-25", type: "functional", participants_count: 40, score_percent: 88, status: "completed" },
  { id: "drl-07", tenant_id: "gulf_water", title_en: "Desalination Seawater Intake Red Tide Containment", title_ar: "تمرين احتواء ظاهرة المد الأحمر بمآخذ مياه التحلية", date: "2026-05-19", type: "tabletop", participants_count: 22, score_percent: 95, status: "completed" },
  { id: "drl-08", tenant_id: "gulf_water", title_en: "Cross-Border Chemical Supply Disruption Tabletop", title_ar: "تمرين طاولة: تعطل سلاسل التوريد الكيميائي عبر الحدود", date: "2026-04-12", type: "tabletop", participants_count: 18, score_percent: 90, status: "completed" },
  { id: "drl-09", tenant_id: "gulf_water", title_en: "Duqm Port Perimeter Security Breach Drill", title_ar: "تمرين الاستجابة للاختراق الأمني بميناء الدقم", date: "2026-03-08", type: "unannounced", participants_count: 48, score_percent: 93, status: "completed" },
  { id: "drl-10", tenant_id: "gulf_water", title_en: "Barka Reverse Osmosis Membrane Failure Switchover", title_ar: "اختبار التبديل الطارئ لأغشية محطة تحلية بركاء", date: "2026-02-17", type: "functional", participants_count: 34, score_percent: 92, status: "completed" },
  { id: "drl-11", tenant_id: "gulf_water", title_en: "TETRA Emergency Radio Grid Outage Simulation", title_ar: "محاكاة انقطاع شبكة تيترا والاتصال اللاسلكي البديل", date: "2026-01-20", type: "tabletop", participants_count: 25, score_percent: 87, status: "completed" },
  { id: "drl-12", tenant_id: "gulf_water", title_en: "Annual Comprehensive Multi-Site National Continuity Exercise", title_ar: "التمرين الوطني السنوي الشامل لاستمرارية الأعمال", date: "2025-12-10", type: "full_scale", participants_count: 120, score_percent: 95, status: "completed" }
];

// Read seed/expanded.ts and update EXPANDED_SITES, EXPANDED_PLANS, EXPANDED_DRILLS, and unreached responders
let expandedCode = fs.readFileSync('seed/expanded.ts', 'utf8');

// Replace EXPANDED_SITES
expandedCode = expandedCode.replace(/export const EXPANDED_SITES: Site\[\] = \[[\s\S]*?\];/m,
  'export const EXPANDED_SITES: Site[] = ' + JSON.stringify(SITES_40, null, 2) + ';');

// Replace EXPANDED_PLANS
expandedCode = expandedCode.replace(/export const EXPANDED_PLANS: Plan\[\] = \[[\s\S]*?\];/m,
  'export const EXPANDED_PLANS: Plan[] = ' + JSON.stringify(PLANS_30, null, 2) + ';');

// Replace EXPANDED_DRILLS
expandedCode = expandedCode.replace(/export const EXPANDED_DRILLS: DrillItem\[\] = \[[\s\S]*?\];/m,
  'export const EXPANDED_DRILLS: DrillItem[] = ' + JSON.stringify(DRILLS_12, null, 2) + ';');

// Update EXPANDED_PEOPLE to ensure 3 unreached responders (indices 4, 17, 28)
expandedCode = expandedCode.replace(/reachability_score:\s*85\s*\+\s*\(i\s*%\s*15\),/m,
  'reachability_score: (i === 4 || i === 17 || i === 28) ? 45 : 85 + (i % 15),');

fs.writeFileSync('seed/expanded.ts', expandedCode, 'utf8');
console.log('seed/expanded.ts successfully updated with 40 sites, 30 plans, 12 drills, and 3 unreached responders.');

// Also update seed/data.ts for 11/12 active automations
let dataCode = fs.readFileSync('seed/data.ts', 'utf8');
// In rule-10, change enabled: true to enabled: false
dataCode = dataCode.replace(/id:\s*"rule-10",([\s\S]*?)enabled:\s*true,/m, 'id: "rule-10",$1enabled: false,');
fs.writeFileSync('seed/data.ts', dataCode, 'utf8');
console.log('seed/data.ts successfully updated with 11/12 active automations drama.');

// Update test/eval/seed-spec23.test.ts to verify the expanded counts
let testCode = fs.readFileSync('test/eval/seed-spec23.test.ts', 'utf8');
testCode = testCode.replace(/expect\(EXPANDED_PLANS\.length\)\.toBe\(\d+\);/m, 'expect(EXPANDED_PLANS.length).toBe(30);');
testCode = testCode.replace(/expect\(EXPANDED_DRILLS\.length\)\.toBe\(\d+\);/m, 'expect(EXPANDED_DRILLS.length).toBe(12);');
testCode = testCode.replace(/expect\(person\.reachability_score\)\.toBeGreaterThanOrEqual\(50\);/m, 'expect(person.reachability_score).toBeGreaterThanOrEqual(40);');

// Add test for 40 sites
if (!testCode.includes('contains exactly 40 sites')) {
  testCode = testCode.replace('describe("Spec 23 Exact Seed Data Counts & Formats", () => {',
    'describe("Spec 23 Exact Seed Data Counts & Formats", () => {\n  it("contains exactly 40 sites across GCC and international hubs", () => {\n    const { EXPANDED_SITES } = require("@/seed/expanded");\n    expect(EXPANDED_SITES.length).toBe(40);\n  });');
}
fs.writeFileSync('test/eval/seed-spec23.test.ts', testCode, 'utf8');
console.log('test/eval/seed-spec23.test.ts updated successfully.');
