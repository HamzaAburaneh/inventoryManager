<script>
	import 'flowbite/dist/flowbite.css';

	let isDarkMode = false; // Default mode, can also use system preference

	// Function to toggle dark mode
	function toggleDarkMode() {
		isDarkMode = !isDarkMode;
		if (isDarkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}
</script>

<!-- Dark Mode Toggle Button -->
<button on:click={toggleDarkMode}>Toggle Dark Mode</button>

<!-- Layout's Main Content -->
<!-- This will render the content of the page that uses this layout -->
<slot />
