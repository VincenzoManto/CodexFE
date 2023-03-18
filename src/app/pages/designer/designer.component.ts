import { HttpClient } from '@angular/common/http';
import {Component, OnDestroy, OnInit} from '@angular/core';
import { NbThemeService, NbToastrService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators' ;
import { environment } from '../../../environments/environment';
import { SolarData } from '../../@core/data/solar';
import { Db } from '../../models/db.model';

interface CardSettings {
  title: string;
  iconClass: string;
  type: string;
}

@Component({
  selector: 'app-designer',
  styleUrls: ['./designer.component.scss'],
  templateUrl: './designer.component.html',
})
export class DesignerComponent implements OnDestroy, OnInit {

  private alive = true;
  db: number;
  dbs: Array<Db> = [];

  showAll = false;
  table: any;
  schema: any;
  saved = false;
  letters: Array<string> = [];
  letter = 'A';
  completeDB = false;

  constructor(private themeService: NbThemeService,
              private http: HttpClient,
              private toast: NbToastrService,
              private solarService: SolarData) {

    this.letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  }

  get showAllTruely() {
    return this.showAll || !this.table.columns?.filter(e => e.description?.trim())?.length;
  }

  changeView() {
    this.completeDB = !this.completeDB;
    if (this.completeDB) {
      this.load('');
    }
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
    await this.http.get(`${environment.codexAPI}/schema/${this.db}/${letter}`).toPromise();

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
    await this.http.get(`${environment.codexAPI}/tagging/${this.db}`).subscribe(e => {
      this.toast.success('Train completed');
    }, (err) => {
      this.toast.danger(err.message);
    });
  }

  ngOnInit() {
    this.http.get(`${environment.codexAPI}/dbs`).subscribe((e: Array<Db>) => {
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
      exTable.fullname = this.table.fullname;
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
      exTable.fullname = this.table.fullname;
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
        fullname: e.fullname || e.name,
        description: e.description,
        columns:
          this.schema.tables.find(d => d.name === e.name)?.columns.filter(d => d.description?.trim()) || [],
      })),
      fks: fks,
    };
    await this.http.post(`${environment.codexAPI}/schema/${this.db}`, tables).subscribe(e => {
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
