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
		<a href="/" class="text-sm text-white/50 transition-colors duration-100 hover:text-white">← Retour</a>

		<!-- Header profil -->
		<div class="flex items-center gap-4">
			<img src={ppVierge} alt="profil" class="h-16 w-16 rounded-full" />
			<p class="text-2xl font-black tracking-widest text-white">{userName ?? ''}</p>
		</div>

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
					<div class="h-2 rounded-full bg-[#4cff4c]" style="width: {userStats.partiesJouees > 0 ? Math.round((userStats.victoires / userStats.partiesJouees) * 100) : 0}%"></div>
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
				Membre depuis le {new Date(user.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
			</p>
		{/if}
	</div>
</div>
