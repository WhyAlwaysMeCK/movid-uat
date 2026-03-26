# Movid Psychodietetyka

Robocza aplikacja webowa dla marki psychodietetycznej zbudowana w React, Vite, Tailwind CSS, Framer Motion, Express, Zod i SQLite.

## Features

- Wielostronicowy serwis marki `Movid Psychodietetyka`
- Animowana strona główna z dopracowanym UI
- Oferta psychodietetyki i dietetyki klinicznej
- Wielostopniowy formularz rezerwacji z zapisem do backendu
- Formularz kontaktowy z walidacją i bazą danych
- Blog i widoki artykułów
- Tryb jasny i ciemny

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the frontend and backend together:

```bash
npm run dev
```

3. Open the app:

- Frontend: `http://localhost:5173`
- API: `http://localhost:3001`

## UAT / Test Environment

Projekt ma teraz wbudowane środowisko UAT:

- publiczny frontend, który można pokazać klientowi
- opcjonalną ochronę hasłem przez HTTP Basic Auth
- panel podglądu danych testowych pod ścieżką `/uat`
- podgląd rezerwacji, formularzy kontaktowych i testowych zdarzeń mailowych
- możliwość wyczyszczenia danych testowych z poziomu panelu

Do wdrożenia na Render przygotowany jest też plik [`render.yaml`](/C:/Users/dawid/OneDrive/Pulpit/AI/Codex%20projevts/render.yaml) oraz instrukcja w [`render-uat.md`](/C:/Users/dawid/OneDrive/Pulpit/AI/Codex%20projevts/docs/render-uat.md).

Aby włączyć ochronę hasłem, utwórz plik `.env` na podstawie `.env.example` i ustaw:

```bash
UAT_BASIC_AUTH_USER=twoj_login
UAT_BASIC_AUTH_PASSWORD=twoje_mocne_haslo
```

Po uruchomieniu aplikacji:

- strona główna będzie dostępna publicznie dopiero po podaniu loginu i hasła
- panel UAT będzie dostępny pod `http://localhost:5173/uat` w dev albo pod `/uat` po deployu
- dane testowe zapisują się do `data/movid.sqlite`

## Production

Build the frontend:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

Express serwuje zbudowany frontend z `dist/`, a dane zapisują się w pliku SQLite w katalogu `data/`.
