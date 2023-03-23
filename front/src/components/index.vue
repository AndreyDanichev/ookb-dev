<script setup>
import 'bootstrap/dist/css/bootstrap.min.css'
import { ref, computed } from 'vue'
import { inject } from 'vue';
import departments from '../static/departments.json'

const http = inject('$axios')

const types = ref([])
const items = ref([])
const activeType = ref(undefined)
const department = ref(undefined)
let item = ''
const selectedItems = ref([])

types.value = (await http.get('types'))
items.value = (await http.get('items'))

const filteredItems = computed(() => {
	return items.value.filter(e => e.type === activeType.value)
})

const addOne = () => {
	if (item.trim()) {
		selectedItems.value.push(item)
		item = ''
	}
}

const deleteOne = (idx) => {
	selectedItems.value.splice(idx, 1)
}

const createRequest = () => {
	if (selectedItems.value) {
		const dataToSave = {
			department: department.value,
			items: [...selectedItems.value]
		}
		http.post('/create-request', dataToSave, {
			responseType: 'blob'
		}).then((file) => {
			const blob = new Blob([file], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
			const link = document.createElement('a');
			link.href = URL.createObjectURL(blob);
			link.download = 'report.xlsx';
			link.click();
			URL.revokeObjectURL(link.href);
			department.value = undefined
			selectedItems.value.length = 0
			activeType.value = undefined
		})
	}
}

</script>

<template>
	<span>Отделение:</span>
	<select class="form-select" v-model="department" style="margin-bottom: 20px;">
		<option :selected="el[0]" v-for="(el, idx) in departments.items" :key="idx">{{ el }}</option>
	</select>
	<span style="display: block; margin-top: 20px;">Категория:</span>
	<select class="form-select" v-model="activeType" style="margin-bottom: 20px;">
		<option :selected="el[0]" v-for="el in types" :key="el.id">{{ el.name }}</option>
	</select>
	<div v-show="activeType">
		<label for="exampleDataList" class="form-label">Введите название:</label>
		<div style="display: flex; flex-flow: row nowrap; column-gap: 20px;">
			<input class="form-control" list="datalistOptions" id="exampleDataList" placeholder="Type to search..."
				v-model="item">
			<datalist id="datalistOptions">
				<option v-for="el in filteredItems" :key="el.id" :value="el.name" />
			</datalist>
			<button style="flex-shrink: 0;" type="button" class="btn btn-primary" @click="addOne">Добавить единицу</button>
		</div>

	</div>
	<div style="display: flex; flex-flow: column; padding: 10px; row-gap: 10px;">
		<div class="row" v-for="el, idx in selectedItems" :key="idx">{{ el }} <span class="cross" @click="deleteOne(idx)" />
		</div>
	</div>
	<button style="margin: 20px 0 0;" type="button" class="btn btn-primary" :disabled="!selectedItems.length"
		@click="createRequest">Сформировать
		требование</button>
</template>

<style scoped>
.cross {
	position: relative;
	width: 20px;
	height: 20px;
	cursor: pointer;
	display: block;
	margin: 0 0 0 20px;
}

.cross:before,
.cross:after {
	content: "";
	position: absolute;
	width: 20px;
	height: 2px;
	background: #000000;
	top: 50%;
	right: 0;
	transform: translateY(-50%);
}

.cross:before {
	transform: rotate(45deg);
}

.cross:after {
	transform: rotate(-45deg);
}
</style>
