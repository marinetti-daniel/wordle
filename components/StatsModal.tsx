import { Stats } from "@/lib/storage";

interface StatsModalProps {
  stats: Stats;
  onClose: () => void;
}

export default function StatsModal({ stats, onClose }: StatsModalProps) {
  const winPercent = stats.played ? Math.round((stats.wins / stats.played) * 100) : 0;
  // The longest bar fills the full width and the others are scaled to it.
  // Math.max(1, ...) avoids dividing by zero before any wins.
  const maxCount = Math.max(1, ...stats.distribution);

  const summary = [
    { label: "Played", value: stats.played },
    { label: "Win %", value: winPercent },
    { label: "Current Streak", value: stats.currentStreak },
    { label: "Max Streak", value: stats.maxStreak },
  ];

  return (
    // Clicking the dark backdrop closes the modal; clicking inside the box doesn't
    // (stopPropagation keeps the click from reaching the backdrop).
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Daily Statistics</h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer" aria-label="Close">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center mb-6">
          {summary.map((item) => (
            <div key={item.label}>
              <div className="text-2xl font-bold text-white">{item.value}</div>
              <div className="text-[11px] text-slate-400">{item.label}</div>
            </div>
          ))}
        </div>

        <h3 className="text-sm font-semibold text-slate-300 mb-2">Guess Distribution</h3>
        <div className="grid gap-1">
          {stats.distribution.map((count, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="w-3 text-slate-400">{i + 1}</span>
              <div
                className="bg-indigo-600 text-white text-right px-2 rounded-sm min-w-6"
                style={{ width: `${(count / maxCount) * 100}%` }}
              >
                {count}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
