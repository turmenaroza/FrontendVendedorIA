import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import { CONFIG } from '../config/config.js';
import { ApiService } from '../services/ApiService.js';

export default function PromptEditor() {
  const [content, setContent] = useState('');
  const [savedContent, setSavedContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState('loading');
  const [saving, setSaving] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await ApiService.request(CONFIG.ENDPOINTS.PROMPT_LOAD, { id: 'system' });
        const text = data?.systemPrompt?.text || '';
        setContent(text);
        setSavedContent(text);
        setStatus('loaded');
      } catch { setStatus('error'); }
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await ApiService.request(CONFIG.ENDPOINTS.PROMPT_SAVE, { systemPrompt: content.trim() });
      setSavedContent(content);
      setIsEditing(false);
    } catch { alert('Erro ao salvar prompt.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-premium)] rounded-xl overflow-hidden shadow-xl">
      <header className="px-6 py-4 border-b border-[var(--border-premium)] bg-[var(--bg-main)]/60 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Instruções do Sistema (System Prompt)</h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">Molde a personalidade, tom de voz e regras comportamentais da inteligência artificial.</p>
        </div>
        <div>
          {isEditing ? (
            <div className="flex gap-2">
              <button onClick={() => { setContent(savedContent); setIsEditing(false); }} className="px-3 py-1.5 border border-[var(--border-premium)] text-xs font-semibold rounded-md text-[var(--text-secondary)] hover:text-white bg-[var(--bg-input)] cursor-pointer">Cancelar</button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-1.5 bg-[var(--orange)] hover:bg-[var(--orange-light)] text-white text-xs font-semibold rounded-md cursor-pointer transition-all">{saving ? 'Salvando...' : 'Salvar'}</button>
            </div>
          ) : (
            <button onClick={() => setIsEditing(true)} className="px-4 py-1.5 border border-[var(--border-premium)] text-xs font-semibold rounded-md text-zinc-300 hover:text-white bg-[var(--bg-input)] hover:border-[var(--border-focus)] cursor-pointer transition-all">Editar Prompt</button>
          )}
        </div>
      </header>

      <div className="p-0">
        {status === 'loading' && <div className="p-8 text-xs text-[var(--text-muted)] flex items-center gap-2 justify-center"><div className="w-4 h-4 border-2 border-[var(--border-premium)] border-t-[var(--orange)] rounded-full animate-spin"/> Carregando base de conhecimento...</div>}
        
        {!isEditing && status === 'loaded' && (
          <div className="p-6 text-sm leading-relaxed text-zinc-300 min-h-[160px] bg-[var(--bg-main)]/20">
            {savedContent ? (
              <div className="prose prose-invert max-w-none space-y-2 text-xs md:text-sm" dangerouslySetInnerHTML={{ __html: marked.parse(savedContent) }} />
            ) : (
              <span className="text-xs italic text-[var(--text-muted)]">Nenhum prompt ou instrução definida para o agente.</span>
            )}
          </div>
        )}

        {isEditing && (
          <textarea ref={editorRef} value={content} onChange={e => setContent(e.target.value)} className="w-full min-h-[300px] bg-[var(--bg-main)] border-0 p-6 font-mono text-xs leading-relaxed text-zinc-200 outline-none resize-y focus:ring-0" placeholder="Defina aqui as regras em Markdown..."/>
        )}
      </div>
    </div>
  );
}