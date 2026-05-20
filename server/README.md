# ClassroomAI Backend

Backend API for ClassroomAI - transforms educational notes into AI-generated video lectures.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Get your free Gemini API key from https://makersuite.google.com/app/apikey
   - Add your Gemini API key to `.env`

3. **Start the server:**
   ```bash
   # Development (with auto-reload)
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Health Check
```
GET /api/health
```

### Upload Document
```
POST /api/upload
Content-Type: multipart/form-data

Body:
- file: PDF, DOC, DOCX, or TXT file (max 10MB)
```

**Response:**
```json
{
  "success": true,
  "documentId": "1234567890-filename.pdf",
  "fileName": "original-name.pdf",
  "textPreview": "First 200 characters...",
  "wordCount": 1500,
  "message": "Document uploaded and processed successfully"
}
```

### Generate Lecture
```
POST /api/lecture/generate
Content-Type: application/json

Body:
{
  "documentId": "1234567890-filename.pdf",
  "mode": "summary|detailed|test",
  "style": "professor|visual"
}
```

**Response:**
```json
{
  "success": true,
  "lecture": {
    "documentId": "...",
    "mode": "summary",
    "style": "professor",
    "script": "Full lecture script...",
    "sceneBreakdown": "Scene-by-scene breakdown...",
    "wordCount": 500,
    "estimatedDuration": 4
  },
  "message": "Lecture script generated successfully"
}
```

## Modes

- **Summary**: Quick overview of key concepts
- **Detailed**: In-depth explanations with examples
- **Test**: Practice questions and solutions

## Styles

- **Professor**: AI professor teaching on a board
- **Visual**: Animated visual explanations

## Next Steps

- [ ] Integrate video generation API (D-ID/HeyGen)
- [ ] Add voice synthesis (ElevenLabs)
- [ ] Implement job queue for async video processing
- [ ] Add database for storing lectures
- [ ] User authentication
