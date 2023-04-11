import * as z from 'zod';

const availabilityOutputSchema = z.object({
  startTime: z.date(),
  endTime: z.date(),
  timeZone: z.string(),
});

export default availabilityOutputSchema