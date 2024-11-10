/*
// Welcome to asynchronous hell
// Make sure to read contribute.md if you wish to make any contributions
*/

class triggerBasic {
	constructor(xPos = 0, yPos = 0 , targets) {	// Give them default positions because I don't wanna have to apply positions to every trigger
		this.xPos = xPos;						// They only have a position so that they can look nice in slydeshow/designer
		this.yPos = yPos;
		this.targets = targets;					// Is just them elements that the trigger will invoke the activate() method of
	}
}

class elementBasic {
	constructor(xPos, yPos, zPos, width, height, rotation, content, style) {
		this.xPos = xPos;
		this.yPos = yPos;
		this.zPos = zPos;			// zPos is basicly css's z-index rule
		this.width = width;
		this.height = height;
		this.rotation = rotation;
		this.content = content;		// Content is pretty generic although is used for all elements
		this.style = style;			// Used to style the element once that system is implemented

		this.attachments = [];		// This is used to notify attachments when they need to be updated
	}

	async update() {
		for (let attachmentName in attachments) {
			let attachment = globalThis[attachmentName];
			if (attachment && typeof attachment.update === "function") {
				await new Promise((resolve) =>
					setTimeout(() => {
						attachment.update();
						resolve();
					}, 0),
				);
			}
			else {
				console.error(`Provided instance (${instance}) is not valid or does not have an activate method.`,);
			}
		}
	}
}

class attachmentBasic {
	constructor(content, style, parent) {
		this.content = content;
		this.style = style;
		this.parent_element = globalThis[parent];

		this.parent_element.attachments.append(self.constructor.name.toString());

		this.update()
	}
	update() {
		this.xPos = this.parent_element.xPos;
		this.yPos = this.parent_element.yPos;
		this.zPos = this.parent_element.zPos;
		this.width = this.parent_element.height;
		this.height = this.parent_element.height;
		this.rotation = this.parent_element.rotation;
	}
}

class animationBasic {
	constructor(xPos = 0, yPos = 0, timeFunction = "x", targets = "", end = [], concurrent = [], after = []) {
		this.xPos = xPos;
		this.yPos = yPos;
		this.timeFunction = timeFunction;		// ex: x, x**2, -x**2+2x
		this.targets = targets;
		this.end = end;							// This is the end position of the animation
		this.start;								// Each animation has it's own start defaults
		this.concurrent = concurrent;			// Sets other animations to run at the same time
		this.after = after;						// Sets other animations to run after this one
	}

	solveMathFunction(x) {
		try {
			// Convert time func to a Js function
			const func = new Function('x', `return ${this.timeFunction};`);

			// Evaluate the function with the input value
			return func(x);
		}
		catch (error) {
			console.error("Error solving time function:", error.message);
			return null;
		}
	}
}

/*
// Triggers
*/
class triggerStart extends triggerBasic {
	constructor(xPos, yPos, targets) {
		super(xPos, yPos, "");	// Passing an empty string because giving it that value is redundant
		trigger(targets);		// Hopefully no race conditions because I'm starting immediately 🤞
	}
}

class triggerDelay extends triggerBasic {
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

class triggerLoop extends triggerBasic {
	constructor(xPos, yPos, targets, delay, loops = Infinity) {
		super(xPos, yPos, targets);
		this.delay = delay;
		this.loops = loops;
		this.itterations = 0;
	}
	activate() {
		let intervalId = setInterval(() => {	// Stupid fucking anonymous js functions (find better loop method)
			if (this.iterations > this.loops) {	// ⚠️ This loops forever, I don't know why, but it does ⚠️
				clearInterval(intervalId);		// Stop the interval (except that it doesn't actually work)
				return;
			}
			trigger(this.targets);
			this.iterations ++;
		}, this.delay);
	}
}

class triggerCounter extends triggerBasic {
	constructor(xPos, yPos, targets, activations, reset = true) {
		super(xPos, yPos, targets, reset);
		this.counter = 0;
		this.activations = activations;
		this.reset = reset
	}
	activate() {
		this.counter++;
		if (this.counter >= this.activations) {
			if (this.reset) {
				this.counter = 0;
			}
			trigger(this.targets);
		}
	}
}

/*
// Elements
*/
class elementText extends elementBasic {
	constructor(xPos, yPos, zPos, width, height, rotation, content, style) {
		super(xPos, yPos, zPos, width, height, rotation, content, style);
	}
}

/*
// Debugging
// These should only be used for debugging as
// they lack the features of a normal trigger
// they may also crash a theoretical editor
*/

class debugLog {
	constructor(log) {
		this.log = log;
	}
	activate() {
		console.log(this.log);
	}
}

class debugAlert {
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

globalThis["loop"] = new triggerLoop(1, 1, ["counter"], 1000, 10);
globalThis["counter"] = new triggerCounter(1, 1, [""], 5, true);
globalThis["debug"] = new debugLog("Triggers after 5 activations");
