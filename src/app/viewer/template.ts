import css from "./style.css";
import template from "./template.html";

export default `
<style>

:host {
  display: block;
  overflow: hidden;
}

#viewer-container {
  height: 100%;
  position: relative;

  background-color: #ccc;
  overflow: auto;

  -moz-user-select: none !important;
  -o-user-select: none !important;
  -khtml-user-select: none !important;
  -webkit-user-select: none !important;
  -ms-user-select: none !important;
  user-select: none !important;

  touch-action: none;
}

#viewer-container #minimap {
  border-style: solid;
  border-width: 1px;
  border-color: #666;
  background-color: var(--viewer-background-color, #e3ebed);
  margin-bottom: 5px;
  display: block;
}

#viewer-container #minimap #viewpoint {
  fill: none;
  stroke-width: 10;
  stroke: black;
}

#viewer-container #minimap-container {
  left: 10px;
  bottom: 18px;
  width: 100px;
  position: absolute;
}

#viewer-container #minimap-container #minimap .mini_table {
  fill: var(--table-boarder-color);
  stroke-width: 10;
  stroke: black;
  float: left;
}

#viewer-container #minimap-container #btn-container {
  display: flex;
}

#viewer-container #minimap-container #btn-container button {
  height: 30px;
  margin-bottom: 5px;
  padding: 1px;
  font-size: 1.2em;
  float: left;
  width: 50%;
}

#viewer-container #minimap-container #btn-container #btn-zoom-in {
  margin-right: 4px;
}

#viewer-container .svg-container {
  overflow: auto;
  width: 100%;
  height: 100%;
}

#viewer {
  user-select: none;
  cursor: default;
  display: block;
  background-color: var(--viewer-background-color, #e3ebed);
}

#viewer.pan {
  cursor: grabbing;
}

.tableGroup {
  stroke: #707070;
}

.table {
  background-color: white;
  min-width: 100px;
  border-collapse: collapse;
  width: 110%;
  border-bottom: 2px solid var(--table-boarder-color);
  border-left: 2px solid var(--table-boarder-color);
  border-right: 2px solid var(--table-boarder-color);
}

.table.move {
  cursor: move;
}

.circle {
  background: #f4f6fa;
  border-radius: 50%;
  width: 14px;
  text-align: center;
  height: 14px;
  font-size: 9px;
  display: inline-block;
  padding: 0px;
  line-height: 1.8;
  font-style: normal;
}

.full {
  background: #112;
  color: #bcd !important;
}

.table tr {
  border-bottom: 1px solid #bbb;
}

.table thead {
  background-color: var(--table-boarder-color);
}

.table thead tr th {
  font-size: 1.2em;
  vertical-align:middle;
  padding: 5px;
  color: white;
}

foreignObject {
  cursor: pointer;
  border-radius: 5px;
  box-shadow: 0px 0px 7px #4465;
  padding-right: 10px;
  transition: 0.5s transform;
}

foreignObject:hover {
  border: 2px solid var(--relation-color)
}

.table.primary th {
  color: white !important;
}

.table td {
  padding: 5px;
  padding-left: 10px;
  padding-right: 10px;
}

.table td.status {
  width: 20px;
  height: 20px;
  padding: 0;
}

.table td.status div {
  width: 14px;
  height: 14px;
  margin-left: 7px;
  background-size: contain;
}

.table td.status .pk {
  /*background-image: url(./asset/pk.svg);*/
}

.table td.status .fk {
  /*background-image: url(./asset/fk.svg);*/
}

path {
  stroke-width: 1;
  stroke: var(--relation-color, #666);
  fill: none;
}

path:not(.included) {
  stroke: lightgrey;
}

.pathHover {
  stroke-width: 2;
  stroke: var(--relation-color-highlight, black);
}

.fromRelation {
  background-color: lightgreen;
}

.toRelation {
  background-color: lightcoral;
}

.highlight {
  stroke-width: 12;
  stroke: transparent;
}

@media print {
  .table {
    border-top: 2px solid var(--table-boarder-color);
  }
  :host {
    border: 1px solid #333;
  }
}

path {
  stroke-width: 2px;
}


table {
  border-radius: 7px;
  border: none !important;
}

* {
  --table-boarder-color: #bcd;
  --relation-color: #88a3;
  font-family: 'Prompt', sans-serif;
  color: #446!important;
  font-size: 11px;
  transition: background 0.5s;
}

tbody tr {
  border: 0px !important;
}

thead {
  border-radius: 7px 7px 0px 0px;
}

thead tr {
  border: 0px !important;
}

table tr td.status div {
  display: none;
}


.svg-container {
  overflow: hidden !important;
}

tr.toRelation {
  color: #fff !important;
  background: #f30 !important;
}

tr.toRelation td {
  color: #fff !important;
}

tbody:after {
  height: 5px;
  background: #bcd;
}

tr:nth-child(even) {
  background: #eaf3ff;
}

path.highlight {
  opacity: 0;
}
path:hover {
  stroke-width: 4px;
}

tbody {
  border-bottom: 10px solid #bcd;
}

thead tr th {
  position: relative;
}


.primary tbody {
  border-color: rgb(255, 51, 122);
}

.primary  tr:nth-child(even) {
  background: rgba(255, 51, 122, 0.2);
}

.primary thead {
  background: rgb(255, 51, 122);
}


.secondary tbody {
  border-color: rgb(255, 163, 51);
}

.secondary  tr:nth-child(even) {
  background: rgba(255, 163, 51, 0.2);
}

.secondary thead {
  background: rgb(255, 163, 51);
}


.crossable tbody {
  border-color: rgb(164, 255, 51);
}

.crossable  tr:nth-child(even) {
  background: rgba(164, 255, 51, 0.2);
}

.crossable thead {
  background: rgb(164, 255, 51);
}


</style>
<div id="viewer-container">
  <div class="svg-container">
    <svg id="viewer" version="2" baseProfile="full" xmlns="http://www.w3.org/2000/svg">
    </svg>
  </div>
  <div id="minimap-container" style="display:none">
    <svg id="minimap" version="2" baseProfile="full" xmlns="http://www.w3.org/2000/svg">
      <rect id="viewpoint"></rect>
    </svg>
    <div id="btn-container">
      <button id="btn-zoom-in">+</button>
      <button id="btn-zoom-out">-</button>
    </div>
  </div>
</div>

`;
