# Fintech Dashboard

A comprehensive fintech dashboard application with advanced file upload capabilities, transaction management, and user authentication.

## Features

- **User Authentication**: JWT-based authentication with role-based access
- **Transaction Management**: Credit/debit transactions with balance tracking
- **Advanced File Upload**: Secure image and video upload with comprehensive validation
- **Dashboard**: Real-time balance and transaction history
- **Admin Panel**: Administrative controls and transaction override capabilities
- **Profile Management**: Image upload and profile customization

## File Upload System

### Overview

The application features a robust file upload system with advanced security measures and comprehensive validation.

### Supported File Types

#### Images

- **Formats**: JPEG, JPG, PNG, GIF, WebP
- **Size Limit**: 20MB maximum
- **Storage**: `uploads/images/` directory

#### Videos

- **Formats**: MP4, MOV, AVI, MKV
- **Size Limit**: 20MB maximum
- **Storage**: `uploads/videos/` directory

### Security Measures

#### File Type Validation

- **Extension Checking**: Validates file extensions against allowed types
- **MIME Type Validation**: Ensures file content matches declared type
- **Executable File Blocking**: Prevents upload of dangerous file types

#### Blocked File Types

The system automatically blocks the following potentially dangerous file types:

- Executables: `.exe`, `.bat`, `.cmd`, `.com`, `.pif`, `.scr`
- Scripts: `.js`, `.vbs`, `.py`, `.php`, `.pl`, `.rb`, `.ps1`
- Installers: `.msi`, `.dmg`, `.app`, `.jar`
- System files: `.cpl`, `.gadget`, `.msc`, `.hta`, `.wsf`, `.wsh`
- Registry files: `.reg`, `.inf`

#### File Size Limits

- **Maximum Size**: 20MB per file
- **Validation**: Server-side size checking
- **Error Handling**: Clear error messages for oversized files

#### File Naming Security

- **Unique Names**: Timestamp + random number + extension
- **Safe Characters**: Only alphanumeric characters and extensions
- **No Conflicts**: Prevents filename collisions

### API Endpoints

#### Image Upload

```
POST /api/profile/upload-image
Content-Type: multipart/form-data
Authorization: Bearer <JWT_TOKEN>

Body:
- image: [file] (jpeg, jpg, png, gif, webp, max 20MB)
```

#### Video Upload

```
POST /api/profile/upload-video
Content-Type: multipart/form-data
Authorization: Bearer <JWT_TOKEN>

Body:
- video: [file] (mp4, mov, avi, mkv, max 20MB)
```

#### Legacy Profile Upload

```
POST /api/profile/upload-profile
Content-Type: multipart/form-data
Authorization: Bearer <JWT_TOKEN>

Body:
- profile: [file] (jpeg, jpg, png, gif, webp, max 20MB)
```

### Response Format

#### Success Response (200)

```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "filename": "1703123456789-123456789.jpg",
    "originalName": "profile.jpg",
    "filePath": "/uploads/images/1703123456789-123456789.jpg",
    "fileSize": "2.45",
    "mimetype": "image/jpeg",
    "profileImage": "/uploads/images/1703123456789-123456789.jpg"
  }
}
```

#### Error Responses

- **400 Bad Request**: Invalid file type or no file uploaded
- **401 Unauthorized**: Missing or invalid JWT token
- **413 Payload Too Large**: File exceeds 20MB limit

## Testing with Postman

### Prerequisites

1. Start the server: `npm start`
2. Server runs on: `http://localhost:5001`

### Step 1: Authentication

1. **Register User**:

   ```
   POST http://localhost:5001/api/auth/register
   Content-Type: application/json

   {
     "username": "testuser",
     "password": "testpass123"
   }
   ```

2. **Login to Get Token**:

   ```
   POST http://localhost:5001/api/auth/login
   Content-Type: application/json

   {
     "username": "testuser",
     "password": "testpass123"
   }
   ```

### Step 2: Test Uploads

#### Valid Image Upload

1. **Method**: POST
2. **URL**: `http://localhost:5001/api/profile/upload-image`
3. **Headers**: `Authorization: Bearer <YOUR_JWT_TOKEN>`
4. **Body**: `form-data`
   - Key: `image`
   - Type: `File`
   - Value: Select any .jpg, .png, .gif, .webp file (< 20MB)

#### Valid Video Upload

1. **Method**: POST
2. **URL**: `http://localhost:5001/api/profile/upload-video`
3. **Headers**: `Authorization: Bearer <YOUR_JWT_TOKEN>`
4. **Body**: `form-data`
   - Key: `video`
   - Type: `File`
   - Value: Select any .mp4, .mov, .avi, .mkv file (< 20MB)

#### Security Test Cases

1. **Invalid File Type**: Try uploading .txt, .pdf, .exe files
2. **File Too Large**: Try uploading files > 20MB
3. **No Authentication**: Remove Authorization header
4. **No File**: Submit without selecting a file

### Expected Results

- ✅ **Valid files**: 200 OK with file details
- ❌ **Invalid types**: 400 Bad Request with error message
- ❌ **Large files**: 413 Payload Too Large
- ❌ **No auth**: 401 Unauthorized
- ❌ **No file**: 400 Bad Request

## Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd fintech-dashboard
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file with:

   ```
   MONGO_URI=mongodb://localhost:27017/FintechDB
   JWT_SECRET=your_jwt_secret_here
   ```

4. **Start the server**:
   ```bash
   npm start
   ```

## Project Structure

```
fintech-dashboard/
├── uploads/              # User uploaded files (gitignored)
│   ├── images/          # Image uploads
│   └── videos/          # Video uploads
├── middleware/
│   └── upload.js        # Enhanced upload middleware
├── controllers/
│   └── profileController.js  # Upload handlers
├── routes/
│   └── profileRoutes.js      # Upload routes
└── .gitignore           # Prevents upload commits
```

## Security Features

### File Upload Security

- ✅ **Type Validation**: Extension and MIME type checking
- ✅ **Size Limits**: 20MB maximum per file
- ✅ **Executable Blocking**: Prevents dangerous file uploads
- ✅ **Unique Naming**: Timestamp + random number + extension
- ✅ **Authentication**: JWT token required for all uploads
- ✅ **Organized Storage**: Separate directories for different file types

### Version Control Security

- ✅ **Gitignore**: uploads/ directory excluded from commits
- ✅ **No User Content**: Prevents accidental commit of user files
- ✅ **Safe Repository**: Clean repository without user uploads

## API Documentation

Full API documentation is available at:
`http://localhost:5001/api-docs`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.
# Updated README for CI/CD
