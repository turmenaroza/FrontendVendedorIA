/**
 * modules/MarkdownToolbar.js
 * Barra de formatação markdown do editor de System Prompt.
 */
export const MarkdownToolbar = {
    get editor() {
        return document.getElementById('prompt-editor');
    },

    _getSelection() {
        const ed = this.editor;
        return {
            start: ed.selectionStart,
            end: ed.selectionEnd,
            text: ed.value.slice(ed.selectionStart, ed.selectionEnd),
            value: ed.value,
        };
    },

    _applySelection(newValue, newStart, newEnd) {
        const ed = this.editor;
        ed.value = newValue;
        ed.setSelectionRange(newStart, newEnd);
        ed.focus();
    },

    wrapInline(marker, placeholder) {
        const { start, end, text, value } = this._getSelection();
        const before = value.slice(start - marker.length, start);
        const after = value.slice(end, end + marker.length);

        if (before === marker && after === marker) {
            const nv = value.slice(0, start - marker.length) + text + value.slice(end + marker.length);
            this._applySelection(nv, start - marker.length, end - marker.length);
        } else {
            const content = text || placeholder;
            const nv = value.slice(0, start) + marker + content + marker + value.slice(end);
            this._applySelection(nv, start + marker.length, start + marker.length + content.length);
        }
    },

    prefixLines(prefix, placeholder) {
        const { start, end, value } = this._getSelection();
        const lineStart = value.lastIndexOf('\n', start - 1) + 1;
        const lineEnd = value.indexOf('\n', end);
        const block = value.slice(lineStart, lineEnd === -1 ? undefined : lineEnd);
        const newBlock = block.split('\n').map(l => prefix + (l || placeholder)).join('\n');
        const nv = value.slice(0, lineStart) + newBlock + (lineEnd === -1 ? '' : value.slice(lineEnd));
        this._applySelection(nv, lineStart, lineStart + newBlock.length);
    },

    insertCodeblock() {
        const { start, end, text, value } = this._getSelection();
        const content = text || 'código aqui';
        const insert = '```\n' + content + '\n```';
        const nv = value.slice(0, start) + insert + value.slice(end);
        this._applySelection(nv, start + 4, start + 4 + content.length);
    },

    insertHorizontalRule() {
        const { start, value } = this._getSelection();
        const insert = '\n---\n';
        const nv = value.slice(0, start) + insert + value.slice(start);
        this._applySelection(nv, start + insert.length, start + insert.length);
    },

    init() {
        document.querySelectorAll('.toolbar-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                switch (btn.dataset.action) {
                    case 'bold': this.wrapInline('**', 'negrito'); break;
                    case 'italic': this.wrapInline('_', 'itálico'); break;
                    case 'strike': this.wrapInline('~~', 'riscado'); break;
                    case 'code': this.wrapInline('`', 'código'); break;
                    case 'ul': this.prefixLines('- ', 'item'); break;
                    case 'ol': this.prefixLines('1. ', 'item'); break;
                    case 'quote': this.prefixLines('> ', 'citação'); break;
                    case 'codeblock': this.insertCodeblock(); break;
                    case 'hr': this.insertHorizontalRule(); break;
                }
            });
        });

        const headingSelect = document.getElementById('toolbar-heading');
        headingSelect.addEventListener('change', () => {
            const map = { h1: '# ', h2: '## ', h3: '### ' };
            if (map[headingSelect.value]) this.prefixLines(map[headingSelect.value], 'título');
            headingSelect.value = '';
        });

        this.editor.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'b') { e.preventDefault(); this.wrapInline('**', 'negrito'); }
                if (e.key === 'i') { e.preventDefault(); this.wrapInline('_', 'itálico'); }
            }
        });
    },
};