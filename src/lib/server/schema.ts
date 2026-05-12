import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull().unique(),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
	bankroll: real('bankroll').notNull().default(1000),
	createdAt: text('created_at').notNull().default(new Date().toISOString())
});

export const stats = sqliteTable('stats', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: integer('user_id').notNull().references(() => users.id),
	partiesJouees: integer('parties_jouees').notNull().default(0),
	victoires: integer('victoires').notNull().default(0),
	defaites: integer('defaites').notNull().default(0),
	egalites: integer('egalites').notNull().default(0),
	blackjacks: integer('blackjacks').notNull().default(0),
	argentGagne: real('argent_gagne').notNull().default(0),
	argentPerdu: real('argent_perdu').notNull().default(0)
});
