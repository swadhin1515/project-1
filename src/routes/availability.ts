import express, { Request, Response } from 'express';
import availabilityInputSchema from "../schemas/availabilityInput";
import availabilityOutputSchema from "../schemas/availabilityOutput";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from "../src/swagger.json";



const app = express();



app.get('/availability', (req: Request, res: Response) => {
  // TODO: Handle availability fetching logic
  try {
    
    const input = availabilityOutputSchema.parse(req.body);
    res.status(200).send('Availability set successfully');
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });

  }
});

/**
 * @swagger
 * /schedule:
 *   post:
 *     summary: Schedule a meeting with the host
 *     security:
 *       - google: []
 *     requestBody:
 *       description: Meeting details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MeetingRequest'
 *     responses:
 *       200:
 *         description: The scheduled meeting
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meeting'
 */

app.post('/availability', (req: Request, res: Response) => {
  // TODO: Handle availability setting logic
  try {
    const input = availabilityInputSchema.parse(req.body);
    // TODO: Handle availability setting logic using input
    res.status(200).send('Availability set successfully');
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });

  }
});


// Serve the Swagger UI at /docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));