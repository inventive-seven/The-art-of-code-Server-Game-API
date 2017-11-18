const fs = require('fs');
const path = require('path');

const singleton = Symbol();
const singletonMemory = Symbol();
const DB = require("./lib/db");

class Memory {
	constructor(memory) {
		if (memory !== singletonMemory) {
			throw new Error('Cannot construct singleton');
		}

		this._type = 'Memory';
		this._locations = {};
		this._items = {};
		this._staticObjects = {};
		this._players = {};
		this._dynamicObjects = {};

		let locationsPath = path.join(__dirname, '../resource/locations.json'),
			itemsPath = path.join(__dirname, '../resource/items.json');

		LoadInMemoryJson(locationsPath, this._locations);
		LoadInMemoryJson(itemsPath, this._items);
		LoadInMemoryFromDB('heroes', this._players);
		LoadInMemoryFromDB('objects', this._staticObjects);
	}

	static get instance() {
		if (!this[singleton]) {
			this[singleton] = new Memory(singletonMemory);
		}
		return this[singleton];
	}

	LoadInMemoryJson(resourcePath, resourceContainer) {
		fs.readFile(resourcePath, 'utf8', function(err, data) {
			if (!err) {
				console.log(`Success read resource ${resourcePath}`);
				resourceContainer = JSON.parse(data);
			} else {
				console.log(`Error read resource ${resourcePath}`);
			}
		});
	}

	LoadInMemoryFromDB(tableName, resourceContainer) {
		DB.loadContent(tableName)
			.then(resources => {
				resourceContainer = resources;
			})
			.catch(err => {
				console.log(err);
				reject(err);
			})
	}

	get type() {
		return this._type;
	}

	set type(value) {
		this._type = value;
	}
}


export Memory;