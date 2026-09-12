// OTP generation + sending.
//
// Real SMS delivery uses Fast2SMS (https://www.fast2sms.com) because its
// "otp" route is free-tier friendly for Indian numbers: you get free credits
// on signup, and this route is pre-approved so it works immediately with no
// DLT sender-ID / template registration (unlike most other SMS routes).
//
// If FAST2SMS_API_KEY is not set (or OTP_DEV_MODE=true), the OTP is instead
// printed to the backend terminal so the project still runs with zero setup.
//
// To go live:
//   1. Sign up free at https://www.fast2sms.com and verify your account.
//   2. Copy your API key from the Dev API section.
//   3. Put it in backend/.env as FAST2SMS_API_KEY=xxxx and set OTP_DEV_MODE=false.

const generateOtpCode = () => {
  return Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
};

const isRealSmsConfigured = () =>
  process.env.OTP_DEV_MODE !== "true" && !!process.env.FAST2SMS_API_KEY;

const sendOtp = async (phone, code) => {
  if (!isRealSmsConfigured()) {
    console.log(`\n[DEV OTP] Phone: ${phone} | OTP Code: ${code}\n`);
    return { sent: true, devMode: true };
  }

  try {
    const params = new URLSearchParams({
      authorization: process.env.FAST2SMS_API_KEY,
      route: "otp",
      variables_values: code,
      flash: "0",
      numbers: phone,
    });

    const response = await fetch(`https://www.fast2sms.com/dev/bulkV2?${params.toString()}`);
    const data = await response.json();

    if (!data.return) {
      // Gateway rejected the request (bad key, no balance, etc). Log the
      // reason and fall back to the console so testing is never blocked.
      console.error("[Fast2SMS] OTP send failed:", data.message || JSON.stringify(data));
      console.log(`\n[FALLBACK OTP] Phone: ${phone} | OTP Code: ${code}\n`);
      return { sent: false, devMode: true, error: data.message };
    }

    console.log(`[Fast2SMS] OTP sent to ${phone} (request id: ${data.request_id || "-"})`);
    return { sent: true, devMode: false };
  } catch (err) {
    console.error("[Fast2SMS] SMS gateway error:", err.message);
    console.log(`\n[FALLBACK OTP] Phone: ${phone} | OTP Code: ${code}\n`);
    return { sent: false, devMode: true, error: err.message };
  }
};

module.exports = { generateOtpCode, sendOtp, isRealSmsConfigured };
