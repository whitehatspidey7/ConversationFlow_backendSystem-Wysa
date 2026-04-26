# Modular Conversation Flow Backend

This repository contains the backend service for a modular, question-based conversation flow system. It handles complex user journeys, including branching logic, module switching, checkpointing, and history tracking.

## Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB
* **ODM:** Mongoose

## Setup Instructions

### Prerequisites
* Node.js (v18+ recommended)
* MongoDB (Local instance or MongoDB Atlas cluster)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/whitehatspidey7/ConversationFlow_backendSystem-Wysa.git
   cd <repo-directory>
## Install dependencies:

## Bash
npm install
## Environment Setup:
Create a .env file in the root directory and add your MongoDB connection string:

## Code snippet
DB_STRING=mongodb+srv://<username>:<password>@cluster.mongodb.net/your_db_name
Note: The application uses a custom DNS configuration (1.1.1.1, 8.8.8.8) to resolve common MongoDB connection issues.

## Seed the Database:
To populate the database with sample modules, questions, and options, run the seed script:

## Bash
node sample_seed_script.js
## Start the Server:
For development (uses nodemon):

## Bash
npm run dev
The server will start on http://localhost:3000.

### API Endpoints
## 1. Start a Module
Starts a conversation flow for a user at the beginning of a specific module.

### URL: POST http://localhost:3000/module/start

Body:

JSON
{
  "userId": "user123",
  "moduleId": "<module-object-id>" 
}

## 2. Answer a Question
Submits an answer and calculates the next step in the flow (moving to the next question or switching modules).

### URL: POST http://localhost:3000/answer

Body:

JSON
{
  "userId": "user123",
  "optionId": "<option-object-id>"
}
## 3. Go Back (Bonus Feature)
Reverts the user to the previous question, respecting checkpoint boundaries.

### URL: POST http://localhost:3000/back

Body:

JSON
{
  "userId": "user123"
}


### System Design & Architecture
## Data Modeling Strategy

The system separates the static flow definition from the dynamic user journey:

Static Entities: Module, Question, and Option. Options dictate the flow logic via nextQuestionId or nextModuleId. A Mongoose pre-save hook ensures an option cannot have both.

## Dynamic Entities:

ConversationHistory: Acts as an append-only log of every action the user takes.

UserState: Acts as the single source of truth for where the user currently is (currentModuleId, currentQuestionId).

## Handling State vs. History
By separating UserState and ConversationHistory, the system can cleanly handle deep linking. If a user opens an old deep link (Requirement 6), the client can simply fetch their active UserState rather than trying to parse the old link, ensuring they always resume from their latest valid position.

## Checkpoint Logic
Questions can be flagged with isCheckpoint: true. When a user passes a checkpoint, the AnswerService records the checkpointHistoryId on the UserState. The backService strictly enforces this boundary, throwing an error if a user attempts to revert past this recorded history ID.

## Defensive Design
Option Validation: The backend strictly verifies that an incoming optionId belongs to the user's currently active questionId in their UserState, preventing users from skipping ahead or submitting rogue options.

Orphaned State Handling: Service layers ensure that missing entities (e.g., a deleted module or invalid flow) throw clear, catchable errors rather than crashing the server.
