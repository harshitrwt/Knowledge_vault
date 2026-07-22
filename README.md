# Knowledge Vault

A comprehensive PDF analysis and interactive learning platform that leverages artificial intelligence to provide intelligent document understanding and conversation capabilities. Knowledge Vault serves as a one-stop solution for students, professionals, and researchers to extract insights from PDF documents through natural language interactions.

## Project Overview

Knowledge Vault is a full-stack web application that enables users to upload PDF documents and interact with them using an AI-powered assistant. The platform analyzes documents and allows users to ask questions about their content, generate mind maps, and maintain persistent conversation histories for future reference.

### Key Features

- **PDF Document Upload and Analysis**: Upload PDF files and extract text content for intelligent analysis
- **AI-Powered Chat Interface**: Ask questions about PDF content using natural language processing powered by Groq's LLaMA model
- **Mind Map Generation**: Automatically generate high-level mind maps and structural summaries of PDF documents
- **Conversation Management**: Save, retrieve, and manage multiple conversations linked to specific PDF documents
- **Multi-File Support**: Handle multiple PDF files with independent contexts and conversation histories
- **User Authentication**: Secure user account management with Clerk authentication
- **Persistent Storage**: Store files and chat histories using PostgreSQL and cloud storage integration
- **Context-Aware Responses**: AI maintains conversation history for follow-up questions and contextual understanding

## Technology Stack

### Backend
- **Framework**: Next.js (TypeScript)
- **API Runtime**: Node.js with Next.js API Routes
- **AI Model**: Groq API (LLaMA 3.3 70B Versatile)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk Authentication Platform
- **PDF Processing**: PDF-Parser library for text extraction

### Frontend
- **Framework**: React with Next.js
- **Language**: TypeScript
- **Authentication**: Clerk React integration
- **UI Components**: React components with Toast notifications
- **HTTP Client**: Fetch API

### Infrastructure
- **Deployment**: Vercel
- **File Storage**: Cloud storage integration (configured via environment)
- **Database Provider**: PostgreSQL cloud instance

## Project Structure

```
Knowledge_vault/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/route.ts           # Chat completion endpoint
│   │   │   ├── chats/[id]/route.ts     # Retrieve and delete saved chats
│   │   │   ├── files/route.ts          # File management endpoints
│   │   │   └── mindmap/route.ts        # Mind map generation endpoint
│   │   └── askai/
│   │       └── askAiClient.tsx         # Main chat interface component
│   └── lib/
│       ├── prisma.ts                   # Prisma client configuration
│       └── user.ts                     # User synchronization utilities
├── prisma/
│   └── schema.prisma                   # Database schema definition
├── public/                              # Static assets
└── package.json                         # Project dependencies
```

## Database Schema

### User Model
Stores user account information and maintains relationships with files and saved chats.
- Fields: id (CUID), clerkId (unique), email (unique), createdAt timestamp
- Relations: One-to-many with File and SavedChat

### SavedChat Model
Persists conversation histories and document context for later retrieval.
- Fields: id, fileName, messages (JSON array), context (full text), userId, createdAt
- Relations: Many-to-one with User

### File Model
Tracks uploaded PDF files and their metadata.
- Fields: id, name, size, url (cloud storage link), userId, createdAt
- Relations: Many-to-one with User

## API Endpoints

### POST /api/chat
Processes a user question against document context and returns AI-generated response.

Request Body:
```json
{
  "question": "string - user's question",
  "context": "string - extracted PDF text content",
  "messages": "array - conversation history for follow-up context"
}
```

Response:
```json
{
  "answer": "string - AI-generated response"
}
```

### POST /api/mindmap
Generates a high-level mind map summarizing key concepts from a PDF.

Request Body:
```
FormData:
- pdf: File (PDF document)
- fileId: string (optional, for existing files)
```

Response:
```json
{
  "mindmap": "string - structured mind map in table format",
  "pdfId": "string - identifier for the processed PDF"
}
```

### GET /api/chats/[id]
Retrieves a complete saved conversation including all messages and document context.

Response:
```json
{
  "id": "string",
  "fileName": "string",
  "messages": "array - conversation history",
  "context": "string - document content"
}
```

### DELETE /api/chats/[id]
Removes a saved conversation from the database.

Response:
```json
{
  "success": true
}
```

## Core Functionality

