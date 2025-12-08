# 🔥 Guida Configurazione Firebase

Questa guida ti aiuterà a configurare Firebase per l'applicazione Gestore Spese.

## 📋 Prerequisiti

- Account Google
- Connessione Internet
- Browser web

## 🚀 Passo 1: Creare un Progetto Firebase

1. Vai su [Firebase Console](https://console.firebase.google.com/)
2. Clicca su **"Aggiungi progetto"** o **"Create a project"**
3. Inserisci un nome per il progetto (es: "gestore-spese")
4. (Opzionale) Abilita Google Analytics
5. Clicca su **"Crea progetto"**
6. Attendi che Firebase completi la configurazione

## 🔧 Passo 2: Registrare l'App Web

1. Nella dashboard del progetto, clicca sull'icona **Web** (`</>`) per aggiungere un'app web
2. Inserisci un nickname per l'app (es: "Gestore Spese Web")
3. **Non** selezionare "Set up Firebase Hosting" per ora
4. Clicca su **"Registra app"**
5. **IMPORTANTE**: Copia le credenziali di configurazione che appaiono

Le credenziali appariranno in questo formato:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "gestore-spese-xxxxx.firebaseapp.com",
  projectId: "gestore-spese-xxxxx",
  storageBucket: "gestore-spese-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxx"
};
```

## 📝 Passo 3: Configurare il File firebase-config.js

1. Apri il file `firebase-config.js` nella cartella del progetto
2. Sostituisci i valori placeholder con le tue credenziali:
   - Sostituisci `YOUR_API_KEY_HERE` con il tuo `apiKey`
   - Sostituisci `your-project-id` con il tuo `projectId`
   - E così via per tutti i campi

**Esempio finale:**

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyDx1234567890abcdefghijklmnopqrs",
    authDomain: "gestore-spese-12345.firebaseapp.com",
    projectId: "gestore-spese-12345",
    storageBucket: "gestore-spese-12345.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:a1b2c3d4e5f6g7h8i9"
};
```

3. Salva il file

## 🔐 Passo 4: Abilitare Authentication

1. Nella Firebase Console, vai su **Authentication** nel menu laterale
2. Clicca su **"Get Started"** o **"Inizia"**
3. Vai alla tab **"Sign-in method"**
4. Clicca su **"Email/Password"**
5. Abilita il toggle **"Email/Password"**
6. **NON** abilitare "Email link (passwordless sign-in)" per ora
7. Clicca su **"Salva"** o **"Save"**

## 💾 Passo 5: Configurare Firestore Database

1. Nella Firebase Console, vai su **Firestore Database** nel menu laterale
2. Clicca su **"Crea database"** o **"Create database"**
3. Seleziona **"Inizia in modalità produzione"** o **"Start in production mode"**
4. Scegli la location più vicina a te (es: `europe-west3` per Europa)
5. Clicca su **"Avanti"** e poi su **"Abilita"**

## 🛡️ Passo 6: Configurare le Regole di Sicurezza Firestore

1. Nella Firestore Database, vai sulla tab **"Regole"** o **"Rules"**
2. Sostituisci le regole predefinite con queste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permetti agli utenti autenticati di leggere/scrivere solo i propri dati
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Blocca tutto il resto
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. Clicca su **"Pubblica"** o **"Publish"**

## ✅ Passo 7: Testare la Configurazione

1. Apri il file `register.html` nel browser
2. Prova a creare un nuovo account
3. Se tutto funziona, verrai reindirizzato a `index.html`
4. Controlla la Firestore Database nella console - dovresti vedere:
   - Una collection `users`
   - Il tuo documento utente con ID uguale al tuo User ID
   - Una sub-collection `wallets`

## 🎯 Struttura Database Finale

Dopo la registrazione, la struttura in Firestore sarà:

```
users/
  └── {userId}/
      ├── displayName: "Nome Utente"
      ├── email: "email@esempio.com"
      ├── createdAt: timestamp
      │
      └── wallets/
          └── default/
              ├── id: "default"
              ├── name: "Principale"
              ├── type: "general"
              └── createdAt: timestamp
```

## 🔍 Troubleshooting

### Errore: "Firebase is not defined"
- Verifica che i tag `<script>` per Firebase SDK siano presenti in `login.html` e `register.html`
- Controlla che `firebase-config.js` venga caricato **dopo** gli SDK Firebase

### Errore: "The apiKey, authDomain, and appId are required"
- Verifica di aver sostituito tutti i placeholder in `firebase-config.js`
- Assicurati di non avere spazi extra o caratteri mancanti

### Errore: "Permission denied" in Firestore
- Controlla le regole di sicurezza in Firestore
- Verifica che l'utente sia autenticato
- Assicurati che le regole permettano l'accesso

### Errore di rete
- Controlla la connessione Internet
- Verifica che il progetto Firebase sia attivo
- Controlla la console del browser per errori dettagliati

## 📚 Risorse Utili

- [Documentazione Firebase Authentication](https://firebase.google.com/docs/auth)
- [Documentazione Firestore](https://firebase.google.com/docs/firestore)
- [Firebase Console](https://console.firebase.google.com/)

## 💡 Consigli

- ✅ **Backup delle credenziali**: Salva le credenziali Firebase in un posto sicuro
- ✅ **Ambiente di sviluppo**: Considera di creare progetti separati per sviluppo e produzione
- ✅ **Quote gratuite**: Il piano Spark di Firebase include:
  - 50,000 letture/giorno
  - 20,000 scritture/giorno
  - 10 GB storage
  - Sufficiente per uso personale
- ✅ **Sicurezza**: Non condividere mai le tue credenziali Firebase pubblicamente

## 🎉 Completato!

Ora la tua applicazione è configurata con Firebase! Puoi:
- Registrare nuovi utenti
- Effettuare il login
- Salvare dati nel cloud
- Accedere ai dati da qualsiasi dispositivo

Per domande o problemi, consulta la documentazione ufficiale Firebase o apri un issue nel repository del progetto.
