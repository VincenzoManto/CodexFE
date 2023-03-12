import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { ChatService } from './chat.service';
import * as h337 from 'heatmap.js';
import { Db } from '../../../models/db.model';
import _ from 'lodash';
import { LocalDataSource } from 'ng2-smart-table';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrComponent } from '../../modal-overlays/toastr/toastr.component';
import { NbToastrService } from '@nebular/theme';


@Component({
  selector: 'ngx-chat',
  templateUrl: 'chat.component.html',
  styleUrls: ['chat.component.scss'],
  providers: [ ChatService ],
})
export class ChatComponent implements OnInit {

  messages: any[];
  pruningData: any;
  option: any;
  heatmap: any;
  lastMessage: string;
  dbs: Array<Db> = [];
  db: number;
  max: number;
  drawing = false;
  tableDataPoints = {};
  session: string;
  steps = [
    'Pruning',
    'Prompt',
    'Query',
    'Results',
  ];
  stepSelected = 'Pruning';
  selectedJump: any;

  constructor(
    protected chatService: ChatService,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private toast: NbToastrService) {
    this.messages = this.chatService.loadMessages();
    this.session = (Date.now()).toString();
  }

  navigate(event) {
    if (!this.selectedJump) {
      return;
    }
    const jump = _.cloneDeep(this.selectedJump);
    const values = jump.from.split('|');
    jump.value = [];
    for (const value of values) {
      jump.value.push([event.data[value]]);
    }
    this.http.post(`http://localhost:3000/navigate/${this.db}/${this.session} `, jump).subscribe((e: any) => {
      if (e.results?.length) {
        this.tablelizeResults(
          e,
          `I ${jump.sentence.toLowerCase()} ${jump['to_table_alias']} by ${jump.from.replaceAll('|', ', ')} ${jump.value.replaceAll('|', ', ')}`
        );
      } else {
        this.messages.push({
          text: 'Nothing here',
          date: new Date(),
          reply: false,
          type:  'text',
          user: {
            name: 'Bot',
          },
        });
      }
    });
  }

  randomNavigation() {
    const randomSentence = [
      'Navigate to',
      'Explore',
      'Drill down to',
      'Look up at',
      'Inspect',
    ];
    return randomSentence[Math.floor(Math.random() * randomSentence.length)];
  }

  sendMessage(event: any) {
    const files = !event.files ? [] : event.files.map((file) => {
      return {
        url: file.src,
        type: file.type,
        icon: 'nb-compose',
      };
    });

    this.messages.push({
      text: event.message,
      date: new Date(),
      reply: true,
      type: files.length ? 'file' : 'text',
      files: files,
      user: {
        name: 'You',
      },
    });

    this.lastMessage = event.message;
    if (event.message === 'd' ) {
      this.http.get('http://localhost:3000/data/' + this.session).subscribe((d: any) => {
        this.tablelizeResults(d);
      });
    } else {
      const lastIdx = this.messages.length;
      this.http.post(`http://localhost:3000/execute/${this.db}/${this.session} `, {
        message: event.message,
        step: this.steps.findIndex(e => e === this.stepSelected),
      }).subscribe((e: any) => {
        if (e.chart) {
          const table = {
            text: 'Here something',
            reply: false,
            date: new Date(),
            customMessageData: {
              chart: this.sanitizer.bypassSecurityTrustHtml(e.chart),
            },
            type: 'chart',
            user: {
              name: 'Bot',
            },
          };
          this.messages.push(table);
        } else {
          this.pruningData = [];
          const pruning = e.pruning;
          let i = 1;
          const w = 50;
          this.max = 0;
          // tslint:disable-next-line:forin
          for (const v in pruning) {
            const value = +pruning[v] * w / 1.5;
            this.max = value > this.max ? value : this.max;
            this.pruningData.push({
              x: Math.round(i / 250) * w + w * 2,
              y: (i % 250) + w * 2,
              value: value,
              radius: +pruning[v] * w * 1.5,
              name: v,
            });
            i += 100;
          }
          this.pruningData.forEach(d => {
            d.value /= this.max;
          });
          if (e.results?.length) {
            this.tablelizeResults(e);
          } else {
            this.messages.push({
              text: 'Nothing here',
              date: new Date(),
              reply: false,
              type:  'text',
              user: {
                name: 'Bot',
              },
            });
          }
        }
        this.messages.splice(lastIdx, 1);
      }, (error) => {
        this.toast.danger(error);
        this.messages[lastIdx].text = error;
      });
      this.messages.push({
        text: '',
        date: new Date(),
        reply: false,
        type:  'waiting',
        user: {
          name: 'Bot',
        },
      });
    }
  }

  tablelizeResults(res, preMessage = 'Here something') {
    const d = res.results;
    const columns = {};
    for (const e of Object.keys(d[0])) {
      columns[e] = {
        title: e,
        type: 'string',
      };
    }
    this.selectedJump = null;
    const source = new LocalDataSource();
    source.load(d);
    const jumps = res.jumps || [];
    jumps.forEach(e => {
      e.sentence = this.randomNavigation();
    });
    const table = {
      text: preMessage,
      reply: false,
      date: new Date(),
      customMessageData: {
        settings: {
          columns,
          actions: false,
        },
        source,
        jumps,
      },
      type: 'table',
      user: {
        name: 'Bot',
      },
    };
    this.messages.push(table);
  }

  draw(ev) {
    if (this.heatmap && this.drawing) {
      this.heatmap.addData({
        x: ev.layerX,
        y: ev.layerY,
        value: 0.03,
      });
    }
  }

  graphHeat() {
    setTimeout(() => {
      const gradientCfg = {
        '0': '#fff',
        '0.4': '#ffc107',
        '0.6': '#fd7e14',
        '1.0': '#dc3545',
      };
      const heatmapConfig = {
        container: document.querySelector('#heatmapContainer'),
      };

      if (!this.heatmap) {
        this.heatmap = h337.create(heatmapConfig);
      } else {
        this.heatmap.setData({data: []});
      }
      this.heatmap.setData({ max: 1, data: this.pruningData });
      setTimeout(() => {
        const canvas = document.querySelector('#heatmapContainer canvas').cloneNode(true) as HTMLCanvasElement;
        document.querySelector('#heatmapContainer').appendChild(canvas);
        const ctx = canvas.getContext('2d');
        ctx.globalCompositeOperation = 'source-over';
        for (const row of this.pruningData) {
          ctx.font = '15px Sans-serif';
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 1;
          const text = ctx.measureText(row.name);
          ctx.strokeText(row.name, row.x - text.width / 2, row.y + 7);
          ctx.fillText(row.name, row.x - text.width / 2, row.y + 7);
          this.tableDataPoints[row.name] = {
            x: row.x,
            y: row.y,
          };
        }
      }, 1000);
    }, 500);
  }

  ngOnInit() {
    this.http.get('http://localhost:3000/dbs').subscribe((e: Array<Db>) => {
      this.dbs = e;
      if (this.dbs?.length) {
        this.db = this.dbs[0]?.id;
      }
    });
  }

  resend() {
    const data = this.heatmap.getData();
    const tables = {};
    // tslint:disable-next-line:forin
    for (const table in this.tableDataPoints) {
      const point = this.tableDataPoints[table];
      const neighbours = data.data.filter(e => Math.abs(+e.x - point.x) < 3 && Math.abs(+e.y - point.y) < 3);
      tables[table] = _.sum(
        neighbours.map(e => e.value || 0),
      );
    }
  }

}



