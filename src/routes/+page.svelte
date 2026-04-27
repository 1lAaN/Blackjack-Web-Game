<script lang="ts">
	import { Enseigne } from '$lib/carte';
import Carte from '$lib/components/Carte.svelte';
	import { Partie } from '$lib/partie.svelte';
	let partie = $state(new Partie());
	let montant = $state<number>(0);
</script>

<!-- MISER -->

{#if partie.etat === 'mise'}
	<p>Bankroll: {partie.bankroll}</p>
	<input type="number" placeholder="saisir votre mise" bind:value={montant} />
	<button onclick={() => partie.miser(montant)}>Valider</button>
{/if}

{#if partie.etat === 'tourJoueur'}
	<h3>== main dealer ==</h3>

	{#each partie.mainDealer.cartes as carte}
		<!--<p>{carte.valeur} {carte.enseigne}</p> -->
		<Carte valeur={carte.valeur} enseigne={carte.enseigne} visible={true}/>
	{/each}
	<p>{partie.mainDealer.calculerScore()}</p>

	<h3>=======</h3>

	{#each partie.mainJoueur.cartes as carte}
		<!--<p>{carte.valeur} {carte.enseigne}</p> -->
		<Carte valeur={carte.valeur} enseigne={carte.enseigne} visible={true}/>
	{/each}

	<p>{partie.mainJoueur.calculerScore()}</p>
	<button onclick={() => partie.hit()}>Hit</button>
	<button onclick={() => partie.stand()}>Stand</button>
{/if}

<!-- TOUR DU DEALER-->

{#if partie.etat === 'tourDealer'}
	<h3>== main dealer ==</h3>

	{#each partie.mainDealer.cartes as carte}
		<Carte valeur={carte.valeur} enseigne={carte.enseigne} visible={true}/>
	{/each}
	<p>{partie.mainDealer.calculerScore()}</p>

	<h3>=======</h3>

	{#each partie.mainJoueur.cartes as carte}
		<Carte valeur={carte.valeur} enseigne={carte.enseigne} visible={true}/>
	{/each}

	<p>{partie.mainJoueur.calculerScore()}</p>
{/if}

<!-- PARTIE TERMINEE-->

{#if partie.etat === 'termine'}
	<h3>== main dealer ==</h3>
	{#each partie.mainDealer.cartes as carte}
		<Carte valeur={carte.valeur} enseigne={carte.enseigne} visible={true}/>
	{/each}
	<p>{partie.mainDealer.calculerScore()}</p>
	<h3>=======</h3>

	{#each partie.mainJoueur.cartes as carte}
		<Carte valeur={carte.valeur} enseigne={carte.enseigne} visible={true}/>
	{/each}
	{partie.mainJoueur.calculerScore()}

	<h3>============</h3>

	{#if partie.resultat === 'gagne'}
		<p>Gagné</p>
		<p>+ {partie.mise}</p>
	{/if}
	{#if partie.resultat === 'perdu'}
		<p>Perdu</p>
		<p>- {partie.mise}</p>
	{/if}
	{#if partie.resultat === 'egalite'}
		<p>Égalité</p>
		<p>Mise rendu tu as rien gagné ni perdu</p>
	{/if}
	<p>Mise finale {partie.bankroll}</p>
	<button onclick={() => partie.rejouer()}>Rejouer</button>
{/if}

<!-- DEBUG-->

<p>
	DEBUG: etat={partie.etat} | resultat={partie.resultat} | bankroll={partie.bankroll} | mise={partie.mise}
</p>

<!-- test affichage carte-->
<!--<h3>== test affichage carte ==</h3>
<Carte valeur="2" enseigne="trefle" visible={true} />
<Carte valeur="2" enseigne="trefle" visible={false}/> -->
