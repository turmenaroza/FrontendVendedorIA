/**
 * services/SessionManager.js
 * Gerencia autenticação via sessionStorage.
 */
import { CONFIG } from '../config.js';

export const SessionManager = {
    getToken() {
        return sessionStorage.getItem(CONFIG.KEYS.TOKEN);
    },

    getEmail() {
        return sessionStorage.getItem(CONFIG.KEYS.EMAIL);
    },

    checkAuth() {
        if (!this.getToken() || !this.getEmail()) {
            window.location.href = 'index.html';
            return false;
        }
        return true;
    },

    logout() {
        sessionStorage.removeItem(CONFIG.KEYS.TOKEN);
        sessionStorage.removeItem(CONFIG.KEYS.EMAIL);
        window.location.href = 'index.html';
    },

    renderUserInfo() {
        const email = this.getEmail();
        if (!email) return;
        document.getElementById('user-avatar').textContent =
            email.split('@')[0].slice(0, 2).toUpperCase();
        document.getElementById('user-email').textContent = email;
    },
};