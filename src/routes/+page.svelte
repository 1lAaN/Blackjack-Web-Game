<script lang="ts">
	import Carte from '$lib/components/Carte.svelte';
	import { Partie } from '$lib/partie.svelte';
	let partie = $state(new Partie());
	let montant = $state<number>(0);
	$effect(() => {
		console.log('etat:', partie.etat, '| resultat:', partie.resultat, '| bankroll:', partie.bankroll);
	});
</script>

<div class="jeu">

	<!-- ZONE DEALER -->
	<div class="zone-dealer">
		{#if partie.etat !== 'mise'}
			<div class="cartes">
				{#each partie.mainDealer.cartes as carte, index}
					<Carte
						valeur={carte.valeur}
						enseigne={carte.enseigne}
						visible={index !== 0 || partie.etat !== 'tourJoueur'}
					/>
				{/each}
			</div>
			{#if partie.etat === 'termine' || partie.etat === 'tourDealer'}
				<div class="score-badge score-rouge">{partie.mainDealer.calculerScore()}</div>
			{/if}
		{/if}
	</div>

	<!-- ZONE CENTRE -->
	<div class="zone-centre">

		{#if partie.etat === 'mise'}
			<div class="mise-container">
				<p class="bankroll-texte">BANKROLL: {partie.bankroll}</p>
				<input class="mise-input" type="number" placeholder="Votre mise" bind:value={montant} />
				<button class="btn-miser" onclick={() => partie.miser(montant)}>MISER</button>
			</div>
		{/if}


		{#if partie.etat === 'termine'}
			{#if partie.resultat === 'gagne'}
				<p class="resultat-texte gagne">GAGNÉ</p>
			{:else if partie.resultat === 'perdu'}
				<p class="resultat-texte perdu">PERDU</p>
			{:else}
				<p class="resultat-texte egalite">ÉGALITÉ</p>
			{/if}
		{/if}

	</div>

	<!-- ZONE JOUEUR -->
	<div class="zone-joueur">
		{#if partie.etat !== 'mise'}
			{#if partie.etat === 'tourJoueur' || partie.etat === 'termine'}
				<div class="score-badge">{partie.mainJoueur.calculerScore()}</div>
			{/if}
			<div class="cartes">
				{#each partie.mainJoueur.cartes as carte}
					<Carte valeur={carte.valeur} enseigne={carte.enseigne} visible={true} />
				{/each}
			</div>
		{/if}
	</div>

	<!-- BOUTONS HIT / STAND -->
	{#if partie.etat === 'tourJoueur'}
		<button class="btn-hit" onclick={() => partie.hit()}>HIT</button>
		<button class="btn-stand" onclick={() => partie.stand()}>STAND</button>
	{/if}

	<!-- INFOS BAS GAUCHE -->
	{#if partie.etat !== 'mise'}
		<div class="infos">
			<p class="bankroll-texte">BANKROLL: {partie.bankroll}</p>
			{#if partie.etat === 'termine'}
				{#if partie.resultat === 'gagne'}
					<p class="gain gagne">+{partie.mise}</p>
				{:else if partie.resultat === 'perdu'}
					<p class="gain perdu">-{partie.mise}</p>
				{/if}
			{/if}
		</div>
	{/if}

	<!-- REJOUER -->
	{#if partie.etat === 'termine'}
		<button class="btn-rejouer" onclick={() => partie.rejouer()}>REJOUER</button>
	{/if}

</div>

<style>
	.jeu {
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	/* ── Zones cartes ── */

	.zone-dealer {
		height: 35%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		padding-top: 16px;
		position: relative;
	}

	.zone-centre {
		height: 30%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.zone-joueur {
		height: 35%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		padding-bottom: 16px;
		position: relative;
	}

	.cartes {
		display: flex;
		gap: 10px;
		justify-content: center;
	}

	/* ── Score badge ── */

	.score-badge {
		background: white;
		color: black;
		border-radius: 50%;
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		font-size: 1rem;
		margin-top: 8px;
	}

	.score-rouge {
		background: #e53e3e;
		color: white;
	}

	/* ── Mise ── */

	.mise-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}

	.mise-input {
		background: white;
		color: black;
		border-radius: 8px;
		padding: 8px 16px;
		font-size: 1.2rem;
		width: 200px;
		text-align: center;
		border: none;
		outline: none;
	}

	.btn-miser {
		background: #3b3a7a;
		color: white;
		font-weight: bold;
		font-size: 1.2rem;
		padding: 12px 48px;
		border-radius: 999px;
		border: 3px solid #5c5bb0;
		cursor: pointer;
	}

	/* ── Résultat ── */

	.resultat-texte {
		font-size: 5rem;
		font-weight: 900;
		letter-spacing: 4px;
	}

	.gagne { color: #4cff4c; }
	.perdu { color: #ff4c4c; }
	.egalite { color: white; }

	/* ── Boutons Hit / Stand ── */

	.btn-hit {
		position: absolute;
		bottom: 48px;
		left: 48px;
		background: #3a7a3a;
		color: white;
		font-weight: bold;
		font-size: 1.1rem;
		padding: 12px 32px;
		border-radius: 999px;
		border: 3px solid #5ab05a;
		cursor: pointer;
	}

	.btn-stand {
		position: absolute;
		bottom: 48px;
		right: 48px;
		background: #7a3a3a;
		color: white;
		font-weight: bold;
		font-size: 1.1rem;
		padding: 12px 32px;
		border-radius: 999px;
		border: 3px solid #b05a5a;
		cursor: pointer;
	}

	/* ── Infos bas gauche ── */

	.infos {
		position: absolute;
		top: 48px;
		left: 48px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.bankroll-texte {
		font-weight: bold;
		font-size: 1rem;
	}

	.gain {
		font-weight: 900;
		font-size: 2.5rem;
	}

	/* ── Rejouer ── */

	.btn-rejouer {
		position: absolute;
		bottom: 48px;
		right: 48px;
		background: #3b3a7a;
		color: white;
		font-weight: bold;
		font-size: 1.1rem;
		padding: 12px 32px;
		border-radius: 999px;
		border: 3px solid #5c5bb0;
		cursor: pointer;
	}
</style>
