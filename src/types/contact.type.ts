export type ContactUsPayload = {
  name: string;
  email: string;
  message: string;
};

export type ContactUsResponse = {
  success: true;
  message: string;
  data: {
    id: number;
    name: string;
    email: string;
    message: string;
    created_at: string;
  };
};