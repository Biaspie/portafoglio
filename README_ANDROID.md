# Guida alla Creazione dell'App Android (APK)

Poiché sul tuo computer mancano **Java (JDK)** e **Android Studio**, non ho potuto generare direttamente il file APK.
Tuttavia, ho preparato l'intero progetto nella cartella `PortafoglioApp`.

Segui questi passaggi per completare la creazione dell'app:

## 1. Installare i Requisiti

### A. Installare Java (JDK)
1.  Scarica e installa **Java SE Development Kit (JDK) 11** o superiore (consigliato JDK 17).
    *   [Scarica JDK da Oracle](https://www.oracle.com/java/technologies/downloads/) o [OpenJDK](https://adoptium.net/).
2.  Dopo l'installazione, apri un nuovo terminale e verifica con:
    ```bash
    java -version
    ```

### B. Installare Android Studio
1.  Scarica e installa **Android Studio**.
    *   [Scarica Android Studio](https://developer.android.com/studio)
2.  Durante l'installazione, assicurati di selezionare **Android SDK** e **Android Virtual Device**.
3.  Apri Android Studio, vai su **More Actions > SDK Manager** e installa:
    *   Android SDK Platform (ultima versione stabile, es. Android 13/14).
    *   Android SDK Build-Tools.

### C. Configurare le Variabili d'Ambiente
Devi aggiungere le cartelle di Android SDK al tuo "Path" di sistema.
1.  Cerca "Modifica le variabili di ambiente relative al sistema" su Windows.
2.  Clicca su **Variabili d'ambiente**.
3.  Aggiungi una nuova variabile utente `ANDROID_HOME` che punta alla cartella del tuo SDK (solitamente `C:\Users\TuoNome\AppData\Local\Android\Sdk`).
4.  Modifica la variabile `Path` e aggiungi:
    *   `%ANDROID_HOME%\platform-tools`
    *   `%ANDROID_HOME%\cmdline-tools\latest\bin`

## 2. Generare l'APK

Una volta installato tutto, apri il terminale nella cartella del progetto:

```bash
cd PortafoglioApp
```

Aggiungi la piattaforma Android:

```bash
npx cordova platform add android
```

Costruisci l'APK:

```bash
npx cordova build android
```

Se tutto va bene, troverai il file APK in:
`PortafoglioApp/platforms/android/app/build/outputs/apk/debug/app-debug.apk`

Puoi copiare questo file sul tuo telefono e installarlo!
