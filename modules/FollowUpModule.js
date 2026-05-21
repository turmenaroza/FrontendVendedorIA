/**
 * modules/FollowUpModule.js
 * Configurações de intervalo, limite e reset do smartFollowUp.
 */
import { CONFIG } from '../config.js';
import { ApiService } from '../services/ApiService.js';
import { UI } from '../services/UI.js';

export const FollowUpModule = {
    get elements() {
        return {
            intervalInput: document.getElementById('followup-interval'),
            limitInput: document.getElementById('followup-limit'),
            daysResetInput: document.getElementById('followup-days-reset'),
            btnSave: document.getElementById('btn-save-followup'),
            statusBadge: document.getElementById('fu-status-badge'),
            statusText: document.getElementById('fu-status-text'),
        };
    },

    async load() {
        this.setStatus('loading');
        try {
            const data = await ApiService.request(CONFIG.ENDPOINTS.CONFIG_LOAD, { key: CONFIG.KEYS.FOLLOWUP });
            const config = data.followUpConfig;
            if (!config) return;

            const { intervalInput, limitInput, daysResetInput } = this.elements;
            intervalInput.value = Math.round(parseInt(config.interval, 10) / 60000);
            limitInput.value = config.followUpLimit;
            daysResetInput.value = config.daysToResetCounter;
            this.setStatus('loaded');
        } catch (err) {
            console.error('[FollowUpModule] load:', err);
            this.setStatus('error');
        }
    },

    setStatus(state) {
        const { statusBadge, statusText } = this.elements;
        statusBadge.classList.remove('loaded');

        const labels = { loading: 'Carregando...', loaded: 'Configurado', error: 'Erro ao carregar' };
        statusText.textContent = labels[state] ?? state;
        if (state === 'loaded') statusBadge.classList.add('loaded');
    },

    validate() {
        const { intervalInput, limitInput, daysResetInput } = this.elements;
        const minutes = parseInt(intervalInput.value, 10);
        const limit = parseInt(limitInput.value, 10);
        const days = parseInt(daysResetInput.value, 10);

        if (!minutes || minutes < 1) {
            UI.showToast('✕ Informe um intervalo válido (mínimo 1 minuto).', 'error');
            return false;
        }
        if (!limit || limit < 1) {
            UI.showToast('✕ Informe um limite de follow-ups válido (mínimo 1).', 'error');
            return false;
        }
        if (!days || days < 1) {
            UI.showToast('✕ Informe um número de dias para reset válido (mínimo 1).', 'error');
            return false;
        }
        return true;
    },

    _buildPayload() {
        const { intervalInput, limitInput, daysResetInput } = this.elements;
        return {
            key: CONFIG.KEYS.FOLLOWUP,
            interval: String(parseInt(intervalInput.value, 10) * 60000),
            followUpLimit: parseInt(limitInput.value, 10),
            daysToResetCounter: parseInt(daysResetInput.value, 10),
        };
    },

    async save() {
        if (!this.validate()) return;
        const { btnSave } = this.elements;
        UI.setLoadingState(btnSave, true);
        try {
            await ApiService.request(CONFIG.ENDPOINTS.CONFIG_SAVE, this._buildPayload());
            UI.showToast('✓ Configurações de follow-up salvas com sucesso.');
        } catch (err) {
            console.error('[FollowUpModule] save:', err);
            UI.showToast('✕ Erro ao salvar configurações.', 'error');
        } finally {
            UI.setLoadingState(btnSave, false, '✓ Salvar Configurações');
        }
    },

    init() {
        this.elements.btnSave.addEventListener('click', () => this.save());
    },
};