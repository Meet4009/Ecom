# API Documentation

## Endpoint: `/users/register`

### Description
This endpoint is used to register a new user in the system. It accepts user details such as name, email, phone, password, and an optional profile image. The first user to register is assigned the role of "admin" by default, while subsequent users are assigned the role of "user" unless specified.

### HTTP Method
`POST`

### URL
`/users/register`

### Request Headers
- `Content-Type: multipart/form-data`

### Request Body
The data should be sent as `multipart/form-data` with the following fields:

| Field         | Type     | Required | Description                              |
|---------------|----------|----------|------------------------------------------|
| `name`        | `string` | Yes      | Full name of the user (min 3, max 255). |
| `email`       | `string` | Yes      | Valid email address.                    |
| `phone`       | `string` | Yes      | 10-digit phone number.                  |
| `password`    | `string` | Yes      | Password (min 4, max 255).              |
| `profileImage`| `file`   | No       | Profile image file (JPEG/PNG/JPG).      |
| `role`        | `string` | No       | User role (`user` or `admin`).          |

### Response

#### Success Response
- **Status Code:** `200 OK`
- **Response Body:**
  ```json
  {
      "success": true,
      "message": "User registered successfully",
      "data": {
          "id": "user_id",
          "name": "User Name",
          "email": "user@example.com",
          "phone": "1234567890",
          "role": "user",
          "profileImage": "profile_image_filename"
      }
  }
  ```

#### Error Responses
- **Status Code:** `400 Bad Request`
  - **Reason:** Validation error or missing required fields.
  - **Example Response:**
    ```json
    {
        "success": false,
        "message": "Validation error message"
    }
    ```

- **Status Code:** `500 Internal Server Error`
  - **Reason:** Server error during registration.
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
curl -X POST http://localhost:5000/users/register \
-H "Content-Type: multipart/form-data" \
-F "name=John Doe" \
-F "email=johndoe@example.com" \
-F "phone=1234567890" \
-F "password=securepassword" \
-F "profileImage=@path/to/image.jpg"
```

#### JavaScript (Axios)
```javascript
const formData = new FormData();
formData.append("name", "John Doe");
formData.append("email", "johndoe@example.com");
formData.append("phone", "1234567890");
formData.append("password", "securepassword");
formData.append("profileImage", fileInput.files[0]);

axios.post("http://localhost:5000/users/register", formData, {
    headers: { "Content-Type": "multipart/form-data" }
})
.then(response => console.log(response.data))
.catch(error => console.error(error.response.data));
```

## Endpoint: `/users/login`

### Description
This endpoint is used to authenticate a user and provide a token for accessing protected resources. It accepts the user's email and password.

### HTTP Method
`POST`

### URL
`/users/login`

### Request Headers
- `Content-Type: application/json`

### Request Body
The data should be sent as JSON with the following fields:

| Field      | Type     | Required | Description                  |
|------------|----------|----------|------------------------------|
| `email`    | `string` | Yes      | Registered email address.    |
| `password` | `string` | Yes      | User's password.             |

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
curl -X POST http://localhost:5000/users/login \
-H "Content-Type: application/json" \
-d '{"email": "johndoe@example.com", "password": "securepassword"}'
```

#### JavaScript (Axios)
```javascript
axios.post("http://localhost:5000/users/login", {
    email: "johndoe@example.com",
    password: "securepassword"
})
.then(response => console.log(response.data))
.catch(error => console.error(error.response.data));
```
