
export const EmbedApiEvents = {
  FUNCTION_CALL_REQUEST: "paella:embedapi:FunctionCallRequest",
  FUNCTION_CALL_RESPONSE: "paella:embedapi:FunctionCallResponse",
  AUTH: 'paella:embedapi:auth'
} as const;

export type EmbedApiEvent = typeof EmbedApiEvents[keyof typeof EmbedApiEvents];