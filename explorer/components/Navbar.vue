<script lang="ts" setup>
// The menu is collapsed behind the burger button on narrow screens.
const menuOpen = ref(false)
const route = useRoute()
watch(
	() => route.path,
	() => {
		menuOpen.value = false
	}
)
</script>

<template>
	<nav class="navbar" aria-label="Main">
		<div class="navbar-brand">
			<NuxtLink class="navbar-item" to="/">
				<img
					src="~/assets/images/ardac-green-logo.svg"
					alt="ARDAC home"
					width="112"
					height="28"
				/>
			</NuxtLink>

			<button
				type="button"
				class="navbar-burger"
				:class="{ 'is-active': menuOpen }"
				aria-label="Menu"
				:aria-expanded="menuOpen"
				aria-controls="navbar-menu"
				@click="menuOpen = !menuOpen"
			>
				<span aria-hidden="true"></span>
				<span aria-hidden="true"></span>
				<span aria-hidden="true"></span>
			</button>
		</div>

		<div
			id="navbar-menu"
			class="navbar-menu"
			:class="{ 'is-active': menuOpen }"
		>
			<div class="navbar-start">
				<NuxtLink class="navbar-item" to="/">Home</NuxtLink>
				<NuxtLink class="navbar-item" to="/about">About</NuxtLink>
				<NuxtLink class="navbar-item" to="/people">People</NuxtLink>
			</div>

			<div class="navbar-end">
				<div class="navbar-item">email: uaf-snap-data-tools@alaska.edu</div>
			</div>
		</div>
	</nav>
</template>
