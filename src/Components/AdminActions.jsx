import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { CONFIG } from '../config/config.js';
import { ApiService } from '../services/ApiService.js';

export default function AdminActions() {
  const [clearing, setClearing] = useState(false);
  const [sending, setSending] = useState(false);

  const confirmAction = async (title, text, confirmText, isDanger) => {
    return Swal.fire({
      title,
      html: `<p style="color:#9ca3af;margin:0;font-size:14px;line-height:1.6;">${text}</p>`,
      icon: isDanger ? 'warning' : 'question',
      background: '#141517',
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: isDanger ? '#ef4444' : '#e8781a',
      cancelButtonColor: '#1f2124',
      customClass: { popup: 'border border-[#2d3136] rounded-xl' },
      reverseButtons: true,
    });
  };

  const handleClear = async () => {
    const { isConfirmed } = await confirmAction(
      'Limpar histórico?',
      'Esta ação irá apagar <strong>permanentemente</strong> todo o contexto de conversas armazenado pelo agente de IA.',
      'Sim, limpar histórico',
      true
    );
    if (!isConfirmed) return;
    setClearing(true);
    try {
      await ApiService.request(CONFIG.ENDPOINTS.CLEAR_MESSAGES);
      Swal.fire({ title: 'Histórico Resetado', icon: 'success', confirmButtonColor: '#e8781a', background: '#141517' });
    } catch {
      Swal.fire({ title: 'Erro na operação', icon: 'error', confirmButtonColor: '#e8781a', background: '#141517' });
    } finally { setClearing(false); }
  };

  const handleSendFirst = async () => {
    const { isConfirmed } = await confirmAction(
      'Disparar mensagens?',
      'O bot iniciará imediatamente a rotina ativa de abordagem para todos os leads da fila pendente.',
      'Disparar agora',
      false
    );
    if (!isConfirmed) return;
    setSending(true);
    try {
      await ApiService.request(CONFIG.ENDPOINTS.FIRST_MSG_SEND, {}, 'POST');
      Swal.fire({ title: 'Disparo Iniciado', icon: 'success', confirmButtonColor: '#e8781a', background: '#141517' });
    } catch {
      Swal.fire({ title: 'Erro no disparo', icon: 'error', confirmButtonColor: '#e8781a', background: '#141517' });
    } finally { setSending(false); }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 flex flex-col justify-between gap-4 hover:border-zinc-800 transition-colors">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Zona Crítica
          </div>
          <h3 className="text-base font-bold text-zinc-200">Reset de Mensagens</h3>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Limpa o banco de dados de mensagens. O robô esquecerá o histórico completo com todos os clientes prospectados.
          </p>
        </div>
        <button onClick={handleClear} disabled={clearing} className="w-full text-center text-xs font-bold uppercase tracking-wider py-2.5 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg transition-all cursor-pointer disabled:opacity-40">
          {clearing ? 'Limpando...' : 'Zerar Banco de Mensagens'}
        </button>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 flex flex-col justify-between gap-4 hover:border-zinc-800 transition-colors">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--orange)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--orange)]" />
            Automação Forçada
          </div>
          <h3 className="text-base font-bold text-zinc-200">Disparo de Abordagem</h3>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Força o agente de inteligência artificial a rodar a fila e enviar a primeira mensagem ativa para os contatos integrados.
          </p>
        </div>
        <button onClick={handleSendFirst} disabled={sending} className="w-full text-center text-xs font-bold uppercase tracking-wider py-2.5 bg-[var(--orange)] hover:bg-[var(--orange-light)] text-white rounded-lg transition-all font-semibold cursor-pointer disabled:opacity-40">
          {sending ? 'Disparando...' : 'Forçar Disparo de Leads'}
        </button>
      </div>
    </div>
  );
}