const authenticator = require(otplib);

const secret = "KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD";
// Alternative:
// const secret = authenticator.generateSecret();
// Note: .generateSecret() is only available for authenticator and not totp/hotp

const token = authenticator.generate(secret);

try {
  const isValid = authenticator.check(token, secret);
  // or
} catch (err) {
  // Possible errors
  // - options validation
  // - "Invalid input - it is not base32 encoded string" (if thiry-two is used)
  console.error(err);
}
