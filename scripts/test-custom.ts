// Dummy file to be run by tsx to hit the endpoint after Next.js is started on port 3010
console.log("Fetching...");
fetch('http://localhost:3010/api/auth/sign-in/email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'student@lms.dev', password: 'Admin123!' })
}).then(async r => {
  console.log(r.status, await r.text());
  process.exit(0);
});
