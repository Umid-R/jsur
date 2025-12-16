import { useState } from 'react';
import { Check, X, Minus, Plus } from 'lucide-react';

type TabType = 'ada' | 'qaza';
type PrayerName = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

interface AdaPrayer {
  name: PrayerName;
  completed: boolean;
  reason?: string;
}

interface QazaPrayer {
  name: PrayerName;
  count: number;
}

export default function LogPage() {
  const [activeTab, setActiveTab] = useState<TabType>('ada');
  const [expandedPrayer, setExpandedPrayer] = useState<PrayerName | null>(null);

  const [adaPrayers, setAdaPrayers] = useState<AdaPrayer[]>([
    { name: 'Fajr', completed: false },
    { name: 'Dhuhr', completed: false },
    { name: 'Asr', completed: false },
    { name: 'Maghrib', completed: false },
    { name: 'Isha', completed: false },
  ]);

  const [qazaPrayers, setQazaPrayers] = useState<QazaPrayer[]>([
    { name: 'Fajr', count: 0 },
    { name: 'Dhuhr', count: 0 },
    { name: 'Asr', count: 0 },
    { name: 'Maghrib', count: 0 },
    { name: 'Isha', count: 0 },
  ]);

  const reasons = ['Sleep', 'Work/Study', 'Travel', 'Health', 'Forgot', 'Voice Message', 'Other'];

  const toggleAdaPrayer = (name: PrayerName) => {
    setAdaPrayers(prayers =>
      prayers.map(p => (p.name === name ? { ...p, completed: !p.completed } : p))
    );
    setExpandedPrayer(expandedPrayer === name ? null : name);
  };

  const updateQazaCount = (name: PrayerName, delta: number) => {
    setQazaPrayers(prayers =>
      prayers.map(p =>
        p.name === name ? { ...p, count: Math.max(0, p.count + delta) } : p
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#0f1419] text-white px-5 py-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold mb-1">Log Prayers</h1>
          <p className="text-gray-400 text-base">Track your daily prayers</p>
        </header>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveTab('ada')}
            className={`flex-1 py-4 rounded-2xl font-medium text-lg transition-all ${
              activeTab === 'ada'
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-800/50 text-gray-400 border border-gray-700/50'
            }`}
          >
            Ada
          </button>
          <button
            onClick={() => setActiveTab('qaza')}
            className={`flex-1 py-4 rounded-2xl font-medium text-lg transition-all ${
              activeTab === 'qaza'
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-800/50 text-gray-400 border border-gray-700/50'
            }`}
          >
            Qaza
          </button>
        </div>

        {activeTab === 'ada' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-2xl border border-teal-700/30 overflow-hidden">
              {adaPrayers.map((prayer, index) => (
                <div key={prayer.name}>
                  <div
                    className={`flex items-center justify-between p-5 cursor-pointer hover:bg-gray-800/30 transition-colors ${
                      expandedPrayer === prayer.name ? 'bg-gray-800/40' : ''
                    }`}
                    onClick={() => toggleAdaPrayer(prayer.name)}
                  >
                    <span className="text-xl">{prayer.name}</span>
                    <div className="flex items-center gap-4">
                      {prayer.completed && (
                        <Check size={20} className="text-emerald-500" />
                      )}
                      <button
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                          prayer.completed
                            ? 'bg-emerald-500/20 border-emerald-500'
                            : 'border-gray-600'
                        }`}
                      >
                        <X size={20} className={prayer.completed ? 'text-emerald-500' : 'text-gray-400'} />
                      </button>
                    </div>
                  </div>

                  {expandedPrayer === prayer.name && !prayer.completed && (
                    <div className="px-5 pb-5 pt-2">
                      <p className="text-gray-400 text-sm mb-1">Reason (optional)</p>
                      <p className="text-gray-500 text-xs mb-4">For personal reflection only</p>
                      <div className="flex flex-wrap gap-2">
                        {reasons.map((reason) => (
                          <button
                            key={reason}
                            className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-sm text-gray-300 transition-colors"
                          >
                            {reason}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {index < adaPrayers.length - 1 && (
                    <div className="h-px bg-gray-800/50 mx-5"></div>
                  )}
                </div>
              ))}
            </div>

            <button className="w-full bg-emerald-500 hover:bg-emerald-600 transition-colors py-4 rounded-2xl font-medium text-lg">
              Save
            </button>
          </div>
        )}

        {activeTab === 'qaza' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-2xl border border-teal-700/30 overflow-hidden">
              {qazaPrayers.map((prayer, index) => (
                <div key={prayer.name}>
                  <div className="flex items-center justify-between p-5">
                    <span className="text-xl">{prayer.name}</span>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => updateQazaCount(prayer.name, -1)}
                        className="w-10 h-10 rounded-full flex items-center justify-center border border-teal-700/50 hover:bg-gray-800/50 transition-colors"
                      >
                        <Minus size={18} className="text-gray-400" />
                      </button>
                      <span className="text-2xl font-medium w-12 text-center">{prayer.count}</span>
                      <button
                        onClick={() => updateQazaCount(prayer.name, 1)}
                        className="w-10 h-10 rounded-full flex items-center justify-center border border-emerald-500 hover:bg-emerald-500/20 transition-colors"
                      >
                        <Plus size={18} className="text-emerald-500" />
                      </button>
                    </div>
                  </div>
                  {index < qazaPrayers.length - 1 && (
                    <div className="h-px bg-gray-800/50 mx-5"></div>
                  )}
                </div>
              ))}
            </div>

            <button className="w-full bg-emerald-500 hover:bg-emerald-600 transition-colors py-4 rounded-2xl font-medium text-lg">
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
