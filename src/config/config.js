export const CONFIG = {
    API_BASE_URL: 'https://vendedor-ia-backend.ixbtpi.easypanel.host',
    ENDPOINTS: {
        PROMPT_LOAD: '/api/prompt/load',
        PROMPT_SAVE: '/api/prompt',
        CLEAR_MESSAGES: '/api/messages/clear',
        CONFIG_LOAD: '/api/config/follow-up/load',
        CONFIG_SAVE: '/api/config/follow-up',
        BH_UPDATE: '/api/businessHour/',
        BH_GETALL: '/api/loadBusinessHour/',
        FIRST_MSG_SAVE: '/api/config/firstMessage/',
        FIRST_MSG_LOAD: '/api/config/firstMessage/load',
        FIRST_MSG_SEND: '/api/config/firstMessage/send'
    },
    KEYS: {
        FOLLOWUP: 'smart_followup_interval',
        FIRST_MSG: 'first_message_config',
        TOKEN: 'kj_token',
        EMAIL: 'kj_email',
    },
};