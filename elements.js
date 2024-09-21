class trigger_basic {
	constructor(xPos, yPos, targets) {
		this.xPos = xPos;
		this.yPos = yPos;
		this.targets = targets;
	}
}

class element_basic {
	constructor(xPos, yPos, width, height, rotation, content) {
		this.xPos = xPos;
		this.yPos = yPos;
		this.width = width;
		this.height = height;
		this.rotation = rotation;
		this.content = content
	}

	getPropertyPairs() {
		try {
			const propertyNames = Object.getOwnPropertyNames(MyClass.prototype);

			const propertyPairs = propertyNames
				.map((propertyName) => {
					const descriptor = Object.getOwnPropertyDescriptor(
						MyClass.prototype,
						propertyName,
					);
					if (!descriptor) return null;

					const value =
						descriptor.value !== undefined
							? descriptor.value.call(this)
							: descriptor.initialValue;
					return [propertyName, value];
				})
				.filter((pair) => pair !== null);

			return propertyPairs;
		}
		catch (error) {
			console.error("Error retrieving property pairs:", error);
			return [];
		}
	}
}

/*
// Triggers
*/
class trigger_start extends trigger_basic {
	// Make sure to create these last
	constructor(xPos, yPos, targets) {
		super(xPos, yPos, targets);
		trigger(this.targets);
	}
}

class trigger_delay extends trigger_basic {
	constructor(xPos, yPos, targets, delay) {
		super(xPos, yPos, targets);
		this.delay = delay;
	}
	activate() {
		setTimeout(() => {
			trigger(this.targets);
		}, this.delay);
	}
}

class trigger_loop extends trigger_basic {
	constructor(xPos, yPos, targets, delay, loops = Infinity) {
		super(xPos, yPos, targets);
		this.delay = delay;
		this.loops = loops;
		this.itterations = 0;
	}
	activate() {
		const intervalId = setInterval(() => {
			if (this.iterations == this.loops) {
				// Ensure you're using >= for inclusivity
				clearInterval(intervalId); // Stop the interval
				return;
			}
			trigger(this.targets);
			this.iterations++;
		}, this.delay);
	}
}

class trigger_counter extends trigger_basic {
	constructor(xPos, yPos, targets, activations) {
		super(xPos, yPos, targets);
		this.counter = 0
		this.activations = activations
	}
	activate() {
		this.counter++;
		if (this.counter == this.activations | this.counter > this.activations) {
			this.counter = 0
			this.activate(this.targets)
		}
	}
}

/*
// Elements
*/
class element_text extends element_basic {
	constructor(xPos, yPos, width, height, rotation, content) {
		super(xPos, yPos, width, height, rotation, content)
	}
}

/*
// Debugging
*/
class debug_log {
	constructor(log) {
		this.log = log;
	}
	activate() {
		console.log(this.log);
	}
}

class debug_alert {
	constructor(alert) {
		this.alert = alert;
	}
	activate() {
		alert(this.alert);
	}
}

/*
// Logic
*/
async function trigger(targets) {
	for (let target of targets) {
		let instance = globalThis[target];
		if (instance && typeof instance.activate === "function") {
			await new Promise((resolve) =>
				setTimeout(() => {
					// Js witchcraft?
					instance.activate();
					resolve();
				}, 0),
			);
		} else {
			console.error(
				`Provided instance (${instance}) is not valid or does not have an activate method.`,
			);
		}
	}
}

function createInstance(id, type, props) {
	const instance = new globalThis[type](...props);
	globalThis[id] = instance;
}

/*
// Rendering
*/
class renderQueue {
	constructor(maxItems) {
		this.maxItems = maxItems
		this.queue = []
	}
	addNewElement(id) {
		this.queue.append(id)
	}
	getElements() {

	}
}
