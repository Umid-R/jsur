import { BarChart3, Calendar } from 'lucide-react';

export default function HomePage() {
  const weeklyActivity = [true, true, false, true, false, true, false];

  const prayerBreakdown = [
    { name: 'Fajr', count: 310 },
    { name: 'Dhuhr', count: 295 },
    { name: 'Asr', count: 260 },
    { name: 'Maghrib', count: 210 },
    { name: 'Isha', count: 173 },
  ];

  const maxCount = Math.max(...prayerBreakdown.map(p => p.count));

  return (
    <div className="min-h-screen bg-[#0f1419] text-white px-5 py-8">
      <div className="max-w-2xl mx-auto space-y-5">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold mb-1">Assalamu Alaikum</h1>
          <p className="text-gray-400 text-base">Let's make up what we missed</p>
        </header>

        <div className="bg-gradient-to-br from-teal-900/30 to-teal-800/20 rounded-3xl p-6 border border-teal-700/40 shadow-lg">
          <div className="text-center">
            <p className="text-gray-300 text-sm mb-3">Total Qaza Remaining</p>
            <h2 className="text-7xl font-bold mb-2">124</h2>
            <p className="text-gray-400 text-sm mb-6">prayers</p>

            <div className="h-px bg-teal-700/40 mb-4"></div>

            <p className="text-emerald-400 text-base mb-3">Completed today: 2</p>
            <div className="w-full bg-gray-800/50 rounded-full h-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '30%' }}></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="bg-emerald-500 hover:bg-emerald-600 transition-colors rounded-2xl p-6 flex flex-col items-center gap-3">
            <BarChart3 size={32} strokeWidth={2} />
            <span className="font-medium text-lg">View Stats</span>
          </button>
          <button className="bg-emerald-500 hover:bg-emerald-600 transition-colors rounded-2xl p-6 flex flex-col items-center gap-3">
            <Calendar size={32} strokeWidth={2} />
            <span className="font-medium text-lg">Calendar</span>
          </button>
        </div>

        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-2xl p-6 border border-teal-700/30">
          <h3 className="text-xl font-semibold mb-4">Today's Qaza Goal</h3>
          <p className="text-gray-300 text-base mb-4">2 prayers remaining</p>
          <div className="w-full bg-gray-800/50 rounded-full h-2.5 overflow-hidden mb-2">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '50%' }}></div>
          </div>
          <p className="text-gray-400 text-sm">1 of 2 completed</p>
        </div>

        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-2xl p-6 border border-teal-700/30">
          <h3 className="text-xl font-semibold mb-4">Weekly Consistency</h3>
          <p className="text-gray-300 text-base mb-5">Active 4 of last 7 days</p>
          <div className="flex gap-2">
            {weeklyActivity.map((active, index) => (
              <div
                key={index}
                className={`flex-1 h-12 rounded-lg ${
                  active ? 'bg-emerald-500' : 'bg-gray-800/50'
                }`}
              ></div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-2xl p-6 border border-teal-700/30">
          <h3 className="text-xl font-semibold mb-6">Your Journey</h3>

          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-400 text-base">Started:</span>
            <span className="text-white text-base">12 May</span>
          </div>

          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-400 text-base">Most missed:</span>
            <span className="text-white text-base">Fajr</span>
          </div>

          <div className="h-px bg-gray-700 mb-4"></div>

          <p className="text-gray-300 text-sm mb-4">Total Qaza Remaining: 1,248</p>

          <div className="space-y-4">
            {prayerBreakdown.map((prayer) => (
              <div key={prayer.name} className="flex items-center gap-3">
                <span className="text-white text-base w-20">{prayer.name}</span>
                <div className="flex-1 bg-gray-800/50 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${(prayer.count / maxCount) * 100}%` }}
                  ></div>
                </div>
                <span className="text-gray-400 text-base w-12 text-right">{prayer.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
