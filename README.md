# web_infrastructure_summative

## Pill Assist – Medicine Information Viewer

Pill Assist is a small web application that helps users quickly look up public information about prescription medicines using the U.S. FDA open data API.

The goal is to make it easier to understand what a medicine is used for, how it is typically taken, and what warnings or side effects are listed in the official labeling.

---

### How the application works

- The user enters a medicine name (brand or generic) into the text box on the home page.
- When the user presses Enter or clicks **“Search FDA Database”**:
  - The page scrolls to the **Drug Information** section.
  - A **loading skeleton** appears while the app queries the FDA API.
  - The app sends a request to `https://api.fda.gov/drug/label.json` and searches across several openFDA fields (brand name, generic name, substance name).
- If a matching medicine label is found, the app displays:
  - Description
  - Indications & Usage
  - Warnings (with a simple visual safety indicator)
  - Possible side effects
  - Drug interactions
- The content is shown in collapsible sections with **+ / −** toggles and “Show More” buttons for long text.
- A secondary search box lets the user search **within** the loaded drug information (with highlighted matches).

If no matching medicine is found, a clear **“No results found”** error state is shown with a button to try again. Other errors (for example network issues) are displayed as on-page messages, not browser alerts.

---

### How to run it

This project is a static front-end app:

1. Open `index.html` in a modern browser (or serve the folder with any simple static web server).
2. Make sure you have an internet connection so the app can reach the FDA API at `api.fda.gov`.
3. Type a medicine name and search.

There is **no custom backend** or database; everything runs in the browser using JavaScript (`script.js`) and Axios via a CDN.

---

### Important limitations

- Data is fetched from the public **openFDA Drug Label** API.
- The API may not contain every product or the very latest label for every drug.
- Search is best-effort: spelling, brand vs generic name, and country differences can affect results.
- The application does **not** personalize information to a specific patient, dose, or combination of medicines.

---

### Critical medical disclaimer

- This application is for **informational and educational purposes only**.
- It **does not provide medical advice, diagnosis, or treatment**.
- Displayed information may be incomplete, outdated, or not applicable to your specific situation.
- **Never start, stop, or change any medicine based solely on this app.**
- Always consult a **licensed healthcare professional** (doctor, pharmacist, nurse) before making any decisions about medicines, doses, or treatments.

By using this application you agree that the developers and maintainers are **not responsible** for any decisions or outcomes related to your health or medication use.
