module.exports = {
	component: require("./FormGenerator.vue"),
	schema: require("./utils/schema.js"),
	validators: require("./utils/validators.js"),
	abstractField: require("./fields/abstractField").default,

	install(Vue) {
		Vue.component("FormGenerator", module.exports.component);
	}
};