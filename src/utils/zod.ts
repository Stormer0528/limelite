import { z } from 'zod';

const emptyStringToNull = z.literal('');

export function allowEmptyString<T extends z.ZodTypeAny>(schema?: T) {
  return (schema ?? z.string().nullish()).or(emptyStringToNull);
}
