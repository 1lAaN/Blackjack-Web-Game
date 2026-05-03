<script lang="ts">
	import carteBack from '$lib/assets/carteBackSide.svg';
	import carteFront from '$lib/assets/carteFrontSide.svg';
	let { valeur, enseigne, visible } = $props();
	const symboles: Record<string, string> = { pique: '♠', coeur: '♥', carreau: '♦', trefle: '♣' };
</script>

{#if visible}
	<div class="relative inline-block">
		<img src={carteFront} class="w-[130px]" alt=""/>
		<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[2rem] flex flex-col items-center text-black font-bold">
			{valeur} <br> {symboles[enseigne]}
		</div>
	</div>
{:else}
	<img src={carteBack} class="w-[130px]" alt="" />
{/if}
