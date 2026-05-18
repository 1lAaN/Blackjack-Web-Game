import { json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { db } from '$lib/server/db';
import { users, stats } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { JWT_SECRET } from '$env/static/private';

export async function GET({ request }) {
	const authHeader = request.headers.get('Authorization');
	if (!authHeader) {
		return json({ error: 'non Autorisé' }, { status: 401 });
	}
	const token = authHeader.split(' ')[1];

	try {
		const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
		const userStats = await db.select().from(stats).where(eq(stats.userId, payload.userId)).get();
		const existing = await db.select().from(users).where(eq(users.id, payload.userId)).get();
		return json({ userStats, user: existing });
	} catch (error) {
		return json({ error: 'Token invalid' }, { status: 401 });
	}
}

export async function POST({ request }) {
	const authHeader = request.headers.get('Authorization');
	if (!authHeader) {
		return json({ error: 'non Autorisé' }, { status: 401 });
	}
	const token = authHeader.split(' ')[1];

	try {
		const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
		const body = await request.json();
		const userStats = await db.select().from(stats).where(eq(stats.userId, payload.userId)).get();
		const addVictoires =
			body.resultat === 'gagne' ? userStats.victoires + 1 : userStats.victoires;
		const addDefaite = 
            body.resultat === 'perdu' ? userStats.defaites + 1 : userStats.defaites;
        const addEgalite = 
            body.resultat === 'egalite' ? userStats.egalites + 1 : userStats.egalites;
        const addPartie = 
            userStats.partiesJouees + 1 ;
        const addBlackjack = 
            body.raison === 'blackjackJoueur' ? userStats.blackjacks + 1 : userStats.blackjacks;
        const addArgentGagne = 
            body.resultat === 'gagne' ? userStats.argentGagne + body.mise : userStats.argentGagne;
        const addArgentPerdu = 
            body.resultat === 'perdu' ? userStats.argentPerdu + body.mise : userStats.argentPerdu;
        await db.update(stats).set({
            victoires: addVictoires,
            defaites: addDefaite,
            egalites: addEgalite,
            partiesJouees: addPartie,
            blackjacks: addBlackjack,
            argentGagne: addArgentGagne,
            argentPerdu: addArgentPerdu, 
        }).where(eq(stats.userId, payload.userId));
        return json({ok:true});
        
	} catch (error) {
		return json({ error: 'Token invalid' }, { status: 401 });
	}
}
