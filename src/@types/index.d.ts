declare module '@hapipal/confidence' {
  interface RequestAccidentEventUser {
    first_name: string;
    last_name: string;
    document: string;
  }

  interface RequestAccidentEvent {
    user_id: string;
    vehicle: string;
    year: number;
    license_plate: string;
    description: string;
    users?: RequestAccidentEventUser[];
  }
}
