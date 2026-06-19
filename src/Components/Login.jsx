import React, { useState } from 'react';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === 'admin@evolucaocompressores.com' && password === 'admin123') {
      localStorage.setItem('user_email', email);
      onLoginSuccess();
    } else {
      setError('Credenciais inválidas. Use o e-mail oficial da Evolução.');
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#0B0D19] text-gray-100 font-sans antialiased">

      <div className="lg:col-span-5 flex flex-col justify-center px-8 sm:px-16 lg:px-20 bg-[#11142A] border-r border-[#252B54] relative z-10">
        <div className="w-full max-w-md mx-auto space-y-8 animate-fade-up">

          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 bg-blue-500 [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]" />
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Plataforma Administrativa</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white uppercase">Acesso Restrito</h1>
            <p className="text-xs text-gray-400">Entre com as suas credenciais para gerenciar o Vendedor IA.</p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg font-medium">
                {error}
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">E-mail Corporativo</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#1E234A] border border-[#252B54] focus:border-blue-500 rounded-xl p-3 text-xs text-white outline-none transition-colors" 
                placeholder="exemplo@evolucaocompressores.com"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Senha de Acesso</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#1E234A] border border-[#252B54] focus:border-blue-500 rounded-xl p-3 text-xs text-white outline-none transition-colors" 
                placeholder="••••••••"
                required
              />
            </div>

            <button 
              type="submit" 
              className="w-full text-center text-xs font-semibold py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl border border-blue-400/30 hover:border-blue-300/50 shadow-[0_4px_12px_rgba(59,130,246,0.2)] cursor-pointer transition-all active:scale-[0.98]"
            >
              Entrar no Painel
            </button>
          </form>

        </div>
      </div>

      <div className="lg:col-span-7 hidden lg:flex flex-col justify-center px-16 lg:px-24 bg-[#0B0D19] relative overflow-hidden">

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#161a36_1px,transparent_1px),linear-gradient(to_bottom,#161a36_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />

        <div className="max-w-2xl space-y-12 relative z-10 animate-fade-up" style={{ animationDelay: '0.1s' }}>

          <div className="flex items-center gap-2">
            <span className="text-lg font-black tracking-wider uppercase text-white">Evolução <span className="text-blue-400">Compressores</span></span>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-black tracking-tight leading-tight text-white uppercase">
              Gerando Confiança, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Inovando em Ar Comprimido.</span>
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed max-w-lg">
              Distribuidor autorizado Ingersoll Rand® em Santa Catarina. Especialistas em engenharia de monitoramento em tempo real, eficiência energética e alta performance para a indústria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-[#11142A]/60 border border-[#252B54] rounded-2xl p-5 backdrop-blur-sm">
              <p className="text-2xl font-black text-blue-400 font-mono">+21 Anos</p>
              <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wide mt-1">De História</h4>
              <p className="text-[11px] text-gray-500 mt-1 leading-normal">Fundada em 2005 atuando com excelência industrial.</p>
            </div>

            <div className="bg-[#11142A]/60 border border-[#252B54] rounded-2xl p-5 backdrop-blur-sm">
              <p className="text-2xl font-black text-cyan-400 font-mono">+950</p>
              <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wide mt-1">Revisões</h4>
              <p className="text-[11px] text-gray-500 mt-1 leading-normal">Unidades compressoras revisadas e assistidas.</p>
            </div>

            <div className="bg-[#11142A]/60 border border-[#252B54] rounded-2xl p-5 backdrop-blur-sm">
              <p className="text-2xl font-black text-emerald-400 font-mono">Real Time</p>
              <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wide mt-1">SustenPlan</h4>
              <p className="text-[11px] text-gray-500 mt-1 leading-normal">Acompanhamento remoto em nuvem via central técnica.</p>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}