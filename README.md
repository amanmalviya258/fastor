# CRM API Documentation

Base URL: `http://localhost:3000/api/v1`

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/amanmalviya258/fastor.git
   cd fastor
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Copy `.env.test` to `.env` and update values as needed:
     ```bash
     cp .env.test .env
     # Edit .env with your database URI, secrets, etc.
     ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## Authentication
Most endpoints require JWT authentication. Include the token in either:
- Cookie: `accessToken`
- Header: `Authorization: Bearer <token>`

---

## Employee Endpoints

### 1. Register Employee
**POST** `/employees/register`

**Authentication:** Not required

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
    "statusCode": 201,
    "success": true,
    "message": "Employee registered successfully",
    "data": {
        "_id": "6909a70725ab9e34f1cb2b9b",
        "email": "john@example.com",
        "name": "John Doe",
        "createdAt": "2025-11-04T07:11:03.961Z",
        "updatedAt": "2025-11-04T07:11:03.961Z",
        "__v": 0
    },
    "error": null,
    "meta": {
        "timestamp": "2025-11-04T07:11:04.317Z"
    }
}
```

---

### 2. Login Employee
**POST** `/employees/login`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "employee": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Employee logged in successfully",
  "success": true
}
```

---

### 3. Logout Employee
**POST** `/employees/logout`

**Authentication:** Required

**Response (200):**
```json
{
    "statusCode": 200,
    "success": true,
    "message": "Employee logged out in successfully",
    "data": null,
    "error": null,
    "meta": {
        "timestamp": "2025-11-04T07:44:39.354Z"
    }
}
```

---

### 4. Get Current Employee
**GET** `/employees/me`

**Authentication:** Required

**Response (200):**
```json
{
    "statusCode": 200,
    "success": true,
    "message": "Current employee fetched successfully",
    "data": {
        "_id": "6909a70725ab9e34f1cb2b9b",
        "email": "john@example.com",
        "name": "John Doe",
        "createdAt": "2025-11-04T07:11:03.961Z",
        "updatedAt": "2025-11-04T07:36:29.626Z",
        "__v": 0,
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTA5YTcwNzI1YWI5ZTM0ZjFjYjJiOWIiLCJpYXQiOjE3NjIyNDE3ODksImV4cCI6MTc2MzEwNTc4OX0.ugSHgMx5Z0m-9WTQkBvnjM9arMOalfN1-CALUIeGQlw"
    },
    "error": null,
    "meta": {
        "timestamp": "2025-11-04T07:46:26.026Z"
    }
}
```

---

## Enquiry Endpoints

### 5. Submit Enquiry Form (Public)
**POST** `/enquiries/submit`

**Authentication:** Not required

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "courseInterest": "Web Development",
  "message": "I'm interested in learning more about the course"
}
```

**Response (201):**
```json
{
    "statusCode": 201,
    "success": true,
    "message": "Enquiry submitted successfully",
    "data": {
        "name": "Jane Smith",
        "email": "jane@example.com",
        "phone": "+1234567890",
        "courseInterest": "Web Development",
        "message": "I'm interested in learning more about the course",
        "isClaimed": false,
        "claimedBy": null,
        "claimedAt": null,
        "_id": "6909b0dad53099839299c03b",
        "createdAt": "2025-11-04T07:52:58.393Z",
        "updatedAt": "2025-11-04T07:52:58.393Z",
        "__v": 0
    },
    "error": null,
    "meta": {
        "timestamp": "2025-11-04T07:52:58.534Z"
    }
}
```

---

### 6. Get Unclaimed Leads
**GET** `/enquiries/unclaimed`

**Authentication:** Required

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Results per page
- `courseInterest` (optional) - Filter by course interest

**Example:** `/enquiries/unclaimed?page=1&limit=10&courseInterest=Web`

**Response (200):**
```json
{
    "statusCode": 200,
    "success": true,
    "message": "Unclaimed leads fetched successfully",
    "data": {
        "leads": [
            {
                "_id": "6909b0dad53099839299c03b",
                "name": "Jane Smith",
                "email": "jane@example.com",
                "phone": "+1234567890",
                "courseInterest": "Web Development",
                "message": "I'm interested in learning more about the course",
                "isClaimed": false,
                "claimedBy": null,
                "claimedAt": null,
                "createdAt": "2025-11-04T07:52:58.393Z",
                "updatedAt": "2025-11-04T07:52:58.393Z",
                "__v": 0
            },
            {
                "_id": "6909b03e1ad6477c5711ba23",
                "name": "Jane Smith",
                "email": "jane@example.com",
                "phone": "+1234567890",
                "courseInterest": "Web Development",
                "message": "I'm interested in learning more about the course",
                "isClaimed": false,
                "claimedBy": null,
                "claimedAt": null,
                "createdAt": "2025-11-04T07:50:22.583Z",
                "updatedAt": "2025-11-04T07:50:22.583Z",
                "__v": 0
            }
        ],
        "totalPages": 1,
        "currentPage": 1,
        "totalLeads": 2
    },
    "error": null,
    "meta": {
        "timestamp": "2025-11-04T07:58:18.210Z"
    }
}
```

