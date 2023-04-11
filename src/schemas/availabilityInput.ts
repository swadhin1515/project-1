import * as z from 'zod';

const availabilityInputSchema = z.object({
  startTime: z.date(),
  endTime: z.date(),
  timeZone: z.string(),
});



export default availabilityInputSchema 
