<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	let cancelled = false;
	let counter: EventSource;
	let done = false;
	let value = 0;

	const count = () => {
		cancelled = false;
		done = false;
		value = 0;

		counter = new EventSource('/count-up');
		counter.onmessage = ({ data }) => {
			if (data === 'done') {
				counter.close();
				done = true;
				return;
			}

			value = data;
		};
		counter.onerror = (e) => {
			console.error(e);
		};
	};

	const cancel = () => {
		cancelled = true;
		counter?.close();
	};

	onMount(() => {
		count();
	});

	onDestroy(() => {
		counter?.close();
	});
</script>

<svelte:head>
	<title>SSE Example</title>
</svelte:head>

<h1>
	Count up to 10 via
	<code style="padding: 0.25em 0.3em; background: #f0f0f0;">EventSource</code>
</h1>

<p style="font-size: 1rem">Open the Network tab to see the SSE connection.</p>

<p>Cancelled: {cancelled}</p>
<p>Done: {done}</p>
<p>Data: {value}</p>

<button on:click={cancel}>Cancel</button>

<button on:click={count}>Count</button>

<style>
	:global(body) {
		font-family: sans-serif;
		text-align: center;
	}

	p {
		margin: 1.5em 0;
		font-size: 1.25rem;
	}

	button {
		font-size: 1.25rem;
		margin: 0.5rem 1rem;
	}
</style>
