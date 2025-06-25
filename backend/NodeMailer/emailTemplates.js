export const VERIFICATION_EMAIL_TEMPLATE = `

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your SyncSphere Account</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f4f5; /* zinc-100 */
    }
    table {
      border-spacing: 0;
    }
    td {
      padding: 0;
    }
    img {
      border: 0;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #f4f4f5; /* zinc-100 */
      padding-bottom: 60px;
    }
    .main {
      background-color: #ffffff;
      margin: 0 auto;
      width: 100%;
      max-width: 600px;
      border-spacing: 0;
      font-family: 'Inter', sans-serif, Arial;
      color: #3f3f46; /* zinc-700 */
    }
    .two-columns {
      text-align: center;
      font-size: 0;
    }
    .two-columns .column {
      width: 100%;
      max-width: 300px;
      display: inline-block;
      vertical-align: top;
    }
  </style>
</head>
<body>

  <!-- This is a preheader. It's the short summary text that follows the subject line in an email client. -->
  <div style="display:none;font-size:1px;color:#333333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    Your SyncSphere verification code is inside.
  </div>

  <center class="wrapper">
    <table class="main" width="100%">
      
      

      <!-- BODY -->
      <tr>
        <td style="padding: 40px 30px;">
          <h2 style="font-size: 24px; font-weight: bold; color: #18181b; margin-top: 0;">Confirm Your Email</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #52525b;">Hello {name},</p>
          <p style="font-size: 16px; line-height: 1.6; color: #52525b;">Thank you for signing up for SyncSphere. To complete your registration, please use the following verification code:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #14b8a6; background-color: #f0fdfa; padding: 15px 20px; border-radius: 8px; display: inline-block;">{verificationCode}</p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #52525b;">This code is valid for the next 15 minutes. Please enter it on the verification page in the app.</p>
          <p style="font-size: 16px; line-height: 1.6; color: #52525b;">If you did not request this, you can safely ignore this email.</p>
          <p style="font-size: 16px; line-height: 1.6; color: #52525b;">Best regards,<br>The SyncSphere Team</p>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="background-color: #27272a; padding: 30px 20px; text-align: center;">
          <p style="font-size: 12px; color: #a1a1aa;">© 2024 SyncSphere. All Rights Reserved.</p>
          <p style="font-size: 12px; color: #a1a1aa;">This is a transactional email. Please do not reply.</p>
        </td>
      </tr>

    </table>
  </center>

</body>
</html>

`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your SyncSphere Password Has Been Reset</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f4f5; /* zinc-100 */
    }
    table {
      border-spacing: 0;
    }
    td {
      padding: 0;
    }
    img {
      border: 0;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #f4f4f5; /* zinc-100 */
      padding-bottom: 60px;
    }
    .main {
      background-color: #ffffff;
      margin: 0 auto;
      width: 100%;
      max-width: 600px;
      border-spacing: 0;
      font-family: 'Inter', sans-serif, Arial;
      color: #3f3f46; /* zinc-700 */
    }
    .two-columns {
      text-align: center;
      font-size: 0;
    }
    .two-columns .column {
      width: 100%;
      max-width: 300px;
      display: inline-block;
      vertical-align: top;
    }
    .button {
        background-color: #14b8a6; /* teal-500 */
        color: #ffffff;
        text-decoration: none;
        padding: 14px 28px;
        border-radius: 8px;
        font-weight: bold;
        display: inline-block;
    }
  </style>
</head>
<body>

  <!-- Preheader text -->
  <div style="display:none;font-size:1px;color:#333333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    Your password has been successfully changed.
  </div>

  <center class="wrapper">
    <table class="main" width="100%">
      
      
      <!-- BODY -->
      <tr>
        <td style="padding: 40px 30px;">
          <h2 style="font-size: 24px; font-weight: bold; color: #18181b; margin-top: 0;">Password Changed Successfully</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #52525b;">Hello {name},</p>
          <p style="font-size: 16px; line-height: 1.6; color: #52525b;">This is a confirmation that the password for your SyncSphere account has been successfully changed. You can now log in using your new password.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #f0fdfa; border: 2px solid #ccfbf1; color: #14b8a6; width: 60px; height: 60px; line-height: 60px; border-radius: 50%; display: inline-block; font-size: 32px; font-weight: bold;">
              ✓
            </div>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #52525b; font-weight: bold;">If you did not make this change, please secure your account immediately by resetting your password again and contacting our support team.</p>
          <p style="font-size: 16px; line-height: 1.6; color: #52525b;">Thank you for helping us keep your account secure.</p>
          <p style="font-size: 16px; line-height: 1.6; color: #52525b;">Best regards,<br>The SyncSphere Team</p>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="background-color: #27272a; padding: 30px 20px; text-align: center;">
          <p style="font-size: 12px; color: #a1a1aa;">© 2024 SyncSphere. All Rights Reserved.</p>
          <p style="font-size: 12px; color: #a1a1aa;">This is a transactional email. Please do not reply.</p>
        </td>
      </tr>

    </table>
  </center>

