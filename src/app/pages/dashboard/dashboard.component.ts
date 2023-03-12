import { HttpClient } from '@angular/common/http';
import {Component, OnDestroy, OnInit} from '@angular/core';
import { NbThemeService, NbToastrService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators' ;
import { SolarData } from '../../@core/data/solar';
import { Db } from '../../models/db.model';

interface CardSettings {
  title: string;
  iconClass: string;
  type: string;
}

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnDestroy, OnInit {

  private alive = true;
  db: number;
  dbs: Array<Db> = [];

  solarValue: number;
  lightCard: CardSettings = {
    title: 'Light',
    iconClass: 'nb-lightbulb',
    type: 'primary',
  };
  rollerShadesCard: CardSettings = {
    title: 'Roller Shades',
    iconClass: 'nb-roller-shades',
    type: 'success',
  };
  wirelessAudioCard: CardSettings = {
    title: 'Wireless Audio',
    iconClass: 'nb-audio',
    type: 'info',
  };
  coffeeMakerCard: CardSettings = {
    title: 'Coffee Maker',
    iconClass: 'nb-coffee-maker',
    type: 'warning',
  };

  statusCards: string;

  commonStatusCardsSet: CardSettings[] = [
    this.lightCard,
    this.rollerShadesCard,
    this.wirelessAudioCard,
    this.coffeeMakerCard,
  ];

  statusCardsByThemes: {
    default: CardSettings[];
    cosmic: CardSettings[];
    corporate: CardSettings[];
    dark: CardSettings[];
  } = {
    default: this.commonStatusCardsSet,
    cosmic: this.commonStatusCardsSet,
    corporate: [
      {
        ...this.lightCard,
        type: 'warning',
      },
      {
        ...this.rollerShadesCard,
        type: 'primary',
      },
      {
        ...this.wirelessAudioCard,
        type: 'danger',
      },
      {
        ...this.coffeeMakerCard,
        type: 'info',
      },
    ],
    dark: this.commonStatusCardsSet,
  };

  table: any;
  schema: any;
  saved = false;
  letters: Array<string> = [];
  letter = 'A';

  constructor(private themeService: NbThemeService,
              private http: HttpClient,
              private toast: NbToastrService,
              private solarService: SolarData) {

    this.letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.statusCards = this.statusCardsByThemes[theme.name];
    });

    this.solarService.getSolarData()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.solarValue = data;
      });
  }

  async changeDb() {
    if (!this.db)
      this.toast.danger('Nessun db selezionato');
    await this.load('A');
  }


  async load(letter) {
    await this.save();
    this.table = null;
    this.letter = letter;
    this.schema = null;
    const schema: any =
    await this.http.get('http://localhost:3000/schema/' + this.db + '/' + letter).toPromise();

    schema.tables.forEach((e: any) => {
      const pks = e.columns?.filter((d: { pk: any; }) => d.pk);
      const fks = e.columns?.filter((d: any) => d.fk);

      if (!fks.length)
        e.type = 'primary';
      else if (JSON.stringify(pks) === JSON.stringify(fks))
        e.type = 'crossable';
      else
        e.type = 'secondary';
    });

    this.schema = schema;
  }

  async train() {
    await this.http.get('http://localhost:3000/schema-tagging/' + this.db).subscribe(e => {
      this.toast.success('Train completed');
    }, (err) => {
      this.toast.danger(err.message);
    });
  }

  ngOnInit() {
    this.http.get('http://localhost:3000/dbs').subscribe((e: Array<Db>) => {
      this.dbs = e;
      if (this.dbs?.length) {
        this.db = this.dbs[0]?.id;
      }
    });
  }

  tableSelected(table) {
    if (this.table) {
      const exTable = this.schema.tables.find(e => e.name === this.table?.name);
      exTable.description = this.table.description;
      exTable.edited = true;
    }
    this.table = table;
    this.table.columns = this.schema.tables.find(e => e.name === this.table.name).columns;
  }

  ngOnDestroy() {
    this.alive = false;
  }

  async save() {
    if (!this.schema) {
      return;
    }
    if (this.table) {
      const exTable = this.schema.tables.find(e => e.name === this.table?.name);
      exTable.description = this.table.description;
      exTable.edited = true;
    }
    const fks = [];
    this.schema.tables.forEach(e => {
      fks.push(...e.columns.map(d => {
        if (d.fk) {
          return {
            from: e.name,
            to: d.fk.table,
            db: this.db,
          };
        }
        return null;
      }).filter(d => d));
    });
    const tables = {
      tables: this.schema.tables.filter(e => e.edited).map(e => ({
        name: e.name,
        db: +this.db,
        id: +e.id || 0,
        description: e.description,
        columns:
          this.schema.tables.find(d => d.name === e.name)?.columns.filter(d => d.description?.trim()) || [],
      })),
      fks: fks,
    };
    await this.http.post('http://localhost:3000/schema/' + this.db, tables).subscribe(e => {
      this.toast.success('Saved');
      this.schema = null;
      this.table = null;
      this.saved = true;
      this.load(this.letter);
    }, (err) => {
      this.toast.danger(err.message);
    });
  }

}
