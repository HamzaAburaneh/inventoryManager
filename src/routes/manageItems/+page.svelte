<script lang="ts">
	import { DarkMode } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import {
		getItems,
		addItem,
		deleteItem,
		searchItems,
		editItemCost,
		editItemLowCount,
		editItemName,
		editItemBarcode,
		editItemStorageType,
		applySorting
	} from '../../lib/items';
	import type { Item } from '../../types';
	import Swal from 'sweetalert2';

	let items: Item[] = [];
	let name = '';
	let barcode = '';
	let count: number = 0;
	let lowCount: number | null = null;
	let cost: number | null = null;
	let storageType: '' | 'freezer' | 'refrigerator' | 'dry storage' = '';
	let searchValue = '';

	let currentSortColumn: keyof Item;
	let sortAscending = true;

	onMount(async () => {
		items = await getItems();
	});

	$: sortIcon = (column) => {
		if (currentSortColumn === column) {
			return sortAscending ? '▲' : '▼';
		}
		// Return a default icon for all columns, not just the active one
		return '↕';
	};

	async function handleAdd() {
		const itemWithoutId = {
			name: name,
			barcode: barcode,
			count: count,
			lowCount: lowCount,
			cost: cost,
			storageType: storageType
		};

		const id = await addItem(itemWithoutId);
		const item: Item = {
			id: id,
			...itemWithoutId
		};

		// Instead of just appending the new item, we'll insert it into the already sorted list
		let updatedItems = [...items, item];
		updatedItems = applySorting(updatedItems, currentSortColumn, sortAscending);

		// Update the local state
		updateItemsAndSort(updatedItems);

		// Clear the input fields
		name = '';
		barcode = '';
		count = 0;
		lowCount = null;
		cost = null;
		storageType = '';
	}

	async function handleDelete(id: string) {
		await deleteItem(id);
		const updatedItems = items.filter((item) => item.id !== id);
		updateItemsAndSort(updatedItems);
	}

	async function handleEditCost(id: string, oldCost: number | null) {
		if (oldCost == null) {
			oldCost = 0;
		}
		await Swal.fire({
			title: 'Edit Cost',
			input: 'number',
			inputValue: oldCost.toString(),
			inputAttributes: {
				autocapitalize: 'off'
			},
			showCancelButton: true,
			confirmButtonText: 'Confirm',
			showLoaderOnConfirm: true,
			preConfirm: async (newCost) => {
				if (newCost) {
					await editItemCost(id, Number(newCost));

					const updatedItems = items.map((item) => {
						if (item.id === id) {
							return { ...item, cost: Number(newCost) };
						}
						return item;
					});

					updateItemsAndSort(updatedItems);
				}
			},
			allowOutsideClick: () => !Swal.isLoading()
		});
	}

	async function handleEditBarcode(id: string, oldBarcode: string) {
		await Swal.fire({
			title: 'Edit Barcode',
			input: 'number',
			inputValue: oldBarcode,
			inputAttributes: {
				autocapitalize: 'off'
			},
			showCancelButton: true,
			confirmButtonText: 'Confirm',
			showLoaderOnConfirm: true,
			preConfirm: async (newBarcode) => {
				if (newBarcode) {
					await editItemBarcode(id, newBarcode);

					const updatedItems = items.map((item) => {
						if (item.id === id) {
							return { ...item, barcode: newBarcode };
						}
						return item;
					});

					updateItemsAndSort(updatedItems);
				}
			},
			allowOutsideClick: () => !Swal.isLoading()
		});
	}

	async function handleEditName(id: string, oldName: string) {
		await Swal.fire({
			title: 'Edit Name',
			input: 'text',
			inputValue: oldName,
			inputAttributes: {
				autocapitalize: 'off'
			},
			showCancelButton: true,
			confirmButtonText: 'Confirm',
			showLoaderOnConfirm: true,
			preConfirm: async (newName) => {
				if (newName) {
					await editItemName(id, newName);

					const updatedItems = items.map((item) => {
						if (item.id === id) {
							return { ...item, name: newName };
						}
						return item;
					});

					updateItemsAndSort(updatedItems);
				}
			},
			allowOutsideClick: () => !Swal.isLoading()
		});
	}

	async function handleEditStorageType(id: string, oldStorageType: string) {
		await Swal.fire({
			title: 'Edit Storage Type',
			input: 'select',
			inputOptions: {
				'': 'Select Storage Type',
				Dry: 'Dry Storage',
				Refrigerator: 'Refrigerator',
				Freezer: 'Freezer'
			},
			inputAttributes: {
				autocapitalize: 'off'
			},
			showCancelButton: true,
			confirmButtonText: 'Confirm',
			showLoaderOnConfirm: true,
			preConfirm: async (newStorageType) => {
				if (newStorageType) {
					await editItemStorageType(id, newStorageType);

					const updatedItems = items.map((item) => {
						if (item.id === id) {
							return { ...item, storageType: newStorageType };
						}
						return item;
					});

					updateItemsAndSort(updatedItems);
				}
			},
			allowOutsideClick: () => !Swal.isLoading()
		});
	}

	async function handleEditLowCount(id: string, oldLowCount: number | null) {
		if (oldLowCount == null) {
			oldLowCount = 0;
		}
		await Swal.fire({
			title: 'Edit Low Count',
			input: 'number',
			inputValue: oldLowCount.toString(),
			inputAttributes: {
				autocapitalize: 'off'
			},
			showCancelButton: true,
			confirmButtonText: 'Confirm',
			showLoaderOnConfirm: true,
			preConfirm: async (newLowCount) => {
				if (newLowCount) {
					await editItemLowCount(id, Number(newLowCount));

					const updatedItems = items.map((item) => {
						if (item.id === id) {
							return { ...item, lowCount: Number(newLowCount) };
						}
						return item;
					});

					updateItemsAndSort(updatedItems);
				}
			},
			allowOutsideClick: () => !Swal.isLoading()
		});
	}

	async function handleSearch() {
		const searchedItems = await searchItems(searchValue);
		updateItemsAndSort(searchedItems);
	}

	async function sortBy(column: keyof Item) {
		if (currentSortColumn === column) {
			sortAscending = !sortAscending;
		} else {
			currentSortColumn = column;
			sortAscending = true;
		}
		updateItemsAndSort(items);
	}

	function updateItemsAndSort(updatedItems: Item[]) {
		items = applySorting(updatedItems, currentSortColumn, sortAscending);
	}
