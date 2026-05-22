import { json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { db } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { JWT_SECRET } from '$env/static/private';
import bcrypt from 'bcrypt';

export async function PATCH({ request }) {
	const authHeader = request.headers.get('Authorization');
	if (!authHeader) {
		return json({ error: 'non Autorisé' }, { status: 401 });
	}
	const token = authHeader.split(' ')[1];
	try {
		const body = await request.json();
		const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
		if (body.name) {
			const existingName = await db.select().from(users).where(eq(users.name, body.name)).get();
			if (existingName) {
				return json({ error: 'Ce nom est deja pris' }, { status: 409 });
			}
			await db.update(users).set({ name: body.name }).where(eq(users.id, payload.userId));
			return json({ ok: true });
		}

		if (body.password) {
            const currentUser = await db.select().from(users).where(eq(users.id, payload.userId)).get();
            const valid = await bcrypt.compare(body.oldPassword, currentUser.password);
            if(!valid){
                return json({error: 'Mot de de passe incorrect'}, {status: 401});
            }
            const newPassword = await bcrypt.hash(body.password, 10);
            await db.update(users).set({password: newPassword}).where(eq(users.id, payload.userId));
            return json({ok: true});
			
		}
	} catch (error) {
		return json({ error: 'Token invalid' }, { status: 401 });
	}
}
