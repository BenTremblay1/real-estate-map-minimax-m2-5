// @ts-nocheck
import { useMemo, useState } from 'react';
import { PropertyScore, getAllPropertyScores } from '../../data/investmentAnalytics';
import { getPropertiesForQuarter } from '../../data/historicalData';
import { ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';

interface DealScoringTableProps {
  selectedQuarter: string;
}

type SortField = 'score' | 'yieldScore' | 'appreciationScore' | 'locationScore';
type SortOrder = 'asc' | 'desc';

export default function DealScoringTable({ selectedQuarter }: DealScoringTableProps) {
  const [sortField, setSortField] = useState<SortField>('score');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showTop50, setShowTop50] = useState(true);

  const scores = useMemo(() => {
    const allScores = getAllPropertyScores(selectedQuarter);
    const properties = getPropertiesForQuarter(selectedQuarter);

    // Merge scores with property data
    return allScores.map(score => {
      const property = properties.find(p => p.id === score.propertyId);
      return {
        ...score,
        price: property?.adjustedPricePerUnit || 0,
        distanceToMRT: property?.distanceToMRT || 0,
        convenienceStores: property?.convenienceStores || 0,
      };
    });
  }, [selectedQuarter]);

  const sortedScores = useMemo(() => {
    const sorted = [...scores].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });
    return showTop50 ? sorted.slice(0, 50) : sorted;
  }, [scores, sortField, sortOrder, showTop50]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (score >= 50) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-30" />;
    return sortOrder === 'desc' ? (
      <ChevronDown className="w-3 h-3 ml-1" />
    ) : (
      <ChevronUp className="w-3 h-3 ml-1" />
    );
  };

  return (
    <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Deal Scoring</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTop50(!showTop50)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              showTop50
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            Top 50
          </button>
          <button
            onClick={() => setShowTop50(false)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              !showTop50
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            All 414
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left text-xs font-medium text-slate-500 pb-3 pr-4">ID</th>
              <th
                className="text-left text-xs font-medium text-slate-500 pb-3 pr-4 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('score')}
              >
                <div className="flex items-center">
                  Score
                  <SortIcon field="score" />
                </div>
              </th>
              <th
                className="text-left text-xs font-medium text-slate-500 pb-3 pr-4 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('yieldScore')}
              >
                <div className="flex items-center">
                  Yield
                  <SortIcon field="yieldScore" />
                </div>
              </th>
              <th
                className="text-left text-xs font-medium text-slate-500 pb-3 pr-4 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('appreciationScore')}
              >
                <div className="flex items-center">
                  Apprec.
                  <SortIcon field="appreciationScore" />
                </div>
              </th>
              <th
                className="text-left text-xs font-medium text-slate-500 pb-3 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('locationScore')}
              >
                <div className="flex items-center">
                  Location
                  <SortIcon field="locationScore" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedScores.slice(0, 10).map((item) => (
              <tr
                key={item.propertyId}
                className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
              >
                <td className="py-3 pr-4 text-sm text-slate-400">#{item.propertyId}</td>
                <td className="py-3 pr-4">
                  <span
                    className={`inline-flex items-center justify-center w-10 h-6 text-xs font-bold rounded border ${getScoreColor(
                      item.score
                    )}`}
                  >
                    {item.score}
                  </span>
                </td>
                <td className="py-3 pr-4 text-sm text-slate-300">{item.yieldScore}</td>
                <td className="py-3 pr-4 text-sm text-slate-300">{item.appreciationScore}</td>
                <td className="py-3 text-sm text-slate-300">{item.locationScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-slate-500">70+ Strong Buy</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
          <span className="text-slate-500">50-69 Hold</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <span className="text-slate-500">&lt;50 Avoid</span>
        </div>
      </div>
    </div>
  );
}
