
---

# 📄 `AI_USAGE.md`

```md
# AI Usage Documentation

## 1. AI Tools Used

- Claude, Gemini Pro

Used for:
- Designing backend flow logic
- Debugging state management issues
- Improving checkpoint system design
- Fixing back navigation logic
- reStructuring MongoDB schema relationships

---

## 2. Prompts Used

### Prompt 1
> “How should I design a conversation flow system with modules and questions?”

### Prompt 2
> “My back service is not working, history and state are mismatched”

### Prompt 3
> “How do I enforce strict checkpoints so user cannot go back beyond a node?”

### Prompt 4
> “Review my answerService and backService for correctness”

### Prompt 5
> “Design a correct UserState + ConversationHistory model for navigation system”

---

## 3. Modifications Made from AI Output

- Simplified history model to a stack-based design
- Removed unnecessary complex branching in checkpoint handling
- Moved checkpoint enforcement into UserState instead of history logic
- Ensured backService only depends on ConversationHistory
- Fixed state consistency between answerService and backService
- Adjusted flow to always store current state before transition

---

## 4. What AI Got Wrong / Needed Correction

- Initially suggested deleting history aggressively (caused inconsistency)
- Suggested checkpoint logic inside history cleanup (incorrect design)
- Mixed responsibilities between UserState and ConversationHistory
- Overcomplicated backtracking logic
- Did not clearly separate:
  - active state (UserState)
  - past state (ConversationHistory)

---

## 5. How I Verified Correctness

- Manual testing of flows via postman:
  - Q1 → Q2 → Q3 → Q4
  - Back navigation step-by-step
- Verified UserState always matches last response
- Tested checkpoint blocking behavior
- Checked invalid option handling
- Ensured no broken references in MongoDB
- Simulated edge cases:
  - empty history
  - invalid optionId
  - module switching