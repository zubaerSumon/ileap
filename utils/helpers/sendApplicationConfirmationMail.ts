import { APPLICATION_CONFIRMATION_TEMPLATE } from "@/server/services/mail/constants";
import sendEmail from "@/server/services/mail/sendMail";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendApplicationConfirmationMail = async (
  email: string,
  name: string,
  opportunityId: string
) => {
  const organization = ["1", "4"].includes(opportunityId)
    ? "Easy Care Gardening"
    : "Clean Up Australia";
  const opportunity = ["1", "4"].includes(opportunityId)
    ? "Gardening Volunteer"
    : "CleanUp Volunteer";

  try {
    const emailTemplate = APPLICATION_CONFIRMATION_TEMPLATE;
    sendEmail(
      [email],
      {
        subject: "Confirmation: Your Opportunity Application on Ausleap",
        data: {
          userName: name,
          opportunity,
          organization,
        },
      },
      emailTemplate
    );
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    throw new Error("Failed to send email. Please try again later.");
  }
};