---

### 7. Claim a Lead
**POST** `/enquiries/claim/:leadId`

**Authentication:** Required

**URL Parameters:**
- `leadId` - The ID of the lead to claim

**Example:** `/enquiries/claim/65f1234567890abcdef12345`

**Response (200):**
```json
{
    "statusCode": 200,
    "success": true,
    "message": "Lead claimed successfully",
    "data": {
        "_id": "6909b0dad53099839299c03b",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "phone": "+1234567890",
        "courseInterest": "Web Development",
        "message": "I'm interested in learning more about the course",
        "isClaimed": true,
        "claimedBy": {
            "_id": "6909a70725ab9e34f1cb2b9b",
            "email": "john@example.com",
            "name": "John Doe"
        },
        "claimedAt": "2025-11-04T08:12:08.290Z",
        "createdAt": "2025-11-04T07:52:58.393Z",
        "updatedAt": "2025-11-04T08:12:08.292Z",
        "__v": 0
    },
    "error": null,
    "meta": {
        "timestamp": "2025-11-04T08:12:08.727Z"
    }
}
```

**Error Response (409) - Already Claimed:**
```json
{
    "statusCode": 409,
    "success": false,
    "message": "This lead has already been claimed",
    "data": null,
    "error": [],
    "meta": {
        "timestamp": "2025-11-04T08:13:39.090Z",
        "path": "/api/v1/enquiries/claim/6909b0dad53099839299c03b",
        "method": "POST"
    }
}
```

---

### 8. Get My Claimed Leads
**GET** `/enquiries/my-leads`

**Authentication:** Required

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Results per page
- `courseInterest` (optional) - Filter by course interest

**Example:** `/enquiries/my-leads?page=1&limit=10`

**Response (200):**
```json
{
    "statusCode": 200,
    "success": true,
    "message": "Your claimed leads fetched successfully",
    "data": {
        "leads": [
            {
                "_id": "6909b0dad53099839299c03b",
                "name": "Jane Smith",
                "email": "jane@example.com",
                "phone": "+1234567890",
                "courseInterest": "Web Development",
                "message": "I'm interested in learning more about the course",
                "isClaimed": true,
                "claimedBy": "6909a70725ab9e34f1cb2b9b",
                "claimedAt": "2025-11-04T08:12:08.290Z",
                "createdAt": "2025-11-04T07:52:58.393Z",
                "updatedAt": "2025-11-04T08:12:08.292Z",
                "__v": 0
            }
        ],
        "totalPages": 1,
        "currentPage": 1,
        "totalLeads": 1
    },
    "error": null,
    "meta": {
        "timestamp": "2025-11-04T08:17:26.912Z"
    }
}
```

---

## Health Check Endpoint

### `GET /api/v1/health`

Returns the status of the MongoDB connection and server health.

#### Example Response

```json
{
    "statusCode": 200,
    "success": true,
    "message": "MongoDB is healthy",
    "data": {
        "status": "🟢 Connected",
        "db_name": "fastor",
        "host": "ac-hti5omx-shard-00-00.ntgcpmj.mongodb.net",
        "port": 27017,
        "poolSize": 50,
        "topologyType": "ReplicaSetWithPrimary",
        "uptimeSeconds": "6.21"
    },
    "error": null,
    "meta": {
        "timestamp": "2025-11-04T07:20:51.391Z",
        "dbStateCode": 1,
        "dbStateDescription": "🟢 Connected"
    }
}
```

---

## Error Responses

All endpoints may return the following error responses:

**400 Bad Request:**
```json
{
  "statusCode": 400,
  "message": "Validation error message",
  "success": false
}
```

**401 Unauthorized:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized request - No token provided",
  "success": false
}
```

**404 Not Found:**
```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "success": false
}
```

**500 Internal Server Error:**
```json
{
  "statusCode": 500,
  "message": "Something went wrong",
  "success": false
}
```

---

## Testing the API

### Using cURL

**Register an employee:**
```bash
curl -X POST http://localhost:3000/api/v1/employees/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/v1/employees/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Submit enquiry (public):**
```bash
curl -X POST http://localhost:3000/api/v1/enquiries/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+1234567890",
    "courseInterest": "Web Development",
    "message": "Interested in the course"
  }'
```

**Get unclaimed leads (with auth):**
```bash
curl -X GET http://localhost:3000/api/v1/enquiries/unclaimed \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Claim a lead:**
```bash
curl -X POST http://localhost:3000/api/v1/enquiries/claim/LEAD_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Get my claimed leads:**
```bash
curl -X GET http://localhost:3000/api/v1/enquiries/my-leads \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Database Models

### Employee
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  refreshToken: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Enquiry
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required),
  phone: String (required),
  courseInterest: String (required),
  message: String,
  isClaimed: Boolean (default: false),
  claimedBy: ObjectId (ref: Employee),
  claimedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```
