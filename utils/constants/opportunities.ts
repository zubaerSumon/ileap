export const OPPORTUNITY_CATEGORIES = [
  { value: "Community & Social Services", label: "Community & Social Services" },
  { value: "Education & Mentorship", label: "Education & Mentorship" },
  { value: "Healthcare & Medical Volunteering", label: "Healthcare & Medical Volunteering" },
  { value: "Corporate & Skilled Volunteering", label: "Corporate & Skilled Volunteering" },
  { value: "Technology & Digital Volunteering", label: "Technology & Digital Volunteering" },
  { value: "Animal Welfare", label: "Animal Welfare" },
  { value: "Arts, Culture & Heritage", label: "Arts, Culture & Heritage" },
  { value: "Environmental & Conservation", label: "Environmental & Conservation" },
] as const;

export const COMMITMENT_TYPES = [
  { value: "workbased", label: "Work based" },
  { value: "eventbased", label: "Event based" },
] as const;

export const RECURRENCE_TYPES = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
] as const;

export const WEEKDAYS = [
  { value: "mon", label: "Monday" },
  { value: "tue", label: "Tuesday" },
  { value: "wed", label: "Wednesday" },
  { value: "thu", label: "Thursday" },
  { value: "fri", label: "Friday" },
  { value: "sat", label: "Saturday" },
  { value: "sun", label: "Sunday" },
] as const;

export const ANSWER_TYPES = [
  { value: "checkbox", label: "Checkbox" },
  { value: "dropdown", label: "Dropdown" },
  { value: "multiple", label: "Multiple choice" },
  { value: "paragraph", label: "Paragraph" },
] as const; 