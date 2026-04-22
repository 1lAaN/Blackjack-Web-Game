export enum Enseigne {
	Pique = 'pique',
	Coeur = 'coeur',
	Carreau = 'carreau',
	Trefle = 'trefle'
}

export enum Valeur {
	Deux = '2',
	Trois = '3',
	Quatre = '4',
	Cinq = '5',
	Six = '6',
	Sept = '7',
	Huit = '8',
	Neuf = '9',
	Dix = '10',
	Valet = 'Valet',
	Reine = 'Reine',
	Roi = 'Roi',
	As = 'As'
}

export interface Carte {
	enseigne: Enseigne;
	valeur: Valeur;
}
