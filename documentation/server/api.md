# Server API Documentation

## Authentication Endpoints

### `/api/auth`

#### POST `/auth/login`
- Purpose: Authenticate user and create session
- Body:
  - `email`: string
  - `password`: string
- Returns:
  - `accessToken`: JWT token
  - `user`: User object

#### POST `/auth/signup`
- Purpose: Create new user account
- Body:
  - `invitationCode`: string
  - `username`: string
  - `email`: string
  - `password`: string
  - `passwordConfirmation`: string
- Returns: User object with initial settings

#### POST `/auth/refresh`
- Purpose: Refresh access token using refresh token cookie
- Returns:
  - `accessToken`: New JWT token
  - `user`: Updated user object

#### POST `/auth/logout`
- Purpose: Invalidate session and clear refresh token
- Returns: Success status

#### POST `/auth/verify-email`
- Purpose: Verify user's email address
- Body:
  - `token`: Verification token
- Returns: Success status

#### POST `/auth/username-is-unique`
- Purpose: Check if username is available
- Body:
  - `username`: string
- Returns:
  - `isUnique`: boolean

## User Management Endpoints

### `/api/users`

#### GET `/users/[id]`
- Purpose: Get user profile by ID
- Parameters:
  - `id`: User ID
- Returns: Public user profile

#### DELETE `/users/[id]`
- Purpose: Delete user account (admin only)
- Parameters:
  - `id`: User ID
- Returns: Success status

#### GET `/users/me`
- Purpose: Get current user's full profile
- Returns: Complete user object with private data

#### PATCH `/users/me`
- Purpose: Update current user's profile
- Body: User data fields to update
- Returns: Updated user object

#### GET `/users/getByQuery`
- Purpose: Search users by query
- Query Parameters: Various search filters
- Returns: Array of matching user profiles

### `/api/me`

#### PATCH `/me/updateEmail`
- Purpose: Update user's email address
- Body:
  - `newEmail`: string
- Returns: Success status

#### DELETE `/me/delete`
- Purpose: Delete own account
- Body:
  - `confirmation`: string
  - `username`: string
- Returns: Success status

#### PATCH `/me/update/record-value`
- Purpose: Update user's record values
- Body: Record data to update
- Returns: Updated record

## Patreon Integration

### `/api/patreon`

#### GET `/patreon/me`
- Purpose: Get user's Patreon profile
- Returns: Patreon account data

#### POST `/patreon/refresh`
- Purpose: Refresh Patreon access token
- Returns: New Patreon tokens

#### POST `/patreon/state-token`
- Purpose: Generate state token for Patreon OAuth
- Returns:
  - `stateToken`: OAuth state token

## Application Endpoints

### `/api/app`

#### GET `/app/network-test`
- Purpose: Test API connectivity
- Returns: Connection status

#### POST `/api/colorMode`
- Purpose: Update user's color mode preference
- Body:
  - `mode`: 'light' | 'dark'
- Returns: Updated preference

## Response Format

All API endpoints follow a standard response format:

```typescript
interface ApiResponse<T> {
  ok: boolean;
  status: string;
  data?: T;
  error?: {
    message: string;
    details?: any;
  };
}
```

## Authentication

Most endpoints require authentication via Bearer token:
```
Authorization: Bearer <access_token>
```

Exceptions:
- `/auth/login`
- `/auth/signup`
- `/auth/refresh`
- `/auth/verify-email`
- `/auth/username-is-unique`
- `/app/network-test`

## Error Handling

All endpoints may return the following error statuses:
- 400: Bad Request - Invalid input
- 401: Unauthorized - Missing or invalid authentication
- 403: Forbidden - Insufficient permissions
- 404: Not Found - Resource doesn't exist
- 500: Internal Server Error - Server-side error

## Rate Limiting

API endpoints are rate-limited to:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

## Best Practices

1. Always check response `ok` status before using data
2. Handle token refresh automatically on 401 responses
3. Implement exponential backoff for failed requests
4. Cache frequently accessed data
5. Use appropriate HTTP methods for operations:
   - GET for retrieval
   - POST for creation
   - PATCH for updates
   - DELETE for removal
