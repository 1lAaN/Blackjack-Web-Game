import type { Carte } from './carte';
import { Enseigne, Valeur } from './carte';

export class Main {
	cartes: Carte[] = [];

	ajouterCarte(carte: Carte) {
		this.cartes.push(carte);
	}

	calculerScore() {
		const valeurs: Record<Valeur, number> = {
			'2': 2,
			'3': 3,
			'4': 4,
			'5': 5,
			'6': 6,
			'7': 7,
			'8': 8,
			'9': 9,
			'10': 10,
			Valet: 10,
			Reine: 10,
			Roi: 10,
			As: 11
		};
		let score = 0;
		let nombreAs = 0;

		this.cartes.forEach((carte) => {
			score += valeurs[carte.valeur];
			if (carte.valeur === Valeur.As) {
				nombreAs++;
			}
		});

		while (score > 21 && nombreAs > 0) {
			score -= 10;
			nombreAs--;
		}
		return score;
	}
}
