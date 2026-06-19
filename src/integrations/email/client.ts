// Email client placeholder
export interface EmailPayload {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export class EmailClient {
  async sendEmail(payload: EmailPayload): Promise<{ success: boolean; messageId?: string }> {
    console.log("[Email Client (Placeholder)] Sending email", payload);
    return { success: true, messageId: "email_sent_placeholder_id" };
  }
}
