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

## Endpoint: `/user/logout`

### Description
This endpoint is used to log out the currently authenticated user. It clears the JWT token cookie and updates the user's login status.

### HTTP Method
`GET`

### URL
`/user/logout`

### Request Headers
- `Authorization: Bearer <token>`

### Request Body
None required

### Response

#### Success Response
- **Status Code:** `200 OK`
- **Response Body:**
  ```json
  {
      "success": true,
      "message": "Logged out successfully"
  }
  ```

#### Error Responses
- **Status Code:** `401 Unauthorized`
  - **Reason:** No token provided or invalid token
  - **Example Response:**
    ```json
    {
        "success": false,
        "message": "Not authorized, authentication failed"
    }
    ```

- **Status Code:** `500 Internal Server Error`
  - **Reason:** Server error during logout
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
curl -X GET http://localhost:5000/user/logout \
-H "Authorization: Bearer your_jwt_token"
```

#### JavaScript (Axios)
```javascript
axios.get("http://localhost:5000/user/logout", {
    headers: {
        "Authorization": "Bearer your_jwt_token"
    }
})
.then(response => console.log(response.data))
.catch(error => console.error(error.response.data));
```

## Endpoint: `/user/profile`

### Description
This endpoint is used to retrieve the authenticated user's profile information.

### HTTP Method
`GET`

### URL
`/user/profile`

### Request Headers
- `Authorization: Bearer <token>`

### Request Body
None required

### Response

#### Success Response
- **Status Code:** `200 OK`
- **Response Body:**
  ```json
  {
      "success": true,
      "data": {
          "_id": "user_id",
          "name": "User Name",
          "email": "user@example.com",
          "phone": "1234567890",
          "role": "user",
          "profileImage": "image_url",
          "createdAt": "2024-01-20T12:00:00.000Z"
      }
  }
  ```

#### Error Responses
- **Status Code:** `401 Unauthorized`
  - **Reason:** No token provided or invalid token
  - **Example Response:**
    ```json
    {
        "success": false,
        "message": "Not authorized, authentication failed"
    }
    ```

- **Status Code:** `404 Not Found`
  - **Reason:** User not found
  - **Example Response:**
    ```json
    {
        "success": false,
        "message": "User not found"
    }
    ```

### Example Usage
#### cURL Command
```bash
curl -X GET http://localhost:5000/user/profile \
-H "Authorization: Bearer your_jwt_token"
```

#### JavaScript (Axios)
```javascript
axios.get("http://localhost:5000/user/profile", {
    headers: {
        "Authorization": "Bearer your_jwt_token"
    }
})
.then(response => console.log(response.data))
.catch(error => console.error(error.response.data));
```

## Endpoint: `/user/profile` (Update)

### Description
This endpoint is used to update the authenticated user's profile information.

### HTTP Method
`PUT`

### URL
`/user/profile`

### Request Headers
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

### Request Body
The data should be sent as JSON with the following fields:

| Field         | Type     | Required | Description                              |
|---------------|----------|----------|------------------------------------------|
| `name`        | `string` | No       | Full name (min 3, max 50 characters).    |
| `email`       | `string` | No       | Valid unique email address.              |
| `phone`       | `string` | No       | Unique 10-digit phone number.            |

### Response

#### Success Response
- **Status Code:** `200 OK`
- **Response Body:**
  ```json
  {
      "success": true,
      "message": "Profile updated successfully",
      "data": {
          "_id": "user_id",
          "name": "Updated Name",
          "email": "updated@example.com",
          "phone": "9876543210",
          "role": "user",
          "profileImage": "image_url",
          "createdAt": "2024-01-20T12:00:00.000Z"
      }
  }
  ```

#### Error Responses
- **Status Code:** `400 Bad Request`
  - **Reason:** Validation error or existing email/phone
  - **Example Response:**
    ```json
    {
        "success": false,
        "message": "Email already in use"
    }
    ```

- **Status Code:** `401 Unauthorized`
  - **Reason:** No token provided or invalid token
  - **Example Response:**
    ```json
    {
        "success": false,
        "message": "Not authorized, authentication failed"
    }
    ```

### Example Usage
#### cURL Command
```bash
curl -X PUT http://localhost:5000/user/profile \
-H "Authorization: Bearer your_jwt_token" \
-H "Content-Type: application/json" \
-d '{
    "name": "Updated Name",
    "email": "updated@example.com",
    "phone": "9876543210"
}'
```

#### JavaScript (Axios)
```javascript
axios.put("http://localhost:5000/user/profile", 
{
    name: "Updated Name",
    email: "updated@example.com",
    phone: "9876543210"
}, {
    headers: {
        "Authorization": "Bearer your_jwt_token"
    }
})
.then(response => console.log(response.data))
.catch(error => console.error(error.response.data));
```

## Endpoint: `/user/profile/image`

### Description
This endpoint is used to update the authenticated user's profile image. It accepts a single image file upload.

### HTTP Method
`PATCH`

### URL
`/user/profile/image`

### Request Headers
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

### Request Body
The data should be sent as form-data with the following field:

| Field          | Type   | Required | Description                                           |
|----------------|--------|----------|-------------------------------------------------------|
| `profileImage` | `file` | Yes      | Image file (JPG, PNG, JPEG, WebP). Max size: 5MB     |

### Response

#### Success Response
- **Status Code:** `200 OK`
- **Response Body:**
  ```json
  {
      "success": true,
      "message": "Profile image updated successfully",
      "data": {
          "profileImage": "uploads/users/profileImage-1234567890.jpg"
      }
  }
  ```

#### Error Responses
- **Status Code:** `400 Bad Request`
  - **Reason:** No image uploaded or invalid file type
  - **Example Response:**
    ```json
    {
        "success": false,
        "message": "Please upload an image"
    }
    ```

- **Status Code:** `401 Unauthorized`
  - **Reason:** No token provided or invalid token
  - **Example Response:**
    ```json
    {
        "success": false,
        "message": "Not authorized, authentication failed"
    }
    ```

### Example Usage
#### cURL Command
```bash
curl -X PATCH http://localhost:5000/user/profile/image \
-H "Authorization: Bearer your_jwt_token" \
-F "profileImage=@/path/to/image.jpg"
```

#### JavaScript (Axios)
```javascript
const formData = new FormData();
formData.append('profileImage', imageFile);

