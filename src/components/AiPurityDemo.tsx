import React, { useState } from 'react';
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  IndianRupee,
  Loader2,
  ScanLine,
  Upload,
  XCircle,
} from 'lucide-react';
import {
  getPurityBand,
  SAMPLE_BAG_SCENARIOS,
  SAMPLE_RATES,
} from '../data/mockData';
import { TRANSLATIONS } from '../i18n';
import type { BagColor, DetectedItem, Language } from '../types';

interface AiPurityDemoProps {
  language: Language;
}

type UploadPreset = 'clean' | 'minor_mix' | 'heavy_mix' | 'rejected';

function buildCustomSimulation(
  bagColor: BagColor,
  preset: UploadPreset
): { purityPct: number; items: DetectedItem[] } {
  const isGreen = bagColor === 'green';

  if (preset === 'clean') {
    return {
      purityPct: 95,
      items: isGreen
        ? [
            {
              nameEn: 'Vegetable Peels & Kitchen Scraps',
              nameHi: 'सब्जी के छिलके और रसोई कचरा',
              confidencePct: 97,
              isCorrectForBag: true,
              noteEn: 'Compostable organic matter',
              noteHi: 'खाद योग्य जैविक कचरा',
            },
            {
              nameEn: 'Coffee Grounds & Tea Leaves',
              nameHi: 'चायपत्ती और कॉफी अवशेष',
              confidencePct: 94,
              isCorrectForBag: true,
              noteEn: 'Biodegradable organic waste',
              noteHi: 'जैविक कचरा — सही बैग',
            },
          ]
        : [
            {
              nameEn: 'Clear PET Bottles & Jugs',
              nameHi: 'साफ प्लास्टिक बोतलें',
              confidencePct: 97,
              isCorrectForBag: true,
              noteEn: 'Clean dry recyclable plastic',
              noteHi: 'साफ सूखा प्लास्टिक',
            },
            {
              nameEn: 'Dry Cardboard & Paper Packaging',
              nameHi: 'सूखा गत्ता और कागज़',
              confidencePct: 95,
              isCorrectForBag: true,
              noteEn: 'Clean dry paperboard',
              noteHi: 'साफ सूखा कागज़',
            },
          ],
    };
  }

  if (preset === 'minor_mix') {
    return {
      purityPct: 74,
      items: isGreen
        ? [
            {
              nameEn: 'Fruit Rinds & Cooked Food Scraps',
              nameHi: 'फलों के छिलके और बचा भोजन',
              confidencePct: 96,
              isCorrectForBag: true,
              noteEn: 'Accepted in Green bag',
              noteHi: 'हरे बैग के लिए सही',
            },
            {
              nameEn: 'Plastic Biscuit Wrapper',
              nameHi: 'बिस्कुट का प्लास्टिक रैपर',
              confidencePct: 92,
              isCorrectForBag: false,
              noteEn: 'Contaminant — move to Blue bag',
              noteHi: 'ग़लत बैग — नीले बैग में डालें',
            },
          ]
        : [
            {
              nameEn: 'HDPE Detergent Bottle & Paper',
              nameHi: 'प्लास्टिक बोतल और कागज़',
              confidencePct: 95,
              isCorrectForBag: true,
              noteEn: 'Accepted in Blue bag',
              noteHi: 'नीले बैग के लिए सही',
            },
            {
              nameEn: 'Soiled Food Napkins',
              nameHi: 'खाने से सने गीले नैपकिन',
              confidencePct: 89,
              isCorrectForBag: false,
              noteEn: 'Wet organic — move to Green bag',
              noteHi: 'गीला कचरा — हरे बैग में डालें',
            },
          ],
    };
  }

  if (preset === 'heavy_mix') {
    return {
      purityPct: 48,
      items: [
        {
          nameEn: isGreen ? 'Kitchen Peels (50%)' : 'Dry Plastic Containers (50%)',
          nameHi: isGreen ? 'रसोई छिलके (50%)' : 'सूखे प्लास्टिक डिब्बे (50%)',
          confidencePct: 93,
          isCorrectForBag: true,
          noteEn: 'Correct items in bag',
          noteHi: 'सही सामग्री',
        },
        {
          nameEn: isGreen
            ? 'Mixed Plastic Carry Bags & Foil'
            : 'Wet Vegetable Waste & Coconut Shells',
          nameHi: isGreen
            ? 'प्लास्टिक थैलियां और फॉयल'
            : 'गीला सब्जी कचरा और नारियल खोल',
          confidencePct: 91,
          isCorrectForBag: false,
          noteEn: 'Heavy contamination — 0.1× payout',
          noteHi: 'अधिक मिलावट — केवल 10% इनाम',
        },
      ],
    };
  }

  return {
    purityPct: 26,
    items: [
      {
        nameEn: isGreen ? 'Broken Glass & Plastic Wrappers' : 'Wet Slurry & Food Waste',
        nameHi: isGreen ? 'टूटा कांच और प्लास्टिक रैपर' : 'गीला कचरा और जूठन',
        confidencePct: 95,
        isCorrectForBag: false,
        noteEn: 'Severe contamination (>70%) — rejected',
        noteHi: 'गंभीर मिलावट (>70%) — बैग अस्वीकृत',
      },
      {
        nameEn: 'Unsegregated Household Trash',
        nameHi: 'बिना छांटा मिलाजुला कचरा',
        confidencePct: 90,
        isCorrectForBag: false,
        noteEn: 'Please separate wet and dry waste before drop-off',
        noteHi: 'कृपया जमा करने से पहले गीला और सूखा कचरा अलग करें',
      },
    ],
  };
}

