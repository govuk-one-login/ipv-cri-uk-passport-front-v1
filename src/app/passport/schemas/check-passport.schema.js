const { z } = require("zod");

const retryResponseSchema = z.object({
  result: z.literal("retry")
});

const successResponseSchema = z.object({
  session_id: z.string().min(1),
  state: z.string().min(1),
  redirect_uri: z.url()
});

const checkPassportResponseSchema = z.union([
  retryResponseSchema,
  successResponseSchema
]);

module.exports = {
  checkPassportResponseSchema
};
