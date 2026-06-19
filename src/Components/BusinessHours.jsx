import React, { useState, useEffect } from 'react';
import { CONFIG } from '../config/config.js';
import { ApiService } from '../services/ApiService.js';

export default function BusinessHours() {
  const [days, setDays] = useState([
    { key: 'Segunda', label: 'Segunda-feira', closed: false, start: '08:00', end: '18:00', error: '' },
    { key: 'Terca', label: 'Terça-feira', closed: false, start: '08:00', end: '18:00', error: '' },
    { key: 'Quarta', label: 'Quarta-feira', closed: false, start: '08:00', end: '18:00', error: '' },
    { key: 'Quinta', label: 'Quinta-feira', closed: false, start: '08:00', end: '18:00', error: '' },
    { key: 'Sexta', label: 'Sexta-feira', closed: false, start: '08:00', end: '18:00', error: '' },
    { key: 'Sabado', label: 'Sábado', closed: true, start: '', end: '', error: '' },
    { key: 'Domingo', label: 'Domingo', closed: true, start: '', end: '', error: '' },
  ]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await ApiService.request(CONFIG.ENDPOINTS.BH_GETALL, undefined, 'GET');
        const list = data?.businessHour ?? [];
        const byDay = Object.fromEntries(list.map(bh => [bh.dia, bh]));
        setDays(prev => prev.map(d => {
          const bh = byDay[d.key];
          if (!bh) return d;
          return {
            ...d,
            closed: !bh.hora_inicio,
            start: bh.hora_inicio ? bh.hora_inicio.slice(0, 5) : '',
            end: bh.hora_fim ? bh.hora_fim.slice(0, 5) : '',
            error: ''
          };
        }));
      } catch (err) { console.error(err); }
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all(days.map(d =>
        ApiService.request(CONFIG.ENDPOINTS.BH_UPDATE + d.key, {
          hora_inicio: d.closed ? null : d.start + ':00',
          hora_fim: d.closed ? null : d.end + ':00',
        }, 'PUT')
      ));
      alert('✓ Agenda comercial atualizada com sucesso.');
    } catch { alert('✕ Erro ao salvar horários.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-premium)] rounded-xl p-6 shadow-xl">
      <div className="flex justify-between items-center mb-6 border-b border-[var(--border-premium)] pb-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Horários de Operação</h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">Defina as janelas de atividade para a prospecção ativa do bot.</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {days.map(d => (
          <div key={d.key} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-[var(--bg-main)] border border-[var(--border-premium)] rounded-lg gap-4 hover:border-[var(--border-focus)] transition-colors">
            <span className="font-medium text-xs text-[var(--text-primary)] w-28">{d.label}</span>
            
            <div className="flex items-center gap-2 flex-1 justify-start sm:justify-center">
              {!d.closed ? (
                <div className="flex items-center gap-2 bg-[var(--bg-input)] px-3 py-1.5 rounded-md border border-[var(--border-premium)]">
                  <input type="text" maxLength={5} value={d.start} onChange={e => setDays(p => p.map(x => x.key === d.key ? {...x, start: e.target.value} : x))} className="w-10 bg-transparent text-center font-mono text-xs text-white outline-none" placeholder="08:00"/>
                  <span className="text-[var(--text-muted)] text-[11px] font-medium uppercase">até</span>
                  <input type="text" maxLength={5} value={d.end} onChange={e => setDays(p => p.map(x => x.key === d.key ? {...x, end: e.target.value} : x))} className="w-10 bg-transparent text-center font-mono text-xs text-white outline-none" placeholder="18:00"/>
                </div>
              ) : (
                <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider bg-[var(--bg-input)] px-2.5 py-1 rounded border border-[var(--border-premium)]/40">Inativo</span>
              )}
            </div>

            <button onClick={() => setDays(p => p.map(x => x.key === d.key ? {...x, closed: !x.closed, start: x.closed ? '08:00' : '', end: x.closed ? '18:00' : ''} : x))} className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-md border transition-all cursor-pointer ${d.closed ? 'bg-[var(--orange)]/10 border-[var(--orange)]/30 text-[var(--orange)]' : 'bg-[var(--bg-input)] border-[var(--border-premium)] text-[var(--text-secondary)] hover:text-white'}`}>
              {d.closed ? 'Ativar' : 'Pausar'}
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-5 mt-4 border-t border-[var(--border-premium)]">
        <button onClick={handleSave} disabled={saving} className="bg-[var(--orange)] hover:bg-[var(--orange-light)] text-white text-xs font-semibold rounded-lg px-4 py-2.5 cursor-pointer transition-all disabled:opacity-50">
          {saving ? 'Salvando...' : 'Salvar Configurações'}
        </button>
      </div>
    </div>
  );
}