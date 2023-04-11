import { Router } from 'express';
import { z } from 'zod';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

const router = Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Generate a URL for the user to authorize the app
const authorizeUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: 'https://www.googleapis.com/auth/calendar',
});

const eventSchema = z.object({
  start: z.object({
    dateTime: z.string().refine((s) => new Date(s) instanceof Date, 'invalid date string'),
  }),
  end: z.object({
    dateTime: z.string().refine((s) => new Date(s) instanceof Date, 'invalid date string'),
  }),
  summary: z.string(),
  description: z.string().optional(),
  location: z.string().optional(),
});

router.post('/create-meeting', async (req, res, next) => {
  try {
    const { code, start, end, summary, description, location } = req.body;

    // exchange code for access token
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // create new event in Google Calendar API
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const event = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        start: { dateTime: start },
        end: { dateTime: end },
        summary,
        description,
        location,
      },
    });
/*
      const event = {
        summary: 'Meeting with John',
        location: '123 Main St.',
        description: 'Discuss project details',
        start: {
            dateTime: '2023-04-15T10:00:00',
            timeZone: 'America/Los_Angeles',
            },
        end: {
            dateTime: '2023-04-15T11:00:00',
            timeZone: 'America/Los_Angeles',
            },
        attendees: [
            { email: 'john@example.com' },
            { email: 'jane@example.com' },
            ],
        reminders: {
            useDefault: true,
            },
        };
        */
    res.json(event.data);
  } catch (err) {
    next(err);
  }
});
