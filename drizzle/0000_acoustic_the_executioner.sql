CREATE TABLE `stats` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`parties_jouees` integer DEFAULT 0 NOT NULL,
	`victoires` integer DEFAULT 0 NOT NULL,
	`defaites` integer DEFAULT 0 NOT NULL,
	`egalites` integer DEFAULT 0 NOT NULL,
	`blackjacks` integer DEFAULT 0 NOT NULL,
	`argent_gagne` real DEFAULT 0 NOT NULL,
	`argent_perdu` real DEFAULT 0 NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`bankroll` real DEFAULT 1000 NOT NULL,
	`created_at` text DEFAULT '2026-05-09T15:24:34.456Z' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);