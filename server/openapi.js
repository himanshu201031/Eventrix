/**
 * OpenAPI 3.0 specification for the Eventrix API.
 * Served interactively at /api-docs and raw at /api-docs.json.
 */
module.exports = {
  openapi: "3.0.3",
  info: {
    title: "Eventrix API",
    version: "1.0.0",
    description:
      "Ticket booking for India's live-event scene. All endpoints live under `/api/v1`. " +
      "Authenticate with `Authorization: Bearer <token>` (issued by POST /auth/login or /auth/verify-otp). " +
      "Every error response follows the shape `{ code, message, timestamp, path, errors? }`.",
  },
  servers: [{ url: "/api/v1", description: "Current version" }],
  tags: [
    { name: "Auth", description: "Registration, login and OTP verification" },
    { name: "Events", description: "Event catalog — public reads, admin writes" },
    { name: "Bookings", description: "Booking requests, approvals and QR passes" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
    schemas: {
      Error: {
        type: "object",
        required: ["code", "message", "timestamp", "path"],
        properties: {
          code: { type: "string", example: "VALIDATION_ERROR" },
          message: { type: "string", example: "Email and password are required" },
          timestamp: { type: "string", format: "date-time" },
          path: { type: "string", example: "/api/v1/auth/login" },
          errors: { type: "array", items: { type: "string" } },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string" },
          username: { type: "string" },
          email: { type: "string", format: "email" },
          role: { type: "string", enum: ["user", "admin"] },
          token: { type: "string", description: "JWT, present on auth responses" },
        },
      },
      Event: {
        type: "object",
        properties: {
          _id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          date: { type: "string", format: "date-time" },
          location: { type: "string" },
          category: { type: "string" },
          totalSeats: { type: "integer" },
          availableSeats: { type: "integer" },
          ticketPrice: { type: "number", description: "0 = free event" },
          image: { type: "string" },
          createdBy: { $ref: "#/components/schemas/User" },
        },
      },
      Booking: {
        type: "object",
        properties: {
          _id: { type: "string" },
          userId: { $ref: "#/components/schemas/User" },
          eventId: { $ref: "#/components/schemas/Event" },
          status: { type: "string", enum: ["pending", "confirmed", "cancelled"] },
          paymentStatus: { type: "string", enum: ["paid", "not_paid"] },
          amount: { type: "number" },
          bookedAt: { type: "string", format: "date-time" },
        },
      },
      Paginated: {
        type: "object",
        required: ["items", "page", "page_size", "total", "pages"],
        properties: {
          items: { type: "array", items: {} },
          page: { type: "integer", example: 1 },
          page_size: { type: "integer", example: 50 },
          total: { type: "integer", example: 132 },
          pages: { type: "integer", example: 3 },
        },
      },
      PaginatedEvents: {
        allOf: [
          { $ref: "#/components/schemas/Paginated" },
          { type: "object", properties: { items: { type: "array", items: { $ref: "#/components/schemas/Event" } } } },
        ],
      },
      PaginatedBookings: {
        allOf: [
          { $ref: "#/components/schemas/Paginated" },
          { type: "object", properties: { items: { type: "array", items: { $ref: "#/components/schemas/Booking" } } } },
        ],
      },
    },
  },
  paths: {
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user and send a verification OTP",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["username", "email", "password"],
                properties: {
                  username: { type: "string" },
                  email: { type: "string", format: "email" },
                  password: { type: "string", format: "password" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "User created; OTP sent to email" },
          409: { description: "Email or username already taken", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Log in with email + password",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: { email: { type: "string" }, password: { type: "string" } },
              },
            },
          },
        },
        responses: {
          200: { description: "Login successful", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
          400: { description: "Account not verified — OTP re-sent", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          401: { description: "Invalid credentials", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          429: { description: "Too many attempts", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/auth/verify-otp": {
      post: {
        tags: ["Auth"],
        summary: "Verify the email OTP and get a JWT",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "otp"],
                properties: { email: { type: "string" }, otp: { type: "string", description: "6-digit code from email" } },
              },
            },
          },
        },
        responses: {
          200: { description: "Account verified", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
          422: { description: "Invalid or expired OTP", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/events": {
      get: {
        tags: ["Events"],
        summary: "List events with filters, sorting and pagination",
        parameters: [
          { name: "category", in: "query", schema: { type: "string" }, description: "Exact category match" },
          { name: "search", in: "query", schema: { type: "string" }, description: "Case-insensitive title search" },
          { name: "sort", in: "query", schema: { type: "string" }, description: "Field to sort by, `-` prefix for descending. Allowed: date, createdAt, title, ticketPrice" },
          { name: "page", in: "query", schema: { type: "integer", minimum: 1, default: 1 } },
          { name: "page_size", in: "query", schema: { type: "integer", minimum: 1, maximum: 100, default: 50 } },
        ],
        responses: {
          200: { description: "Paginated event list", content: { "application/json": { schema: { $ref: "#/components/schemas/PaginatedEvents" } } } },
        },
      },
      post: {
        tags: ["Events"],
        summary: "Create an event (admin only)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "description", "date", "location", "category", "totalSeats"],
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  date: { type: "string", format: "date-time" },
                  location: { type: "string" },
                  category: { type: "string" },
                  totalSeats: { type: "integer", minimum: 1 },
                  ticketPrice: { type: "number", default: 0 },
                  image: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Event created", content: { "application/json": { schema: { $ref: "#/components/schemas/Event" } } } },
          401: { description: "Not authenticated", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          403: { description: "Not an admin", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/events/{id}": {
      get: {
        tags: ["Events"],
        summary: "Get a single event",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Event details", content: { "application/json": { schema: { $ref: "#/components/schemas/Event" } } } },
          400: { description: "Invalid ID format", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          404: { description: "Event not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
      put: {
        tags: ["Events"],
        summary: "Update an event (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object", additionalProperties: true, description: "Partial event fields" },
            },
          },
        },
        responses: {
          200: { description: "Event updated", content: { "application/json": { schema: { $ref: "#/components/schemas/Event" } } } },
          401: { description: "Not authenticated", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          403: { description: "Not an admin", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
      delete: {
        tags: ["Events"],
        summary: "Delete an event (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          204: { description: "Event deleted" },
          401: { description: "Not authenticated", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          403: { description: "Not an admin", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/bookings/send-otp": {
      post: {
        tags: ["Bookings"],
        summary: "Request a booking OTP for the current user",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "OTP sent to email" },
          401: { description: "Not authenticated", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/bookings": {
      post: {
        tags: ["Bookings"],
        summary: "Submit a booking request (OTP verified, single-use)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["eventId", "otp"],
                properties: {
                  eventId: { type: "string" },
                  otp: { type: "string", description: "6-digit booking OTP from POST /bookings/send-otp" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Booking request submitted", content: { "application/json": { schema: { $ref: "#/components/schemas/Booking" } } } },
          409: { description: "Already booked or pending", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          422: { description: "Invalid OTP or event sold out", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/bookings/my": {
      get: {
        tags: ["Bookings"],
        summary: "List the current user's bookings (admins see all), newest first",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", minimum: 1, default: 1 } },
          { name: "page_size", in: "query", schema: { type: "integer", minimum: 1, maximum: 100, default: 50 } },
        ],
        responses: {
          200: { description: "Paginated bookings", content: { "application/json": { schema: { $ref: "#/components/schemas/PaginatedBookings" } } } },
          401: { description: "Not authenticated", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/bookings/{id}/confirm": {
      put: {
        tags: ["Bookings"],
        summary: "Confirm a booking and deduct a seat (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["paymentStatus"],
                properties: { paymentStatus: { type: "string", enum: ["paid", "not_paid"] } },
              },
            },
          },
        },
        responses: {
          200: { description: "Booking confirmed", content: { "application/json": { schema: { $ref: "#/components/schemas/Booking" } } } },
          409: { description: "Already confirmed", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/bookings/{id}": {
      delete: {
        tags: ["Bookings"],
        summary: "Cancel a booking (owner or admin); refunds the seat if it was confirmed",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          204: { description: "Booking cancelled" },
          403: { description: "Not the owner and not an admin", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          404: { description: "Booking not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
  },
};
