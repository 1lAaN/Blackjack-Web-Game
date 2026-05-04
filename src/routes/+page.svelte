<script lang="ts">
	import Carte from '$lib/components/Carte.svelte';
	import { Partie } from '$lib/partie.svelte';
	let ecran = $state<'menu' | 'blackjack'>('menu');
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

	function lancerBlackjack() {
		partie = new Partie();
		montant = 0;
		ecran = 'blackjack';
	}
	function retourMenu() {
		ecran = 'menu';
	}
</script>

{#if ecran === 'menu'}
	<div class="relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden">

		<h1 class="mb-2 text-[3.5rem] font-black tracking-[6px] text-white">CASINO</h1>
		<p class="mb-12 text-base font-bold tracking-widest text-white/50">CHOISISSEZ VOTRE JEU</p>

		<div class="flex flex-col gap-4 w-[340px]">

			<!-- BLACKJACK (disponible) -->
			<button
				onclick={lancerBlackjack}
				class="flex items-center gap-5 rounded-2xl border-[3px] border-white/20 bg-black/30 px-6 py-5 text-left cursor-pointer transition-[transform,border-color,box-shadow] duration-150 hover:scale-[1.02] hover:border-white/60 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]"
			>
				<span class="text-[2.5rem]">🃏</span>
				<div>
					<p class="text-lg font-black tracking-widest text-white">BLACKJACK</p>
					<p class="text-sm text-white/50">Battez le dealer sans dépasser 21</p>
				</div>
				<span class="ml-auto rounded-full bg-white px-3 py-1 text-xs font-black text-black tracking-widest">JOUER</span>
			</button>

			<!-- ROULETTE (bientôt) -->
			<button
				disabled
				class="flex items-center gap-5 rounded-2xl border-[3px] border-white/10 bg-black/20 px-6 py-5 text-left opacity-40 cursor-not-allowed"
			>
				<span class="text-[2.5rem]">🎡</span>
				<div>
					<p class="text-lg font-black tracking-widest text-white">ROULETTE</p>
					<p class="text-sm text-white/50">Misez sur le bon numéro</p>
				</div>
				<span class="ml-auto rounded-full border border-white/30 px-3 py-1 text-xs font-black text-white/50 tracking-widest">BIENTÔT</span>
			</button>

			<!-- POKER (bientôt) -->
			<button
				disabled
				class="flex items-center gap-5 rounded-2xl border-[3px] border-white/10 bg-black/20 px-6 py-5 text-left opacity-40 cursor-not-allowed"
			>
				<span class="text-[2.5rem]">♠️</span>
				<div>
					<p class="text-lg font-black tracking-widest text-white">POKER</p>
					<p class="text-sm text-white/50">Texas Hold'em</p>
				</div>
				<span class="ml-auto rounded-full border border-white/30 px-3 py-1 text-xs font-black text-white/50 tracking-widest">BIENTÔT</span>
			</button>

		</div>
	</div>

{:else if ecran === 'blackjack'}
	<div class="relative flex h-screen w-screen flex-col overflow-hidden">

		<!-- BOUTON RETOUR -->
		<button
			onclick={retourMenu}
			class="absolute top-4 right-4 z-50 cursor-pointer rounded-full border-[3px] border-white/20 bg-black/30 px-5 py-2 text-sm font-bold text-white transition-[transform,filter] duration-100 hover:scale-105 hover:brightness-125 active:scale-95"
		>← Menu</button>

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
				<div class="flex items-center gap-2">
					<button onclick={() => montant += 5}   class="w-14 h-14 rounded-full bg-[#8b1a1a]    border-4 border-dashed border-white/40 text-white/90 font-bold text-sm cursor-pointer shadow-lg transition-transform duration-100 hover:scale-110 active:scale-90">5</button>
					<button onclick={() => montant += 10}  class="w-14 h-14 rounded-full bg-[#1a3a6b]   border-4 border-dashed border-white/40 text-white/90 font-bold text-sm cursor-pointer shadow-lg transition-transform duration-100 hover:scale-110 active:scale-90">10</button>
					<button onclick={() => montant += 20}  class="w-14 h-14 rounded-full bg-[#1a5c2e]  border-4 border-dashed border-white/40 text-white/90 font-bold text-sm cursor-pointer shadow-lg transition-transform duration-100 hover:scale-110 active:scale-90">20</button>
					<button onclick={() => montant += 50}  class="w-14 h-14 rounded-full bg-[#7a4a1a] border-4 border-dashed border-white/40 text-white/90 font-bold text-sm cursor-pointer shadow-lg transition-transform duration-100 hover:scale-110 active:scale-90">50</button>
					<button onclick={() => montant += 100} class="w-14 h-14 rounded-full bg-[#1a1a1a]  border-4 border-dashed border-white/40 text-white/90 font-bold text-sm cursor-pointer shadow-lg transition-transform duration-100 hover:scale-110 active:scale-90">100</button>
					<button onclick={() => montant += 500} class="w-14 h-14 rounded-full bg-[#3d1a6b] border-4 border-dashed border-white/40 text-white/90 font-bold text-sm cursor-pointer shadow-lg transition-transform duration-100 hover:scale-110 active:scale-90">500</button>
					<button onclick={() => montant = partie.bankroll} class="h-10 rounded-full bg-[#7a6a1a] border-4 border-dashed border-white/40 text-white/90 font-bold text-sm cursor-pointer shadow-lg transition-transform duration-100 hover:scale-110 active:scale-90 px-4">ALL IN</button>
				</div>
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

		{#if partie.etat !== 'mise'}
			<div class="absolute top-12 left-12 flex flex-col gap-1">
				<p class="text-base font-bold">BANKROLL: {partie.bankroll}</p>
				<p class="text-base font-bold"> MISE: {partie.mise} </p>
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
{/if}