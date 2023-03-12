export class Db {
  id: number;
  name: string;
  server: string;
  port: number;
  username: string;
  password: string;
  type: 'mysql' | 'mssql' | 'oracle';
}
