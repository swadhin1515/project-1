import express from 'express';
import { google } from 'googleapis';
//import { OAuth2Client } from 'google-auth-library';
import oauth2Client  from "../services/googleCalender";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from "../src/swagger.json";

const app = express.Router();


/**
 * @swagger
 * /host/events:
 *   get:
 *     summary: Get a list of events for the host
 *     security:
 *       - google: []
 *     responses:
 *       200:
 *         description: A list of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */

// Endpoint for fetching the host's scheduled meetings
app.get('/routes/meetings', async (req, res) => {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URL
    );
    oauth2Client.setCredentials(req.session.hostCredentials);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const events = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime'
    });
    res.status(200).json({ meetings: events.data.items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching meetings' });
  }
});


/**
 * @swagger
 * /non-host/events:
 *   get:
 *     summary: Get a list of events for the non-host user
 *     security:
 *       - google: []
 *     responses:
 *       200:
 *         description: A list of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */

// Endpoint for fetching the non-host user's scheduled meetings
app.get('/routes/meetings', async (req, res) => {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URL
    );
    oauth2Client.setCredentials(req.session.userCredentials);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const events = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime'
    });
    res.status(200).json({ meetings: events.data.items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching meetings' });
  }
});

export default app;


// Serve the Swagger UI at /docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));