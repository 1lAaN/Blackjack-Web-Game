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

enum raison{
	bustJoueur = "bustJoueur",
	bustDealer = "bustDealer",
	blackjackJoueur = "blackjackJoueur",
	blackjackDealer = "blackjackDealer",
	dealerScore = "dealerScore",
	joueurScore = "joueurScore"

}

export class Partie {
	etat = $state(etatPartie.Mise);
	resultat = $state<resultat | undefined>(undefined);
	raison = $state<raison | undefined>(undefined);
	bankroll = $state(1000);
	mainJoueur = $state(new Main());
	mainDealer = $state(new Main());
	pioche = $state(new Pioche());
	mise = $state(0);

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
			this.raison = raison.blackjackDealer
		}
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
			this.jouerDealer()
		} else if (this.mainJoueur.calculerScore() > 21) {
			this.bankroll -= this.mise;
			this.resultat = resultat.Perdu;
			this.etat = etatPartie.Termine;
			this.raison = raison.bustJoueur
		} else {
			this.etat = etatPartie.tourJoueur;
		}
	}

	stand() {
		this.etat = etatPartie.tourDealer;
		this.jouerDealer();
	}

	jouerDealer() {
		while (this.mainDealer.calculerScore() < 17) {
			this.mainDealer.ajouterCarte(this.pioche.piocher());
		}
		this.resoudre();
	}

	resoudre() {
		if (this.mainJoueur.cartes.length === 2 && this.mainJoueur.calculerScore() === 21){
			this.bankroll += this.mise * 1.5;
			this.resultat = resultat.Gagne;
			this.raison = raison.blackjackJoueur;
		}
		else if (
			this.mainDealer.calculerScore() > 21
		) {
			this.bankroll += this.mise;
			this.resultat = resultat.Gagne;
			this.raison = raison.bustDealer

		} else if (this.mainDealer.calculerScore() < this.mainJoueur.calculerScore()){
			this.bankroll += this.mise;
			this.resultat = resultat.Gagne;
			this.raison = raison.joueurScore;


		}
		 else if (this.mainDealer.calculerScore() > this.mainJoueur.calculerScore()) {
			this.bankroll -= this.mise;
			this.resultat = resultat.Perdu;
			this.raison = raison.dealerScore;
		} else {
			this.resultat = resultat.Egalite;
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
		this.resultat = undefined;
	}
}
