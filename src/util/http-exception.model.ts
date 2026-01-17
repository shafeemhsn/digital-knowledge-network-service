const resolveMessage = (payload: unknown) => {
  if (typeof payload === "string") {
    return payload;
  }

  if (payload && typeof payload === "object" && "message" in payload) {
    const messageValue = (payload as { message?: unknown }).message;
    if (typeof messageValue === "string") {
      return messageValue;
    }
  }

  try {
    return JSON.stringify(payload);
  } catch {
    return String(payload);
  }
};

class HttpException extends Error {
  errorCode: number;
  payload: unknown;
  constructor(errorCode: number, payload: unknown) {
    super(resolveMessage(payload));
    this.errorCode = errorCode;
    this.payload = payload;
  }
}

export default HttpException;
