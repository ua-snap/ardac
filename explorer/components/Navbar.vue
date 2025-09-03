<template>
	<nav class="navbar" role="navigation" aria-label="main navigation">
		<div class="navbar-brand">
			<NuxtLink class="navbar-item" to="/">
				<img
					src="~/assets/images/ardac-green-logo.svg"
					width="112"
					height="28"
				/>
			</NuxtLink>

			<a
				role="button"
				class="navbar-burger"
				aria-label="menu"
				aria-expanded="false"
				data-target="navbarBasicExample"
			>
				<span aria-hidden="true"></span>
				<span aria-hidden="true"></span>
				<span aria-hidden="true"></span>
			</a>
		</div>

		<div id="navbarBasicExample" class="navbar-menu">
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
