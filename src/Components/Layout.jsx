import React, { useState } from 'react';
import { SessionManager } from '../services/SessionManager.js';

export default function Layout({ children, activeTab, setActiveTab, onLogout }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const email = SessionManager.getEmail() || 'admin@evolucaocompressores.com';
  const userName = email.split('@')[0];

  const menuItems = [
    { id: 'visao-geral', label: 'Visão Geral', icon: '📊' },
    { id: 'prompt', label: 'System Prompt', icon: '📝' },
    { id: 'horarios', label: 'Horários', icon: '🕒' },
    { id: 'follow-up', label: 'Follow-Up', icon: '🔁' },
    { id: 'primeira-msg', label: 'Primeira Mensagem', icon: '📩' },
    { id: 'acoes-admin', label: 'Ações Admin', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen flex bg-[#0B0D19] text-gray-100 antialiased font-sans">

      <aside className={`bg-[#11142A] border-r border-[#252B54] flex flex-col justify-between fixed h-full z-30 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <div>
          <div className="p-5 border-b border-[#252B54] flex items-center justify-between overflow-hidden">
            {!isCollapsed && (
              <div className="animate-fade-up">
                <h2 className="text-sm font-bold uppercase tracking-wider text-white">Evolução</h2>
                <p className="text-xs text-blue-400 font-bold uppercase tracking-widest">Compressores</p>
              </div>
            )}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)} 
              className={`text-gray-400 hover:text-white text-sm p-1 cursor-pointer hover:bg-[#161A36] rounded-md transition-all ${isCollapsed ? 'mx-auto' : ''}`}
            >
              {isCollapsed ? '▶' : '◀'}
            </button>
          </div>

          <nav className="p-3 space-y-1">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-[#1E234A] text-white border-l-4 border-blue-500'
                    : 'text-gray-400 hover:bg-[#161A36]/50 hover:text-white'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
                title={item.label}
              >
                <span className="text-sm">{item.icon}</span>
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-[#252B54] bg-[#0E1022] flex items-center justify-between overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center font-bold text-xs text-white uppercase flex-shrink-0">
              {userName.slice(0, 2)}
            </div>
            {!isCollapsed && (
              <div className="truncate w-28 animate-fade-up">
                <p className="text-xs font-bold text-white capitalize">{userName}</p>
                <p className="text-[10px] text-gray-500 truncate">{email}</p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button 
              onClick={onLogout} 
              className="text-red-400 hover:text-red-500 p-2 cursor-pointer hover:bg-red-500/10 rounded-lg transition-all flex items-center justify-center" 
              title="Sair"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          )}
        </div>
      </aside>

      <div className={`flex-1 p-8 min-h-screen flex flex-col justify-between transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        
        <div className="flex flex-col gap-6 w-full">
          <section className="bg-[#11142A] border border-[#252B54] rounded-2xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase">Painel Administrativo</span>
                <h1 className="text-xl font-extrabold text-white mt-0.5">Vendedor IA</h1>
                <p className="text-xs text-gray-400 mt-1">Gerencie todas as configurações do seu agente de vendas inteligente.</p>
              </div>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Agente Ativo
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-[#161A36] border border-[#252B54] rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center text-base">⚙️</div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</p>
                  <p className="text-xs font-bold text-white mt-0.5">Ativo</p>
                </div>
              </div>
              <div className="bg-[#161A36] border border-[#252B54] rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-cyan-500/10 text-cyan-400 rounded-lg flex items-center justify-center text-base">🤖</div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Modo</p>
                  <p className="text-xs font-bold text-white mt-0.5">Auto</p>
                </div>
              </div>
              <div className="bg-[#161A36] border border-[#252B54] rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center text-base">🛡️</div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Security</p>
                  <p className="text-xs font-bold text-white mt-0.5">OK</p>
                </div>
              </div>
            </div>
          </section>

          <div className="w-full">
            {children}
          </div>
        </div>

        <footer className="w-full text-center py-0 mt-2 text-[10px] text-gray-600 font-normal tracking-wide opacity-70">
          Feito com <span className="text-red-500/80">❤️</span> pela Konvex Jr
        </footer>

      </div>
    </div>
  );
}