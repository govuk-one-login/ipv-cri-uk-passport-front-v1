const { checkPassportResponseSchema } = require("./check-passport.schema");

const validSuccessResponse = {
  session_id: "some-session-id",
  state: "some-state",
  redirect_uri: "https://example.com/callback"
};

describe("checkPassportResponseSchema", () => {
  describe("success response", () => {
    it("accepts a response with all required fields", () => {
      const parseResult =
        checkPassportResponseSchema.safeParse(validSuccessResponse);

      expect(parseResult.success).to.equal(true);
    });

    it("rejects when session_id is missing", () => {
      const parseResult = checkPassportResponseSchema.safeParse({
        state: validSuccessResponse.state,
        redirect_uri: validSuccessResponse.redirect_uri
      });

      expect(parseResult.success).to.equal(false);
    });

    it("rejects when session_id is empty", () => {
      const parseResult = checkPassportResponseSchema.safeParse({
        ...validSuccessResponse,
        session_id: ""
      });

      expect(parseResult.success).to.equal(false);
    });

    it("rejects when state is missing", () => {
      const parseResult = checkPassportResponseSchema.safeParse({
        session_id: validSuccessResponse.session_id,
        redirect_uri: validSuccessResponse.redirect_uri
      });

      expect(parseResult.success).to.equal(false);
    });

    it("rejects when state is empty", () => {
      const parseResult = checkPassportResponseSchema.safeParse({
        ...validSuccessResponse,
        state: ""
      });

      expect(parseResult.success).to.equal(false);
    });

    it("rejects when redirect_uri is missing", () => {
      const parseResult = checkPassportResponseSchema.safeParse({
        session_id: validSuccessResponse.session_id,
        state: validSuccessResponse.state
      });

      expect(parseResult.success).to.equal(false);
    });

    it("rejects when redirect_uri is invalid", () => {
      const parseResult = checkPassportResponseSchema.safeParse({
        ...validSuccessResponse,
        redirect_uri: "not-a-url"
      });

      expect(parseResult.success).to.equal(false);
    });
  });

  describe("retry response", () => {
    it("accepts a result retry response", () => {
      const validRetryResponse = {
        result: "retry"
      };
      const parseResult =
        checkPassportResponseSchema.safeParse(validRetryResponse);

      expect(parseResult.success).to.equal(true);
    });

    it("rejects result responses with values other than retry", () => {
      const parseResult = checkPassportResponseSchema.safeParse({
        result: "success"
      });

      expect(parseResult.success).to.equal(false);
    });
  });

  describe("unexpected response", () => {
    it("rejects an unexpected object", () => {
      const parseResult = checkPassportResponseSchema.safeParse({
        unexpected: true
      });

      expect(parseResult.success).to.equal(false);
    });

    it("rejects null", () => {
      const parseResult = checkPassportResponseSchema.safeParse(null);

      expect(parseResult.success).to.equal(false);
    });
  });
});
