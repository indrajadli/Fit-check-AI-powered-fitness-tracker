# AI Coach Technical Guide — FitCheck

This guide explains the "Brain" of the FitCheck application: the AI Coach system. It details how the backend communicates with Large Language Models (LLMs) like Google Gemini and OpenAI.

## 1. Role of the AI Coach
The AI Coach serves two primary functions in the app:
1. **Dynamic Exercise Analysis**: Generates deep-dive guides for every exercise in the library.
2. **Interactive Chat**: Provides a real-time dialogue box on the Exercise Detail page for custom user questions.

---

## 2. AI Providers (LLMs)

### Google Gemini (Recommended)
- **Model**: `gemini-1.5-flash` or `gemini-1.5-pro`
- **Why**: Offers a generous **Free Tier** (up to 15 requests/min) and high speed.
- **API Endpoint**: `https://generativelanguage.googleapis.com/v1/models/{model}:generateContent`

### OpenAI (Alternative)
- **Model**: `gpt-4o` or `gpt-4o-mini`
- **Why**: Industry-standard accuracy, but requires paid tokens.
- **Note**: The app currently defaults to Gemini for cost efficiency.

---

## 3. Backend Architecture

### `AiService.java`
This is the heart of the AI system. It handles:
- **API Key Management**: Loads keys from `application.yml`.
- **Request Construction**: Transforms exercise data into JSON payloads.
- **Response Parsing**: Extracts the generated text from complex API responses.
- **Offline Fallbacks**: Provides hardcoded expert advice if the internet or API fails.

### `AiController.java`
Exposes the AI features to the React frontend via REST:
- `GET /api/ai/coach/exercise/{id}`: Fetches the structured breakdown.
- `POST /api/ai/chat`: Handles the interactive dialogue.

---

## 4. Prompt Engineering
The AI Coach uses "System Prompting" to ensure responses are high-quality.

### Exercise Guide Prompt
When you view an exercise, we send a prompt like this:
> "You are the world's most detailed AI Fitness Coach. Provide an exhaustive analysis of [Exercise Name]. Use headers: OVERVIEW, SETUP, FORM, and CUES."

### Chat Prompt
For the dialogue box, we include the context:
> "You are helping a user with [Exercise Name]. Answer this question: [User's Question]. Keep it scientific and motivating."

---

## 5. Handling Errors & Quotas
AI APIs are powerful but can be fragile. We handle:
- **429 (Quota Exceeded)**: If you use too many tokens, the backend catches this and tells the user to check their API balance.
- **Timeouts**: If the AI takes too long, we display a motivating "heavy sets" message.
- **Markdown Support**: All AI responses are treated as Markdown, allowing the frontend to render **bold**, *italics*, and ### headers beautifully.

---

## 6. How to Switch Models
You can change the "Brain" of your app in `backend/src/main/resources/application.yml`:

```yaml
app:
  gemini:
    api-key: AIzaSy...
    model: gemini-1.5-pro  # Change to flash for speed, pro for quality
```

**Developer Tip**: If you want to use OpenAI again, you can refactor `AiService.java` to use the `https://api.openai.com/v1/chat/completions` endpoint.
