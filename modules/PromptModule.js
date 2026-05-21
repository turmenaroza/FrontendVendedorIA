/**
 * modules/PromptModule.js
 * Gerencia o System Prompt (carregamento, edição markdown e salvamento).
 */
import { CONFIG } from '../config.js';
import { ApiService } from '../services/ApiService.js';
import { UI } from '../services/UI.js';

export const PromptModule = {
    savedContent: '',

    get elements() {
        return {
            card: document.getElementById('prompt-card'),
            preview: document.getElementById('prompt-preview'),
            loader: document.getElementById('prompt-loader'),
            editor: document.getElementById('prompt-editor'),
            btnEdit: document.getElementById('btn-edit-prompt'),
            btnSave: document.getElementById('btn-save-prompt'),
            btnCancel: document.getElementById('btn-cancel-prompt'),
            statusBadge: document.getElementById('sp-status-badge'),
            statusText: document.getElementById('sp-status-text'),
        };
    },

    setStatus(state) {
        const { statusBadge, statusText } = this.elements;
        statusBadge.classList.remove('loaded');

        const labels = { loading: 'Carregando...', loaded: 'Configurado', error: 'Erro ao carregar' };
        statusText.textContent = labels[state] ?? state;
        if (state === 'loaded') statusBadge.classList.add('loaded');
    },

    async load() {
        this.setStatus('loading');
        this._toggleLoader(true);
        try {
            const data = await ApiService.request(CONFIG.ENDPOINTS.PROMPT_LOAD, { id: 'system' });
            this.savedContent = data.systemPrompt?.text || '';
            this._renderPreview(this.savedContent);
            this.setStatus('loaded');
        } catch (err) {
            console.error('[PromptModule] load:', err);
            this._renderPreview('');
            this.setStatus('error');
        }
    },

    async save() {
        const newContent = this.elements.editor.value.trim();
        UI.setLoadingState(this.elements.btnSave, true);
        try {
            await ApiService.request(CONFIG.ENDPOINTS.PROMPT_SAVE, { systemPrompt: newContent });
            this.savedContent = newContent;
            this._renderPreview(this.savedContent);
            this._setEditMode(false);
            UI.showToast('✓ System prompt salvo com sucesso.');
        } catch (err) {
            console.error('[PromptModule] save:', err);
            UI.showToast('✕ Erro ao salvar. Tente novamente.', 'error');
        } finally {
            UI.setLoadingState(this.elements.btnSave, false, '✓ Salvar');
        }
    },

    _renderPreview(text) {
        this._toggleLoader(false);
        const { preview } = this.elements;
        if (text) {
            preview.innerHTML = marked.parse(text);
            preview.classList.remove('is-empty');
        } else {
            preview.textContent = 'Nenhum system prompt definido. Clique em "Editar" para adicionar.';
            preview.classList.add('is-empty');
        }
    },

    _setEditMode(isEditing) {
        const { card, editor } = this.elements;
        if (isEditing) {
            editor.value = this.savedContent;
            card.classList.add('is-editing');
            editor.focus();
        } else {
            card.classList.remove('is-editing');
        }
    },

    _toggleLoader(show) {
        const { loader, preview } = this.elements;
        loader.style.display = show ? 'flex' : 'none';
        preview.style.display = show ? 'none' : 'block';
    },

    init() {
        const { btnEdit, btnCancel, btnSave, editor } = this.elements;
        btnEdit.addEventListener('click', () => this._setEditMode(true));
        btnCancel.addEventListener('click', () => this._setEditMode(false));
        btnSave.addEventListener('click', () => this.save());

        editor.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.save();
            }
        });
    },
};