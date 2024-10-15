/*
// Welcome to asynchronous hell
// Make sure to read contribute.md if you wish to make any contributions
*/

class trigger_basic {
	constructor(xPos = 0, yPos = 0 , targets) {	// Give them default positions because I don't wanna have to apply positions to every trigger
		this.xPos = xPos;						// They only have a position so that they can look nice in slydeshow/designer
		this.yPos = yPos;
		this.targets = targets;					// Is just them elements that the trigger will invoke the activate() method of
	}
}

class element_basic {
	constructor(xPos, yPos, zPos, width, height, rotation, content) {
		this.xPos = xPos;
		this.yPos = yPos;
		this.zPos = zPos;			// zPos is basicly css's z-index rule
		this.width = width;
		this.height = height;
		this.rotation = rotation;
		this.content = content;		// Content is pretty generic although is used for all elements
	}
}

/*
// Triggers
*/
class trigger_start extends trigger_basic {
	constructor(xPos, yPos, targets) {
		super(xPos, yPos, "");	// Passing an empty string because giving it that value is redundant
		trigger(targets);		// Hopefully no race conditions because I'm starting immediately 🤞
	}
}

class trigger_delay extends trigger_basic {
	constructor(xPos, yPos, targets, delay) {
		super(xPos, yPos, targets);
		this.delay = delay;
	}
	activate() {
		setTimeout(() => {	// Why is delay in js so fucking stupid? There has to be a better way than using an anonymous function!
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
		let intervalId = setInterval(() => {	// Stupid fucking anonymous js functions (find better loop method)
			if (this.iterations == this.loops) {
												// ⚠️ This loops forever, I don't know why, but it does ⚠️
				clearInterval(intervalId);		// Stop the interval (except that it doesn't actually work)
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
		if (this.counter >= this.activations) {
			this.counter = 0
			this.activate(this.targets)
		}
	}
}

/*
// Elements
*/
class element_text extends element_basic {
	constructor(xPos, yPos, zPos, width, height, rotation, content) {
		super(xPos, yPos, zPos, width, height, rotation, content)
	}
}

/*
// Debugging
// These should only be used for debugging as
// they lack the features of a normal trigger
// they may also crash a theoretical editor
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
					// Js witchcraft? Js witchcraft.
					instance.activate();
					resolve();
				}, 0),
			);
		}
		else {
			console.error(`Provided instance (${instance}) is not valid or does not have an activate method.`,);
		}
	}
}

/*
// Rendering
*/
