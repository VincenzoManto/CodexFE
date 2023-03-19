import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { environment } from '../../../../environments/environment';
import { Db } from '../../../models/db.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent {

  structure = [];
  prompt: string;
  error: string;
  dbs = [];
  db: number;

  constructor(
    private toast: NbToastrService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.http.get(`${environment.codexAPI}/dbs`).subscribe((e: Array<Db>) => {
      this.dbs = e;
    });
  }

  submit() {
    this.http.post(`${environment.codexAPI}/dashboard/${this.db} `, {
      message: this.prompt
    }).subscribe((e: any) => {
      if (e.intent === 'add') {
        switch (e.size) {
          case 'large':
            this.structure.push({
              class: 6
            });
            break;
          case 'entire':
            this.structure.push({
              class: 12
            });
            break;

          case 'small':
            this.structure.push({
              class: 2
            });
            break;
          default:
            this.structure.push({
              class: 3
            });
            break;
        }
      } else if (e.intent === 'modify') {
        const colIdx = this.structure.findIndex(e => e.selected);
        if (isNaN(colIdx) || colIdx >= this.structure.length  || colIdx < 0) {
          this.error = 'Your column seems to be inexistent';
          return;
        } else {
          const col = this.structure[colIdx];
          if (['enlarge', 'wider', 'large'].includes(e.action)) {
            if (col.class < 12)
              col.class++;
            else {
              this.error = 'It cannot be wider';
              return;
            }
          } else if (['shrinken', 'smaller', 'small'].includes(e.action)) {
            if (col.class > 1)
              col.class--;
            else {
              this.error = 'It cannot be smaller';
              return;
            }
          }
        }
      } else if (e.intent === 'delete') {
        const colIdx =  this.structure.findIndex(e => e.selected);
        if (isNaN(colIdx) || colIdx >= this.structure.length || colIdx < 0) {
          this.error = 'Your column seems to be inexistent';
          return;
        } else {
          this.structure.splice(colIdx, 1);
        }
      } else if (e.intent === 'create') {
        const queries = e.queries;
        let cx;
        this.structure = queries.map((e, i) => {
          cx = (i % 2 === 0) ? Math.round(3 + Math.random() * 5) : (12 - cx);
          return {
            class: cx,
            prompt: e.prompt
          }
        });
      }
      this.prompt = '';
    }, (err) => {
      this.toast.warning('The service is currently loading, but you can retry');
    });
  }

  select(col) {
    this.structure.forEach(e => e.selected = false);
    col.selected = true;
  }

}