</script>

<link
	rel="stylesheet"
	href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
/>
<div class="container mt-4 bg-red-300 dark:bg-slate-800">
	<div class="row g-3 mb-3">
		<div class="col form-group">
			<label for="name" class="form-label">Name</label>
			<input id="name" class="form-control" bind:value={name} placeholder="Name" />
		</div>
		<div class="col form-group">
			<label for="barcode" class="form-label">Barcode</label>
			<input id="barcode" class="form-control" bind:value={barcode} placeholder="Barcode" />
		</div>
		<div class="col form-group">
			<label for="count" class="form-label">Count</label>
			<input id="count" class="form-control" bind:value={count} type="number" placeholder="Count" />
		</div>
		<div class="col form-group">
			<label for="lowCount" class="form-label">Low Count</label>
			<input
				id="lowCount"
				class="form-control"
				bind:value={lowCount}
				type="number"
				placeholder="Low Count"
			/>
		</div>
		<div class="col form-group">
			<label for="cost" class="form-label">Cost</label>
			<input id="cost" class="form-control" bind:value={cost} type="number" placeholder="Cost" />
		</div>
		<div class="col form-group">
			<label for="storageType" class="form-label">Storage type</label>
			<select id="storageType" bind:value={storageType} class="form-control">
				<option value="">Select storage type...</option>
				<option value="Freezer">Freezer</option>
				<option value="Refrigerator">Refrigerator</option>
				<option value="Dry">Dry Storage</option>
			</select>
		</div>
		<div class="col form-floating">
			<button class="btn btn-primary form-control" on:click={handleAdd}>Add Item</button>
		</div>
	</div>

	<div class="mb-3">
		<label for="search" class="form-label">Search</label>
		<input
			id="search"
			class="form-control"
			bind:value={searchValue}
			placeholder="Search"
			on:input={handleSearch}
		/>
	</div>
	<table class="table">
		<thead>
			<tr>
				<th class="header" on:click={() => sortBy('name')}
					>Name <span class="sort-icon">{sortIcon('name')}</span></th
				>
				<th class="header" on:click={() => sortBy('barcode')}
					>Barcode <span class="sort-icon">{sortIcon('barcode')}</span></th
				>
				<th class="header" on:click={() => sortBy('count')}
					>Count <span class="sort-icon">{sortIcon('count')}</span></th
				>
				<th class="header" on:click={() => sortBy('lowCount')}
					>LowCount <span class="sort-icon">{sortIcon('lowCount')}</span></th
				>
				<th class="header" on:click={() => sortBy('cost')}
					>Cost <span class="sort-icon">{sortIcon('cost')}</span></th
				>
				<th class="header" on:click={() => sortBy('storageType')}
					>Storage Type <span class="sort-icon">{sortIcon('storageType')}</span></th
				>
				<th />
			</tr>

			<tr>
				<th class="instruction">Click to edit</th>
				<th class="instruction">Click to edit</th>
				<th class="instruction">Not editable</th>
				<th class="instruction">Click to edit</th>
				<th class="instruction">Click to edit</th>
				<th class="instruction">Click to edit</th>
				<th />
			</tr>
		</thead>
		<tbody>
			{#each items as item (item.id)}
				<tr>
					<td class="editable-cell" on:click={() => handleEditName(item.id, item.name)}
						>{item.name}</td
					>
					<td class="editable-cell" on:click={() => handleEditBarcode(item.id, item.barcode)}
						>{item.barcode}</td
					>
					<td>{item.count}</td>
					{#if item.lowCount != null}
						<td class="editable-cell" on:click={() => handleEditLowCount(item.id, item.lowCount)}
							>{item.lowCount}</td
						>
					{:else}
						<td class="editable-cell" on:click={() => handleEditLowCount(item.id, item.lowCount)} />
					{/if}

					{#if item.cost != null}
						<td class="editable-cell" on:click={() => handleEditCost(item.id, item.cost)}
							>{item.cost}</td
						>
					{:else}
						<td class="editable-cell" on:click={() => handleEditCost(item.id, item.cost)} />
					{/if}
					<td
						class="editable-cell"
						on:click={() => handleEditStorageType(item.id, item.storageType)}>{item.storageType}</td
					>

					<td
						><button class="btn btn-danger" on:click={() => handleDelete(item.id)}>Delete</button
						></td
					>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	table {
		table-layout: fixed; /* This can help stabilize column widths */
		width: 100%;
	}
	.editable-cell:hover {
		background-color: #b3ddff;
		/* A light grey color */
	}
	.sort-icon {
		display: none;
		margin-left: 5px;
	}

	.header {
		position: relative;
		border: 2px solid transparent; /* Invisible border */
	}
	.header:hover::after {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		border: 4px solid black;
		pointer-events: none; /* Ensures the pseudo-element doesn't interfere with click events */
	}

	.header:hover .sort-icon {
		display: inline !important;
	}

	/* can you make the css of the second table row none bold */
	.instruction {
		font-weight: normal;
		font-size: smaller;
	}
</style>
