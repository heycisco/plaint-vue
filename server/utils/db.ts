import { mkdirSync } from 'node:fs'
import { DatabaseSync } from 'node:sqlite'
import { dirname, join } from 'node:path'

export interface Complaint {
  id: number
  name: string | null
  body: string
  created_at: string
}

const globalForDb = globalThis as typeof globalThis & {
  __plaintDb?: DatabaseSync
}

type ColumnInfo = {
  name: string
  notnull: number
}

function tableColumns(db: DatabaseSync) {
  const rows = db.prepare('PRAGMA table_info(complaints)').all() as ColumnInfo[]
  return rows.map(row => row.name)
}

function columnInfo(db: DatabaseSync) {
  return db.prepare('PRAGMA table_info(complaints)').all() as ColumnInfo[]
}

function rebuildComplaintsTable(db: DatabaseSync) {
  const columns = tableColumns(db)

  let selectName = 'NULL'
  if (columns.includes('name') && columns.includes('title')) {
    selectName = `NULLIF(TRIM(COALESCE(NULLIF(TRIM(name), ''), NULLIF(TRIM(title), ''))), '')`
  }
  else if (columns.includes('name')) {
    selectName = `NULLIF(TRIM(name), '')`
  }
  else if (columns.includes('title')) {
    selectName = `NULLIF(TRIM(title), '')`
  }

  db.exec('PRAGMA foreign_keys = OFF')
  db.exec(`
    CREATE TABLE complaints_next (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      body TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    )
  `)
  db.exec(`
    INSERT INTO complaints_next (id, name, body, created_at)
    SELECT id, ${selectName}, body, created_at
    FROM complaints
  `)
  db.exec('DROP TABLE complaints')
  db.exec('ALTER TABLE complaints_next RENAME TO complaints')
  db.exec('PRAGMA foreign_keys = ON')
}

function migrateSchema(db: DatabaseSync) {
  const columns = tableColumns(db)

  if (!columns.length) {
    return
  }

  const nameColumn = columnInfo(db).find(column => column.name === 'name')
  const needsRebuild = columns.includes('title')
    || !nameColumn
    || nameColumn.notnull === 1

  if (!needsRebuild) {
    return
  }

  if (columns.includes('title') && !columns.includes('name')) {
    db.exec(`ALTER TABLE complaints ADD COLUMN name TEXT NOT NULL DEFAULT ''`)
    db.exec(`UPDATE complaints SET name = title WHERE TRIM(name) = '' AND TRIM(title) != ''`)
  }

  rebuildComplaintsTable(db)
}

function openDatabase() {
  const dbPath = join(process.cwd(), 'data', 'plaint.sqlite')
  mkdirSync(dirname(dbPath), { recursive: true })

  const db = new DatabaseSync(dbPath)
  db.exec('PRAGMA journal_mode = WAL')
  db.exec(`
    CREATE TABLE IF NOT EXISTS complaints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      body TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    )
  `)

  migrateSchema(db)

  return db
}

export function useDatabase() {
  if (!globalForDb.__plaintDb) {
    globalForDb.__plaintDb = openDatabase()
  }

  return globalForDb.__plaintDb
}

export function listComplaints(): Complaint[] {
  const rows = useDatabase()
    .prepare('SELECT id, name, body, created_at FROM complaints ORDER BY id DESC')
    .all()

  return rows as unknown as Complaint[]
}

export function createComplaint(name: string | null, body: string): Complaint {
  const row = useDatabase()
    .prepare(
      `INSERT INTO complaints (name, body) VALUES (?, ?)
       RETURNING id, name, body, created_at`
    )
    .get(name, body)

  return row as unknown as Complaint
}

export function deleteComplaint(id: number): boolean {
  const result = useDatabase()
    .prepare('DELETE FROM complaints WHERE id = ?')
    .run(id)

  return result.changes > 0
}