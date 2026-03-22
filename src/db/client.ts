import postgres from 'postgres'

if (!process.env.APP_DATABASE_URL) {
	throw new Error('APP_DATABASE_URL environment variable is required')
}

// Non-superuser connection — subject to RLS policies
const sql = postgres(process.env.APP_DATABASE_URL)

export { sql }
