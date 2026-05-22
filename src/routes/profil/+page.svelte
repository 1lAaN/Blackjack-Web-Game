<script lang="ts">
	import ppVierge from '$lib/assets/ppVierge.svg';

	let userName = $state<string | null>(null);
	let userStats = $state<{
		partiesJouees: number;
		victoires: number;
		defaites: number;
		egalites: number;
		blackjacks: number;
		argentGagne: number;
		argentPerdu: number;
	} | null>(null);
	let user = $state<{ bankroll: number; createdAt: string } | null>(null);
	let onglet = $state<'stats' | 'parametres'>('stats');
	let newUserName = $state<string | null>(null);
	let oldPassword = $state<string | null>(null);
	let newPassword = $state<string | null>(null);
	let pseudoSuccess = $state(false);
	let passwordSuccess = $state(false);

	$effect(() => {
		if (typeof window !== 'undefined') {
			userName = localStorage.getItem('name');
			(async () => {
				const token = localStorage.getItem('token');
				const res = await fetch('/api/stats', {
					headers: { Authorization: `Bearer ${token}` }
				});
				const data = await res.json();
				userStats = data.userStats;
				user = data.user;
			})();
		}
	});
</script>

<div
	class="flex h-screen w-screen items-center justify-center"
	style="background-image: url('/fond2.svg'); background-size: cover;"
