# ChatApp Backend

This project sets up a Node.js server for a chat application with user authentication, profile management, and real-time communication using Socket.IO. It also integrates Cloudinary for image uploads.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
  - [User Endpoints](#user-endpoints)
- [License](#license)

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd ChatAppBackend
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Create a `.env` file in the root directory and set the necessary environment variables (see [Environment Variables](#environment-variables) for details).

2. Start the server:
   ```
   npm start
   ```

3. The server will be running on the specified port (default is 3000).

## Environment Variables

- `PORT`: The port on which the server will listen (default is 3000).
- `MONGO_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret key for JWT token generation.
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name.
- `CLOUDINARY_API_KEY`: Cloudinary API key.
- `CLOUDINARY_API_SECRET`: Cloudinary API secret.

## API Documentation

### User Endpoints

#### 1. **Sign Up**
   - **URL**: `/api/users/signUp`
   - **Method**: `POST`
   - **Description**: Registers a new user.
   - **Request Body**:
     ```json
     {
       "fullName": "John Doe",
       "email": "johndoe@example.com",
       "password": "password123",
       "confirmPassword": "password123"
     }
     ```
   - **Response**:
     - **201**: User created successfully.
     - **400**: Validation errors (e.g., missing fields, passwords do not match).
     - **500**: Internal server error.

#### 2. **Login**
   - **URL**: `/api/users/login`
   - **Method**: `POST`
   - **Description**: Logs in a user and returns a JWT token.
   - **Request Body**:
     ```json
     {
       "email": "johndoe@example.com",
       "password": "password123"
     }
     ```
   - **Response**:
     - **200**: Login successful, returns user details and token.
     - **400**: Missing email or password.
     - **401**: Invalid credentials.
     - **500**: Internal server error.

#### 3. **Get User by ID**
   - **URL**: `/api/users/profile/:id`
   - **Method**: `GET`
   - **Description**: Retrieves user details by ID.
   - **Response**:
     - **200**: User found, returns user details.
     - **404**: User not found.
     - **500**: Internal server error.

#### 4. **Update Profile Photo**
   - **URL**: `/api/users/profile-photo`
   - **Method**: `PATCH`
   - **Description**: Updates the user's profile photo by uploading it to Cloudinary.
   - **Headers**:
     - `Content-Type`: `multipart/form-data`
   - **Request Body**:
     - `profileImage`: The image file to upload.
     - `id`: The user ID (sent as part of the request body).
   - **Response**:
     - **200**: Profile photo updated successfully.
     - **404**: User not found.
     - **500**: Failed to update profile photo.

## License

This project is licensed under the MIT License.
