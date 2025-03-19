# Sistema Informativo per la Gestione degli Ospiti nei BnB

## 1. Panoramica del Sistema
Il sistema informativo ha lo scopo di facilitare la gestione degli ospiti per i Bed & Breakfast (BnB), garantendo un'integrazione efficace con i servizi di Alloggiati Web e con le piattaforme di prenotazione come Airbnb, Booking e altri.

## 2. Struttura del Sistema
### 2.1 Host e Strutture
- Ogni host può avere una o più strutture.
- Ogni struttura ha un proprio account Alloggiati Web collegato.
- Ogni struttura può contenere uno o più appartamenti prenotabili.
- Ogni appartamento dispone di un calendario prenotazioni.

### 2.2 Alloggiati Web
- Il sistema dovrà scansionare i documenti degli ospiti per una determinata struttura.
- Le ricevute delle schedine inviate ad Alloggiati Web dovranno essere archiviate per 5 anni (solo per strutture con Licenza SCIAA).

## 3. Funzionalità dell'Applicativo
### 3.1 Gestione Automatica di Alloggiati Web
- Acquisizione e salvataggio automatico dei dati degli ospiti.
- Invio automatico delle schedine ad Alloggiati Web.
- Archiviazione delle ricevute di trasmissione.

### 3.2 Gestione delle Prenotazioni
- Importazione automatica delle prenotazioni da:
  - Airbnb
  - Booking
  - iCal
  - Gestionale proprietario
- Sincronizzazione del calendario per evitare overbooking.
- Blocco automatico delle date negli altri gestori di proprietà.

### 3.3 Gestione delle Tasse di Soggiorno
- Calcolo del numero di ospiti e del numero di notti soggiornate.
- Generazione di report mensili per la contabilità delle tasse di soggiorno.

## 4. Requisiti Tecnici
- **Database**: Archiviazione delle strutture, appartamenti, ospiti e ricevute.
- **Integrazione API**: Comunicazione con Alloggiati Web, Airbnb, Booking, iCal e gestionali proprietari.
- **Sicurezza**: Protezione dei dati degli ospiti e conformità alle normative GDPR.

## 5. Considerazioni Finali
Il sistema dovrà garantire un'interfaccia intuitiva per gli host, permettendo una gestione efficiente degli ospiti, delle prenotazioni e degli obblighi normativi. Dovrà inoltre garantire un'alta affidabilità e sicurezza nell'archiviazione e trasmissione dei dati.

