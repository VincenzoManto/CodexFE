import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as $ from 'jquery';
import 'pivottable';
import 'jquery-ui-sortable';
declare var google, ggchart;


@Component({
  selector: 'app-pivot',
  templateUrl: 'pivot.component.html',
  styleUrls: ['pivot.component.css']
})
export class PivotComponent implements OnInit, AfterViewInit {

  @Input() data: Array<any>;

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    google.load('visualization', '1', {packages:['corechart', 'charteditor']});
    // tslint:disable-next-line:ban
    $('#output').pivotUI(this.data, {
      cols: Object.keys(this.data[0]),
      rendererName: 'Area Chart',
      rendererOptions: { gchart: {width: 800, height: 600} },
      renderers: $.extend(
        $.pivotUtilities.renderers,
        ggchart
      )
    });

  }
}
