import type { Carte } from './carte';
import { Enseigne, Valeur } from './carte';

export class Pioche {
	cartes: Carte[] = [];

	constructor() {
		this.generer();
		this.melanger();
	}

	generer() {
		Object.values(Enseigne).forEach((enseigne) => {
			Object.values(Valeur).forEach((valeur) => {
				const maCarte: Carte = {
					enseigne: enseigne,
					valeur: valeur
				};
				this.cartes.push(maCarte);
			});
		});
	}

	melanger() {
		const length = this.cartes.length;
		for (let i = length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[this.cartes[i], this.cartes[j]] = [this.cartes[j], this.cartes[i]];
		}
	}

	piocher(): Carte {
		if (this.cartes.length === 0) {
			throw new Error('La Pioche est vide !');
		}
		return this.cartes.pop()!;
	}
}
