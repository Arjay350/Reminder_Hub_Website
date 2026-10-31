# Reminder Hub — Official Website & Showcase 📱✨

The official responsive landing page and web showcase for **Reminder Hub**, a calm, practical, local-first Android organizer built with Flutter & Hive and optional Google Drive backups.

[![Website Status](https://img.shields.io/badge/Status-Live%20Ready-success?style=flat-square)](index.html)
[![App Version](https://img.shields.io/badge/Android%20App-v1.4.0-6366F1?style=flat-square&logo=android&logoColor=white)](https://github.com/Arjay350/Reminder-Hub-/releases/download/v1.4.0-publish/Reminder_Hub.apk)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
[![Local First](https://img.shields.io/badge/Storage-Local--First%20%7C%20Optional%20Google%20Drive-10B981?style=flat-square)](privacy.html)

---

## 🌟 Overview

This repository hosts the companion marketing and showcase website for **Reminder Hub**. It highlights the app’s offline architecture, daily reminder features, school timetable manager, bill tracker, notes vault, and interactive Mochi pet companion, while offering direct APK downloads and privacy policy documentation.

### 🔗 Quick Links
- **Android App Repository:** [Arjay350/Reminder-Hub-](https://github.com/Arjay350/Reminder-Hub-)
- **Direct APK Download:** [Download v1.4.0 APK](https://github.com/Arjay350/Reminder-Hub-/releases/download/v1.4.0-publish/Reminder_Hub.apk)
- **Privacy Policy:** [Read Privacy Policy](privacy.html)
- **Developer:** Junjifil Jr. Castro ([rjyastro@gmail.com](mailto:rjyastro@gmail.com))

---

## ✨ Website Features

- 🎮 **Live Interactive App Simulator:** Users can interact with tasks, start a focus timer, pet the virtual companion Mochi, and test AI prompts directly in the hero section.
- 🌓 **Dynamic Theme Engine:** Seamless Light and Dark mode toggle with persistent local storage preference.
- 🔊 **Synthesized Web Audio Feedback:** Subtle, calming UI sound effects generated using Web Audio API (zero external audio asset dependencies).
- 📱 **Fully Responsive Glassmorphic Design:** Optimized across mobile, tablet, and desktop viewports with fluid CSS layout.
- 🛡️ **Dedicated Privacy Policy Page:** Privacy documentation covering local storage, optional Google Drive backups, device permissions, and analytics practices.
- ⚡ **Zero Framework Overhead:** Built purely with semantic HTML5, modern CSS3 variables, and vanilla JavaScript for instant loading speeds.

---

## 🛠️ Tech Stack

- **HTML5:** Semantic markup, accessibility attributes (`aria-*`), Open Graph social sharing meta tags.
- **CSS3:** Custom CSS properties (Design tokens), glassmorphism effects, flexbox & CSS grid, responsive media queries.
- **JavaScript (ES6+):** Vanilla JavaScript, Web Audio API sound synthesis, IntersectionObserver for scroll reveals, theme toggling.

---

## 📂 Project Structure

```text
REMINDER_HUB_WEBSITE/
├── assets/
│   ├── images/
│   │   ├── app_icon.png
│   │   ├── screen_dashboard.png
│   │   ├── screen_school.png
│   │   ├── screen_bills.png
│   │   └── ... (app screenshots & assets)
├── index.html       # Primary landing page & interactive showcase
├── privacy.html     # Dedicated Privacy Policy documentation page
├── script.js        # UI interactions, Web Audio synthesis & theme switcher
├── styles.css       # Complete design system & responsive layout
└── README.md        # Repository documentation
```

---

## 🚀 Getting Started Locally

No build tools, bundlers, or `npm install` needed!

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Arjay350/Reminder-Hub-Website.git
   cd Reminder-Hub-Website
   ```

2. **Run locally:**
   - Simply double-click `index.html` to open it in your web browser.
   - Or use VS Code's **Live Server** extension, Python HTTP server:
     ```bash
     python -m http.server 3000
     ```
     Then navigate to `http://localhost:3000`.

---

## 🌐 Deploying to GitHub Pages

1. Push this repository to GitHub.
2. In your repository, go to **Settings** > **Pages**.
3. Under **Branch**, select `main` (or `master`) and folder `/ (root)`.
4. Click **Save**. Your site will be live within seconds!

---

## 📄 License & Credits

- **Developer:** [Junjifil Jr. Castro](https://github.com/Arjay350)
- **Contact:** `rjyastro@gmail.com`
- Designed and built as the official companion web presence for the **Reminder Hub** Android application.
