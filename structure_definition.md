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

Il secondo step è di traning: l'annotazione delle entità viene encoded attraverso un modello fine-tuned di seq2seq e salvato persistentemente come annotazione dello schema: questo falicità il mapping semantico e velocizza la fase di pruning.
