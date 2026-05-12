import { json } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { JWT_SECRET } from '$env/static/private';

export async function POST({ request }) {
	const { email, password } = await request.json();
	const existing = await db.select().from(users).where(eq(users.email, email)).get();
	if (!existing) {
		return json({ error: "Email n'existe pas" }, { status: 401 });
	}
	const valid = await bcrypt.compare(password, existing.password);
	if (!valid) {
		return json({ error: 'mot de passe incorrect' }, { status: 401 });
	}
	const token = jwt.sign({ userId: existing.id }, JWT_SECRET, { expiresIn: '30d' });
	return json({ token, bankroll: existing.bankroll, name: existing.name });
}
