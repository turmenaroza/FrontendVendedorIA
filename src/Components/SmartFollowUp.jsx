import React, { useState, useEffect } from 'react';
import { CONFIG } from '../config/config.js';
import { ApiService } from '../services/ApiService.js';

export default function SmartFollowUp() {
  const [interval, setIntervalVal] = useState('');
  const [limit, setLimit] = useState('');
  const [daysReset, setDaysReset] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await ApiService.request(CONFIG.ENDPOINTS.CONFIG_LOAD, { key: CONFIG.KEYS.FOLLOWUP });
        const config = data?.followUpConfig;
        if (config) {
          setIntervalVal(Math.round(parseInt(config.interval, 10) / 60000));
          setLimit(config.followUpLimit);
          setDaysReset(config.daysToResetCounter);
        }
      } catch (err) { console.error(err); }
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await ApiService.request(CONFIG.ENDPOINTS.CONFIG_SAVE, {
        key: CONFIG.KEYS.FOLLOWUP,
        interval: String(parseInt(interval, 10) * 60000),
        followUpLimit: parseInt(limit, 10),
        daysToResetCounter: parseInt(daysReset, 10),
      });
      alert('✓ Configurações de cadência atualizadas.');
    } catch { alert('✕ Erro ao salvar.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-premium)] rounded-xl p-6 shadow-xl">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-[var(--text-primary)]">Esteira de Re-prospecção</h2>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">Configure os ciclos, limites e tempos de espera das abordagens secundárias.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Intervalo de Rotina', desc: 'Minutos entre checagens de novas mensagens.', val: interval, set: setIntervalVal, unit: 'MIN' },
          { label: 'Limite de Mensagens', desc: 'Máximo de cobranças enviadas por contato.', val: limit, set: setLimit, unit: 'MSG' },
          { label: 'Janela de Reset', desc: 'Dias para limpar o contador e reabordar.', val: daysReset, set: setDaysReset, unit: 'DIAS' }
        ].map((item, idx) => (
          <div key={idx} className="p-4 bg-[var(--bg-main)] border border-[var(--border-premium)] rounded-lg flex flex-col justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-[var(--text-primary)]">{item.label}</h4>
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
            </div>
            <div className="flex items-center gap-2 bg-[var(--bg-input)] px-3 py-1.5 rounded-md border border-[var(--border-premium)] w-fit">
              <input type="number" value={item.val} onChange={e => item.set(e.target.value)} className="w-12 bg-transparent text-center text-xs font-semibold text-white outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <span className="text-[10px] font-bold text-[var(--text-muted)]">{item.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-5 mt-5 border-t border-[var(--border-premium)]">
        <button onClick={handleSave} disabled={saving} className="bg-[var(--orange)] hover:bg-[var(--orange-light)] text-white text-xs font-semibold rounded-lg px-4 py-2.5 cursor-pointer transition-all disabled:opacity-50">
          {saving ? 'Salvando...' : 'Salvar Esteira'}
        </button>
      </div>
    </div>
  );
}