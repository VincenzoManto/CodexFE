import TableData from './table-data';
import Relation, { RelationData } from '../realtion/relation';

interface Callbacks {
  tableDblClick: (tableData: TableData) => void;
  tableClick: (tableData: TableData) => void;
  tableContextMenu: (tableData: TableData) => void;
  tableMove: (tableData: TableData) => void;
  tableMoveEnd: (tableData: TableData) => void;
  zoomIn: (zoom: number) => void;
  zoomOut: (zoom: number) => void;
  viewportClick: (x: number, y: number) => void;
  relationClick: (relationData: Relation) => void;
  relationDblClick: (relationData: RelationData) => void;
  relationContextMenu: (relationData: RelationData) => void;
}

export default Callbacks;
