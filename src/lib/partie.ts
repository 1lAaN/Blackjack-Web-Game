import { Pioche } from './pioche';
import { Main } from './main';

enum etatPartie {
	Mise = 'mise',
	tourJoueur = 'tourJoueur',
	tourDealer = 'tourDealer',
	Termine = 'termine'
}

export class Partie {
	etat: etatPartie;
	pioche: Pioche;
	mainJoueur: Main;
	mainDealer: Main;
	mise = 0;
	bankroll = 1000;

	constructor() {
		this.mainDealer = new Main();
		this.mainJoueur = new Main();
		this.pioche = new Pioche();
		this.etat = etatPartie.Mise;
	}
	distribuer() {
		this.mainDealer.ajouterCarte(this.pioche.piocher());
		this.mainJoueur.ajouterCarte(this.pioche.piocher());
		this.mainDealer.ajouterCarte(this.pioche.piocher());
		this.mainJoueur.ajouterCarte(this.pioche.piocher());
		this.etat = etatPartie.tourJoueur;
	}

	miser(montant: number) {
		if (montant >= 1 && montant <= this.bankroll) {
			this.mise = montant;
			this.distribuer();
		}
	}

	hit() {
		this.mainJoueur.ajouterCarte(this.pioche.piocher());
		if (this.mainJoueur.calculerScore() == 21) {
			this.etat = etatPartie.tourDealer;
		} else if (this.mainJoueur.calculerScore() > 21) {
			this.etat = etatPartie.Termine;
		} else {
			this.etat = etatPartie.tourJoueur;
		}
	}

	stand() {
		this.etat = etatPartie.tourDealer;
	}

	jouerDealer() {
		while (this.mainDealer.calculerScore() < 17) {
			this.mainDealer.ajouterCarte(this.pioche.piocher());
		}
		this.resoudre();
	}

	resoudre() {
		if (this.mainDealer.calculerScore() > 21) {
			this.bankroll += this.mise;
		} else if (this.mainDealer.calculerScore() < this.mainJoueur.calculerScore()) {
			this.bankroll += this.mise;
		} else if (this.mainDealer.calculerScore() > this.mainJoueur.calculerScore()) {
			this.bankroll -= this.mise;
		}
		this.etat = etatPartie.Termine;
	}

    rejouer(){
        this.etat = etatPartie.Mise
        this.mise = 0 
        this.mainDealer = new Main()
        this.mainJoueur = new Main()
        this.pioche.generer()
        this.pioche.melanger()
    }
}