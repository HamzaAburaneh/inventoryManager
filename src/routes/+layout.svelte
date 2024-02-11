<script>
	import 'flowbite';
	import 'flowbite/dist/flowbite.css';
	import '../global.css';
	let isDarkMode = false;

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

<button on:click={toggleDarkMode}>Toggle Dark Mode</button>
<slot />
