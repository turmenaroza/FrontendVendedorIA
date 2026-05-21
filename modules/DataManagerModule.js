/**
 * modules/DataManagerModule.js
 * Gerencia ações administrativas críticas.
 */
import { CONFIG } from '../config.js';
import { ApiService } from '../services/ApiService.js';
import { UI } from '../services/UI.js';

const TRASH_ICON = `
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
  Limpar Mensagens`;

const SEND_ICON = `
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
  Enviar Primeiras Mensagens`;

export const DataManagerModule = {

    async clearMessages(btn) {
        const { isConfirmed } = await Swal.fire({
            title: 'Limpar histórico de mensagens?',
            html: `
              <p style="margin:0 0 10px;line-height:1.65;">
                Esta ação irá apagar <strong>permanentemente</strong> todo o histórico de conversas armazenado pelo agente.
              </p>
              <p style="margin:0;line-height:1.65;">
                O agente perderá o contexto de todas as interações anteriores.
                Esta operação <strong>não pode ser desfeita</strong>.
              </p>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, limpar tudo',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#e53e3e',
            cancelButtonColor: '#6b7280',
            reverseButtons: true,
            focusCancel: true,
        });

        if (!isConfirmed) return;

        UI.setLoadingState(btn, true);

        try {
            await ApiService.request(CONFIG.ENDPOINTS.CLEAR_MESSAGES);

            Swal.fire({
                title: 'Histórico limpo!',
                text: 'Todas as mensagens foram removidas com sucesso.',
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#e8781a',
                timer: 3000,
                timerProgressBar: true,
            });

            UI.showToast('✓ Histórico de mensagens limpo com sucesso.');

        } catch (err) {
            console.error('[DataManagerModule] clear:', err);

            Swal.fire({
                title: 'Erro ao limpar',
                text: 'Não foi possível limpar as mensagens. Tente novamente.',
                icon: 'error',
                confirmButtonText: 'Fechar',
                confirmButtonColor: '#e8781a',
            });

            UI.showToast('✕ Erro ao limpar mensagens.', 'error');

        } finally {
            UI.setLoadingState(btn, false, TRASH_ICON);
        }
    },

    async sendFirstMessages(btn) {

        const { isConfirmed } = await Swal.fire({
            title: 'Enviar primeiras mensagens?',
            html: `
              <p style="margin:0 0 10px;line-height:1.65;">
                O agente irá iniciar imediatamente o envio da
                <strong>primeira mensagem automática</strong>
                para todos os contatos pendentes.
              </p>
              <p style="margin:0;line-height:1.65;">
                Deseja continuar?
              </p>`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sim, enviar agora',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#e8781a',
            cancelButtonColor: '#6b7280',
            reverseButtons: true,
            focusCancel: true,
        });

        if (!isConfirmed) return;

        UI.setLoadingState(btn, true);

        try {

            await ApiService.request(
                CONFIG.ENDPOINTS.FIRST_MSG_SEND,
                {},
                'POST'
            );

            Swal.fire({
                title: 'Envio iniciado!',
                text: 'As primeiras mensagens começaram a ser enviadas.',
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#e8781a',
                timer: 3000,
                timerProgressBar: true,
            });

            UI.showToast('✓ Primeiras mensagens enviadas.');

        } catch (err) {

            console.error('[DataManagerModule] sendFirstMessages:', err);

            Swal.fire({
                title: 'Erro no envio',
                text: 'Não foi possível iniciar o envio das mensagens.',
                icon: 'error',
                confirmButtonText: 'Fechar',
                confirmButtonColor: '#e8781a',
            });

            UI.showToast('✕ Erro ao enviar mensagens.', 'error');

        } finally {
            UI.setLoadingState(btn, false, SEND_ICON);
        }
    },

    init() {

        const clearBtn = document.getElementById('btn-clear-messages');
        const sendBtn = document.getElementById('btn-send-first-messages');

        clearBtn.addEventListener('click', () => {
            this.clearMessages(clearBtn);
        });

        sendBtn.addEventListener('click', () => {
            this.sendFirstMessages(sendBtn);
        });
    },
};