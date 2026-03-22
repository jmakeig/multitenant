import { readFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import postgres from 'postgres'

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL environment variable is required')
}

// Superuser connection — bypasses RLS, used only for migrations
const sql = postgres(process.env.DATABASE_URL)

const __dirname = dirname(fileURLToPath(import.meta.url))
const migrations_dir = join(__dirname, '..', 'migrations')

async function migrate() {
	await sql.unsafe(`
		CREATE TABLE IF NOT EXISTS schema_migration (
			id         SERIAL PRIMARY KEY,
			filename   TEXT NOT NULL UNIQUE,
			applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
		)
	`)

	const applied = new Set(
		(await sql`SELECT filename FROM schema_migration`).map(r => r.filename as string)
	)

	const files = readdirSync(migrations_dir)
		.filter(f => f.endsWith('.sql'))
		.sort()

	for (const filename of files) {
		if (applied.has(filename)) {
			console.log(`skip  ${filename}`)
			continue
		}
		const content = readFileSync(join(migrations_dir, filename), 'utf8')
		await sql.begin(async tx => {
			await tx.unsafe(content)
			await tx.unsafe(`INSERT INTO schema_migration (filename) VALUES ('${filename.replace(/'/g, "''")}')`)
		})
		console.log(`apply ${filename}`)
	}

	await sql.end()
	console.log('done')
}

migrate().catch(err => {
	console.error(err)
	process.exit(1)
})
