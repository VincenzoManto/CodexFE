## Overall structure
Il framework si fonda sul classico paradigma 3-tier consistendo di un backend modulare, un frontend semimodulare ed un interfaccia a db relazionale in MySQL.
Dal core del framework si dipanano differenti possibili connessioni configurabili in runtime su definizione dell'utente.
tali connessioni cosistuiscono la rete di sorgenti di dati su cui definire le successive inquiry. Al momento tali connessioni avvengo considerando come terminale un DBMS SQLServer (quindi RDB) in locale o tramite tunnelling SSL.
Il database ha il fine ultimo di materializzare le tabelle di supporto al framework così come l'insieme di metadata e di astrazioni sulle molteplici connessioni definite dall'utente.

Il backend è codificato usando un connubio di due ambienti differenti: 
1. motore atto alla gestione delle API e la gestione delle chiamate, finalizzato quindi ad essere uno strumento flessibile utile ad interfacciarsi a differenti paradigmi di frontend (mobile, web, desktop api)
2. motore atto all'interfaccia con le sorgenti di dati, all'estrazione, all'elaborazione del dato e la sua successiva trasformazione in informazione

Il primo componente è codificato con NodeJS: nasce quindi per essere un backend di natura altamente modulare estendibile a seconda delle esigenze e delle implementazioni.
Il secondo componente è, al momento, un ambiente python modulare che, richiamato su richiesta dal backend per svolgere le suddette attività. Ogni componente può essere quindi modificato o rimosso e nuovi moduli possono essere aggiunti per ampliare il modello. Uno sviluppo utile è quello di mappare tutto ciò con un sistema flessibile di configurazione di script python.

## Design process
Il primo processo importante è il design del meta-schema: il framework necessita di avere una conoscenza sulla semantica delle entità di interesse.
1. Lo step obbligatorio è perciò quello di collegarsi ad una base di dati inserita
2. Per le entità d'interesse, inserire un nome da visualizzare ed una serie di attributi che ne possano descrivere il contenuto. Non sono necessarie frasi, quanto più una serie di tag.
3. Opzionalmente, per ogni entità è possibile descrivere singole colonne e, quindi, escludere le rimanenti. Se nessuna colonna è taggata, il framework considererà rilevanti tutti gli attributi ed è quindi autonomo nel gestire schema non completamente descritti. Possibili sviluppi sull'autoapprendimento delle colonne rilevanti.

Il secondo step è di traning: le annotazioni fornite dall'utente vengono codificate attraverso un modello fine-tuned di seq2seq e successivamente salvate: questo falicità il mapping semantico e velocizza la fase di pruning.
Il risultato è quindi un encoded schema persistente.

