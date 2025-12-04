# PM Prompt Genius

**PM Prompt Genius** is a comprehensive, accessible, and aesthetically pleasing prompt engineering library designed for Project Managers, Scrum Masters, and Agile teams. It leverages Google's Gemini API to generate intelligent responses for various project management scenarios.

## 🎨 Features

*   **Extensive Prompt Library**: Curated prompts for Waterfall, Agile, SAFe, Jira, and Leadership.
*   **Gemini AI Integration**: Real-time generation of content using the `gemini-2.5-flash` model.
*   **Thinking Mode (New)**: Toggle "Deep Thinking" to use `gemini-3-pro-preview` for complex reasoning tasks (Budget: 32k tokens).
*   **AI Chatbot (New)**: A conversational interface to discuss project challenges directly with Gemini.
*   **Art Fusion Aesthetics**: A unique "Van Gogh x Klimt" visual theme with rich textures and gold accents.
*   **Accessibility First**: 
    *   WCAG 2.2 AA Compliant.
    *   High Contrast Mode.
    *   Screen Reader support (ARIA landmarks, live regions).
    *   Keyboard navigation & Focus management.
    *   Reduced motion support.
*   **Interactive Playground**: Test and refine prompts instantly.
*   **Jira Automation Toolkit**: Python scripts and JQL queries.

## 🛠 Tech Stack

*   **Frontend**: React 19, TypeScript, Vite
*   **Styling**: Tailwind CSS (with custom configuration)
*   **Icons**: Lucide React
*   **AI**: Google GenAI SDK (`@google/genai`)

## 🚀 Getting Started

### Prerequisites

*   Node.js (v18 or higher)
*   A Google Gemini API Key

### Installation

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up your API Key:
    *   Create a `.env` file in the root directory.
    *   Add: `API_KEY=your_gemini_api_key_here`
    *   *Note: In a Vite environment, you might need to use `VITE_API_KEY` and update `geminiService.ts` accordingly, or use a proxy server for security.*

4.  Run the development server:
    ```bash
    npm run dev
    ```

## ♿ Accessibility

This project prioritizes inclusivity:
*   **Contrast**: All text meets or exceeds 4.5:1 contrast ratios.
*   **Navigation**: Skip-to-content links and clear focus indicators.
*   **Semantics**: Proper HTML5 landmarks (`main`, `nav`, `search`).
*   **Themes**: Dedicated High-Contrast mode for low-vision users.

## ✍️ Author

**BalajiDuddukuri**

## 📄 License

MIT