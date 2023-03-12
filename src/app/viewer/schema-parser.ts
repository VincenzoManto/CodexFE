import Table from './table';
import { Column, ColumnFk } from './types/column';
import {
  ColumnFkSchema,
  TableSchema,
  Schema,
  ColumnSchema,
} from './types/schema';

export default function schemaParser(schema: Schema): Table[] {
  const tablesFk = new Map<TableSchema, ColumnSchema[]>();
  const tables: Table[] = [];
  schema.tables.forEach((table: TableSchema) => {
    const fks = table.columns.filter((column) => (column as ColumnFkSchema).fk);
    tablesFk.set(table, fks);
    /*for (let i = 0; i < table.columns.length; ) {
      if ((table.columns[i] as ColumnFkSchema).fk) {
        // table.columns.splice(i, 1);
      } else {
        ++i;
      }
    }*/
    tables.push(new Table(table, schema.arrangement));
  });

  schema.tables.forEach((sTable) => {
    const fks = tablesFk.get(sTable);
    fks.forEach((sFkColumn: ColumnFkSchema) => {
      const fkTable = tables.find(
        (table) => table.getName()?.toLowerCase() === sFkColumn.fk.table?.toLowerCase(),
      );
      if (fkTable) {
        const fkColumn = fkTable
          .getColumns()
          .find((column) => column.name?.toLowerCase() === sFkColumn.fk.column?.toLowerCase());
        if (fkColumn == null)
          throw new Error('fk column not found ' + fkTable.name + ' ' +
          sFkColumn.name + ' ' + sFkColumn.fk.table + ' ' + sFkColumn.fk.column);
        const cols = sTable.columns;
        const idx = cols
        .findIndex((column) => column.name?.toLowerCase() === sFkColumn.name?.toLowerCase());
        //cols.splice(idx, 1);
        const newCol = {
          name: sFkColumn.name,
          type: sFkColumn['type'],
          fk: {
            column: fkColumn,
            table: fkTable
          }
        };
        if (fkTable.name === sTable.name) {
          delete newCol.fk;
        }
        sTable.columns[idx] = newCol;
      } else {
        tables
          .find((table) => sTable.name === table.getName())
          .addColumn({
            ...sFkColumn,
          } as Column);
      }
    });
  });

  return tables;
}