### PDF Text Extraction
The application uses PDFParser to extract raw text content from uploaded PDF files. Text extraction occurs asynchronously and supports both text-based and provides error handling for scanned/image-based PDFs.

### AI Chat System
- Uses Groq's LLaMA 3.3 70B Versatile model for text completion
- Implements a system prompt that constrains AI responses to document context
- Maintains conversation history (last 10 messages) for contextual follow-up questions
- Provides suggestions and recommendations derived from document content
- Includes fallback responses for out-of-scope questions

### Conversation Context Management
The system stores PDF contexts in memory during a session and provides capabilities to:
- Maintain multi-turn conversations within a single document analysis
- Save conversation snapshots to the database for persistent access
- Re-load and continue conversations from stored histories
- Associate multiple conversations with individual PDF documents

### Authentication and Authorization
- Clerk authentication ensures secure user access
- User synchronization creates database records on first login
- All database queries filtered by authenticated userId
- File and chat access restricted to owning user only

## Setup and Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL database instance
- Groq API key
- Clerk account and application credentials
- Cloud storage service (for file uploads)

### Environment Configuration

Create a `.env.local` file in the project root:

```
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=[your-clerk-key]
CLERK_SECRET_KEY=[your-clerk-secret]
GROQ_API_KEY=[your-groq-api-key]
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/harshitrwt/Knowledge_vault.git
cd Knowledge_vault
```

2. Install dependencies:
```bash
npm install
```

3. Set up database:
```bash
npx prisma migrate dev
npx prisma generate
```

4. Run development server:
```bash
npm run dev
```

5. Access the application at `http://localhost:3000`

## Deployment

The project is configured for Vercel deployment:

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

Production deployment: https://knowledge-vault-puce.vercel.app

## Usage Guide

### Uploading and Analyzing PDFs
1. Navigate to the Ask AI interface
2. Select a PDF file to upload
3. Click analyze to extract document content
4. Wait for confirmation that file analysis is complete

### Asking Questions
1. After PDF analysis, enter your question in the input field
2. Ask specific questions about document content
3. Review AI responses which are grounded in the PDF context
4. Ask follow-up questions that reference previous discussion points

### Generating Mind Maps
1. Upload a PDF document
2. Navigate to the mind map generation feature
3. System generates a high-level summary in table format
4. Review key concepts and document structure

### Saving Conversations
1. Complete your question-answer session
2. Click save conversation button
3. Conversation is stored with chat history and document context
4. Access saved conversations later for reference

### Retrieving Saved Chats
1. Navigate to saved conversations section
2. Select a previous conversation
3. Full chat history and document context are restored
4. Continue conversation or review previous Q&A

## Error Handling

The application implements comprehensive error handling:

- **API Key Errors**: Clear messages when Groq API key is missing or invalid
- **PDF Parsing Errors**: Graceful fallback for scanned or image-based PDFs
- **Network Errors**: Retry logic and user-friendly error notifications
- **Database Errors**: Logging and safe error responses to prevent data exposure
- **Authentication Errors**: Redirects to login for unauthorized access attempts

## Security Considerations

- All database queries include userId filtering to prevent cross-user data access
- Sensitive API keys are stored in server environment variables only
- PDF files are stored in secure cloud storage with access controls
- User conversations are encrypted and associated with authenticated sessions
- Input validation on chat questions and file uploads

## Development Notes

### Conversation History Limitation
The system stores the last 10 messages for context to balance performance with conversation continuity. Older messages can be retrieved from SavedChat records.

### PDF Context Caching
Document context is maintained in memory during active sessions for performance. For stored files, context is retrieved from the database when conversations are restored.

### Token Limits
The chat API limits context blocks to 2000 characters per message to manage Groq API token constraints.

## Future Enhancements

- Support for additional document formats (DOCX, PPTX, etc.)
- Advanced document indexing for faster searches
- Collaborative document analysis features
- Annotations and highlighting within documents
- Export conversation summaries as PDF or document formats
- Multi-language support for PDF analysis
- Custom AI model fine-tuning for specific document types
- Real-time collaborative editing of conversations

## Issues and Support

For bug reports, feature requests, or general support, please open an issue on the GitHub repository.

Current open issues: 1

## License

This project is open source and available for educational and professional use.

## Author

Harshit Rawat (@harshitrwt)

## Repository

GitHub: https://github.com/harshitrwt/Knowledge_vault

Live Demo: https://knowledge-vault-puce.vercel.app
