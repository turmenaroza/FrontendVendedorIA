/**
 * modules/FirstMessageModule.js
 * Configura o horário e texto da primeira mensagem automática.
 *
 * Endpoints:
 *   POST /api/config/firstMessage/       { key, executionTime, message }
 *   POST /api/config/firstMessage/load   { key }
 *   Resposta: { firstMessageConfig: { executionTime, message } }
 */
import { CONFIG } from '../config.js';
import { ApiService } from '../services/ApiService.js';
import { UI } from '../services/UI.js';

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

export const FirstMessageModule = {
    get elements() {
        return {
            timeInput: document.getElementById('fm-execution-time'),
            messageInput: document.getElementById('fm-message'),
            btnSave: document.getElementById('btn-save-first-message'),
            statusBadge: document.getElementById('fm-status-badge'),
            statusText: document.getElementById('fm-status-text'),
            timeHint: document.getElementById('fm-time-hint'),
        };
    },

    // ── status badge ───────────────────────────────────────────────────────────

    setStatus(state) {
        const { statusBadge, statusText } = this.elements;
        statusBadge.classList.remove('loaded');

        const labels = { loading: 'Carregando...', loaded: 'Configurado', error: 'Erro ao carregar' };
        statusText.textContent = labels[state] ?? state;
        if (state === 'loaded') statusBadge.classList.add('loaded');
    },

    // ── time hint ──────────────────────────────────────────────────────────────

    _updateHint(time) {
        const { timeHint } = this.elements;
        if (!time) { timeHint.textContent = ''; return; }

        if (TIME_RE.test(time)) {
            timeHint.textContent = `Próximo disparo agendado para as ${time} (horário de Brasília).`;
            timeHint.style.color = 'var(--text-dim)';
        } else {
            timeHint.textContent = 'Formato inválido — use HH:MM:SS (ex: 09:00:00).';
            timeHint.style.color = 'var(--error, #e53e3e)';
        }
    },

    // ── validate ───────────────────────────────────────────────────────────────

    validate() {
        const { timeInput, messageInput } = this.elements;
        const time = timeInput.value.trim();
        const msg = messageInput.value.trim();

        if (!TIME_RE.test(time)) {
            UI.showToast('✕ Informe um horário válido no formato HH:MM:SS.', 'error');
            timeInput.focus();
            return false;
        }
        if (!msg) {
            UI.showToast('✕ Informe o texto da mensagem.', 'error');
            messageInput.focus();
            return false;
        }
        return true;
    },

    // ── load ───────────────────────────────────────────────────────────────────

    async load() {
        this.setStatus('loading');
        try {
            const data = await ApiService.request(
                CONFIG.ENDPOINTS.FIRST_MSG_LOAD,
                { key: CONFIG.KEYS.FIRST_MSG },
            );
            const cfg = data?.firstMessageConfig;
            if (!cfg) { this.setStatus('error'); return; }

            this.elements.timeInput.value = cfg.executionTime || '';
            this.elements.messageInput.value = cfg.message || '';
            this._updateHint(cfg.executionTime || '');
            this.setStatus('loaded');
        } catch (err) {
            console.error('[FirstMessageModule] load:', err);
            this.setStatus('error');
        }
    },

    // ── save ───────────────────────────────────────────────────────────────────

    async save() {
        if (!this.validate()) return;
        const { btnSave, timeInput, messageInput } = this.elements;

        UI.setLoadingState(btnSave, true);
        try {
            await ApiService.request(CONFIG.ENDPOINTS.FIRST_MSG_SAVE, {
                key: CONFIG.KEYS.FIRST_MSG,
                executionTime: timeInput.value.trim(),
                message: messageInput.value.trim(),
            });
            this._updateHint(timeInput.value.trim());
            this.setStatus('loaded');
            UI.showToast('✓ Configuração da primeira mensagem salva com sucesso.');
        } catch (err) {
            console.error('[FirstMessageModule] save:', err);
            UI.showToast('✕ Erro ao salvar. Tente novamente.', 'error');
        } finally {
            UI.setLoadingState(btnSave, false, '✓ Salvar Configuração');
        }
    },

    // ── init ───────────────────────────────────────────────────────────────────

    init() {
        const { btnSave, timeInput } = this.elements;

        btnSave.addEventListener('click', () => this.save());

        // hint em tempo real
        timeInput.addEventListener('input', () => this._updateHint(timeInput.value.trim()));

        // auto-formatação: "090000" → "09:00:00"
        timeInput.addEventListener('blur', () => {
            const raw = timeInput.value.replace(/\D/g, '');
            if (raw.length === 6) {
                timeInput.value = `${raw.slice(0, 2)}:${raw.slice(2, 4)}:${raw.slice(4, 6)}`;
                this._updateHint(timeInput.value);
            }
        });
    },
};