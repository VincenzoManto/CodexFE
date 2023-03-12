import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, AfterViewInit, Output, Input, EventEmitter } from '@angular/core';
import DbViewer, { TableClickEvent } from '../../viewer';
import Table from '../../viewer/table';
import TableData from '../../viewer/types/table-data';

@Component({
  selector: 'app-db',
  templateUrl: './db.component.html',
  styleUrls: ['./db.component.scss']
})
export class DBComponent implements AfterViewInit {
  title = 'firsttry';
  dbViewer?: DbViewer;
  @ViewChild('dbViewer') viewer?: any;
  @Input() set schema(value) {
    this.dbViewer = null;
    this.dbViewer = new DbViewer();
    this.dbViewer.schema = value;
    this.dbViewer.setAttribute('style', 'height:100vh');

    this.dbViewer.addEventListener('tableClick', (ev) => {
      this.table = ev.detail;
      this.tableSelected.emit(this.table);
    }, false);
    this.dbViewer.addEventListener('relationClick', (ev) => {
      ev.detail.changeInclude(!ev.detail.included);
    });
  }
  @Output() tableSelected = new EventEmitter();

  table: TableData;

  constructor(private http: HttpClient) {

  }

  async ngAfterViewInit() {
    if (!this.viewer) {
      return;
    }
    this.viewer.nativeElement.append(this.dbViewer);

  }

  load() {
    setTimeout(() => {
      const tables = this.viewer.nativeElement.querySelectorAll('foreignObject');
      for (const table of tables) {
        if (Math.random() > 0.6)
          table.classList.add('secondary');
        else if (Math.random() > 0.5)
          table.classList.add('primary');
        table.setAttribute('height', +(table.getAttribute('height') || 0) + 20);
      }
    }, 100);
  }

  moved() {

  }
}
