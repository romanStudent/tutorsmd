import { useState } from 'react';
import {
  useGetTutorSlotsQuery,
  useCreateSlotMutation,
  useDeleteSlotMutation,
} from '@shared/api/slotApi';
import { Spinner } from '@shared/index';

const DAY_NAMES = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

export const AvailableSlotsForm = () => {
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime,   setEndTime]   = useState('10:00');
  const [error, setError] = useState<string | null>(null);

  const { data: slotsData, isLoading } = useGetTutorSlotsQuery();
  const [createSlot, { isLoading: creating }] = useCreateSlotMutation();
  const [deleteSlot] = useDeleteSlotMutation();

  const slots = slotsData?.slots ?? [];

  const handleAdd = async () => {
    setError(null);
    if (startTime >= endTime) {
      setError('Endzeit muss nach Startzeit liegen');
      return;
    }
    try {
      await createSlot({ dayOfWeek, startTime, endTime }).unwrap();
    } catch (err: any) {
      setError(err?.data?.message ?? 'Fehler beim Erstellen');
    }
  };

  const handleDelete = async (slotId: string) => {
    await deleteSlot(slotId).unwrap().catch(() => {});
  };

  if (isLoading) return <Spinner />;

  const slotsByDay = DAY_NAMES.map((_, i) =>
    slots.filter(s => s.dayOfWeek === i)
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-1">
          Verfügbarkeit hinzufügen
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Wählen Sie Tage und Zeiten, wann Sie unterrichten können.
        </p>

        {/* Add slot form */}
        <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
          {/* Day selector */}
          <div className="flex flex-wrap gap-2">
            {DAY_NAMES.map((day, i) => (
              <button key={i} type="button"
                onClick={() => setDayOfWeek(i)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition border
                  ${dayOfWeek === i
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400'}`}>
                {day}
              </button>
            ))}
          </div>

          {/* Time inputs */}
          <div className="flex gap-3 items-center">
            <div>
              <label className="text-xs text-slate-500 block mb-1">Von</label>
              <input type="time" value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="border border-slate-300 rounded-xl px-3 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-100" />
            </div>
            <span className="text-slate-400 mt-4">—</span>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Bis</label>
              <input type="time" value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="border border-slate-300 rounded-xl px-3 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-100" />
            </div>
            <button type="button" onClick={handleAdd}
              disabled={creating}
              className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50
                text-white text-sm font-medium px-4 py-2 rounded-xl transition">
              {creating ? '...' : '+ Hinzufügen'}
            </button>
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>
      </div>

      {/* Slots by day */}
      <div className="space-y-3">
        {DAY_NAMES.map((day, i) => {
          const daySlots = slotsByDay[i];
          if (daySlots.length === 0) return null;
          return (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4">
              <p className="text-sm font-semibold text-slate-700 mb-2">{day}</p>
              <div className="flex flex-wrap gap-2">
                {daySlots.map(slot => (
                  <div key={slot.id}
                    className="flex items-center gap-1.5 bg-blue-50 border border-blue-200
                      rounded-lg px-3 py-1.5">
                    <span className="text-sm text-blue-700">
                      {slot.startTime} – {slot.endTime}
                    </span>
                    <button onClick={() => handleDelete(slot.id)}
                      className="text-blue-400 hover:text-red-500 transition text-xs ml-1">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {slots.length === 0 && (
          <div className="bg-white rounded-3xl border border-dashed border-slate-200
            p-8 text-center">
            <p className="text-slate-400 text-sm">
              Noch keine Verfügbarkeiten. Fügen Sie Ihre verfügbaren Zeiten hinzu.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};