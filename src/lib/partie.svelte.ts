import { Pioche } from './pioche';
import { Main } from './main.svelte';

enum etatPartie {
	Mise = 'mise',
	tourJoueur = 'tourJoueur',
	tourDealer = 'tourDealer',
	Termine = 'termine'
}

enum resultat {
	Gagne = 'gagne',
	Perdu = 'perdu',
	Egalite = 'egalite'
}

enum raison {
	bustJoueur = 'bustJoueur',
	bustDealer = 'bustDealer',
	blackjackJoueur = 'blackjackJoueur',
	blackjackDealer = 'blackjackDealer',
	dealerScore = 'dealerScore',
	joueurScore = 'joueurScore'
}

export class Partie {
	etat = $state(etatPartie.Mise);
	resultat = $state<resultat | undefined>(undefined);
	raison = $state<raison | undefined>(undefined);
	resultatSplit = $state<resultat | undefined>(undefined);
	raisonSplit = $state<raison | undefined>(undefined);
	bankroll = $state(1000);
	mainJoueur = $state(new Main());
	mainDealer = $state(new Main());
	mainSplit = $state<Main | undefined>(undefined);
	mainJouee = $state(true);
	pioche = $state(new Pioche());
	mise = $state(0);
	mainJoueurBust = false;
	mainSplitBust = false;

	distribuer() {
		this.mainDealer.ajouterCarte(this.pioche.piocher());
		this.mainJoueur.ajouterCarte(this.pioche.piocher());
		this.mainDealer.ajouterCarte(this.pioche.piocher());
		this.mainJoueur.ajouterCarte(this.pioche.piocher());
		this.etat = etatPartie.tourJoueur;

		if (this.mainDealer.calculerScore() === 21 && this.mainJoueur.calculerScore() === 21) {
			this.etat = etatPartie.Termine;
			this.resultat = resultat.Egalite;
		} else if (this.mainJoueur.calculerScore() === 21) {
			this.jouerDealer();
		} else if (this.mainDealer.calculerScore() === 21) {
			this.etat = etatPartie.Termine;
			this.resultat = resultat.Perdu;
			this.bankroll -= this.mise;
			this.raison = raison.blackjackDealer;
		}
	}

	miser(montant: number) {
		if (montant >= 1 && montant <= this.bankroll) {
			this.mise = montant;
			this.distribuer();
		}
	}

	hit() {
		if (this.mainJouee === true) {
			this.mainJoueur.ajouterCarte(this.pioche.piocher());
			if (!this.mainSplit) {
				if (this.mainJoueur.calculerScore() == 21) {
					this.etat = etatPartie.tourDealer;
					this.jouerDealer();
				} else if (this.mainJoueur.calculerScore() > 21) {
					this.bankroll -= this.mise;
					this.resultat = resultat.Perdu;
					this.etat = etatPartie.Termine;
					this.raison = raison.bustJoueur;
				} else {
					this.etat = etatPartie.tourJoueur;
				}
			} else {
				if (this.mainJoueur.calculerScore() == 21) {
					this.mainJouee = false;
					this.etat = etatPartie.tourJoueur;
				} else if (this.mainJoueur.calculerScore() > 21) {
					this.bankroll -= this.mise;
					this.mainJouee = false;
					this.etat = etatPartie.tourJoueur;
					this.mainJoueurBust = true;
					this.resultat = resultat.Perdu;
					this.raison = raison.bustJoueur;
				}
			}
		} else {
			if (this.mainSplit) {
				this.mainSplit.ajouterCarte(this.pioche.piocher());
				if (this.mainSplit.calculerScore() == 21) {
					this.etat = etatPartie.tourDealer;
					this.jouerDealer();
				} else if (this.mainSplit.calculerScore() > 21) {
					this.bankroll -= this.mise;
					this.mainSplitBust = true;
					this.resultatSplit = resultat.Perdu;
					this.raisonSplit = raison.bustJoueur;
					this.jouerDealer();
				} else {
					this.etat = etatPartie.tourJoueur;
				}
			}
		}
	}

