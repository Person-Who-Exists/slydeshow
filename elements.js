/*
// Welcome to asynchronous hell
// Make sure to read contribute.md if you wish to make any contributions
*/
``
let settings = new Map()
settings.set("tick-rate", 30)

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
	constructor(xPos = 0, yPos = 0, timeFunction = "x", time = 0, target = "", end = [], after = []) {
		this.xPos = xPos;
		this.yPos = yPos;
		this.timeFunction = timeFunction;		// ex: x, x**2, -0.5x**2+2x
		this.time = time						// This is the time (in seconds) the animation takes to complete
		this.target = globalThis[target];
		this.end = end;							// This is the end position of the animation
		this.start;								// Each animation has it's own start defaults
		this.after = after;						// Sets other animations to run after this one
		this.progress = 0						// Sets the starting progress for the animation timer
	}

	solveTime(x) {
		try {
			// Convert time func to a Js function
			const func = new Function('x', `return ${this.timeFunction};`);

			// Evaluate the function with the input value
			return func(x);
		}
		catch (error) {
			console.error(`error solving function: ${this.timeFunction}`);
			return null;
		}
	}
}

/*
// Triggers
*/
class triggerStart extends triggerBasic {
	constructor(xPos, yPos, targets) {
		super(xPos, yPos, targets);
		// Once the renderer is finish, make it wait for that to finish
		trigger(targets);
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
		this.iterations = 0;
	}
	activate() {
		let intervalId = setInterval(() => {
			if (this.iterations > this.loops) {
				clearInterval(intervalId);
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

class triggerPalette extends triggerBasic {
	constructor(xPos, yPos, palette) {
		super(xPos, yPos, []);

		const parsedJson = JSON.parse(palette);
		this.paletteDark = new Map(Object.entries(parsedJson.dark));
		this.paletteLight = new Map(Object.entries(parsedJson.light));

		this.colorState = settings.get("colorPalette");
	}
	getColor(type) {
		if (this.colorState == "dark") {
			return this.paletteDark.get(type);
		}
		else {
			return this.paletteLight.get(type);
		}
	}

	activate() {
		this.colorState = this.colorState === "light" ? "dark" : "light";
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
// Attachments
*/
class attachmentBorder extends attachmentBasic {
	constructor(content, style, parent) {
		super(content, style, parent)
	}
}

/*
// Animations
*/
class animationTranslate extends animationBasic {
	constructor(xPos = 0, yPos = 0, timeFunction = "x", time = 0, target = "", end = [], after = []) {
		super(xPos = 0, yPos = 0, timeFunction = "x", time = 0, target = "", end = [], after = [])

		this.start[0] = this.target.xPos;
		this.start[1] = this.target.yPos;
		this.progress
	}
	activate() {

	}
	tick() {
		let animProgress = this.solveTime(this.progress)

		this.target.xPos = (this.start[0] + (animProgress * (this.end[0] - this.start[0])))
		this.target.yPos = (this.start[1] + (animProgress * (this.end[1] - this.start[1])))

		this.progress += ((1 / settings.get("tick-rate")) * this.time)
	}
}

class animationRotate extends animationBasic {
	constructor(xPos = 0, yPos = 0, timeFunction = "x", time = 0, target = "", end = [], after = []) {
		super(xPos = 0, yPos = 0, timeFunction = "x", time = 0, target = "", end = [], after = [])

		this.start[0] = this.target.rotation;
	}
	activate() {

	}
	tick() {
		let animProgress = this.solveTime(this.progress)

		this.target.rotation = (this.start[0] + (animProgress * (this.end[0] - this.start[0])))

		this.progress += ((1 / settings.get("tick-rate")) * this.time)
	}
}

class animationScale extends animationBasic {
	constructor(xPos = 0, yPos = 0, timeFunction = "x", target = "", end = [], after = []) {
		super(xPos = 0, yPos = 0, timeFunction = "x", target = "", end = [], after = [])

		this.start[0] = this.target.height;
		this.start[1] = this.target.width;
	}
	activate() {

	}
	tick() {

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

globalThis["loop"] = new triggerLoop(1, 1, ["counter"], 100, 35);
globalThis["counter"] = new triggerCounter(1, 1, ["debug"], 5, true);
globalThis["debug"] = new debugLog("Triggers every 5 activations");

globalThis["delay"] = new triggerDelay(1, 1, ["debugger2"], 2000)
globalThis["debugger2"] = new debugLog("Triggers after 1/4th of a second")

globalThis["starter"] = new triggerStart(1, 1, ["loop", "delay"])
