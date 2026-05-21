/**
 * modules/BusinessHourModule.js
 * Tabela de horário de funcionamento por dia da semana.
 */
import { CONFIG } from '../config.js';
import { ApiService } from '../services/ApiService.js';
import { UI } from '../services/UI.js';

export const BusinessHourModule = {
  days: [
    { key: 'Segunda', label: 'Segunda-feira', closed: false, start: '08:00', end: '18:00' },
    { key: 'Terca', label: 'Terça-feira', closed: false, start: '08:00', end: '18:00' },
    { key: 'Quarta', label: 'Quarta-feira', closed: false, start: '08:00', end: '18:00' },
    { key: 'Quinta', label: 'Quinta-feira', closed: false, start: '08:00', end: '18:00' },
    { key: 'Sexta', label: 'Sexta-feira', closed: false, start: '08:00', end: '18:00' },
    { key: 'Sabado', label: 'Sábado', closed: true, start: '', end: '' },
    { key: 'Domingo', label: 'Domingo', closed: true, start: '', end: '' },
  ],

  get elements() {
    return {
      statusBadge: document.getElementById('bh-status-badge'),
      statusText: document.getElementById('bh-status-text'),
    };
  },

  _timeToMin(t) {
    if (!t) return null;
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  },

  _validateRow(day) {
    const startEl = document.getElementById('bh-start-' + day.key);
    const endEl = document.getElementById('bh-end-' + day.key);
    const errEl = document.getElementById('bh-err-' + day.key);
    if (day.closed) return true;

    const timeRe = /^([01]\d|2[0-3]):[0-5]\d$/;
    let msg = '';
    if (!timeRe.test(startEl.value)) msg = 'Formato inválido (HH:MM)';
    else if (!timeRe.test(endEl.value)) msg = 'Formato inválido (HH:MM)';
    else if (this._timeToMin(endEl.value) <= this._timeToMin(startEl.value)) msg = 'Fim deve ser maior que início';

    startEl.classList.toggle('error', !!msg);
    endEl.classList.toggle('error', !!msg);
    errEl.textContent = msg;
    errEl.classList.toggle('visible', !!msg);
    return !msg;
  },

  setStatus(state) {
    const { statusBadge, statusText } = this.elements;
    statusBadge.classList.remove('loaded');

    const labels = { loading: 'Carregando...', loaded: 'Configurado', error: 'Erro ao carregar' };
    statusText.textContent = labels[state] ?? state;
    if (state === 'loaded') statusBadge.classList.add('loaded');
  },

  render() {
    const tbody = document.getElementById('bh-tbody');
    tbody.innerHTML = '';

    this.days.forEach(day => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <span class="bh-day-label">${day.label}</span>
          ${day.closed ? '<span class="bh-closed-badge">Fechado</span>' : ''}
        </td>
        <td>
          ${day.closed
          ? '<span style="color:var(--text-dim);font-size:13px;">—</span>'
          : `<div>
                 <input class="bh-time-input input-control" id="bh-start-${day.key}" value="${day.start}" placeholder="08:00" maxlength="5">
                 <div class="bh-err-msg" id="bh-err-${day.key}"></div>
               </div>`}
        </td>
        <td>
          ${day.closed
          ? '<span style="color:var(--text-dim);font-size:13px;">—</span>'
          : `<input class="bh-time-input input-control" id="bh-end-${day.key}" value="${day.end}" placeholder="18:00" maxlength="5">`}
        </td>
        <td>
          <button class="bh-toggle-btn" data-key="${day.key}">
            ${day.closed ? 'Abrir' : 'Fechar'}
          </button>
        </td>`;
      tbody.appendChild(tr);

      if (!day.closed) {
        document.getElementById('bh-start-' + day.key)
          .addEventListener('blur', e => { day.start = e.target.value; this._validateRow(day); });
        document.getElementById('bh-end-' + day.key)
          .addEventListener('blur', e => { day.end = e.target.value; this._validateRow(day); });
      }
    });

    tbody.querySelectorAll('.bh-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const d = this.days.find(x => x.key === btn.dataset.key);
        d.closed = !d.closed;
        if (d.closed) { d.start = ''; d.end = ''; }
        this.render();
      });
    });
  },

  async load() {
    this.setStatus('loading')
    try {
      const data = await ApiService.request(CONFIG.ENDPOINTS.BH_GETALL, undefined, 'GET');
      const list = data?.businessHour ?? [];
      const byDay = Object.fromEntries(list.map(bh => [bh.dia, bh]));

      this.days.forEach(day => {
        const bh = byDay[day.key];
        if (!bh) return;
        day.closed = !bh.hora_inicio;
        day.start = bh.hora_inicio ? bh.hora_inicio.slice(0, 5) : '';
        day.end = bh.hora_fim ? bh.hora_fim.slice(0, 5) : '';
      });
      this.setStatus('loaded');
    } catch (err) {
      console.error('[BusinessHourModule] load:', err);
      this.setStatus('error');
    }
    this.render();
  },

  async save() {
    const allValid = this.days.every(d => this._validateRow(d));
    if (!allValid) return UI.showToast('✕ Corrija os erros antes de salvar.', 'error');

    const btn = document.getElementById('btn-save-business-hours');
    UI.setLoadingState(btn, true);
    try {
      await Promise.all(
        this.days.map(d =>
          ApiService.request(CONFIG.ENDPOINTS.BH_UPDATE + d.key, {
            hora_inicio: d.closed ? null : d.start + ':00',
            hora_fim: d.closed ? null : d.end + ':00',
          }, 'PUT'),
        ),
      );
      UI.showToast('✓ Horários salvos com sucesso.');
    } catch (err) {
      console.error('[BusinessHourModule] save:', err);
      UI.showToast('✕ Erro ao salvar horários.', 'error');
    } finally {
      UI.setLoadingState(btn, false, '✓ Salvar');
    }
  },

  init() {
    document.getElementById('btn-save-business-hours')
      .addEventListener('click', () => this.save());
    this.load();
  },
};