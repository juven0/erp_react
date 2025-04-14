export type UserData = {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    entryDate: string;
    exitDate: string | null;
  };

  export interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    entryDate: string;
    exitDate?: string | null;
  }
  