// Zoho types placeholder
export interface ZohoLeadPayload {
  First_Name?: string;
  Last_Name: string;
  Email: string;
  Phone?: string;
  Company?: string;
  Description?: string;
}

export interface ZohoResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}
