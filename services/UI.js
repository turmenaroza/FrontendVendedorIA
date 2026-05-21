/**
 * services/UI.js
 * Helpers de interface reutilizáveis por qualquer módulo.
 */
export const UI = {
    get toast() {
        return document.getElementById('toast-notification');
    },

    showToast(message, type = 'success') {
        const el = this.toast;
        el.textContent = message;
        const isError = type === 'error';
        el.style.borderLeftColor = isError ? 'var(--error)' : 'var(--success)';
        el.style.color = isError ? 'var(--error)' : 'var(--success)';
        el.classList.add('is-visible');
        setTimeout(() => el.classList.remove('is-visible'), 3500);
    },

    setLoadingState(btn, isLoading, originalText = '') {
        if (isLoading) {
            btn.dataset.originalText = btn.innerHTML;
            btn.disabled = true;
            btn.textContent = 'Aguarde...';
        } else {
            btn.disabled = false;
            btn.innerHTML = originalText || btn.dataset.originalText;
        }
    },

    renderDate() {
        const el = document.getElementById('current-date');
        if (el) {
            el.textContent = new Date().toLocaleDateString('pt-BR', {
                weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
            });
        }
    },
};