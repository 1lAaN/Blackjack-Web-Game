<script lang="ts">
	import Carte from '$lib/components/Carte.svelte';
	import { Partie } from '$lib/partie.svelte';
	let partie = $state(new Partie());
	let montant = $state<number>(0);
	$effect(() => {
		console.log(
			'etat:',
			partie.etat,
			'| resultat:',
			partie.resultat,
			'| bankroll:',
			partie.bankroll
		);
		(window as any).partie = partie;
	});
</script>

<div class="relative flex h-screen w-screen flex-col overflow-hidden">
	<!-- ZONE DEALER -->
	<div class="relative flex h-[35%] flex-col items-center justify-start pt-4">
		{#if partie.etat !== 'mise'}
			<div class="flex justify-center gap-2.5">
				{#each partie.mainDealer.cartes as carte, index}
					<Carte
						valeur={carte.valeur}
						enseigne={carte.enseigne}
						visible={index !== 0 || partie.etat !== 'tourJoueur'}
					/>
				{/each}
			</div>
			{#if partie.etat === 'termine' || partie.etat === 'tourDealer'}
				<div
					class="mt-2 flex h-12 w-12 items-center justify-center rounded-full text-base font-bold {partie.mainDealer.calculerScore() >
					21
						? 'bg-[#e53e3e] text-white'
						: 'bg-white text-black'}"
				>
					{partie.mainDealer.calculerScore()}
				</div>
			{/if}
		{/if}
	</div>

	<!-- ZONE CENTRE -->
	<div class="flex h-[30%] items-center justify-center">
		{#if partie.etat === 'mise'}
			<div class="flex flex-col items-center gap-3">
				<p class="text-base font-bold">BANKROLL: {partie.bankroll}</p>
				<input
					class="w-[200px] rounded-lg border-none bg-white px-4 py-2 text-center text-xl text-black outline-none"
					type="number"
					placeholder="Votre mise"
					bind:value={montant}
				/>
				<button
					class="cursor-pointer rounded-full border-[3px] border-[#5c5bb0] bg-[#3b3a7a] px-12 py-3 text-xl font-bold text-white transition-[transform,filter] duration-100 hover:scale-105 hover:brightness-125 active:scale-95"
					onclick={() => partie.miser(montant)}>MISER</button
				>
			</div>
		{/if}

		{#if partie.etat === 'termine'}
			{#if partie.resultat === 'gagne'}
				<div class="flex flex-col items-center">
					<p class="text-[5rem] font-black tracking-[4px] text-[#4cff4c]">GAGNÉ</p>
					{#if partie.raison === 'bustDealer'}
						<p class="text-xl font-bold text-[#4cff4c]">Le dealer a bust</p>
					{:else if partie.raison === 'blackjackJoueur'}
						<p class="text-xl font-bold text-[#4cff4c]">Tu as blackjack !</p>
					{:else if partie.raison === 'joueurScore'}
						<p class="text-xl font-bold text-[#4cff4c]">Tu as un score plus élevé</p>
					{/if}
				</div>
			{:else if partie.resultat === 'perdu'}
				<div class="flex flex-col items-center">
					<p class="text-[5rem] font-black tracking-[4px] text-[#ff4c4c]">PERDU</p>
					{#if partie.raison === 'bustJoueur'}
						<p class="text-xl font-bold text-[#ff4c4c]">Tu as bust</p>
					{:else if partie.raison === 'blackjackDealer'}
						<p class="text-xl font-bold text-[#ff4c4c]">Le dealer a blackjack</p>
					{:else if partie.raison === 'dealerScore'}
						<p class="text-xl font-bold text-[#ff4c4c]">Le dealer a un score plus élevé</p>
					{/if}
				</div>
			{:else}
				<p class="text-[5rem] font-black tracking-[4px] text-white">ÉGALITÉ</p>
			{/if}
		{/if}
	</div>

	<!-- ZONE JOUEUR -->
	<div class="relative flex h-[35%] flex-col items-center justify-end pb-4">
		{#if partie.etat !== 'mise'}
			{#if partie.etat === 'tourJoueur' || partie.etat === 'termine'}
				<div
					class="mt-2 flex h-12 w-12 items-center justify-center rounded-full text-base font-bold {partie.mainJoueur.calculerScore() >
					21
						? 'bg-[#e53e3e] text-white'
						: 'bg-white text-black'}"
				>
					{partie.mainJoueur.calculerScore()}
				</div>
			{/if}
			<div class="flex justify-center gap-2.5">
				{#each partie.mainJoueur.cartes as carte}
					<Carte valeur={carte.valeur} enseigne={carte.enseigne} visible={true} />
				{/each}
			</div>
		{/if}
	</div>

	<!-- BOUTONS HIT / STAND -->
	{#if partie.etat === 'tourJoueur'}
		<button
			class="absolute bottom-12 left-12 cursor-pointer rounded-full border-[3px] border-[#5ab05a] bg-[#3a7a3a] px-8 py-3 text-lg font-bold text-white transition-[transform,filter] duration-100 hover:-translate-y-0.5 hover:scale-105 hover:brightness-125 active:scale-95"
			onclick={() => partie.hit()}>HIT</button
		>
		<button
			class="absolute right-12 bottom-12 cursor-pointer rounded-full border-[3px] border-[#b05a5a] bg-[#7a3a3a] px-8 py-3 text-lg font-bold text-white transition-[transform,filter] duration-100 hover:-translate-y-0.5 hover:scale-105 hover:brightness-125 active:scale-95"
			onclick={() => partie.stand()}>STAND</button
		>
	{/if}

	<!-- INFOS BAS GAUCHE -->
	{#if partie.etat !== 'mise'}
		<div class="absolute top-12 left-12 flex flex-col gap-1">
			<p class="text-base font-bold">BANKROLL: {partie.bankroll}</p>
			{#if partie.etat === 'termine'}
				{#if partie.resultat === 'gagne'}
					<p class="text-[2.5rem] font-black text-[#4cff4c]">+{partie.mise}</p>
				{:else if partie.resultat === 'perdu'}
					<p class="text-[2.5rem] font-black text-[#ff4c4c]">-{partie.mise}</p>
				{/if}
			{/if}
		</div>
	{/if}

	<!-- REJOUER -->
	{#if partie.etat === 'termine'}
		<button
			class="absolute right-12 bottom-12 cursor-pointer rounded-full border-[3px] border-[#5c5bb0] bg-[#3b3a7a] px-8 py-3 text-lg font-bold text-white transition-[transform,filter] duration-100 hover:-translate-y-0.5 hover:scale-105 hover:brightness-125 active:scale-95"
			onclick={() => partie.rejouer()}>REJOUER</button
		>
	{/if}
</div>