>
	<div class="flex h-full w-[75%] flex-col gap-6 overflow-y-auto bg-black/75 p-8">
		<a href="/" class="text-sm text-white/50 transition-colors duration-100 hover:text-white"
			>← Retour</a
		>

		<!-- Header profil -->
		<div class="flex items-center gap-4">
			<img src={ppVierge} alt="profil" class="h-16 w-16 rounded-full" />
			<p class="text-2xl font-black tracking-widest text-white">{userName ?? ''}</p>
		</div>

		<!-- Onglets -->
		<div class="flex gap-2 border-b border-white/10 pb-1">
			<button
				onclick={() => (onglet = 'stats')}
				class="px-4 py-2 text-sm font-bold tracking-widest transition-colors duration-100 {onglet ===
				'stats'
					? 'border-b-2 border-white text-white'
					: 'text-white/40 hover:text-white'}">STATS</button
			>
			<button
				onclick={() => (onglet = 'parametres')}
				class="px-4 py-2 text-sm font-bold tracking-widest transition-colors duration-100 {onglet ===
				'parametres'
					? 'border-b-2 border-white text-white'
					: 'text-white/40 hover:text-white'}">PARAMÈTRES</button
			>
		</div>

		{#if onglet === 'stats'}
			{#if user && userStats}
				<!-- Bankroll -->
				{@const gain = userStats.argentGagne - userStats.argentPerdu}
				<div class="rounded-xl bg-white/5 p-5">
					<p class="text-sm text-white/50">Bankroll actuelle</p>
					<p class="text-4xl font-black text-white">{user.bankroll} €</p>
					<p class="mt-1 text-sm font-bold {gain >= 0 ? 'text-[#4cff4c]' : 'text-[#ff4c4c]'}">
						↗ {gain >= 0 ? '+' : ''}{gain} € depuis le début
					</p>
				</div>

				<!-- Stats principales -->
				<div>
					<p class="mb-2 text-xs font-bold tracking-widest text-white/40">STATISTIQUES</p>
					<div class="grid grid-cols-3 gap-3">
						<div class="rounded-xl bg-white/5 p-4 text-center">
							<p class="text-sm text-white/50">Parties</p>
							<p class="text-3xl font-black text-white">{userStats.partiesJouees}</p>
						</div>
						<div class="rounded-xl bg-white/5 p-4 text-center">
							<p class="text-sm text-white/50">Victoires</p>
							<p class="text-3xl font-black text-[#4cff4c]">{userStats.victoires}</p>
						</div>
						<div class="rounded-xl bg-white/5 p-4 text-center">
							<p class="text-sm text-white/50">Défaites</p>
							<p class="text-3xl font-black text-[#ff4c4c]">{userStats.defaites}</p>
						</div>
					</div>
				</div>

				<!-- Taux de victoire -->
				<div>
					<p class="mb-2 text-xs font-bold tracking-widest text-white/40">TAUX DE VICTOIRE</p>
					<div class="h-2 w-full rounded-full bg-white/10">
						<div
							class="h-2 rounded-full bg-[#4cff4c]"
							style="width: {userStats.partiesJouees > 0
								? Math.round((userStats.victoires / userStats.partiesJouees) * 100)
								: 0}%"
						></div>
					</div>
					<div class="mt-1 flex justify-between text-xs text-white/30">
						<span>0%</span><span>50%</span><span>100%</span>
					</div>
				</div>

				<!-- Détails -->
				<div>
					<p class="mb-2 text-xs font-bold tracking-widest text-white/40">DÉTAILS</p>
					<div class="grid grid-cols-2 gap-3">
						<div class="rounded-xl bg-white/5 p-4">
							<p class="text-sm text-white/50">Blackjacks</p>
							<p class="text-2xl font-black text-white">{userStats.blackjacks}</p>
						</div>
						<div class="rounded-xl bg-white/5 p-4">
							<p class="text-sm text-white/50">Égalités</p>
							<p class="text-2xl font-black text-white">{userStats.egalites}</p>
						</div>
						<div class="rounded-xl bg-white/5 p-4">
							<p class="text-sm text-white/50">Argent gagné</p>
							<p class="text-2xl font-black text-[#4cff4c]">{userStats.argentGagne} €</p>
						</div>
						<div class="rounded-xl bg-white/5 p-4">
							<p class="text-sm text-white/50">Argent perdu</p>
							<p class="text-2xl font-black text-[#ff4c4c]">{userStats.argentPerdu} €</p>
						</div>
					</div>
				</div>

				<!-- Membre depuis -->
				<p class="text-center text-sm text-white/30">
					Membre depuis le {new Date(user.createdAt).toLocaleDateString('fr-FR', {
						day: 'numeric',
						month: 'long',
						year: 'numeric'
					})}
				</p>
			{/if}
		{:else}
			<!-- PARAMÈTRES -->
			<div class="flex flex-col gap-4">
				<!-- Changer le pseudo -->
				<div class="rounded-xl bg-white/5 p-5">
					<p class="mb-3 text-sm font-bold tracking-widest text-white/40">PSEUDO</p>
					<div class="flex gap-3">
						<input
							class="flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white outline-none placeholder:text-white/30 focus:border-[#5c5bb0]"
							type="text"
							placeholder="Nouveau pseudo"
							bind:value={newUserName}
						/>
						<button
							class="cursor-pointer rounded-lg border-[2px] border-[#5c5bb0] bg-[#3b3a7a] px-5 py-2 text-sm font-bold text-white transition-[transform,filter] duration-100 hover:brightness-125 active:scale-95"
							onclick={async () => {
								const token = localStorage.getItem('token');
								const res = await fetch('/api/user', {
									method: 'PATCH',
									headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
									body: JSON.stringify({ name: newUserName })
								});
								const data = await res.json();
								if (res.ok) {
									userName = newUserName;
									localStorage.setItem('name', newUserName ?? '');
									pseudoSuccess = true;
								}
							}}
						>
							Modifier
						</button>
					</div>
					{#if pseudoSuccess}
						<p class="mt-1 text-sm font-bold text-[#4cff4c]">Pseudo modifié !</p>
					{/if}
			</div>

				<!-- Changer la photo de profil -->
				<div class="rounded-xl bg-white/5 p-5">
					<p class="mb-3 text-sm font-bold tracking-widest text-white/40">PHOTO DE PROFIL</p>
					<div class="flex items-center gap-4">
						<img src={ppVierge} alt="profil" class="h-14 w-14 rounded-full" />
						<button
							class="cursor-pointer rounded-lg border-[2px] border-[#5c5bb0] bg-[#3b3a7a] px-5 py-2 text-sm font-bold text-white transition-[transform,filter] duration-100 hover:brightness-125 active:scale-95"
						>
							Changer
						</button>
					</div>
				</div>

				<!-- Changer le mot de passe -->
				<div class="rounded-xl bg-white/5 p-5">
					<p class="mb-3 text-sm font-bold tracking-widest text-white/40">MOT DE PASSE</p>
					<div class="flex flex-col gap-2">
						<input
							class="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white outline-none placeholder:text-white/30 focus:border-[#5c5bb0]"
							type="password"
							placeholder="Mot de passe actuel"
							bind:value={oldPassword}
						/>
						<input
							class="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white outline-none placeholder:text-white/30 focus:border-[#5c5bb0]"
							type="password"
							placeholder="Nouveau mot de passe"
							bind:value={newPassword}
							
						/>
						<button
							class="cursor-pointer self-end rounded-lg border-[2px] border-[#5c5bb0] bg-[#3b3a7a] px-5 py-2 text-sm font-bold text-white transition-[transform,filter] duration-100 hover:brightness-125 active:scale-95"
							onclick={async () => {
								const token = localStorage.getItem('token');
								const res = await fetch('/api/user', {
									method: 'PATCH',
									headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
									body: JSON.stringify({ password: newPassword, oldPassword: oldPassword})
								});
								const data = await res.json();
								if (res.ok) {
									oldPassword = '';
									newPassword = '';
									passwordSuccess = true;
								}
							}}
						>
							Modifier
						</button>
					{#if passwordSuccess}
						<p class="mt-1 text-sm font-bold text-[#4cff4c]">Mot de passe modifié !</p>
					{/if}
				</div>
			</div>

				<!-- Langue -->
				<div class="rounded-xl bg-white/5 p-5">
					<p class="mb-3 text-sm font-bold tracking-widest text-white/40">LANGUE</p>
					<div class="flex gap-2">
						<button
							class="cursor-pointer rounded-lg border-[2px] border-white bg-white/20 px-5 py-2 text-sm font-bold text-white transition-[transform,filter] duration-100 hover:brightness-125 active:scale-95"
						>
							🇫🇷 Français
						</button>
						<button
							class="cursor-pointer rounded-lg border-[2px] border-white/20 bg-white/5 px-5 py-2 text-sm font-bold text-white/50 transition-[transform,filter] duration-100 hover:brightness-125 active:scale-95"
						>
							🇬🇧 English
						</button>
					</div>
				</div>

				<!-- Supprimer le compte -->
				<div class="rounded-xl border border-[#ff4c4c]/20 bg-[#ff4c4c]/5 p-5">
					<p class="mb-1 text-sm font-bold tracking-widest text-[#ff4c4c]/70">ZONE DANGEREUSE</p>
					<p class="mb-3 text-xs text-white/30">Cette action est irréversible.</p>
					<button
						class="cursor-pointer rounded-lg border-[2px] border-[#ff4c4c] bg-transparent px-5 py-2 text-sm font-bold text-[#ff4c4c] transition-[transform,filter] duration-100 hover:bg-[#ff4c4c] hover:text-white active:scale-95"
					>
						Supprimer mon compte
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>
