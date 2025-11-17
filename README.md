# Mern-Auth
This is a full-stack project built on the MERN stack (MongoDB, Express.js, React.js, Node.js). This contains all the basic features that we can expect from an application, such as Register, Login, and Password Reset.

Note: Email service will not work after December 23, 2025.

## For Demo
- [Get your temp. email and inbox ](https://temp-mail.org/en/)(Open link in new tab)
- [Live link](https://mern-auth-b9qw.onrender.com)
- Below is the problems I faced during development.

#### Email 
Initially, I used Gmail SMTP for sending emails to users. But when I deployed my backend on Render, I found that it wasn't sending emails. 

I didn't know why, but after searching, I found that this was a security issue—Render doesn't allow it. I then switched to another service provider, SendGrid, and it's working.

#### Login 
When a user logs in, they shouldn't be asked to login again until the user logs out or the login credentials expire. 

To achieve this, I've managed user state using Context API, Cookies for login credentials, and replaced browser history to protect private pages.

#### Email verification and Password reset
To implement both, I used the mailing service (which I mentioned above) to send a 6-digit OTP to users' registered emails.

#### Tech stack and Tools
- Frontend: React.js, Tailwindcss.
- Backend: Node.js, Express.js, SendGrid, MongoDB.
- Tools: VSCode, Postman, Git.