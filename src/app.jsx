import React, { useState } from 'react';
import { SessionManager } from './services/SessionManager.js';
import Layout from './Components/Layout.jsx';
import Login from './Components/Login.jsx';
import AdminActions from './Components/AdminActions.jsx';
import BusinessHours from './Components/BusinessHours.jsx';
import FirstMessage from './Components/FirstMessage.jsx';
import SmartFollowUp from './Components/SmartFollowUp.jsx';
import PromptEditor from './Components/PromptEditor.jsx';

export default function App() {
  const [isAuthed, setIsAuthed] = useState(SessionManager.isAuthed());
  const [activeTab, setActiveTab] = useState('visao-geral');

  const handleLogout = () => {
    SessionManager.logout();
    setIsAuthed(false);
  };

  if (!isAuthed) {
    return <Login onLoginSuccess={() => setIsAuthed(true)} />;
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
      
      
      {activeTab === 'visao-geral' && (
        <div className="space-y-6 animate-fade-up">
          <div className="text-xs font-bold tracking-widest uppercase text-gray-400 border-b border-[#252B54] pb-2">
            Configurações Rápidas
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div onClick={() => setActiveTab('prompt')} className="bg-[#11142A] border border-[#252B54] hover:border-blue-500 rounded-2xl p-5 cursor-pointer transition-all flex flex-col justify-between h-36 group">
              <div className="text-2xl transition-transform group-hover:scale-110">📝</div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wide">System Prompt</h3>
                <p className="text-[10px] text-gray-400 mt-1">Configure o comportamento do agente.</p>
              </div>
            </div>
            <div onClick={() => setActiveTab('horarios')} className="bg-[#11142A] border border-[#252B54] hover:border-blue-500 rounded-2xl p-5 cursor-pointer transition-all flex flex-col justify-between h-36 group">
              <div className="text-2xl transition-transform group-hover:scale-110">🕒</div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wide">Horários</h3>
                <p className="text-[10px] text-gray-400 mt-1">Defina as janelas de funcionamento.</p>
              </div>
            </div>
            <div onClick={() => setActiveTab('follow-up')} className="bg-[#11142A] border border-[#252B54] hover:border-blue-500 rounded-2xl p-5 cursor-pointer transition-all flex flex-col justify-between h-36 group">
              <div className="text-2xl transition-transform group-hover:scale-110">🔁</div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wide">Follow-Up</h3>
                <p className="text-[10px] text-gray-400 mt-1">Ajuste intervalos e limites.</p>
              </div>
            </div>
            <div onClick={() => setActiveTab('primeira-msg')} className="bg-[#11142A] border border-[#252B54] hover:border-blue-500 rounded-2xl p-5 cursor-pointer transition-all flex flex-col justify-between h-36 group">
              <div className="text-2xl transition-transform group-hover:scale-110">📩</div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wide">Primeira Mensagem</h3>
                <p className="text-[10px] text-gray-400 mt-1">Configure o primeiro disparo.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      
      {activeTab === 'prompt' && <PromptEditor />}
      {activeTab === 'horarios' && <BusinessHours />}
      {activeTab === 'follow-up' && <SmartFollowUp />}
      {activeTab === 'primeira-msg' && <FirstMessage />}
      {activeTab === 'acoes-admin' && <AdminActions />}
      
    </Layout>
  );
}