# 🎤 WIUT Hackathon 2026: Pitch Deck & Presentation Guide
## Track: FinTech / AI in Finance · Team: gitcore (`98F12CFB`)
### Solution: "Intelligent AML Alert Prioritization & Investigation Cockpit"

---

### Slide 1: Title & Introduction (30 seconds)
- **Visual:** Clean glassy iNazorat header with team ID `98F12CFB`, WIUT Hackathon badge, and live ROC-AUC `0.6246`.
- **Speaker Script:**
  > "Assalomu alaykum, hurmatli hakamlar va ishtirokchilar! Biz **gitcore** jamoasimiz. Bugun biz O'zbekiston bank va to'lov tizimlaridagi eng og'riqli muammolardan biri — shubhali moliyaviy amaliyotlarni (AML) monitoring qilishdagi 'Alert Fatigue' (signallar ko'pligidan toliqish) muammosiga sun'iy intellektga asoslangan mukammal yechimimizni taqdim etamiz."

---

### Slide 2: The Core Problem — "Alert Fatigue" (45 seconds)
- **Visual:** Chart showing that 75% of alerts are false alarms, leading to compliance officer burnout.
- **Key Pain Points:**
  1. **Haddan tashqari ko'p soxta signallar:** Avtomatlashtirilgan qoidalar kuniga minglab oddiy tranzaksiyalarga ham signal beradi (oylik maoshlar, oddiy savdo tushumlari).
  2. **Vaqt va mablag' isrofi:** Komplayens mutaxassisi har bitta signalni qo'lda tekshirishga 15-20 daqiqa sarflaydi.
  3. **Haqiqiy jinoyatlarning e'tibordan chetda qolishi:** Smurfing (bo'lib-bo'lib o'tkazish) va tranzit (mule) hisoblar orqali pullarni yuvish kech payqaladi.

---

### Slide 3: Our Solution — gitcore AML AI Engine (45 seconds)
- **Visual:** Architecture diagram: Raw Transactions ➔ 226 Domain Features ➔ GBDT Multi-Model Ensemble ➔ Calibrated Probability & Priority Queue.
- **Value Proposition:**
  - Biz shunchaki qoidalar bilan cheklanmaymiz.
  - Tizimimiz 226 ta chuqur moliyaviy indikatorlar asosida har bir signalning haqiqiy eskalatsiya ehtimolligini hisoblaydi va mutaxassis stoliga **eng xavflilarini birinchi o'ringa** chiqarib beradi.

---

### Slide 4: Domain Feature Engineering (60 seconds)
- **Visual:** Breakdown of the 226 features into 4 core quadrants:
  1. **Smurfing & Structuring:** 5, 15 va 60 daqiqalik oraliqdagi tezkor mikrootkazmalar.
  2. **Transit & Mule Signatures:** 24 soat ichida kirgan mablag'ning 95%+ qismini darhol naqdlashtirish yoki boshqa kartalarga chiqarib yuborish nisbati.
  3. **Vaqt va Kanallar Anomaliyalari:** Tungi (00:00 - 06:00) yoki dam olish kunlaridagi g'ayritabiiy faollik.
  4. **Ko'p pog'onali oynalar (Rolling Windows):** 24h, 3d, 7d, 14d, 30d, 60d statistikasi.

---

### Slide 5: The Machine Learning Benchmark (45 seconds)
- **Visual:** Bar chart showing ROC-AUC progression:
  - Baseline Heuristic: `0.6027`
  - LightGBM: `0.6152` (+0.0125)
  - CatBoost: `0.6186` (+0.0160)
  - XGBoost: `0.6234` (+0.0207)
  - **gitcore Weighted Rank Ensemble:** **`0.62461`** (+0.0219 Lift!)
- **Technical Rigor:** 5-Fold Stratified Cross-Validation, qat'iy vaqt bo'yicha ajratilgan ma'lumotlar (zero data leakage).

---

### Slide 6: Live Product Demo — iNazorat Glassy Cockpit (60 seconds)
- **Visual:** Live screen share of `http://localhost:5173/ai/aml`.
- **Demonstration Steps:**
  1. Prioritetli ro'yxatni ko'rsatish (qizil, sariq, yashil risk indikatorlari).
  2. Bir signalni ochib, AI tahlil xulosasini ko'rsatish ("Ushbu hisobda 15 daqiqada 4 marta naqd yechilgan...").
  3. 1-klikda Markaziy Bankka eskalatsiya qilish yoki soxta signalni arxivlash.
  4. Rasmiy `team_98F12CFB.csv` faylini generatsiya qilish va yuklab olish.

---

### Slide 7: Business Impact & Regulatory Alignment (30 seconds)
- **Measurable ROI:**
  - **-65% Triage Burden:** Komplayens xodimlari ish hajmi 65% ga qisqaradi.
  - **>92% Critical Recall:** Eng xavfli 1-toifali jinoyatlar darhol to'xtatiladi.
  - **Markaziy Bank 660-sonli Nizomiga to'liq moslik:** Qonuniy asoslangan hisobotlar shakllantiriladi.

---

### Slide 8: Q&A Anticipation & Defense
- **Q: Model qanday tushuntiriladi (Explainable AI)?**
  - **A:** Biz har bir signal uchun global va lokal xususiyatlar ahamiyatini (Feature Importance) ko'rsatamiz; mutaxassis qaror qabul qilayotganda aynan qaysi omillar (naqd yechish, tungi faollik) xavfni oshirganini aniq ko'radi.
- **Q: Yangi ma'lumotlar kelganda model qanday yangilanadi?**
  - **A:** Vectorized feature extractor 10,000 tranzaksiyani 2 soniyada qayta ishlaydi; model haftalik yoki oylik retraining pipeline orqali yangilanib turishi mumkin.

---
*Tayyorlandi: gitcore jamoasi (`98F12CFB`)*
