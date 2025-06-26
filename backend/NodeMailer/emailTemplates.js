// ... (your existing templates)

export const APPLICATION_REMINDER_TEMPLATE = `
  <p>Hi {name},</p>
  <p>This is a friendly reminder that your application for the <strong>{jobTitle}</strong> position at <strong>{company}</strong> is due {when}!</p>
  <p>Don't miss out on this opportunity.</p>
  <p>Best of luck!</p>
`;

// MODIFIED: Added a {when} placeholder
export const INTERVIEW_REMINDER_TEMPLATE = `
  <p>Hi {name},</p>
  <p>This is a friendly reminder that you have an interview {when} for the <strong>{jobTitle}</strong> position at <strong>{company}</strong>.</p>
  <p>You've got this! Prepare well and good luck!</p>
`;