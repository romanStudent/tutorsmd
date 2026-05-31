import { useGetUserLessonsQuery } from '@shared/index';
import {
  LineChart, Line, CartesianGrid,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useMemo } from 'react';
import { Spinner } from '@shared/index';
import { useTranslation } from 'react-i18next';

export const ProgressChart = () => {
  const { t } = useTranslation('progressChart');

  const { data, isLoading } = useGetUserLessonsQuery({ status: 'completed' });

  const chartData = useMemo(() => {
    if (!data?.lessons.length) return [];

    const weeks: Record<string, number> = {};

    data.lessons.forEach((lesson) => {
      const date  = new Date(lesson.completedAt ?? lesson.scheduledAt);
      const start = new Date(date);
      start.setDate(date.getDate() - date.getDay());
      const key = start.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
      weeks[key] = (weeks[key] ?? 0) + lesson.durationMinutes / 60;
    });

    return Object.entries(weeks)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-8)
      .map(([week, hours]) => ({
        week,
        hours: Math.round(hours * 10) / 10,
      }));
  }, [data]);

  if (isLoading) return <Spinner />;

  if (!chartData.length) {
    return (
      <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-8 text-center">
        <p className="text-slate-400 text-sm">{t('empty')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-5">
        {t('title')}
        <span className="text-slate-400 font-normal text-sm ml-2">({t('subtitle')})</span>
      </h2>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <Line
            type="monotone"
            dataKey="hours"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 4, fill: '#2563eb', strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#2563eb' }}
          />
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
          <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} unit="h" axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: 'none',
              fontSize: '13px',
            }}
            formatter={(v: number) => [`${v}h`, t('tooltip.label')]}
            labelFormatter={(l) => t('tooltip.week', { week: l })}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};