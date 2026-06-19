import React, { useState, useEffect } from 'react';
import { CONFIG } from '../config/config.js';
import { ApiService } from '../services/ApiService.js';

export default function FirstMessage() {
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');
  const [hint, setHint] = useState('');
  const [hintColor, setHintColor] = useState('text-gray-400');
  const [saving, setSaving] = useState(false);

  const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

  useEffect(() => {
    async function load() {
      try {
        const data = await ApiService.request(CONFIG.ENDPOINTS.FIRST_MSG_LOAD, { key: CONFIG.KEYS.FIRST_MSG });
        const cfg = data?.firstMessageConfig;
        if (cfg) {
          setTime(cfg.executionTime || '');
          setMessage(cfg.message || '');
          updateHint(cfg.executionTime || '');
        }
      } catch (err) { console.error(err); }
    }
    load();
  }, []);

  const updateHint = (val) => {
    if (!val) { setHint(''); return; }
    if (TIME_RE.test(val)) {
      setHint(`✓ Próximo disparo agendado para as ${val}.`);
      setHintColor('text-emerald-400 bg-emerald-500/5 border-emerald-500/20');
    } else {
      setHint('✕ Formato inválido. Use HH:MM:SS (ex: 09:00:00).');
      setHintColor('text-red-400 bg-red-500/5 border-red-500/20');
    }
  };

  const handleBlur = () => {
    const raw = time.replace(/\D/g, '');
    if (raw.length === 6) {
      const formatted = `${raw.slice(0, 2)}:${raw.slice(2, 4)}:${raw.slice(4, 6)}`;
      setTime(formatted);
      updateHint(formatted);
    }
  };

  const handleSave = async () => {
    if (!TIME_RE.test(time.trim()) || !message.trim()) {
      alert('✕ Preencha um horário válido (HH:MM:SS) e a mensagem.');
      return;
    }
    setSaving(true);
    try {
      await ApiService.request(CONFIG.ENDPOINTS.FIRST_MSG_SAVE, {
        key: CONFIG.KEYS.FIRST_MSG,
        executionTime: time.trim(),
        message: message.trim(),
      });
      alert('✓ Configuração da primeira mensagem atualizada.');
    } catch {
      alert('✕ Erro ao salvar.');
    } finally { setSaving(false); }
  };

  return (
    <div className="bg-[#11142A] border border-[#252B54] rounded-2xl p-6 shadow-xl space-y-6 animate-fade-up">
      <div>
        <h2 className="text-base font-semibold text-white">Configuração de Abordagem Ativa</h2>
        <p className="text-xs text-gray-400 mt-0.5">Determine o momento e o conteúdo exato do primeiro contato automático da inteligência artificial.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campo do Horário */}
        <div className="lg:col-span-1 p-5 bg-[#161A36] border border-[#252B54] rounded-xl flex flex-col justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Horário de Disparo</h4>
            <p className="text-[11px] text-gray-400 leading-relaxed">Instante diário em que a esteira vai rodar a fila de novos leads integrados.</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 bg-[#1E234A] px-3 py-2 rounded-lg border border-[#252B54] w-full focus-within:border-blue-500 transition-colors">
              <input 
                type="text" 
                value={time} 
                onChange={e => { setTime(e.target.value); updateHint(e.target.value); }} 
                onBlur={handleBlur}
                className="bg-transparent text-xs font-mono font-bold text-white outline-none w-full" 
                placeholder="09:00:00" 
                maxLength={8} 
              />
              <span className="text-[10px] font-bold text-gray-500 tracking-wider flex-shrink-0">HH:MM:SS</span>
            </div>
            {hint && (
              <div className={`text-[11px] font-medium px-3 py-1.5 border rounded-md ${hintColor}`}>
                {hint}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 p-5 bg-[#161A36] border border-[#252B54] rounded-xl flex flex-col gap-3">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Mensagem de Boas-Vindas</h4>
            <p className="text-[11px] text-gray-400 leading-relaxed">Primeiro bloco de texto enviado pelo WhatsApp de prospecção.</p>
          </div>
          <textarea 
            value={message} 
            onChange={e => setMessage(e.target.value)} 
            rows={4} 
            className="w-full bg-[#1E234A] border border-[#252B54] focus:border-blue-500 rounded-lg p-3 text-xs text-white outline-none resize-none transition-colors leading-relaxed"
            placeholder="Insira a mensagem de introdução comercial..."
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-[#252B54]">
        <button 
          onClick={handleSave} 
          disabled={saving} 
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl px-5 py-2.5 cursor-pointer transition-all disabled:opacity-50"
        >
          {saving ? 'Gravando...' : 'Salvar Configuração'}
        </button>
      </div>
    </div>
  );
}