<script lang="ts">
	import { Partie } from '$lib/partie.svelte';
	let partie = $state(new Partie());
	let montant = $state<number>(0);
</script>

{#if partie.etat === 'mise'}
	<p>Bankroll: {partie.bankroll}</p>
	<input type="number" placeholder="saisir votre mise" bind:value={montant} />
	<button onclick={() => partie.miser(montant)}>Valider</button>
{/if}

{#if partie.etat === 'tourJoueur'}
	{#each partie.mainJoueur.cartes as carte}
		<p>{carte.valeur} {carte.enseigne}</p>
	{/each}
	<p>{partie.mainJoueur.calculerScore()}</p>
	<button onclick={() => partie.hit()}>Hit</button>
	<button onclick={() => partie.stand()}>Stand</button>
{/if}

{#if partie.etat === 'tourDealer'}
	{#each partie.mainDealer.cartes as carte}
		<p>{carte.valeur} {carte.enseigne}</p>
	{/each}
	<p>{partie.mainDealer.calculerScore()}</p>
{/if}

{#if partie.etat === 'termine'}
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

<p>DEBUG: etat={partie.etat} | resultat={partie.resultat} | bankroll={partie.bankroll} | mise={partie.mise}</p>
