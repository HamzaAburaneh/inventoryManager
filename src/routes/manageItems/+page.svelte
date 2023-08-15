<script lang="ts">
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

		items = [...items, item];

		name = '';
		barcode = '';
		count = 0;
		lowCount = null;
		cost = null;
		storageType = '';

		items = applySorting(items, currentSortColumn, sortAscending);
	}

	async function handleDelete(id: string) {
		await deleteItem(id);
		items = await getItems();
		items = applySorting(items, currentSortColumn, sortAscending);
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
			confirmButtonText: 'Edit',
			showLoaderOnConfirm: true,
			preConfirm: async (newCost) => {
				if (newCost) {
					await editItemCost(id, Number(newCost));
					items = await getItems();
				}
			},
			allowOutsideClick: () => !Swal.isLoading()
		});
		items = applySorting(items, currentSortColumn, sortAscending);
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
			confirmButtonText: 'Edit',
			showLoaderOnConfirm: true,
			preConfirm: async (newBarcode) => {
				if (newBarcode) {
					await editItemBarcode(id, newBarcode);
					items = await getItems();
				}
			},
			allowOutsideClick: () => !Swal.isLoading()
		});
		items = applySorting(items, currentSortColumn, sortAscending);
	}

	//handle editname function which opens an input box to edit the name of an item and make the prompt styles look better using sweetalert2
	async function handleEditName(id: string, oldName: string) {
		await Swal.fire({
			title: 'Edit Name',
			input: 'text',
			inputValue: oldName,
			inputAttributes: {
				autocapitalize: 'off'
			},
			showCancelButton: true,
			confirmButtonText: 'Edit',
			showLoaderOnConfirm: true,
			preConfirm: async (newName) => {
				if (newName) {
					await editItemName(id, newName);
					items = await getItems();
				}
			},
			allowOutsideClick: () => !Swal.isLoading()
		});
		items = applySorting(items, currentSortColumn, sortAscending);
	}
	//handle editStorageType function which opens an input box to edit the storage type of an item and make the prompt styles look better using sweetalert2
	async function handleEditStorageType(id: string, oldStorageType: string) {
		await Swal.fire({
			title: 'Edit Storage Type',
			input: 'text',
			inputValue: oldStorageType,
			inputAttributes: {
				autocapitalize: 'off'
			},
			showCancelButton: true,
			confirmButtonText: 'Edit',
			showLoaderOnConfirm: true,
			preConfirm: async (newStorageType) => {
				if (newStorageType) {
					await editItemStorageType(id, newStorageType);
					items = await getItems();
				}
			},
			allowOutsideClick: () => !Swal.isLoading()
		});
		items = applySorting(items, currentSortColumn, sortAscending);
	}

	async function handleEditLowCount(id: string, oldLowCount: number | null) {
		//if oldLowCount is null you should still be able to edit the lowcount
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
			confirmButtonText: 'Edit',
			showLoaderOnConfirm: true,
			preConfirm: async (newLowCount) => {
				if (newLowCount) {
					await editItemLowCount(id, Number(newLowCount));
					items = await getItems();
				}
			},
			allowOutsideClick: () => !Swal.isLoading()
		});
		items = applySorting(items, currentSortColumn, sortAscending);
	}

	async function handleSearch() {
		items = await searchItems(searchValue);
		items = applySorting(items, currentSortColumn, sortAscending);
	}
	function sortBy(column: keyof Item) {
		if (currentSortColumn === column) {
			sortAscending = !sortAscending;
		} else {
			currentSortColumn = column;
			sortAscending = true;
		}
		items = applySorting(items, currentSortColumn, sortAscending);
	}
</script>

<link
	rel="stylesheet"
	href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
/>
<div class="container mt-4">
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
				<option value="freezer">Freezer</option>
				<option value="refrigerator">Refrigerator</option>
				<option value="dry storage">Dry Storage</option>
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
				<th on:click={() => sortBy('name')}>Name</th>
				<th on:click={() => sortBy('barcode')}>Barcode</th>
				<th on:click={() => sortBy('count')}>Count</th>
				<th on:click={() => sortBy('lowCount')}>LowCount</th>
				<th on:click={() => sortBy('cost')}>Cost</th>
				<th on:click={() => sortBy('storageType')}>Storage Type</th>
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
	.editable-cell:hover {
		background-color: #b3ddff;
		/* A light grey color */
	}

	/* can you make the css of the second table row none bold */
	.instruction {
		font-weight: normal;
		font-size: smaller;
	}
</style>
