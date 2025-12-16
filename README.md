## Aura – Holographic Portfolio for Sat Paing Oo

This is a 3D‑styled personal portfolio for **Sat Paing Oo**.  
The interface is presented as **SPO.SYS**, and **Aura** is the holographic assistant that helps viewers explore projects, skills, and history.
It includes:

- **Home view** with holographic head, summary, and quick navigation
- **Projects** view powered by structured data from `constants.ts`
- **Skills** radar chart view
- **Employment history** and **education** timeline
- An integrated **Aura** chat assistant backed by Gemini (optional, via API key)

### Live / Contact

- **LinkedIn**: https://www.linkedin.com/in/satpaingoo777/
- **GitHub**: https://github.com/SatPaingOo
- **Email**: `satpaingoo777@gmail.com`

---

## Run Locally

**Prerequisites:** Node.js (v18+ recommended)

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure Gemini (optional, for Aura chat)**

   Create a `.env.local` file and set:

   ```bash
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

   If you skip this, the app will fall back to an offline, portfolio‑aware response mode.

3. **Start the dev server**

   ```bash
   npm run dev
   ```

4. Open the printed `http://localhost:xxxx` URL in your browser.