export const AiPurityDemo: React.FC<AiPurityDemoProps> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const [selectedSampleId, setSelectedSampleId] = useState<string>(SAMPLE_BAG_SCENARIOS[1].id);
  const [customImageUrl, setCustomImageUrl] = useState<string | null>(null);
  const [customFileName, setCustomFileName] = useState<string>('');
  const [bagColor, setBagColor] = useState<BagColor>(SAMPLE_BAG_SCENARIOS[1].bagColor);
  const [weightKg, setWeightKg] = useState<number>(SAMPLE_BAG_SCENARIOS[1].weightKg);
  const [uploadPreset, setUploadPreset] = useState<UploadPreset>('minor_mix');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [imgLoadError, setImgLoadError] = useState<boolean>(false);

  const activeSample = SAMPLE_BAG_SCENARIOS.find((s) => s.id === selectedSampleId);

  const [result, setResult] = useState<{
    purityPct: number;
    items: DetectedItem[];
    bagColor: BagColor;
    weightKg: number;
  }>({
    purityPct: SAMPLE_BAG_SCENARIOS[1].purityPct,
    items: SAMPLE_BAG_SCENARIOS[1].items,
    bagColor: SAMPLE_BAG_SCENARIOS[1].bagColor,
    weightKg: SAMPLE_BAG_SCENARIOS[1].weightKg,
  });

  const handleSelectSample = (sampleId: string) => {
    const sample = SAMPLE_BAG_SCENARIOS.find((s) => s.id === sampleId);
    if (!sample) return;
    setSelectedSampleId(sampleId);
    setCustomImageUrl(null);
    setCustomFileName('');
    setImgLoadError(false);
    setBagColor(sample.bagColor);
    setWeightKg(sample.weightKg);
    setResult({
      purityPct: sample.purityPct,
      items: sample.items,
      bagColor: sample.bagColor,
      weightKg: sample.weightKg,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setCustomImageUrl(objectUrl);
    setCustomFileName(file.name);
    setSelectedSampleId('custom');
    setImgLoadError(false);
  };

  const handleRunScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      if (customImageUrl || selectedSampleId === 'custom') {
        const sim = buildCustomSimulation(bagColor, uploadPreset);
        setResult({
          purityPct: sim.purityPct,
          items: sim.items,
          bagColor,
          weightKg,
        });
      } else if (activeSample) {
        // If user switched bag color on a sample photo, reflect realistic mismatch or match
        const matchesSampleColor = bagColor === activeSample.bagColor;
        const purity = matchesSampleColor ? activeSample.purityPct : 24;
        const items = matchesSampleColor
          ? activeSample.items
          : activeSample.items.map((it) => ({
              ...it,
              isCorrectForBag: false,
              noteEn: `Wrong bag colour! These items belong in the ${
                activeSample.bagColor === 'blue' ? 'Blue' : 'Green'
              } bag.`,
              noteHi: `गलत रंग का बैग! ये वस्तुएं ${
                activeSample.bagColor === 'blue' ? 'नीले' : 'हरे'
              } बैग में जानी चाहिए।`,
            }));
        setResult({
          purityPct: purity,
          items,
          bagColor,
          weightKg,
        });
      }
      setIsScanning(false);
    }, 450);
  };

  const previewUrl = customImageUrl ?? activeSample?.imageUrl ?? '';
  const bandInfo = getPurityBand(result.purityPct);
  const ratePerKg = SAMPLE_RATES[result.bagColor];
  const calculatedReward = Number((result.weightKg * ratePerKg * bandInfo.factor).toFixed(2));

  const bandRows = [
    {
      range: '90% – 100%',
      factor: '1.0×',
      descEn: 'Accept · Full pay',
      descHi: 'स्वीकृत · पूरा इनाम',
      active: result.purityPct >= 90,
    },
    {
      range: '60% – 89%',
      factor: '0.5×',
      descEn: 'Reduced pay · Show errors',
      descHi: 'आधा इनाम · सुधार दिखाएं',
      active: result.purityPct >= 60 && result.purityPct < 90,
    },
    {
      range: '40% – 59%',
      factor: '0.1×',
      descEn: 'Low pay · Show errors',
      descHi: '10% इनाम · सुधार दिखाएं',
      active: result.purityPct >= 40 && result.purityPct < 60,
    },
    {
      range: 'Below 40%',
      factor: '0×',
      descEn: 'Reject with feedback',
      descHi: 'अस्वीकृत · दोबारा छांटें',
      active: result.purityPct < 40,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          {t.aiDemoTitle}
        </h1>
        <p className="mt-1 max-w-3xl text-sm text-slate-600 dark:text-slate-400">
          {t.aiDemoSub}
        </p>
      </div>

      {/* Main 2-Column Workspace */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Left: Input Controls & Photo Preview */}
        <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-6 dark:border-slate-800 dark:bg-slate-900">
          <div>
            <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
              {t.step1Title}
            </h2>

            {/* Pre-loaded Sample Buttons */}
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {SAMPLE_BAG_SCENARIOS.map((sample) => {
                const isSelected = selectedSampleId === sample.id;
                return (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSelectSample(sample.id)}
                    className={`min-h-[44px] rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-colors ${
                      isSelected
                        ? 'border-[#2E7D32] bg-[#2E7D32]/10 text-[#2E7D32] dark:border-emerald-500 dark:bg-emerald-950/50 dark:text-emerald-300'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    {language === 'hi' ? sample.titleHi : sample.titleEn}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Photo Preview + Upload Dropzone */}
          <div className="space-y-3">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800">
              {previewUrl && !imgLoadError ? (
                <img
                  src={previewUrl}
                  alt={customFileName || activeSample?.titleEn || 'Waste bag sample'}
                  referrerPolicy="no-referrer"
                  onError={() => setImgLoadError(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-center text-slate-500 dark:text-slate-400">
                  <Camera className="h-10 w-10" />
                  <p className="text-sm font-semibold">
                    {customFileName || 'Bag preview ready for AI inspection'}
                  </p>
                </div>
              )}
            </div>

            <label className="flex min-h-[48px] cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-[#1565C0] hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:border-blue-500">
              <Upload className="h-4 w-4 text-[#1565C0] dark:text-blue-400" />
              <span>
                {customFileName
                  ? `${t.uploadLabel}: ${customFileName}`
                  : `${t.uploadLabel} (${t.uploadHint})`}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>
          </div>

          {/* Custom Upload Simulation Preset (only when user uploaded their own photo) */}
          {selectedSampleId === 'custom' && (
            <div>
              <p className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                {language === 'hi'
                  ? 'सिमुलेशन परिणाम चुनें (अपलोड फोटो टेस्ट के लिए)'
                  : 'Mock AI Test Outcome (for your uploaded photo)'}
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(
                  [
                    { id: 'clean', label: '95% Clean' },
                    { id: 'minor_mix', label: '74% Half Pay' },
                    { id: 'heavy_mix', label: '48% Low Pay' },
                    { id: 'rejected', label: '26% Reject' },
                  ] as const
                ).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setUploadPreset(p.id)}
                    className={`min-h-[38px] rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${
                      uploadPreset === p.id
                        ? 'border-[#1565C0] bg-[#1565C0] text-white'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bag Colour + Weight */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-bold text-slate-800 dark:text-slate-200">
                {t.bagColorSelect}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setBagColor('green')}
                  className={`flex min-h-[44px] items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition-colors ${
                    bagColor === 'green'
                      ? 'border-[#2E7D32] bg-[#2E7D32] text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                  }`}
                >
                  <span
                    className={`h-3 w-3 rounded-sm ${
                      bagColor === 'green' ? 'bg-white' : 'bg-[#2E7D32]'
                    }`}
                    aria-hidden="true"
                  />
                  <span>{language === 'hi' ? 'हरा बैग' : 'Green Bag'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBagColor('blue')}
                  className={`flex min-h-[44px] items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition-colors ${
                    bagColor === 'blue'
                      ? 'border-[#1565C0] bg-[#1565C0] text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                  }`}
                >
                  <span
                    className={`h-3 w-3 rounded-sm ${
                      bagColor === 'blue' ? 'bg-white' : 'bg-[#1565C0]'
                    }`}
                    aria-hidden="true"
                  />
                  <span>{language === 'hi' ? 'नीला बैग' : 'Blue Bag'}</span>
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="demo-weight-input"
                className="mb-2 block text-sm font-bold text-slate-800 dark:text-slate-200"
              >
                {t.weightLabel}
              </label>
              <input
                id="demo-weight-input"
                type="number"
                min="0.5"
                max="30"
                step="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(Math.max(0.1, Number(e.target.value) || 0.1))}
                className="font-mono-num min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-base font-bold text-slate-900 focus:border-[#2E7D32] focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleRunScan}
            disabled={isScanning}
            className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#2E7D32] px-5 py-3 text-base font-bold text-white transition-colors hover:bg-[#256628] disabled:opacity-70"
          >
            {isScanning ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>{t.analyzingBtn}</span>
              </>
            ) : (
              <>
                <ScanLine className="h-5 w-5" />
                <span>{t.runCheckBtn}</span>
              </>
            )}
          </button>
        </section>

        {/* Right: AI Output, Payout Calculation, and Rules */}
        <div className="space-y-6 xl:col-span-6">
          {/* Result Summary + Payout Math */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {t.finalPayoutTitle}
                </p>
                <div className="mt-1 flex items-baseline gap-3">
                  <span className="font-mono-num text-4xl font-extrabold text-slate-900 dark:text-white">
                    {result.purityPct}%
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      bandInfo.band === 'full'
                        ? 'text-[#2E7D32] dark:text-emerald-400'
                        : bandInfo.band === 'half' || bandInfo.band === 'low'
                        ? 'text-amber-700 dark:text-amber-400'
                        : 'text-red-700 dark:text-red-400'
                    }`}
                  >
                    {language === 'hi' ? bandInfo.actionHi : bandInfo.actionEn}
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-slate-100 px-4 py-3 text-right dark:bg-slate-800">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {language === 'hi' ? 'अंतिम इनाम' : 'Instant Reward'}
                </p>
                <p className="font-mono-num flex items-center justify-end text-3xl font-extrabold text-[#2E7D32] dark:text-emerald-400">
                  <IndianRupee className="h-6 w-6" />
                  <span>{calculatedReward.toFixed(2)}</span>
                </p>
              </div>
            </div>

            {/* Step-by-step Formula Display */}
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {language === 'hi'
                  ? 'इनाम सूत्र: वजन (kg) × श्रेणी दर (₹/kg) × शुद्धता गुणांक'
                  : 'Reward = Weight (kg) × Category Rate (₹/kg) × Purity Factor'}
              </p>
              <p className="font-mono-num mt-2 text-base font-bold text-slate-900 dark:text-white">
                {result.weightKg.toFixed(2)} kg × ₹{ratePerKg}/kg × {bandInfo.factor} = ₹
                {calculatedReward.toFixed(2)}
              </p>
              <p className="mt-1.5 text-xs font-medium text-[#1565C0] dark:text-blue-300">
                {t.sampleRateNote}
              </p>
            </div>

            {/* Detected Items List */}
            <div className="mt-6">
              <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                {t.detectedItemsTitle}
              </h3>
              <div className="mt-3 divide-y divide-slate-200 dark:divide-slate-800">
                {result.items.map((item, idx) => (
                  <div
                    key={`${item.nameEn}-${idx}`}
                    className="flex items-start justify-between gap-3 py-3 first:pt-1 last:pb-0"
                  >
                    <div className="flex items-start gap-2.5">
                      {item.isCorrectForBag ? (
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#2E7D32] dark:text-emerald-400" />
                      ) : result.purityPct < 40 ? (
                        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
                      ) : (
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                      )}
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {language === 'hi' ? item.nameHi : item.nameEn}
                        </p>
                        <p
                          className={`text-xs font-medium ${
                            item.isCorrectForBag
                              ? 'text-slate-500 dark:text-slate-400'
                              : 'text-amber-700 dark:text-amber-400'
                          }`}
                        >
                          {language === 'hi' ? item.noteHi : item.noteEn}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono-num shrink-0 text-xs font-bold text-slate-600 dark:text-slate-300">
                      {item.confidencePct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Payout Rules & Purity Bands Reference */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
              {t.payoutRulesTitle}
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {t.sampleRateNote}
            </p>

            <div className="mt-4 divide-y divide-slate-200 dark:divide-slate-800">
              {bandRows.map((row) => (
                <div
                  key={row.range}
                  className={`flex items-center justify-between gap-4 py-2.5 text-sm ${
                    row.active
                      ? 'font-bold text-slate-900 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        row.active ? 'bg-[#2E7D32] dark:bg-emerald-400' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                      aria-hidden="true"
                    />
                    <span className="font-mono-num">{row.range}</span>
                  </div>
                  <span className="font-mono-num">{row.factor}</span>
                  <span className="text-right text-xs sm:text-sm">
                    {language === 'hi' ? row.descHi : row.descEn}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
