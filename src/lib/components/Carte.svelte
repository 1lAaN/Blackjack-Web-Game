<script lang="ts">
	import carteBack from '$lib/assets/carteBackSide.svg';
	import carteFront from '$lib/assets/carteFrontSide.svg';
	let { valeur, enseigne, visible } = $props();
	const symboles: Record<string, string> = { pique: '♠', coeur: '♥', carreau: '♦', trefle: '♣' };
</script>

{#if visible}
	<div class="carte-container">
		<img src={carteFront} class="carte-img" alt=""/>
		<div class="carte-contenu">
			{valeur} <br> {symboles[enseigne]}
		</div>
	</div>
{:else}
	<img src={carteBack} class="carte-img" alt="" />
{/if}

<style>
	.carte-container {
		position: relative;
		display: inline-block;
	}

	.carte-img {
		width: 100px;
	}

	.carte-contenu {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		color: black;
		font-weight: bold;
	}
</style>