</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your SyncSphere Password</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f4f5; /* zinc-100 */
    }
    table {
      border-spacing: 0;
    }
    td {
      padding: 0;
    }
    img {
      border: 0;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #f4f4f5; /* zinc-100 */
      padding-bottom: 60px;
    }
    .main {
      background-color: #ffffff;
      margin: 0 auto;
      width: 100%;
      max-width: 600px;
      border-spacing: 0;
      font-family: 'Inter', sans-serif, Arial;
      color: #3f3f46; /* zinc-700 */
    }
    .two-columns {
      text-align: center;
      font-size: 0;
    }
    .two-columns .column {
      width: 100%;
      max-width: 300px;
      display: inline-block;
      vertical-align: top;
    }
    .button {
        background-color: #14b8a6; /* teal-500 */
        color: #ffffff;
        text-decoration: none;
        padding: 14px 28px;
        border-radius: 8px;
        font-weight: bold;
        display: inline-block;
    }
  </style>
</head>
<body>

  <!-- Preheader text -->
  <div style="display:none;font-size:1px;color:#333333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    A request was made to reset your password.
  </div>

  <center class="wrapper">
    <table class="main" width="100%">
      
      

      <!-- BODY -->
      <tr>
        <td style="padding: 40px 30px;">
          <h2 style="font-size: 24px; font-weight: bold; color: #18181b; margin-top: 0;">Password Reset Request</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #52525b;">Hello {name},</p>
          <p style="font-size: 16px; line-height: 1.6; color: #52525b;">We received a request to reset the password associated with your SyncSphere account. If you made this request, please click the button below to set a new password.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{resetURL}" target="_blank" class="button">Reset Your Password</a>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #52525b;">This link is valid for 1 hour. If you did not request a password reset, you can safely disregard this email.</p>
          <p style="font-size: 16px; line-height: 1.6; color: #52525b;">Best regards,<br>The SyncSphere Team</p>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="background-color: #27272a; padding: 30px 20px; text-align: center;">
          <p style="font-size: 12px; color: #a1a1aa;">© 2024 SyncSphere. All Rights Reserved.</p>
          <p style="font-size: 12px; color: #a1a1aa;">This is a transactional email. Please do not reply.</p>
        </td>
      </tr>

    </table>
  </center>

</body>
</html>
`;

export const WELCOME_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to SyncSphere!</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f4f5; /* zinc-100 */
    }
    table {
      border-spacing: 0;
    }
    td {
      padding: 0;
    }
    img {
      border: 0;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #f4f4f5; /* zinc-100 */
      padding-bottom: 60px;
    }
    .main {
      background-color: #ffffff;
      margin: 0 auto;
      width: 100%;
      max-width: 600px;
      border-spacing: 0;
      font-family: 'Inter', sans-serif, Arial;
      color: #3f3f46; /* zinc-700 */
    }
    .two-columns {
      text-align: center;
      font-size: 0;
    }
    .two-columns .column {
      width: 100%;
      max-width: 300px;
      display: inline-block;
      vertical-align: top;
    }
    .button {
        background-color: #14b8a6; /* teal-500 */
        color: #ffffff;
        text-decoration: none;
        padding: 14px 28px;
        border-radius: 8px;
        font-weight: bold;
        display: inline-block;
    }
  </style>
</head>
<body>

  <!-- Preheader text for inbox preview -->
  <div style="display:none;font-size:1px;color:#333333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    We're excited to have you on board! Let's get you started.
  </div>

  <center class="wrapper">
    <table class="main" width="100%">
      
      <!-- HEADER -->
      <tr>
        <td style="background-color: #27272a; padding: 16px;">
          <table width="100%">
            <tr>
              <td class="two-columns">
                <table class="column">
                  <tr>
                    <td style="padding: 0 22px;">
                      <!-- Add your logo URL here -->
                      <a href="{appURL}" target="_blank">
                        <img src="https://i.imgur.com/your-logo-url.png" alt="SyncSphere Logo" width="40" title="SyncSphere Logo" style="display:inline-block;vertical-align:middle;">
                        <span style="font-size: 20px; font-weight: bold; color: #ffffff; display:inline-block; vertical-align:middle; margin-left: 10px;">SyncSphere</span>
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- BODY -->
      <tr>
        <td style="padding: 40px 30px;">
          <h2 style="font-size: 24px; font-weight: bold; color: #18181b; margin-top: 0;">Welcome to SyncSphere!</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #52525b;">Hello {name},</p>
          <p style="font-size: 16px; line-height: 1.6; color: #52525b;">We're thrilled to have you join our community. Your account has been successfully created, and you're now ready to start connecting and chatting in real-time.</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #52525b; margin-top: 24px;">Click the button below to jump right in and start your first conversation.</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="{appURL}" target="_blank" class="button">Start Chatting</a>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #52525b;">Best regards,<br>The SyncSphere Team</p>
        </td>

      <!-- FOOTER -->
      <tr>
        <td style="background-color: #27272a; padding: 30px 20px; text-align: center;">
          <p style="font-size: 12px; color: #a1a1aa;">© 2024 SyncSphere. All Rights Reserved.</p>
          <p style="font-size: 12px; color: #a1a1aa;">You are receiving this email because you signed up for an account on SyncSphere.</p>
        </td>
      </tr>

    </table>
  </center>

</body>
</html>
`