<script lang="ts">
	import { Partie } from '$lib/partie';
	let partie = $state(new Partie());
	let montant = $state(0);
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
    <p>{partie.mainJoueur.calculerScore}</p>
    <button onclick={() => partie.hit}>Hit</button>
{/if}
