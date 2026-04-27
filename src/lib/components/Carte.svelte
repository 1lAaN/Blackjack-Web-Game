<script lang="ts">
	import carteBack from '$lib/assets/carteBackSide.svg';
	import carteFront from '$lib/assets/carteFrontSide.svg';
	let { valeur, enseigne, visible } = $props();
	const symboles: Record<string, string> = { pique: '♠', coeur: '♥', carreau: '♦', trefle: '♣' };
</script>

{#if visible}
	<div style="position: relative; display: inline-block">
		<img src={carteFront} style="width: 100px;" />
		<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 2rem; display: flex; flex-direction: column; align-items: center">
			{valeur} <br> {symboles[enseigne]}
		</div>
	</div>
{:else}
	<img src={carteBack} style="width: 100px;"/>
{/if}
