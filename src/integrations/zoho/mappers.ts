// Zoho mappers placeholder
import { ZohoLeadPayload } from "./types";

interface ContactFormData {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
}

export function mapContactFormToZohoLead(formData: ContactFormData): ZohoLeadPayload {
  return {
    First_Name: formData.firstName || "",
    Last_Name: formData.lastName || "Unknown",
    Email: formData.email,
    Phone: formData.phone || "",
    Company: formData.company || "Individual",
    Description: formData.message || "",
  };
}
