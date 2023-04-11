import express from 'express';
import { z } from 'zod';
import { google } from 'googleapis';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

const app = express();
const port = process.env.PORT || 3000;

// Set up Google OAuth credentials
const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

// Set up Google Calendar API client
const calendar = google.calendar({
  version: 'v3',
  auth: oAuth2Client,
});

// Zod schema for the host availability input
const hostAvailabilitySchema = z.object({
  startTime: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/),
});

// Zod schema for the available time slots output
const availableTimeSlotsSchema = z.array(
  z.object({
    start: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/),
    end: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/),
  })
);


// Use middleware to parse request bodies as JSON
app.use(express.json());

// Mount availability and meetings routers at their respective paths
app.use('/availability', availabilityRouter);
app.use('/meetings', meetingsRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