axios.patch("http://localhost:5000/user/profile/image", 
    formData,
    {
        headers: {
            "Authorization": "Bearer your_jwt_token",
            "Content-Type": "multipart/form-data"
        }
    }
)
.then(response => console.log(response.data))
.catch(error => console.error(error.response.data));
```

## Password Update Endpoint

Update user's password with authentication.

**URL**: `/password-update`  
**Method**: `PUT`  
**Auth required**: Yes  
**Authorization**: Bearer Token

### Request Body
```json
{
  "oldPassword": "string",
  "newPassword": "string"
}
```

### Success Response
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

### Example Usage
```bash
curl -X PUT \
  'http://your-domain/password-update' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "oldPassword": "currentPassword123",
    "newPassword": "newPassword123"
  }'
```

## Endpoint: `/user/password-forgot`

### Description
This endpoint is used to initiate the password reset process by sending a reset link to the user's email.

### HTTP Method
`POST`

### URL
`/user/password-forgot`

### Request Headers
- `Content-Type: application/json`

### Request Body
The data should be sent as JSON with the following field:

| Field   | Type     | Required | Description           |
|---------|----------|----------|-----------------------|
| `email` | `string` | Yes      | User's email address |

### Response

#### Success Response
- **Status Code:** `200 OK`
- **Response Body:**
  ```json
  {
      "success": true,
      "message": "Password reset link sent successfully"
  }
  ```

#### Error Responses
- **Status Code:** `404 Not Found`
  - **Reason:** User not found
  - **Example Response:**
    ```json
    {
        "success": false,
        "message": "User not found"
    }
    ```

- **Status Code:** `500 Internal Server Error`
  - **Reason:** Email sending failed
  - **Example Response:**
    ```json
    {
        "success": false,
        "message": "Email could not be sent"
    }
    ```

### Example Usage
#### cURL Command
```bash
curl -X POST http://localhost:5000/user/password-forgot \
-H "Content-Type: application/json" \
-d '{
    "email": "user@example.com"
}'
```

#### JavaScript (Axios)
```javascript
axios.post("http://localhost:5000/user/password-forgot", {
    email: "user@example.com"
})
.then(response => console.log(response.data))
.catch(error => console.error(error.response.data));
```

## Endpoint: `/user/password-reset/:token`

### Description
This endpoint is used to reset a user's password using a valid reset token. The token is received via email when using the forgot password endpoint.

### HTTP Method
`PUT`

### URL
`/user/password-reset/:token`

### Request Headers
- `Content-Type: application/json`

### URL Parameters
| Parameter | Type     | Description                          |
|-----------|----------|--------------------------------------|
| `token`   | `string` | Password reset token from email link |

### Request Body
The data should be sent as JSON with the following fields:

| Field             | Type     | Required | Description                                |
|-------------------|----------|----------|--------------------------------------------|
| `newPassword`     | `string` | Yes      | New password (min 4 characters)           |
| `confirmPassword` | `string` | Yes      | Must match newPassword                    |

### Response

#### Success Response
- **Status Code:** `200 OK`
- **Response Body:**
  ```json
  {
      "success": true,
      "message": "Password reset successful"
  }
  ```

#### Error Responses
- **Status Code:** `400 Bad Request`
  - **Reason:** Invalid token, expired token, or passwords don't match
  - **Example Response:**
    ```json
    {
        "success": false,
        "message": "Invalid or expired reset token"
    }
    ```

- **Status Code:** `500 Internal Server Error`
  - **Reason:** Server error during password reset
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
curl -X PUT http://localhost:5000/user/password-reset/your_reset_token \
-H "Content-Type: application/json" \
-d '{
    "newPassword": "newSecurePassword",
    "confirmPassword": "newSecurePassword"
}'
```

#### JavaScript (Axios)
```javascript
axios.put(`http://localhost:5000/user/password-reset/${resetToken}`, {
    newPassword: "newSecurePassword",
    confirmPassword: "newSecurePassword"
})
.then(response => console.log(response.data))
.catch(error => console.error(error.response.data));
```
