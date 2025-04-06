export interface Step1FormData {
  name: string;
  volunteerType: string[];
  email: string;
  password: string;
  termsAccepted: boolean;
}

export interface Step2FormData {
  age: number;
  phone: string;
  location: string;
}

export interface Step3FormData {
  profilePhoto: File;
  interestedSkills: string[];
  skills: string;
  website: string;
  linkedin: string;
}

export interface VolunteerSignupForm extends Step1FormData, Step2FormData, Step3FormData {}