## Inquiry process
Il processo di inquiry ha inizio all'invio di una richiesta in natural language da parte del frontend. Il body della richiesta è composto dal messaggio e dall'id di connessione alla sorgente di dati richiesta.
1. Una volta ricevuta la richiesta, il backend provvede a valutare se il messaggio riferisca ad una richiesta di visualizzazione dei dati (DV) precedenti tramite un controllo a cascata: se non è possibile comprendere un intent di DV, si procede oltre.
1.1 nel caso in cui fosse possibile individuare l'intent di DV, si accede allo storico temporaneo dell'ultima estrazione e si procede mappando la richiesta sulla creazione di 2 tipologie di grafico (bar chart o line chart, da estendere poi con pie chart) e nell'inviduazione delle entità coinvolte (colonne/attributi) e della tipologia di operazione richiesta (grouping, counting, average, ...)
1.2 vedere 6.1 per dettagli e formato della visualizzazione
1.2 nel caso in cui non fosse possibile individuare l'intent di DV, il prompt viene passato alla fase di pruning e NQL.
2. La richiesta viene elaborata tramite sentence_transformer al fine di identificare le entità ed i topic più rilevanti nella richiesta (ad esempio "Ordini" quando la richiesta riferisce all'estrazione del venduto). Questi topic vengono codificati e gli encoding vengono comparati con l'encoded schema.
Più nello specifico, per ogni entità dell'encoded schema (encoded tables) viene calcolata una similarità con i topic estratti dalla richiesta. Tale likehood è ottenuta tramite computo della cosine distance tra le feature vector dell'encoded topic e dell'encoded table.
Una volta fatto ciò, ogni tabella ha un valore di similarità rispetto alla richiesta. Tuttavia è necessario considerare anche come i differenti collegamenti (FK) influiscano sulla necessità di includere le tabelle nello span considerato: ad esempio, posta una tabella B di bridge tra A e C, se A e C sono rilevanti per il prompt utente, anche la tabella B dovrà essere considerata come rilevante. Per far ciò si percorre il grafo della base di dati utilizzando le FK dichiarate (prerequisito è perciò che il DB sia correttamente definito) e si propagano i pesi di similarità di ogni tabella alle entità vicine smorzando l'incremento tanto più ci si allontana dalla tabella considerata, tutto ciò, per ogni tabella dello schema.
Ne ritorna un dizionario tabella-similarità che viene usato per ordinare le tabelle più rilevanti e selezionare quelle nel 75° percentile.
3. Una volta ottenuto il pruning si procede con la creazione del prompt da inviare a GPT-3 Codex. La strutturazione è semplice: viene inoltrata la richiesta utente e il pruned schema (includendo solo le colonne definite dall'utente come rilevanti oppure tutte) in formato plain-text.
Tramite chiamata alle API, si ottiene una query SQL. Si procede ad una fase di valutazione della query: viene fatto un parse del comando onde evitare codici dannosi e vengono sostituite ricerche dirette con ricerche fuzzy quale ad esempio LIKE.
4. La query viene inviata al DBMS ed eseguita. In caso di errore, il messaggio viene ripassato a GPT che provvede a tornare al punto 3. (solamente una volta). Questo permette un primo livello di self-diagnosis e self-healing.
5. Il risultato della query, se valorizzato viene inviato al primo componente del backend che provvede a completare la risposta con un post processing. Tuttavia, vengono individuate, dati i campi disponibili estratti dalla query e date le FK che caratterizzano la topologia del DB, tutte le entità visitabili data tale estrazione.
6. Il postprocessing dei dati richiama la DV, la DS e il DM.
6.1 la DV avviene non tramite NL-to-DV ma valutando le colonne più rilevanti considerando fattori statistici che le caratterizzano. Date tale colonne, viene proposto un grafico scegliendo tra bar chart, line chart, scatter chart o pie chart.
Il risultato della DV è uno pseudo-schema consistente nella definizione delle dimensioni principali del grafico e della sua visualizzazione. Uno dei tool che permette l'utilizzo di pseudo-schema estramente minimali per la generazione di chart è la lib VegaLite che, con l'appoggio della lib Altair, può essere convertita direttamente in codice html che il frontend può injectare nel template HTML della chat.
6.2 la DS avviene studiando statisticamente la tabella di risultato. Vengono evidenziate le dimensioni più rilevanti e quelle invece inifluenti. Viene data indicazione sul numero di risultati e sulla distribuzione dei valori. Viene riassunto il contenuto semantico della tabella considerando anche la richiesta inoltrata dall'utente. Vengono poi riassunti i contenuti di ogni singola colonna.
6.3 il DM avviene combinando semplici algoritmi di anomaly detection e forecast sulle time series usando la lib Prophet.
7. Risultati (raw data), il grafico, la summarization, le linked entities, le informazioni sul pruning e i risultati di DM vengono poi uniti in un unico oggetto ed inoltrati al frontend per la visualizzazione.

Appendice
Qualora si volessero esplorare le linked entities, il frontend invierà una richiesta specifica contenente il salto richiesto dall'utente (linked entity e referenced columns) e l'oggetto del salto (il record). La query verrà costruita direttamente tramite join e seguirà il medesimo percorso dal punto 4 dell'inquiry process.

## Conclusioni
Come si può vedere, il framework è in grado di operare anche in assenza di conoscenza altamente specifica su colonne e tabelle. Al fine di operare su piccole basi di dati, all'utente è richiesto solamente di definire il significato semantico dell'entità di interesse. Tuttavia, per migliorare prestazioni ed affinare i risultati, l'utente può inserire informazioni più specifiche anche per le colonne.
Si è voluto porre molto accento sulla self-diagnosis, sulla resilienza del sistema e sugli automatismi inferenziali nella DS, DV e DM. I prossimi sviluppi verteranno su rendere ancora più solido questo processo ed estrarre più informazioni inferenziali sulle annotazioni al fine di potenziare il pruning così come la visualizzazione.
Un ulteriore piccolo sviluppo sarà quello di utilizzare la conoscenza del sistema al crescere del numero di query richieste, la quale può essere usata ad esempio per delineare un mappa lite dello schema ed evidenziare quali entità sono più rilevanti e centrali.

