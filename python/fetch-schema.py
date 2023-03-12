import pymssql
import json

class Object(object):
  pass

conn = pymssql.connect('192.168.173.204', 'sa', 'Stark.99', "Next_4S_DB")
cursor = conn.cursor(as_dict=True)

cursor.execute("""SELECT  top(200)	column_name, table_name, data_type, A.REF as ref_table, A.REFCOLNAME as ref_column FROM
INFORMATION_SCHEMA.COLUMNS
left join (SELECT
OBJECT_NAME(parent_object_id) PARENT,
c.NAME COLNAME,
OBJECT_NAME(referenced_object_id) REF,
cref.NAME REFCOLNAME
FROM
sys.foreign_key_columns fkc
INNER JOIN
sys.columns c
   ON fkc.parent_column_id = c.column_id
      AND fkc.parent_object_id = c.object_id
INNER JOIN
sys.columns cref
   ON fkc.referenced_column_id = cref.column_id
      AND fkc.referenced_object_id = cref.object_id ) A on PARENT = table_name and COLNAME = column_name
	  where table_name not like '[_]%'
	  order by TABLE_NAMe
""")

cols = {}
for row in cursor:
  if (row['table_name'] not in cols):
    cols[row['table_name']] = {}
    cols[row['table_name']]['columns'] = []
  newCol = {}
  newCol['name'] = row['column_name']
  newCol['type'] = row['data_type']
  if (row['ref_table'] is not None):
    newCol['fk'] = {}
    newCol['fk']['table'] = row['ref_table']
    newCol['fk']['column'] = row['ref_column']
  cols[row['table_name']]['columns'].append(newCol)

print(json.dumps(cols))
conn.close()