	stand() {
		if (this.mainSplit) {
			if (this.mainJouee === true) {
				this.mainJouee = false;
			} else {
				this.etat = etatPartie.tourDealer;
				this.jouerDealer();
			}
		} else {
			this.etat = etatPartie.tourDealer;
			this.jouerDealer();
		}
	}

	split() {
		this.mainSplit = new Main();
		this.mainSplit.ajouterCarte(this.mainJoueur.cartes[1]);
		this.mainJoueur.cartes.pop();
		this.mainJoueur.ajouterCarte(this.pioche.piocher());
		this.mainSplit.ajouterCarte(this.pioche.piocher());
	}

	peutSplitter() {
		if (this.etat !== etatPartie.Termine) {
			if (
				this.mainJoueur.cartes.length === 2 &&
				this.mainJoueur.cartes[0].valeur === this.mainJoueur.cartes[1].valeur
			) {
				return true;
			} else {
				return false;
			}
		}
	}

	jouerDealer() {
		while (this.mainDealer.calculerScore() < 17) {
			this.mainDealer.ajouterCarte(this.pioche.piocher());
		}
		this.resoudre();
	}

	resoudre() {
		if (!this.mainSplitBust) {
			if (this.mainSplit) {
				if (this.mainSplit.cartes.length === 2 && this.mainSplit.calculerScore() === 21) {
					this.bankroll += this.mise * 1.5;
					this.resultatSplit = resultat.Gagne;
					this.raisonSplit = raison.blackjackJoueur;
				} else if (this.mainDealer.calculerScore() > 21) {
					this.bankroll += this.mise;
					this.resultatSplit = resultat.Gagne;
					this.raisonSplit = raison.bustDealer;
				} else if (this.mainDealer.calculerScore() < this.mainSplit.calculerScore()) {
					this.bankroll += this.mise;
					this.resultatSplit = resultat.Gagne;
					this.raisonSplit = raison.joueurScore;
				} else if (this.mainDealer.calculerScore() > this.mainSplit.calculerScore()) {
					this.bankroll -= this.mise;
					this.resultatSplit = resultat.Perdu;
					this.raisonSplit = raison.dealerScore;
				} else {
					this.resultatSplit = resultat.Egalite;
				}
			}
		}
		if (!this.mainJoueurBust) {
			if (this.mainJoueur.cartes.length === 2 && this.mainJoueur.calculerScore() === 21) {
				this.bankroll += this.mise * 1.5;
				this.resultat = resultat.Gagne;
				this.raison = raison.blackjackJoueur;
			} else if (this.mainDealer.calculerScore() > 21) {
				this.bankroll += this.mise;
				this.resultat = resultat.Gagne;
				this.raison = raison.bustDealer;
			} else if (this.mainDealer.calculerScore() < this.mainJoueur.calculerScore()) {
				this.bankroll += this.mise;
				this.resultat = resultat.Gagne;
				this.raison = raison.joueurScore;
			} else if (this.mainDealer.calculerScore() > this.mainJoueur.calculerScore()) {
				this.bankroll -= this.mise;
				this.resultat = resultat.Perdu;
				this.raison = raison.dealerScore;
			} else {
				this.resultat = resultat.Egalite;
			}
		}
		this.etat = etatPartie.Termine;
	}

	rejouer() {
		this.etat = etatPartie.Mise;
		this.mise = 0;
		this.mainDealer = new Main();
		this.mainJoueur = new Main();
		this.pioche.generer();
		this.pioche.melanger();
		this.resultat = undefined;
		this.raison = undefined;
		this.mainJouee = true;
		this.mainSplit = undefined;
		this.resultatSplit = undefined;
		this.raisonSplit = undefined;
		this.mainJoueurBust = false;
		this.mainSplitBust = false;
	}
}
