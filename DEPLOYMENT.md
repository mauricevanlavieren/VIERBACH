# VIERBACH — Beheerpaneel & Publicatie (STRATO)

Deze website is een **statische React-site** met een klein **PHP-beheerpaneel**.
Geen database. Alle bewerkbare inhoud staat in één JSON-bestand.

---

## 1. Hoe werkt het?

```
Bezoeker ──► / (publieke website)
                  │
                  └──► GET /api/content.php ──► data/content.json
                                                        ▲
Eigenaar ──► /admin (inloggen) ─► dashboard ──► POST /api/save-content.php ──┘
                 │                                  POST /api/upload.php ──► /uploads/
```

- **Publiek** (`/`): iedereen kan de site bekijken. De inhoud wordt bij het laden
  opgehaald uit `/api/content.php`. Is er geen PHP (b.v. GitHub Pages), dan valt
  de site automatisch terug op de standaardinhoud.
- **Beheer** (`/admin`): beschermd met gebruikersnaam + wachtwoord (PHP-sessie,
  bcrypt-hash, CSRF-bescherming). Alleen hier kunnen teksten en foto's gewijzigd
  worden.

## 2. Standaard inloggegevens (ZELF WIJZIGEN!)

| Veld          | Waarde        |
| ------------- | ------------- |
| Gebruikersnaam| `admin`       |
| Wachtwoord    | `vierbach2026`|

**Wachtwoord wijzigen:** op uw computer (of via SSH op de server):
```
php tools/make-hash.php "uwnieuwewachtwoord"
```
Plak de uitvoer in `api/config.php` als `ADMIN_PASSWORD_HASH`.

## 3. Publiceren op STRATO

1. Bouw en pak de site in één map:
   ```
   ./scripts/pack-deploy.sh
   ```
   Dit maakt de map `deploy/` met de complete website (React + PHP).

2. Log in bij STRATO → **Klantenlogin** → uw hostingpakket →
   **Webspace beheren**.

3. Ga naar de **`htdocs`**-map en verwijder eventuele standaardbestanden.

4. Upload de **INHOUD van `deploy/`** naar `htdocs`, zodat deze structuur ontstaat:

   ```
   htdocs/
   ├── index.html        ← de React-site (uit deploy/)
   ├── assets/           ← JavaScript/CSS/foto's
   ├── api/              ← login.php, content.php, upload.php, enz.
   ├── data/
   │   └── content.json  ← alle bewerkbare inhoud
   ├── uploads/          ← geüploade foto's
   └── tools/            ← wachtwoord-hulpmiddel (nooit via browser bereikbaar)
   ```

   > Let op: upload de **inhoud** van `deploy/`, niet de map zelf.

5. Open `https://uwdomein.nl/admin` en log in.

## 4. Bestandsrechten (permissies)

Standaard werkt alles met de standaard rechten die STRATO bij uploaden geeft
(mappen 755, bestanden 644). Als opslaan/uploaden mislukt:

```
chmod 755 data uploads      (mappen)
chmod 644 data/content.json (bestand)
```

Alleen als het dan nog niet lukt (PHP draait als andere gebruiker):
```
chmod 775 data uploads
chmod 664 data/content.json
```

## 5. Beveiliging die al ingebouwd is

- Wachtwoord staat als **bcrypt-hash** in `api/config.php` (nooit in React/browser).
- `api/.htaccess` blokkeert directe downloads van `config.php`.
- `data/.htaccess` blokkeert directe downloads van `content.json`.
- `uploads/.htaccess` zorgt dat er **geen scripts** (PHP e.d.) uitgevoerd worden.
- Elke wijziging/upload vereist een geldige **PHP-sessie** én **CSRF-token**.
- Uploads: alleen JPG/PNG/WEBP/SVG, maximaal 5 MB, willekeurige bestandsnaam,
  inhoud wordt gecontroleerd.
- Teksten worden gesaneerd (geen HTML/scripts).

## 6. Lokaal testen

**Eénmalig:** PHP installeren (php-cli).

Terminal 1 — PHP-server:
```
cd vierbach-hijskraanverhuur2.0
php -S 127.0.0.1:8000 -t backend
```

Terminal 2 — de site:
```
npm install
npm run dev
```
De Vite-devserver (poort 3000) stuurt `/api` en `/uploads` automatisch door naar
de PHP-server. Open **http://localhost:3000/admin**.

Of test de definitieve build:
```
./scripts/pack-deploy.sh
php -S 127.0.0.1:8000 -t deploy scripts/local-router.php
```
Open **http://127.0.0.1:8000/** en **http://127.0.0.1:8000/admin**.

## 7. API-overzicht

| Endpoint                 | Methode | Toegang     | Doel                              |
| ------------------------ | ------- | ----------- | --------------------------------- |
| `/api/content.php`       | GET     | publiek     | Inhoud ophalen                    |
| `/api/auth.php`          | GET     | publiek     | Sessiestatus + CSRF-token         |
| `/api/login.php`         | POST    | publiek     | Inloggen (sessie starten)         |
| `/api/logout.php`        | POST    | beheer      | Uitloggen                         |
| `/api/save-content.php`  | POST    | beheer      | Inhoud opslaan (content.json)     |
| `/api/upload.php`        | POST    | beheer      | Foto uploaden (naar /uploads/)    |

## 8. Productie-build maken

```
npm run build
```
Uitvoer staat in `dist/` (of gebruik `./scripts/pack-deploy.sh` voor de volledige
STRATO-map inclusief PHP).
