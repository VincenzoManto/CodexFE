import { HttpClient } from '@angular/common/http';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { environment } from '../../../../environments/environment';
import { Db } from '../../../models/db.model';
import { saveAs } from 'file-saver';
import _ from 'lodash';

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
  @ViewChild('schema') template: TemplateRef<any>;;

  constructor(
    private toast: NbToastrService,
    private http: HttpClient,
    private dialo: NbDialogService
  ) {}

  ngOnInit() {
    this.http.get(`${environment.codexAPI}/dbs`).subscribe((e: Array<Db>) => {
      this.dbs = e;
    });
  }

  downLoadFile(data: any, type: string) {
    let blob = new Blob([data], { type: type});
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
        alert( 'Please disable your Pop-up blocker and try again.');
    }
  }

  pptx() {
    const cards = this.structure.filter(e => e.title?.trim() && e.query?.trim());
    if (cards?.length) {
      this.http.post(`${environment.codexAPI}/pptx/${this.db} `, {
        queries: cards.map(e => e.query),
        titles: cards.map(e => e.title)
      }, {responseType: 'blob'}).subscribe((data: any) => {
        var fileName = "report.pptx";


        saveAs(data, fileName);
        this.toast.success('Here a gift for you', 'Gift 🎁')
        //this.downLoadFile(e, 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
      });
    } else {
      this.toast.info('You probably need to give a title to cards', 'Hmm...');
    }
  }

  submit() {
    const prompt = _.clone(this.prompt);
    this.prompt = '';
    this.http.post(`${environment.codexAPI}/dashboard/${this.db} `, {
      message: prompt
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
        let colIdx = e.pos || this.structure.findIndex(e => e.selected);
        colIdx = this.transform(colIdx);
        if (isNaN(colIdx) || colIdx >= this.structure.length  || colIdx < 0) {
          this.error = 'Your column seems to be inexistent. Try write ordinal position as \"1st\"';
          return;
        } else {
          const col = this.structure[colIdx];
          if (['enlarge', 'wider', 'large', 'expand'].includes(e.action)) {
            if (col.class < 12)
              col.class++;
            else {
              this.error = 'It cannot be wider';
              return;
            }
          } else if (['shrinken', 'smaller', 'small', 'reduce'].includes(e.action)) {
            if (col.class > 1)
              col.class--;
            else {
              this.error = 'It cannot be smaller';
              return;
            }
          }
        }
      } else if (e.intent === 'delete') {
        let colIdx = e.pos || this.structure.findIndex(e => e.selected);
        colIdx = this.transform(colIdx);
        if (isNaN(colIdx) || colIdx >= this.structure.length || colIdx < 0) {
          this.error = 'Your column seems to be inexistent';
          return;
        } else {
          this.structure.splice(colIdx, 1);
        }
      } else if (e.intent === 'create') {
        const queries = e.queries.filter(e => e && e.toLowerCase().includes('select'));
        let cx;
        this.structure = queries.map((e, i) => {
          cx = (i % 2 === 0) ? Math.round(3 + Math.random() * 5) : (12 - cx);
          const query = e.trim().replace(/^\_+/g, '').replaceAll(/\\\w|\n/gi,'');
          return {
            class: cx,
            prompt: query,
            query
          }
        });
      } else if (e.intent === 'presentation') {
        this.pptx();
      } else if (e.intent === 'schema') {
        this.dialo.open(this.template);
      }
    }, (err) => {
      this.toast.warning('The service is currently loading, but you can retry', 'Hey, wait please');
    });
  }

  select(col) {
    this.structure.forEach(e => e.selected = false);
    col.selected = true;
  }

  transform(idx) {
    switch (idx) {
      case 'first':
        return 0;
      case 'second':
        return 1;
      case 'third':
        return 2;
      case 'fourth':
        return 3;
      case 'last':
        return this.structure.length - 1;
      case 'second last':
        return this.structure.length - 2;
      default:
        return (parseInt(idx) || 0) - 1;
    }
  }

}
