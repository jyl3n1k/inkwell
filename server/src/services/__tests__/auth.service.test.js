import { jest } from "@jest/globals";

const mockUserRepository = {
  findByEmail: jest.fn(),
  create: jest.fn(),
};

const mockTokenService = {
  issueTokens: jest.fn(),
};

jest.unstable_mockModule("../../repositories/user.repository.js", () => ({
  UserRepository: mockUserRepository,
}));

jest.unstable_mockModule("../token.service.js", () => ({
  TokenService: mockTokenService,
}));

const {
  AuthService,
  EmailAlreadyRegisteredError,
  WeakPasswordError,
  ValidationError,
} = await import("../auth.service.js");

const validInput = {
  email: "alice@example.com",
  displayName: "Alice",
  password: "correcthorse",
};

beforeEach(() => {
  jest.resetAllMocks();
  mockUserRepository.findByEmail.mockResolvedValue(null);
  mockUserRepository.create.mockResolvedValue({
    id: "u1",
    email: validInput.email,
    displayName: validInput.displayName,
  });
  mockTokenService.issueTokens.mockReturnValue({
    accessToken: "fake-access",
    refreshToken: "fake-refresh",
  });
});

describe("AuthService.register", () => {
  test("creates a user and returns tokens for valid input", async () => {
    await expect(AuthService.register(validInput)).resolves.toEqual({
      user: {
        id: "u1",
        email: validInput.email,
        displayName: validInput.displayName,
      },
      accessToken: "fake-access",
      refreshToken: "fake-refresh",
    });
  });

  test("rejects an already-registered email", async () => {
    mockUserRepository.findByEmail.mockResolvedValue({ id: "existing" });

    await expect(AuthService.register(validInput))
      .rejects.toBeInstanceOf(EmailAlreadyRegisteredError);
  });

  test("rejects a seven-character password", async () => {
    await expect(
      AuthService.register({ ...validInput, password: "1234567" }),
    ).rejects.toBeInstanceOf(WeakPasswordError);
  });

  test("accepts an eight-character password", async () => {
    await expect(
      AuthService.register({ ...validInput, password: "12345678" }),
    ).resolves.toHaveProperty("accessToken", "fake-access");
  });

  test("rejects a missing email", async () => {
    await expect(
      AuthService.register({ ...validInput, email: "" }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  test("converts a repository create failure into a registration error", async () => {
    mockUserRepository.create.mockRejectedValue(
      new Error("unique constraint violated"),
    );

    await expect(AuthService.register(validInput))
      .rejects.toBeInstanceOf(EmailAlreadyRegisteredError);
    expect(mockTokenService.issueTokens).not.toHaveBeenCalled();
  });
});
