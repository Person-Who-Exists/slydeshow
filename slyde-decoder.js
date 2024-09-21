const showJson = '{"name": "Example show", "type": "canvas", "1": { "object-one": { "type": "trigger_delay", "delay": 5000, "target": ["object-two"]}}'

var parsedJson = JSON.parse(showJson)

function getObjectsFromSlideNumber(slideNumber) {
	return parsedJson[slideNumber]
}
