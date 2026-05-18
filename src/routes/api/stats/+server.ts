import { json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { db } from '$lib/server/db';
import {users, stats } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { JWT_SECRET } from '$env/static/private';

export async function GET({ request }) {
    const authHeader = request.headers.get('Authorization')
    if(!authHeader){
        return json({error: 'non Autorisé'}, {status: 401});
    }
    const token = authHeader.split(' ')[1];

    try {
       const payload = jwt.verify(token, JWT_SECRET) as {userId: number}; 
       const userStats = await db.select().from(stats).where(eq(stats.userId, payload.userId)).get()
       const existing = await db.select().from(users).where(eq(users.id, payload.userId)).get();
       return json({userStats, user: existing})
    } catch (error) {
        return json({error: 'Token invalid'}, {status: 401});
        
    }
   
}