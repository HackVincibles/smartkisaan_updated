const { OAuth2Client } = require('google-auth-library');
const { GOOGLE_CLIENT_ID } = require('../config/config');

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

/**
 * verifyGoogleToken
 * Verifies a Google id_token sent from the frontend (React + @react-oauth/google)
 *
 * Flow:
 *   1. Frontend: user clicks "Sign in with Google"
 *   2. Frontend: Google returns an id_token (credential)
 *   3. Frontend: POST /api/v1/auth/google  { idToken: "eyJ..." }
 *   4. Backend: calls this function to verify the token with Google
 *   5. Backend: extracts { googleId, name, email, picture } from payload
 *   6. Backend: finds or creates user → returns our own JWT
 *
 * @param {string} idToken - Google id_token from frontend
 * @returns {object} { googleId, name, email, picture }
 * @throws {Error} if token is invalid or expired
 */
const verifyGoogleToken = async (idToken) => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  return {
    googleId: payload['sub'],       // Google's unique user ID
    name: payload['name'],
    email: payload['email'],
    picture: payload['picture'],    // Profile photo URL
    emailVerified: payload['email_verified'],
  };
};

module.exports = { verifyGoogleToken };
