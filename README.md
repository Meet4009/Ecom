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
#### JavaScript (Axios)
```javascript
axios.post("https://ecom-kl8f.onrender.com/api/v1/user/register", {
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
#### JavaScript (Axios)
```javascript
axios.post("https://ecom-kl8f.onrender.com/api/v1/user/login", {
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
#### JavaScript (Axios)
```javascript
axios.get("https://ecom-kl8f.onrender.com/api/v1/user/logout", {
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
#### JavaScript (Axios)
```javascript
axios.get("https://ecom-kl8f.onrender.com/api/v1/user/profile", {
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
#### JavaScript (Axios)
```javascript
axios.put("https://ecom-kl8f.onrender.com/api/v1/user/profile", 
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

## Endpoint: `/user/profile-image`

### Description
This endpoint allows authenticated users to update their profile image. The endpoint performs validation on the image file including size and file type checks, handles the deletion of old profile images, and updates the user's profile with the new image path.

### HTTP Method
`PATCH`

### URL
`/user/profile/image`

### Request Headers
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

### Request Body
The data should be sent as form-data with the following field:

| Field          | Type   | Required | Description                                     |
|----------------|--------|----------|-------------------------------------------------|
| `profileImage` | `file` | Yes      | Image file (JPG, JPEG, PNG). Max size: 5MB     |

### Validations
- File size must not exceed 5MB
- Only JPG, JPEG, and PNG file types are allowed
- Authentication token must be valid
- User must exist in the system

### Response

#### Success Response
- **Status Code:** `200 OK`
- **Response Body:**
  ```json
  {
      "success": true,
      "message": "Profile image updated successfully",
      "data": {
          "profileImage": "uploads/users/profileImage-timestamp.extension"
      }
  }
  ```

#### Error Responses
- **Status Code:** `400 Bad Request`
  - **Cases:**
    - No image uploaded
    - Invalid file type
    - File size exceeds limit
  - **Example Response:**
    ```json
    {
        "success": false,
        "message": "Please upload an image"
    }
    ```
    ```json
    {
        "success": false,
        "message": "Please upload only JPG, JPEG or PNG images"
    }
    ```
    ```json
    {
        "success": false,
        "message": "Image size should be less than 5MB"
    }
    ```

- **Status Code:** `401 Unauthorized`
  - **Reason:** Invalid or missing authentication token
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

- **Status Code:** `500 Internal Server Error`
  - **Reason:** Server error during file upload or processing
  - **Example Response:**
    ```json
    {
        "success": false,
        "message": "Server Error: error_message"
    }
    ```

### Example Usage
#### JavaScript (Axios)
```javascript
const formData = new FormData();
formData.append('profileImage', imageFile);

axios.patch("https://ecom-kl8f.onrender.com/api/v1/user/profile-image", 
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

## Endpoint: `/user/password-update`

### Description
This endpoint allows authenticated users to update their password. It requires the current password for verification before setting the new password.

### HTTP Method
`PUT`

### URL
`/user/password-update`

### Request Headers
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

### Request Body
The data should be sent as JSON with the following fields:

| Field         | Type     | Required | Description                              |
|---------------|----------|----------|------------------------------------------|
| `oldPassword` | `string` | Yes      | Current password for verification        |
| `newPassword` | `string` | Yes      | New password (min 4 characters)          |

### Response

#### Success Response
- **Status Code:** `200 OK`
- **Response Body:**
  ```json
  {
      "success": true,
      "message": "Password updated successfully"
  }
  ```

#### Error Responses
- **Status Code:** `400 Bad Request`
  - **Reason:** Current password is incorrect
  - **Example Response:**
    ```json
    {
        "success": false,
        "message": "Current password is incorrect"
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

- **Status Code:** `500 Internal Server Error`
  - **Reason:** Server error during password update
  - **Example Response:**
    ```json
    {
        "success": false,
        "message": "Server Error: error_message"
    }
    ```

### Example Usage
#### JavaScript (Axios)
```javascript
axios.put("https://ecom-kl8f.onrender.com/api/v1/user/password-update",
{
    oldPassword: "currentPassword123",
    newPassword: "newPassword123"
},
{
    headers: {
        "Authorization": "Bearer your_jwt_token"
    }
})
.then(response => console.log(response.data))
.catch(error => console.error(error.response.data));
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
#### JavaScript (Axios)
```javascript
axios.post("https://ecom-kl8f.onrender.com/api/v1/user/password-forgot", {
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
#### JavaScript (Axios)
```javascript
axios.put(`https://ecom-kl8f.onrender.com/api/v1/user/password-reset/${resetToken}`, {
    newPassword: "newSecurePassword",
    confirmPassword: "newSecurePassword"
})
.then(response => console.log(response.data))
.catch(error => console.error(error.response.data));
```

## Endpoint: `/admin/users`

### Description
This endpoint allows administrators to retrieve a list of all users in the system. Only accessible by users with admin role.

### HTTP Method
`GET`

### URL
`/admin/users`

### Request Headers
- `Authorization: Bearer <token>`

### Response

#### Success Response
- **Status Code:** `200 OK`
- **Response Body:**
  ```json
  {
      "success": true,
      "message": "Get All User Successfully",
      "count": 10,
      "data": [
          {
              "_id": "user_id",
              "name": "User Name",
              "email": "user@example.com",
              "phone": "1234567890",
              "role": "user",
              "profileImage": "image_url",
              "createdAt": "2024-01-20T12:00:00.000Z"
          }
          // ... more users
      ]
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

- **Status Code:** `403 Forbidden`
  - **Reason:** User is not an admin
  - **Example Response:**
    ```json
    {
        "success": false,
        "message": "Role (user) is not authorized to access this route"
    }
    ```

- **Status Code:** `404 Not Found`
  - **Reason:** No users found
  - **Example Response:**
    ```json
    {
        "success": false,
        "message": "No users found"
    }
    ```

### Example Usage
#### JavaScript (Axios)
```javascript
axios.get("https://ecom-kl8f.onrender.com/api/v1/admin/users", {
    headers: {
        "Authorization": "Bearer your_jwt_token"
    }
})
.then(response => console.log(response.data))
.catch(error => console.error(error.response.data));
```

## Endpoint: `/admin/users/:id`

### Description
This endpoint allows administrators to retrieve details of a specific user. Only accessible by users with admin role.

### HTTP Method
`GET`

### URL
`/admin/users/:id`

### Request Headers
- `Authorization: Bearer <token>`

### URL Parameters
| Parameter | Type     | Description                     |
|-----------|----------|---------------------------------|
| `id`      | `string` | ID of the user to retrieve      |

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

- **Status Code:** `403 Forbidden`
  - **Reason:** User is not an admin
  - **Example Response:**
    ```json
    {
        "success": false,
        "message": "Role (user) is not authorized to access this route"
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
#### JavaScript (Axios)
```javascript
axios.get(`https://ecom-kl8f.onrender.com/api/v1/admin/users/${userId}`, {
    headers: {
        "Authorization": "Bearer your_jwt_token"
    }
})
.then(response => console.log(response.data))
.catch(error => console.error(error.response.data));
```

## Endpoint: `/admin/delete/:id`

### Description
This endpoint allows administrators to delete a user account and their associated profile image. Only accessible by admin users.

### HTTP Method
`DELETE`

### URL
`/admin/delete/:id`

### Request Headers
- `Authorization: Bearer <token>`

### URL Parameters
| Parameter | Type     | Description                     |
|-----------|----------|---------------------------------|
| `id`      | `string` | ID of the user to be deleted    |

### Response

#### Success Response
- **Status Code:** `200 OK`
- **Response Body:**
  ```json
  {
      "success": true,
      "message": "User and profile image deleted successfully"
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

- **Status Code:** `403 Forbidden`
  - **Reason:** User is not an admin
  - **Example Response:**
    ```json
    {
        "success": false,
        "message": "Access denied. Admin only."
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

- **Status Code:** `500 Internal Server Error`
  - **Reason:** Server error during user deletion
  - **Example Response:**
    ```json
    {
        "success": false,
        "message": "Server Error: error_message"
    }
    ```

### Example Usage
#### JavaScript (Axios)
```javascript
axios.delete(`https://ecom-kl8f.onrender.com/api/v1/admin/delete/${userId}`, {
    headers: {
        "Authorization": "Bearer your_jwt_token"
    }
})
.then(response => console.log(response.data))
.catch(error => console.error(error.response.data));
```

## Endpoint: `/product/create`

### Description
This endpoint allows administrators to create a new product with details including name, price, category, brand, stock, descriptions, FAQs, and multiple product images. Only accessible by users with admin role.

### HTTP Method
`POST`

### URL
`/product/create`

### Request Headers
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

### Request Body
The data should be sent as multipart/form-data with the following fields:

| Field           | Type        | Required | Description                                    |
|----------------|-------------|----------|------------------------------------------------|
| `name`         | `string`    | Yes      | Product name                                  |
| `price`        | `number`    | Yes      | Product price                                 |
| `category`     | `string`    | Yes      | Product category                              |
| `brand`        | `string`    | Yes      | Product brand                                 |
| `stock`        | `number`    | Yes      | Available stock quantity                      |
| `description`  | `JSON`      | Yes      | Array of description objects (see format below)|
| `faqs`         | `JSON`      | Yes      | Array of FAQ objects (see format below)       |
| `productImages`| `file`      | Yes      | Up to 10 product images (JPG, JPEG, PNG)      |

### Description Object Format
```json
[
  {
    "title": "string",
    "points": ["string", "string"]
  }
]
```

### FAQ Object Format
```json
[
  {
    "question": "string",
    "answer": [
      {
        "title": "string",
        "points": ["string", "string"]
      }
    ]
  }
]
```

### Response

#### Success Response
- **Status Code:** `201 Created`
- **Response Body:**
  ```json
  {
      "success": true,
      "product": {
          "_id": "product_id",
          "name": "Product Name",
          "price": 999,
          "category": "Category",
          "brand": "Brand",
          "stock": 100,
          "description": [],
          "faqs": [],
          "productImages": [
              {
                  "url": "/uploads/products/image-filename.jpg",
                  "public_id": "image-filename"
              }
          ],
          "ratings": 0,
          "numReviews": 0,
          "status": "Active",
          "createdUser": "user_id",
          "createdAt": "2024-01-20T12:00:00.000Z"
      }
  }
  ```

#### Error Responses
- **Status Code:** `400 Bad Request`
  - **Reason:** Missing required fields or invalid data
  - **Example Response:**
    ```json
    {
        "success": false,
        "message": "Product images are required"
    }
    ```
    ```json
    {
        "success": false,
        "message": "Invalid JSON format in description or FAQs"
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

- **Status Code:** `403 Forbidden`
  - **Reason:** User is not an admin
  - **Example Response:**
    ```json
    {
        "success": false,
        "message": "Role (user) is not authorized to access this route"
    }
    ```

### Example Usage
#### JavaScript (Axios)
```javascript
const formData = new FormData();
formData.append('name', 'Product Name');
formData.append('price', '999');
formData.append('category', 'Category');
formData.append('brand', 'Brand');
formData.append('stock', '100');
formData.append('description', JSON.stringify([
    {
        title: "Description Title",
        points: ["Point 1", "Point 2"]
    }
]));
formData.append('faqs', JSON.stringify([
    {
        question: "FAQ Question?",
        answer: [{
            title: "Answer Title",
            points: ["Point 1", "Point 2"]
        }]
    }
]));

// Append product images
productImages.forEach(image => {
    formData.append('productImages', image);
});

axios.post('https://ecom-kl8f.onrender.com/api/v1/product/create', 
    formData,
    {
        headers: {
            'Authorization': 'Bearer your_jwt_token',
            'Content-Type': 'multipart/form-data'
        }
    }
)
.then(response => console.log(response.data))
.catch(error => console.error(error.response.data));
```

## Endpoint: /product`

### Description
This endpoint allows retrieving all products in the system. No authentication is required to access this endpoint.

### HTTP Method
`GET`

### URL
`/product`

### Request Headers
None required

### Response

#### Success Response
- **Status Code:** `200 OK`
- **Response Body:**
  ```json
  {
      "success": true,
      "products": [
          {
              "_id": "product_id",
              "name": "Product Name",
              "price": 999,
              "category": "Category",
              "brand": "Brand",
              "stock": 100,
              "description": [
                  {
                      "title": "Description Title",
                      "points": ["Point 1", "Point 2"]
                  }
              ],
              "faqs": [
                  {
                      "question": "FAQ Question?",
                      "answer": [
                          {
                              "title": "Answer Title",
                              "points": ["Point 1", "Point 2"]
                          }
                      ]
                  }
              ],
              "productImages": [
                  {
                      "url": "/uploads/products/image-filename.jpg",
                      "public_id": "image-filename"
                  }
              ],
              "ratings": 0,
              "numReviews": 0,
              "status": "Active",
              "createdUser": {
                  "name": "Admin Name",
                  "email": "admin@example.com"
              },
              "createdAt": "2024-01-20T12:00:00.000Z"
          }
      ]
  }
  ```

#### Error Response
- **Status Code:** `500 Internal Server Error`
  - **Reason:** Server error while fetching products
  - **Example Response:**
    ```json
    {
        "success": false,
        "message": "Server Error",
        "error": "error_message"
    }
    ```

### Example Usage
#### JavaScript (Axios)
```javascript
axios.get('https://ecom-kl8f.onrender.com/api/v1/product')
    .then(response => console.log(response.data))
    .catch(error => console.error(error.response.data));
```

## Endpoint: `/product/:id`

### Description
This endpoint allows retrieving details of a specific product by its ID. No authentication is required to access this endpoint.

### HTTP Method
`GET`

### URL
`/product/:id`

### Request Headers
None required

### URL Parameters
| Parameter | Type     | Description                     |
|-----------|----------|---------------------------------|
| `id`      | `string` | ID of the product to retrieve   |

### Response

#### Success Response
- **Status Code:** `200 OK`
- **Response Body:**
  ```json
  {
      "success": true,
      "product": {
          "_id": "product_id",
          "name": "Product Name",
          "price": 999,
          "category": "Category",
          "brand": "Brand",
          "stock": 100,
          "description": [
              {
                  "title": "Description Title",
                  "points": ["Point 1", "Point 2"]
              }
          ],
          "faqs": [
              {
                  "question": "FAQ Question?",
                  "answer": [
                      {
                          "title": "Answer Title",
                          "points": ["Point 1", "Point 2"]
                      }
                  ]
              }
          ],
          "productImages": [
              {
                  "url": "/uploads/products/image-filename.jpg",
                  "public_id": "image-filename"
              }
          ],
          "ratings": 0,
          "numReviews": 0,
          "status": "Active",
          "createdUser": {
              "name": "Admin Name",
              "email": "admin@example.com"
          },
          "createdAt": "2024-01-20T12:00:00.000Z"
      }
  }
  ```

#### Error Responses
- **Status Code:** `404 Not Found`
  - **Reason:** Product not found
  - **Example Response:**
    ```json
    {
        "success": false,
        "message": "Product not found"
    }
    ```

- **Status Code:** `500 Internal Server Error`
  - **Reason:** Server error while fetching product
  - **Example Response:**
    ```json
    {
        "success": false,
        "message": "Server Error",
        "error": "error_message"
    }
    ```

### Example Usage
#### JavaScript (Axios)
```javascript
axios.get(`https://ecom-kl8f.onrender.com/api/v1/product/${productId}`)
    .then(response => console.log(response.data))
    .catch(error => console.error(error.response.data));
```

## Endpoint: `/product/:id` (Update)

### Description
This endpoint allows administrators to update an existing product's details. Only accessible by users with admin role.

### HTTP Method
`PUT`

### URL
`/product/:id`

### Request Headers
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

### URL Parameters
| Parameter | Type     | Description                     |
|-----------|----------|---------------------------------|
| `id`      | `string` | ID of the product to update     |

### Request Body
The data should be sent as JSON. All fields are optional, but at least one must be provided:

| Field           | Type        | Required | Description                                    |
|----------------|-------------|----------|------------------------------------------------|
| `name`         | `string`    | No       | Product name                                   |
| `price`        | `number`    | No       | Product price                                  |
| `category`     | `string`    | No       | Product category                               |
| `brand`        | `string`    | No       | Product brand                                  |
| `stock`        | `number`    | No       | Available stock quantity                       |
| `description`  | `array`     | No       | Array of description objects (see format below)|
| `faqs`         | `array`     | No       | Array of FAQ objects (see format below)        |

### Description Object Format
```json
[
  {
    "title": "string",
    "points": ["string", "string"]
  }
]
```

### FAQ Object Format
```json
[
  {
    "question": "string",
    "answer": [
      {
        "title": "string",
        "points": ["string", "string"]
      }
    ]
  }
]
```

### Response

#### Success Response
- **Status Code:** `200 OK`
- **Response Body:**
  ```json
  {
      "success": true,
      "product": {
          "_id": "product_id",
          "name": "Updated Product Name",
          "price": 999,
          "category": "Updated Category",
          "brand": "Updated Brand",
          "stock": 100,
          "description": [],
          "faqs": [],
          "productImages": [
              {
                  "url": "/uploads/products/image-filename.jpg",
                  "public_id": "image-filename"
              }
          ],
          "ratings": 0,
          "numReviews": 0,
          "status": "Active",
          "createdUser": "user_id",
          "createdAt": "2024-01-20T12:00:00.000Z",
          "updatedAt": "2024-01-20T13:00:00.000Z"
      }
  }
  ```

#### Error Responses
- **Status Code:** `400 Bad Request`
  - **Reason:** Validation error or no fields to update
  - **Example Response:**
    ```json
    {
        "success": false,
        "message": "No valid fields to update"
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

- **Status Code:** `403 Forbidden`
  - **Reason:** User is not an admin
  - **Example Response:**
    ```json
    {
        "success": false,
        "message": "Role (user) is not authorized to access this route"
    }
    ```

- **Status Code:** `404 Not Found`
  - **Reason:** Product not found
  - **Example Response:**
    ```json
    {
        "success": false,
        "message": "Product not found"
    }
    ```

### Example Usage
#### JavaScript (Axios)
```javascript
axios.put(`https://ecom-kl8f.onrender.com/api/v1/product/${productId}`,
    {
        name: "Updated Product Name",
        price: 999,
        stock: 100
    },
    {
        headers: {
            "Authorization": "Bearer your_jwt_token",
            "Content-Type": "application/json"
        }
    }
)
.then(response => console.log(response.data))
.catch(error => console.error(error.response.data));
```

## Endpoint: `/product/:id/images`

### Description
This endpoint allows administrators to update product images. It supports multiple image uploads, replaces all existing images of the product, and validates file types and sizes.

### HTTP Method
`PUT`

### URL
`/product/:id/images`

### Request Headers
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

### URL Parameters
| Parameter | Type     | Description                     |
|-----------|----------|---------------------------------|
| `id`      | `string` | ID of the product to update     |

### Request Body
The data should be sent as form-data with the following field:

| Field           | Type     | Required | Description                                     |
|----------------|----------|----------|-------------------------------------------------|
| `productImages` | `file[]` | Yes      | Up to 10 image files (JPG, JPEG, PNG). Max size: 5MB each |

### Validations
- At least one image must be uploaded
- Each file size must not exceed 5MB
- Only JPG, JPEG, and PNG file types are allowed
- Maximum 10 images allowed
- Authentication token must be valid
- User must have admin role

### Response

#### Success Response
- **Status Code:** `200 OK`
- **Response Body:**
  ```json
  {
      "success": true,
      "message": "Product images updated successfully",
      "data": {
          "_id": "product_id",
          "productImages": [
              {
                  "url": "/uploads/products/image-filename.jpg",
                  "public_id": "image-filename"
              }
          ],
          // ... other product fields
      }
  }
  ```

#### Error Responses
- **Status Code:** `400 Bad Request`
  - **Cases:**
    - No images uploaded
    - Invalid file type
    - File size exceeds limit
  - **Example Response:**
    ```json
    {
        "success": false,
        "message": "Please upload at least one image"
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

- **Status Code:** `403 Forbidden`
  - **Reason:** User is not an admin
  - **Example Response:**
    ```json
    {
        "success": false,
        "message": "Role (user) is not authorized to access this route"
    }
    ```

- **Status Code:** `404 Not Found`
  - **Reason:** Product not found
  - **Example Response:**
    ```json
    {
        "success": false,
        "message": "Product not found"
    }
    ```

### Example Usage
#### JavaScript (Axios)
```javascript
const formData = new FormData();
productImages.forEach(image => {
    formData.append('productImages', image);
});

axios.put(`https://ecom-kl8f.onrender.com/api/v1/product/${productId}/images`, 
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

## Endpoint: `/product/:id` (Delete)

### Description
This endpoint allows administrators to delete a specific product. Only accessible by users with admin role.

### HTTP Method
`DELETE`

### URL
`/product/:id`

### Request Headers
- `Authorization: Bearer <token>`

### URL Parameters
| Parameter | Type     | Description                     |
|-----------|----------|---------------------------------|
| `id`      | `string` | ID of the product to delete     |

### Response

#### Success Response
- **Status Code:** `200 OK`
- **Response Body:**
  ```json
  {
      "success": true,
      "message": "Product deleted successfully"
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

- **Status Code:** `403 Forbidden`
  - **Reason:** User is not an admin
  - **Example Response:**
    ```json
    {
        "success": false,
        "message": "Role (user) is not authorized to access this route"
    }
    ```

- **Status Code:** `404 Not Found`
  - **Reason:** Product not found
  - **Example Response:**
    ```json
    {
        "success": false,
        "message": "Product not found"
    }
    ```

- **Status Code:** `500 Internal Server Error`
  - **Reason:** Server error during deletion
  - **Example Response:**
    ```json
    {
        "success": false,
        "message": "Server Error",
        "error": "error_message"
    }
    ```

### Example Usage
#### JavaScript (Axios)
```javascript
axios.delete(`https://ecom-kl8f.onrender.com/api/v1/product/${productId}`, {
    headers: {
        "Authorization": "Bearer your_jwt_token"
    }
})
.then(response => console.log(response.data))
.catch(error => console.error(error.response.data));
```
