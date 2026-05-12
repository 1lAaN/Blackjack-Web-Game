import { json } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '$lib/server/db';
import { users, stats } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { JWT_SECRET } from '$env/static/private';

export async function POST({ request }) {
	const { email, password, name } = await request.json();
	const existingMail = await db.select().from(users).where(eq(users.email, email)).get();
	if (existingMail) {
		return json({ error: 'Email dejà utilisé' }, { status: 409 });
	}
    const existingName = await db.select().from(users).where(eq(users.name, name)).get();
    if(existingName){
        return json({error: 'Ce nom est deja pris'}, {status: 409});
    }
	const hash = await bcrypt.hash(password, 10);
	const [user] = await db.insert(users).values({ email: email, password: hash, name:name }).returning();
	await db.insert(stats).values({ userId: user.id });
	const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });

	return json({ token, bankroll: user.bankroll, name: user.name});
}
