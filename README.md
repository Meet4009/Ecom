# API Documentation

## Endpoint: `/user/register`

### Description
This endpoint is used to register a new user in the system. It accepts user details such as name, email, phone, password, and an optional profile image. The first user to register is assigned the role of "admin" by default, while subsequent users are assigned the role of "user" unless specified.

### HTTP Method
`POST`

### URL
`/user/register`

### Request Headers
- `Content-Type: application/json`

### Request Body
The data should be sent as JSON with the following fields:

| Field         | Type     | Required | Description                              |
|---------------|----------|----------|------------------------------------------|
| `name`        | `string` | Yes      | Full name (min 3, max 50 characters).    |
| `email`       | `string` | Yes      | Valid unique email address.              |
| `phone`       | `string` | Yes      | Unique 10-digit phone number.            |
| `password`    | `string` | Yes      | Password (min 4 characters).             |
| `role`        | `string` | No       | User role (`user` or `admin`).           |

### Response

#### Success Response
- **Status Code:** `201 Created`
- **Response Body:**
  ```json
  {
      "success": true,
      "message": "Registration successful",
      "data": {
          "name": "User Name",
          "email": "user@example.com",
          "phone": "1234567890",
          "role": "user",
          "loggedIn": false,
          "createdAt": "2024-01-20T12:00:00.000Z",
          "_id": "user_id"
      }
  }
  ```

#### Error Responses
- **Status Code:** `400 Bad Request`
  - **Reason:** Validation error, existing email/phone, or missing required fields
  - **Example Response:**
    ```json
    {
        "success": false,
        "message": "Email already registered"
    }
    ```

- **Status Code:** `500 Internal Server Error`
  - **Reason:** Server error during registration
  - **Example Response:**
    ```json
    {
        "success": false,
        "message": "Server Error: error_message"
    }
    ```

### Example Usage
#### cURL Command
```bash
curl -X POST http://localhost:5000/user/register \
-H "Content-Type: application/json" \
-d '{
    "name": "John Doe",
    "email": "johndoe@example.com",
    "phone": "1234567890",
    "password": "securepassword"
}'
```

#### JavaScript (Axios)
```javascript
axios.post("http://localhost:5000/user/register", {
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "1234567890",
    password: "securepassword"
})
.then(response => console.log(response.data))
.catch(error => console.error(error.response.data));
```

## Endpoint: `/user/login`

### Description
This endpoint is used to authenticate a user and provide a token for accessing protected resources. It accepts the user's email and password.

### HTTP Method
`POST`

### URL
`/user/login`

### Request Headers
- `Content-Type: application/json`

### Request Body
The data should be sent as JSON with the following fields:

| Field      | Type     | Required | Description                                    |
|------------|----------|----------|------------------------------------------------|
| `login`    | `string` | Yes      | User's email address or phone number.         |
| `password` | `string` | Yes      | User's password.                              |

### Response

#### Success Response
- **Status Code:** `200 OK`
- **Response Body:**
  ```json
  {
      "success": true,
      "message": "Login successful",
      "data": {
          "token": "jwt_token",
          "user": {
              "id": "user_id",
              "name": "User Name",
              "email": "user@example.com",
              "role": "user"
          }
      }
  }
  ```

#### Error Responses
- **Status Code:** `401 Unauthorized`
  - **Reason:** Invalid email or password.
  - **Example Response:**
    ```json
    {
        "success": false,
        "message": "Invalid email or password"
    }
    ```

- **Status Code:** `500 Internal Server Error`
  - **Reason:** Server error during login.
  - **Example Response:**
    ```json
    {
        "success": false,
        "message": "Server Error: error_message"
    }
    ```

### Example Usage
#### cURL Command
```bash
curl -X POST http://localhost:5000/user/login \
-H "Content-Type: application/json" \
-d '{"login": "johndoe@example.com", "password": "securepassword"}'
```

#### JavaScript (Axios)
```javascript
axios.post("http://localhost:5000/user/login", {
    login: "johndoe@example.com",
    password: "securepassword"
})
.then(response => console.log(response.data))
.catch(error => console.error(error.response.data));
```
