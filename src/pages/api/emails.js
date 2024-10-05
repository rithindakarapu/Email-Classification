import { google } from 'googleapis';
import { getSession } from 'next-auth/react';
import connectDB from '../../utils/db'; // Import database connection
import Email from '../../models/Email'; // Import Email model

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    auth.setCredentials({
      access_token: session.accessToken,
      refresh_token: session.refreshToken,
    });

    const gmail = google.gmail({ version: 'v1', auth });

    // Parse count to ensure it is a number
    const count = parseInt(req.query.count) || 10;

    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: count,
    });

    const messages = response.data.messages || [];

    if (messages.length === 0) {
      return res.status(200).json({ message: 'No new emails found.' });
    }

    // Fetch detailed email data
    const emailPromises = messages.map(async (message) => {
      const email = await gmail.users.messages.get({
        userId: 'me',
        id: message.id,
      });
      return email.data;
    });

    const emails = await Promise.all(emailPromises);

    // Connect to the database
    await connectDB();

    // Store emails in the database
    const savedEmails = await Email.insertMany(
      emails.map((email) => ({
        id: email.id,
        threadId: email.threadId,
        snippet: email.snippet,
        internalDate: new Date(parseInt(email.internalDate)),
        payload: email.payload,
      }))
    );

    // Return the saved emails data
    res.status(200).json(savedEmails);
  } catch (error) {
    console.error('Error fetching or saving emails:', error.message);
    res.status(500).json({ error: 'Error fetching or saving emails' });
  }
}
