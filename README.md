# ✨ AKS - The Virtual Fashion Atelier
<img width="1919" height="829" alt="image" src="https://github.com/user-attachments/assets/757633f6-acdf-4065-90f8-a82e768d41ad" />


Live link:
https://gen-lang-client-0352686033.web.app/

**AKS** is an AI-powered virtual fashion assistant designed to transform how we envision unstitched fabric. By leveraging the power of Google's Gemini Vision AI, Aks analyzes fabric patterns, textures, and colors to generate bespoke tailoring instructions and high-end styling recommendations for traditional Pakistani wear.

Developed as a submission for the **Hackathon Phase 1: "App Banaao"**.


🌟 Features

*   **🧠 AI Fabric Analysis:** Upload any unstitched fabric, and our Gemini-powered engine will analyze its color palette, texture, and embellishments.
*   **👗 Bespoke Tailoring Instructions:** Get customized stitching guides for various templates including *A-Line Kurtas, Modern Lehengas, and Classic Ghararas*.
*   **💍 Styling & Accessories:** Receive curated recommendations for matching bottoms, dupattas, footwear, and jewelry to complete the high-end look.
*   **💾 Cloud Saving:** Authenticated users can save their favorite style reports to their personal collection via Firebase Firestore.
*   **🎨 Cinematic UI:** A visually stunning, vintage-inspired user interface built with Framer Motion animations and responsive design.

  
💻 Tech Stack

This project is built using a modern, scalable architecture:

**Frontend:**
*   React.js (Vite)
*   Tailwind CSS (for styling)
*   Framer Motion (for smooth animations)
*   Lucide React (Icons)
*   Firebase Hosting (Deployment)

**Backend:**
*   Node.js & Express.js
*   `@google/genai` SDK
*   Google Cloud Run (Serverless Backend Deployment)

**AI & Cloud Services:**
*   **Google Gemini AI** (Vision capabilities for fabric analysis)
*   Firebase Authentication & Firestore Database

---

🚀 Getting Started (Local Development)

Follow these steps to run the project locally.

### Prerequisites
*   Node.js installed on your machine.
*   A Google Gemini API Key.
*   Firebase project setup.

### Run locally

Use Node.js 22.12 or newer. In the repository root:

```sh
npm ci
cp .env.example .env
npm run dev
```

In a second terminal:

```sh
cd backend
npm ci
cp .env.example .env
# Set GEMINI_API_KEY in backend/.env
npm start
```

The frontend uses http://localhost:8080 by default. The backend verifies the
Firebase ID token sent by the signed-in user before calling Gemini. On Cloud
Run, configure the Gemini key as a server-side secret. For local development,
configure Firebase Admin credentials with Google Application Default Credentials
if token verification cannot access your project. Set FIREBASE_PROJECT_ID if
using a different Firebase project.

For deployment set
VITE_API_URL to the backend HTTPS URL before building. `/health` reports
whether the backend has an AI key configured. Never put a Gemini key in
VITE_ variables or source files. Rotate the previously committed test key;
removing it from the working tree does not remove it from Git history.

Firebase currently targets the existing project's named Firestore database.
Enable Email/Password sign-in and authorize your development hostname in
Firebase Authentication. `firestore.rules` and `firestore.indexes.json` now
define owner-only access and the collection index for that named database.
Deploy them with the Firebase CLI after reviewing the target project and
database: `firebase deploy --only firestore`. Committing these files does not
change the live database until deployment.

### Checks

```sh
npm run lint
npm run build
cd backend
npm test
```

The GitHub Actions workflow runs these checks on pushes and pull requests.

Uploaded images are resized to a maximum 1200px dimension and a bounded JPEG
preview before analysis/saving, keeping saved reports below Firestore's document
limit. Analysis failures are displayed as errors; no fabricated report is used.
