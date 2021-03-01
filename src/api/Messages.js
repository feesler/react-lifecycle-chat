const BASE_URL = process.env.REACT_APP_MESSAGES_URL;

export class Messages {
  static async read(from = 0) {
    const response = await fetch(`${BASE_URL}?from=${from}`);
    if (!response.ok) {
      throw new Error();
    }

    return response.json();
  }

  static async send(userId, content) {
    const submitMessage = {
      id: 0,
      userId,
      content,
    };

    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(submitMessage),
    });

    return response.ok;
  }
}
