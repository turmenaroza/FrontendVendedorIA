import { CONFIG } from '../config/config.js';

export const SessionManager = {
    getToken() { return sessionStorage.getItem(CONFIG.KEYS.TOKEN); },
    getEmail() { return sessionStorage.getItem(CONFIG.KEYS.EMAIL); },
    isAuthed() { return !!this.getToken() && !!this.getEmail(); },
    saveSession(token, email) {
        sessionStorage.setItem(CONFIG.KEYS.TOKEN, token);
        sessionStorage.setItem(CONFIG.KEYS.EMAIL, email);
    },
    logout() {
        sessionStorage.removeItem(CONFIG.KEYS.TOKEN);
        sessionStorage.removeItem(CONFIG.KEYS.EMAIL);
    },
    getAvatarText() {
        const email = this.getEmail();
        return email ? email.split('@')[0].slice(0, 2).toUpperCase() : '--';
    }
};