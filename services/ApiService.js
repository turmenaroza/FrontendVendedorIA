/**
 * services/ApiService.js
 * Camada HTTP única. Todos os módulos importam daqui.
 */
import { CONFIG } from '../config.js';
import { SessionManager } from './SessionManager.js';

export class ApiService {
    static async request(endpoint, payload = null, method = 'POST') {
        const headers = {
            'Content-Type': 'application/json',
            'access-token': SessionManager.getToken(),
        };

        const options = { method, headers };

        if (payload !== null && method !== 'GET') {
            options.body = JSON.stringify(payload);
        }

        const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, options);

        if (!response.ok) {
            throw new Error(`[ApiService] ${method} ${endpoint} → HTTP ${response.status}`);
        }

        return response.json();
    }
}