import postgres from 'postgres'
import { env } from '$env/dynamic/private'

// Non-superuser connection — subject to RLS policies.
// Uses $env/dynamic/private so the module is safe to import at build time.
const sql = postgres(env.APP_DATABASE_URL)

export { sql }
