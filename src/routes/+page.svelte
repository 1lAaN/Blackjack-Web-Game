<script lang="ts">
	import Carte from '$lib/components/Carte.svelte';
	import { Partie } from '$lib/partie.svelte';
	let partie = $state(new Partie());
	let montant = $state<number>(0);
	let ecran = $state<'accueil' | 'jeu'>('accueil');
	let modalPatchNote = $state(false);
	let commits = $state<any[]>([]);

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
	$effect(() => {
		fetch('https://api.github.com/repos/1lAaN/Blackjack-Web-Game/commits')
			.then((res) => res.json())
			.then((data) => {
				commits = data;
				console.log(data);
			});
	});
</script>

<div>
	{#if ecran === 'jeu'}
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
						<div class="flex items-center gap-2">
							<button
								onclick={() => (montant += 5)}
								class="h-14 w-14 cursor-pointer rounded-full border-4 border-dashed border-white/40 bg-[#8b1a1a] text-sm font-bold text-white/90 shadow-lg transition-transform duration-100 hover:scale-110 active:scale-90"
								>5</button
							>
							<button
								onclick={() => (montant += 10)}
								class="h-14 w-14 cursor-pointer rounded-full border-4 border-dashed border-white/40 bg-[#1a3a6b] text-sm font-bold text-white/90 shadow-lg transition-transform duration-100 hover:scale-110 active:scale-90"
								>10</button
							>
							<button
								onclick={() => (montant += 20)}
								class="h-14 w-14 cursor-pointer rounded-full border-4 border-dashed border-white/40 bg-[#1a5c2e] text-sm font-bold text-white/90 shadow-lg transition-transform duration-100 hover:scale-110 active:scale-90"
								>20</button
							>
							<button
								onclick={() => (montant += 50)}
								class="h-14 w-14 cursor-pointer rounded-full border-4 border-dashed border-white/40 bg-[#7a4a1a] text-sm font-bold text-white/90 shadow-lg transition-transform duration-100 hover:scale-110 active:scale-90"
								>50</button
							>
							<button
								onclick={() => (montant += 100)}
								class="h-14 w-14 cursor-pointer rounded-full border-4 border-dashed border-white/40 bg-[#1a1a1a] text-sm font-bold text-white/90 shadow-lg transition-transform duration-100 hover:scale-110 active:scale-90"
								>100</button
							>
							<button
								onclick={() => (montant += 500)}
								class="h-14 w-14 cursor-pointer rounded-full border-4 border-dashed border-white/40 bg-[#3d1a6b] text-sm font-bold text-white/90 shadow-lg transition-transform duration-100 hover:scale-110 active:scale-90"
								>500</button
							>
							<button
								onclick={() => (montant = partie.bankroll)}
								class="h-10 cursor-pointer rounded-full border-4 border-dashed border-white/40 bg-[#7a6a1a] px-4 text-sm font-bold text-white/90 shadow-lg transition-transform duration-100 hover:scale-110 active:scale-90"
								>ALL IN</button
							>
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
					{#if partie.peutSplitter()}
						<button
							class="mb-2 cursor-pointer rounded-full border-[3px] border-[#b0a05a] bg-[#7a6a1a] px-8 py-2 text-lg font-bold text-white transition-[transform,filter] duration-100 hover:-translate-y-0.5 hover:scale-105 hover:brightness-125 active:scale-95"
							onclick={() => partie.split()}>SPLIT</button
						>
					{/if}
					<div class="flex items-end gap-12">
						<!-- Main joueur -->
						<div class="flex flex-col items-center gap-1">
							{#if partie.etat === 'tourJoueur' || partie.etat === 'termine'}
								<div
									class="flex h-12 w-12 items-center justify-center rounded-full text-base font-bold {partie.mainJoueur.calculerScore() > 21 ? 'bg-[#e53e3e] text-white' : !partie.mainSplit || partie.mainJouee ? 'bg-white text-black' : 'bg-white/40 text-black/40'}"
								>
									{partie.mainJoueur.calculerScore()}
								</div>
							{/if}
							<div class="flex justify-center gap-2.5">
								{#each partie.mainJoueur.cartes as carte}
									<Carte valeur={carte.valeur} enseigne={carte.enseigne} visible={true} />
								{/each}
							</div>
							{#if partie.etat === 'termine' && partie.mainSplit}
								<p class="mt-1 text-sm font-black {partie.resultat === 'gagne' ? 'text-[#4cff4c]' : partie.resultat === 'perdu' ? 'text-[#ff4c4c]' : 'text-white'}">
									{partie.resultat === 'gagne' ? '+' + partie.mise : partie.resultat === 'perdu' ? '-' + partie.mise : '='}
								</p>
							{/if}
						</div>

						<!-- Main split -->
						{#if partie.mainSplit}
							<div class="flex flex-col items-center gap-1">
								{#if partie.etat === 'tourJoueur' || partie.etat === 'termine'}
									<div
										class="flex h-12 w-12 items-center justify-center rounded-full text-base font-bold {partie.mainSplit.calculerScore() > 21 ? 'bg-[#e53e3e] text-white' : !partie.mainJouee ? 'bg-white text-black' : 'bg-white/40 text-black/40'}"
									>
										{partie.mainSplit.calculerScore()}
									</div>
								{/if}
								<div class="flex justify-center gap-2.5">
									{#each partie.mainSplit.cartes as carte}
										<Carte valeur={carte.valeur} enseigne={carte.enseigne} visible={true} />
									{/each}
								</div>
								{#if partie.etat === 'termine'}
									<p class="mt-1 text-sm font-black {partie.resultatSplit === 'gagne' ? 'text-[#4cff4c]' : partie.resultatSplit === 'perdu' ? 'text-[#ff4c4c]' : 'text-white'}">
										{partie.resultatSplit === 'gagne' ? '+' + partie.mise : partie.resultatSplit === 'perdu' ? '-' + partie.mise : '='}
									</p>
								{/if}
							</div>
						{/if}
					</div>
				{/if}
			</div>

			<!-- BOUTONS HIT / STAND -->
			{#if partie.etat === 'tourJoueur'}
				<button
					class="absolute bottom-12 left-12 cursor-pointer rounded-full border-[3px] border-[#b05a5a] bg-[#7a3a3a] px-8 py-3 text-lg font-bold text-white transition-[transform,filter] duration-100 hover:-translate-y-0.5 hover:scale-105 hover:brightness-125 active:scale-95"
					onclick={() => partie.stand()}>STAND</button
				>
				<button
					class="absolute right-12 bottom-12 cursor-pointer rounded-full border-[3px] border-[#5ab05a] bg-[#3a7a3a] px-8 py-3 text-lg font-bold text-white transition-[transform,filter] duration-100 hover:-translate-y-0.5 hover:scale-105 hover:brightness-125 active:scale-95"
					onclick={() => partie.hit()}>HIT</button
				>

				{#if partie.mainJoueur.cartes.length === 2}
					<button
						class="absolute bottom-36 right-12 cursor-pointer rounded-full border-[3px] border-[#5ab0b0] bg-[#1a6b6b] px-8 py-3 text-lg font-bold text-white transition-[transform,filter] duration-100 hover:-translate-y-0.5 hover:scale-105 hover:brightness-125 active:scale-95"
						onclick={() => partie.double()}>DOUBLE</button
					>
				{/if}
			{/if}

			<!-- INFOS HAUT GAUCHE -->
			{#if partie.etat !== 'mise'}
				<div class="absolute top-12 left-12 flex flex-col gap-1">
					<p class="text-base font-bold">BANKROLL: {partie.bankroll}</p>
					<p class="text-base font-bold">MISE: {partie.mise}</p>
					{#if partie.etat === 'termine'}
						{@const gainJoueur = partie.resultat === 'gagne' ? partie.mise : partie.resultat === 'perdu' ? -partie.mise : 0}
						{@const gainSplit = partie.mainSplit ? (partie.resultatSplit === 'gagne' ? partie.mise : partie.resultatSplit === 'perdu' ? -partie.mise : 0) : 0}
						{@const total = gainJoueur + gainSplit}
						{#if total > 0}
							<p class="text-[2.5rem] font-black text-[#4cff4c]">+{total}</p>
						{:else if total < 0}
							<p class="text-[2.5rem] font-black text-[#ff4c4c]">{total}</p>
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
	{:else}
		<div
			class="relative flex h-screen w-screen flex-col items-center justify-between py-16"
			style="background-image: url('/fond2.svg'); background-size: cover;"
		>
			<h1
				class="text-center text-7xl font-black tracking-widest drop-shadow-[3px_4px_10px_#443182]
"
			>
				KNR<br />BLACKJACK
			</h1>
			<button
				onclick={() => (ecran = 'jeu')}
				class="cursor-pointer rounded-full border-[3px] border-[#5c5bb0] bg-[#3b3a7a] px-20 py-5 text-2xl font-black tracking-widest text-white shadow-[0_0_40px_#3b3a7a] transition-[transform,filter] duration-100 hover:scale-105 hover:brightness-125 active:scale-95"
				>JOUER</button
			>
			<button
				onclick={() => (modalPatchNote = true)}
				class="cursor-pointer rounded-full border-[3px] border-white/20 bg-black/60 px-12 py-3 text-base font-bold tracking-widest text-white transition-[transform,filter] duration-100 hover:scale-105 hover:brightness-125 active:scale-95"
				>PATCH NOTE</button
			>
			<p class="text-sm text-white/40">dev by <a href="https://github.com/1lAaN" target="_blank" class="text-white/70 hover:text-white transition-colors duration-100">1lAaN</a></p>
		</div>
	{/if}
</div>
{#if modalPatchNote}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
		<div
			class="relative flex max-h-[70vh] w-[500px] flex-col gap-4 overflow-y-auto rounded-2xl border border-white/20 bg-[#1a1a2e] p-8"
		>
			<button
				onclick={() => (modalPatchNote = false)}
				class="absolute top-4 right-4 cursor-pointer text-2xl text-white/50 transition-colors duration-100 hover:text-white"
				>✕</button
			>
			<h2 class="text-2xl font-black tracking-widest text-white">PATCH NOTES</h2>
			<div class="flex flex-col gap-2">
				{#each commits.filter((c) => c.commit.message.startsWith('feat') || c.commit.message.startsWith('fix')) as commit}
					<div class="flex flex-col gap-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
						<p class="text-xs text-white/40">
							{new Date(commit.commit.author.date).toLocaleDateString('fr-FR', {
								day: '2-digit',
								month: 'long',
								year: 'numeric'
							})}
						</p>
						<p class="text-sm font-semibold text-white/90">{commit.commit.message}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}
