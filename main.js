/**
 * main.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Ponto de entrada único da aplicação.
 * Importa todos os módulos e os inicializa na ordem correta.
 *
 * Para adicionar um novo módulo:
 *   1. Crie o arquivo em /modules/SeuModulo.js
 *   2. Importe aqui
 *   3. Adicione SeuModulo.init() e SeuModulo.load() (se aplicável)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { SessionManager } from './services/SessionManager.js';
import { UI } from './services/UI.js';

import { PromptModule } from './modules/PromptModule.js';
import { MarkdownToolbar } from './modules/MarkdownToolbar.js';
import { FollowUpModule } from './modules/FollowUpModule.js';
import { FirstMessageModule } from './modules/FirstMessageModule.js';
import { BusinessHourModule } from './modules/BusinessHourModule.js';
import { DataManagerModule } from './modules/DataManagerModule.js';

document.addEventListener('DOMContentLoaded', () => {
    // ── autenticação ────────────────────────────────────────────────────────────
    if (!SessionManager.checkAuth()) return;
    SessionManager.renderUserInfo();

    document.getElementById('btn-logout')
        .addEventListener('click', () => SessionManager.logout());

    // ── UI global ───────────────────────────────────────────────────────────────
    UI.renderDate();

    // ── inicialização dos módulos ────────────────────────────────────────────────
    PromptModule.init();
    MarkdownToolbar.init();
    FollowUpModule.init();
    FirstMessageModule.init();
    BusinessHourModule.init();   // já chama .load() internamente
    DataManagerModule.init();

    // ── carregamento de dados assíncronos ────────────────────────────────────────
    PromptModule.load();
    FollowUpModule.load();
    FirstMessageModule.load();
});