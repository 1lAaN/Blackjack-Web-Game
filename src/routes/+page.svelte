<script lang="ts">
	import Carte from '$lib/components/Carte.svelte';
	import { Partie } from '$lib/partie.svelte';
	let partie = $state(new Partie());
	let montant = $state<number>(0);
	$effect(() => {
		console.log('etat:', partie.etat, '| resultat:', partie.resultat, '| bankroll:', partie.bankroll);
		(window as any).partie = partie;
	});
</script>

<div class="relative w-screen h-screen overflow-hidden flex flex-col">

	<!-- ZONE DEALER -->
	<div class="h-[35%] flex flex-col items-center justify-start pt-4 relative">
		{#if partie.etat !== 'mise'}
			<div class="flex gap-2.5 justify-center">
				{#each partie.mainDealer.cartes as carte, index}
					<Carte
						valeur={carte.valeur}
						enseigne={carte.enseigne}
						visible={index !== 0 || partie.etat !== 'tourJoueur'}
					/>
				{/each}
			</div>
			{#if partie.etat === 'termine' || partie.etat === 'tourDealer'}
				<div class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-base mt-2 {partie.mainDealer.calculerScore() > 21 ? 'bg-[#e53e3e] text-white' : 'bg-white text-black'}">
					{partie.mainDealer.calculerScore()}
				</div>
			{/if}
		{/if}
	</div>

	<!-- ZONE CENTRE -->
	<div class="h-[30%] flex items-center justify-center">

		{#if partie.etat === 'mise'}
			<div class="flex flex-col items-center gap-3">
				<p class="font-bold text-base">BANKROLL: {partie.bankroll}</p>
				<input
					class="bg-white text-black rounded-lg px-4 py-2 text-xl w-[200px] text-center border-none outline-none"
					type="number"
					placeholder="Votre mise"
					bind:value={montant}
				/>
				<button
					class="bg-[#3b3a7a] text-white font-bold text-xl px-12 py-3 rounded-full border-[3px] border-[#5c5bb0] cursor-pointer transition-[transform,filter] duration-100 hover:brightness-125 hover:scale-105 active:scale-95"
					onclick={() => partie.miser(montant)}
				>MISER</button>
			</div>
		{/if}

		{#if partie.etat === 'termine'}
			{#if partie.resultat === 'gagne'}
				<p class="text-[5rem] font-black tracking-[4px] text-[#4cff4c]">GAGNÉ</p>
			{:else if partie.resultat === 'perdu'}
				<p class="text-[5rem] font-black tracking-[4px] text-[#ff4c4c]">PERDU</p>
			{:else}
				<p class="text-[5rem] font-black tracking-[4px] text-white">ÉGALITÉ</p>
			{/if}
		{/if}

	</div>

	<!-- ZONE JOUEUR -->
	<div class="h-[35%] flex flex-col items-center justify-end pb-4 relative">
		{#if partie.etat !== 'mise'}
			{#if partie.etat === 'tourJoueur' || partie.etat === 'termine'}
				<div class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-base mt-2 {partie.mainJoueur.calculerScore() > 21 ? 'bg-[#e53e3e] text-white' : 'bg-white text-black'}">
					{partie.mainJoueur.calculerScore()}
				</div>
			{/if}
			<div class="flex gap-2.5 justify-center">
				{#each partie.mainJoueur.cartes as carte}
					<Carte valeur={carte.valeur} enseigne={carte.enseigne} visible={true} />
				{/each}
			</div>
		{/if}
	</div>

	<!-- BOUTONS HIT / STAND -->
	{#if partie.etat === 'tourJoueur'}
		<button
			class="absolute bottom-12 left-12 bg-[#3a7a3a] text-white font-bold text-lg px-8 py-3 rounded-full border-[3px] border-[#5ab05a] cursor-pointer transition-[transform,filter] duration-100 hover:brightness-125 hover:scale-105 hover:-translate-y-0.5 active:scale-95"
			onclick={() => partie.hit()}
		>HIT</button>
		<button
			class="absolute bottom-12 right-12 bg-[#7a3a3a] text-white font-bold text-lg px-8 py-3 rounded-full border-[3px] border-[#b05a5a] cursor-pointer transition-[transform,filter] duration-100 hover:brightness-125 hover:scale-105 hover:-translate-y-0.5 active:scale-95"
			onclick={() => partie.stand()}
		>STAND</button>
	{/if}

	<!-- INFOS BAS GAUCHE -->
	{#if partie.etat !== 'mise'}
		<div class="absolute top-12 left-12 flex flex-col gap-1">
			<p class="font-bold text-base">BANKROLL: {partie.bankroll}</p>
			{#if partie.etat === 'termine'}
				{#if partie.resultat === 'gagne'}
					<p class="font-black text-[2.5rem] text-[#4cff4c]">+{partie.mise}</p>
				{:else if partie.resultat === 'perdu'}
					<p class="font-black text-[2.5rem] text-[#ff4c4c]">-{partie.mise}</p>
				{/if}
			{/if}
		</div>
	{/if}

	<!-- REJOUER -->
	{#if partie.etat === 'termine'}
		<button
			class="absolute bottom-12 right-12 bg-[#3b3a7a] text-white font-bold text-lg px-8 py-3 rounded-full border-[3px] border-[#5c5bb0] cursor-pointer transition-[transform,filter] duration-100 hover:brightness-125 hover:scale-105 hover:-translate-y-0.5 active:scale-95"
			onclick={() => partie.rejouer()}
		>REJOUER</button>
	{/if}

</div>
