import { mysqlTable, mysqlSchema, AnyMySqlColumn, primaryKey, bigint, varchar, datetime, decimal, text, int, json, unique, date, smallint, tinyint } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const actionPlan = mysqlTable("action_plan", {
	id: bigint({ mode: "number" }).notNull(),
	description: varchar({ length: 255 }),
	createdAt: datetime("created_at", { mode: 'string'}),
	createdBy: varchar("created_by", { length: 255 }),
	finalizedAt: datetime("finalized_at", { mode: 'string'}),
	finalizedBy: varchar("finalized_by", { length: 255 }),
	actionPlanStatus: varchar("action_plan_status", { length: 255 }),
	initialIndicatorValue: decimal("initial_indicator_value", { precision: 10, scale: 2 }),
	finalIndicatorValue: decimal("final_indicator_value", { precision: 10, scale: 2 }),
	geoLocationId: bigint("geo_location_id", { mode: "number" }),
	logicalLocationId: bigint("logical_location_id", { mode: "number" }),
	geoLocationCode: varchar("geo_location_code", { length: 255 }),
	logicalLocationCode: varchar("logical_location_code", { length: 255 }),
	indicatorId: bigint("indicator_id", { mode: "number" }),
	actionPlanTemplateId: bigint("action_plan_template_id", { mode: "number" }),
	criticalMomentId: bigint("critical_moment_id", { mode: "number" }),
	criticalMomentCode: varchar("critical_moment_code", { length: 255 }),
	initialSurveyCount: bigint("initial_survey_count", { mode: "number" }),
	finalSurveyCount: bigint("final_survey_count", { mode: "number" }),
	tag: varchar({ length: 256 }),
	actionPlanTarget: varchar("action_plan_target", { length: 64 }),
	libraryStatus: varchar("library_status", { length: 32 }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "action_plan_id"}),
]);

export const actionPlanActivity = mysqlTable("action_plan_activity", {
	id: bigint({ mode: "number" }).notNull(),
	description: varchar({ length: 4096 }),
	createdAt: datetime("created_at", { mode: 'string'}),
	createdBy: varchar("created_by", { length: 255 }),
	progress: decimal({ precision: 10, scale: 2 }),
	actionPlanId: bigint("action_plan_id", { mode: "number" }),
	dateFrom: datetime("date_from", { mode: 'string'}),
	dateTo: datetime("date_to", { mode: 'string'}),
	responsable: varchar({ length: 255 }),
	support: varchar({ length: 255 }),
	status: varchar({ length: 32 }),
	lastModifiedAt: datetime("last_modified_at", { mode: 'string'}),
	lastModifiedBy: varchar("last_modified_by", { length: 254 }),
	responsableMail: varchar("responsable_mail", { length: 254 }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "action_plan_activity_id"}),
]);

export const actionPlanActivityComment = mysqlTable("action_plan_activity_comment", {
	id: bigint({ mode: "number" }).notNull(),
	createdAt: datetime("created_at", { mode: 'string'}).notNull(),
	createdBy: varchar("created_by", { length: 255 }),
	createdByName: varchar("created_by_name", { length: 255 }),
	text: text().notNull(),
	actionPlanActivityId: bigint("action_plan_activity_id", { mode: "number" }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "action_plan_activity_comment_id"}),
]);

export const actionPlanActivityEvidence = mysqlTable("action_plan_activity_evidence", {
	id: bigint({ mode: "number" }).notNull(),
	createdAt: datetime("created_at", { mode: 'string'}),
	name: varchar({ length: 255 }),
	type: varchar({ length: 255 }),
	// Warning: Can't parse longblob from database
	// longblobType: longblob("file"),
	actionPlanActivityId: bigint("action_plan_activity_id", { mode: "number" }).notNull(),
	createdBy: varchar("created_by", { length: 255 }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "action_plan_activity_evidence_id"}),
]);

export const actionPlanCause = mysqlTable("action_plan_cause", {
	id: bigint({ mode: "number" }).notNull(),
	priority: int(),
	cause: varchar({ length: 1024 }),
	problem: varchar({ length: 1024 }),
	actionPlanId: bigint("action_plan_id", { mode: "number" }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "action_plan_cause_id"}),
]);

export const actionPlanLog = mysqlTable("action_plan_log", {
	id: bigint({ mode: "number" }).notNull(),
	createdAt: datetime("created_at", { mode: 'string'}).notNull(),
	userLogin: varchar("user_login", { length: 255 }).notNull(),
	userEmail: varchar("user_email", { length: 255 }).notNull(),
	event: varchar({ length: 255 }).notNull(),
	description: varchar({ length: 1024 }).notNull(),
	actionPlanId: bigint("action_plan_id", { mode: "number" }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "action_plan_log_id"}),
]);

export const actionPlanTemplate = mysqlTable("action_plan_template", {
	id: bigint({ mode: "number" }).notNull(),
	name: varchar({ length: 255 }),
	description: varchar({ length: 255 }),
	indicatorId: bigint("indicator_id", { mode: "number" }),
	criticalMomentId: bigint("critical_moment_id", { mode: "number" }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "action_plan_template_id"}),
]);

export const actionPlanTemplateActivity = mysqlTable("action_plan_template_activity", {
	id: bigint({ mode: "number" }).notNull(),
	description: varchar({ length: 4096 }),
	actionPlanTemplateId: bigint("action_plan_template_id", { mode: "number" }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "action_plan_template_activity_id"}),
]);

export const alert = mysqlTable("alert", {
	id: bigint({ mode: "number" }).notNull(),
	name: varchar({ length: 255 }),
	description: varchar({ length: 255 }),
	createdAt: datetime("created_at", { mode: 'string'}),
	alertStatus: varchar("alert_status", { length: 255 }),
	limetropyUserId: bigint("limetropy_user_id", { mode: "number" }),
	surveyResponseId: bigint("survey_response_id", { mode: "number" }),
	triggerResponseId: bigint("trigger_response_id", { mode: "number" }),
	createdBy: varchar("created_by", { length: 255 }),
	updatedBy: varchar("updated_by", { length: 255 }),
	updatedAt: datetime("updated_at", { mode: 'string'}),
	surveyResponseComment: text("survey_response_comment"),
	alertType: varchar("alert_type", { length: 32 }),
	humanSurvey: text("human_survey"),
	firstUpdatedAt: datetime("first_updated_at", { mode: 'string'}),
	firstUpdatedBy: varchar("first_updated_by", { length: 255 }),
	finalizedAt: datetime("finalized_at", { mode: 'string'}),
},
(table) => [
	primaryKey({ columns: [table.id], name: "alert_id"}),
]);

export const alertComment = mysqlTable("alert_comment", {
	id: bigint({ mode: "number" }).notNull(),
	createdAt: datetime("created_at", { mode: 'string'}).notNull(),
	createdBy: varchar("created_by", { length: 255 }),
	alertId: bigint("alert_id", { mode: "number" }),
	text: text(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "alert_comment_id"}),
]);

export const alertEvidence = mysqlTable("alert_evidence", {
	id: bigint({ mode: "number" }).notNull(),
	createdAt: datetime("created_at", { mode: 'string'}).notNull(),
	name: varchar({ length: 255 }).notNull(),
	type: varchar({ length: 255 }).notNull(),
	// Warning: Can't parse longblob from database
	// longblobType: longblob("file").notNull(),
	alertId: bigint("alert_id", { mode: "number" }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "alert_evidence_id"}),
]);

export const brandQuestion = mysqlTable("brand_question", {
	id: bigint({ mode: "number" }).notNull(),
	questionId: bigint("question_id", { mode: "number" }).notNull(),
	logicalLocationId: bigint("logical_location_id", { mode: "number" }).notNull(),
	description: varchar({ length: 255 }),
	questionText: varchar("question_text", { length: 255 }),
	questionTextEnglish: varchar("question_text_english", { length: 255 }),
	questionOptionsId: bigint("question_options_id", { mode: "number" }),
	mandatory: tinyint(),
	questionCondition: varchar("question_condition", { length: 255 }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "brand_question_id"}),
]);

export const channel = mysqlTable("channel", {
	id: bigint({ mode: "number" }).notNull(),
	name: varchar({ length: 255 }),
	description: varchar({ length: 255 }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "channel_id"}),
]);

export const cluster = mysqlTable("cluster", {
	id: bigint({ mode: "number" }).notNull(),
	name: varchar({ length: 255 }),
	description: varchar({ length: 255 }),
	active: tinyint(),
	code: varchar({ length: 16 }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "cluster_id"}),
]);

export const configProperty = mysqlTable("config_property", {
	id: bigint({ mode: "number" }).notNull(),
	key: varchar({ length: 255 }).notNull(),
	simpleValue: varchar("simple_value", { length: 255 }),
	objectValue: text("object_value"),
},
(table) => [
	primaryKey({ columns: [table.id], name: "config_property_id"}),
]);

export const criticalMoment = mysqlTable("critical_moment", {
	id: bigint({ mode: "number" }).notNull(),
	name: varchar({ length: 255 }),
	description: varchar({ length: 255 }),
	searchCodeFrom: varchar("search_code_from", { length: 255 }),
	searchCodeTo: varchar("search_code_to", { length: 255 }),
	searchOrder: int("search_order"),
	parentId: bigint("parent_id", { mode: "number" }),
	code: varchar({ length: 16 }),
	configurationUi: text("configuration_ui"),
	dashboardId: bigint("dashboard_id", { mode: "number" }),
	priority: int(),
	logicalLocationId: bigint("logical_location_id", { mode: "number" }),
	tags: varchar({ length: 1024 }),
	parentSurveyId: bigint("parent_survey_id", { mode: "number" }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "critical_moment_id"}),
]);

export const dashboard = mysqlTable("dashboard", {
	id: bigint({ mode: "number" }).notNull(),
	title: varchar({ length: 100 }).notNull(),
	description: varchar({ length: 256 }).notNull(),
	config: json(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "dashboard_id"}),
]);

export const databasechangelog = mysqlTable("databasechangelog", {
	id: varchar({ length: 255 }).notNull(),
	author: varchar({ length: 255 }).notNull(),
	filename: varchar({ length: 255 }).notNull(),
	dateexecuted: datetime({ mode: 'string'}).notNull(),
	orderexecuted: int().notNull(),
	exectype: varchar({ length: 10 }).notNull(),
	md5Sum: varchar({ length: 35 }),
	description: varchar({ length: 255 }),
	comments: varchar({ length: 255 }),
	tag: varchar({ length: 255 }),
	liquibase: varchar({ length: 20 }),
	contexts: varchar({ length: 255 }),
	labels: varchar({ length: 255 }),
	deploymentId: varchar("deployment_id", { length: 10 }),
});

export const databasechangeloglock = mysqlTable("databasechangeloglock", {
	id: int().notNull(),
	locked: tinyint().notNull(),
	lockgranted: datetime({ mode: 'string'}),
	lockedby: varchar({ length: 255 }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "databasechangeloglock_id"}),
]);

export const dynamicReport = mysqlTable("dynamic_report", {
	id: bigint({ mode: "number" }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: varchar({ length: 255 }),
	dynamicReport: text("dynamic_report").notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "dynamic_report_id"}),
]);

export const geoLocation = mysqlTable("geo_location", {
	id: bigint({ mode: "number" }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	searchCodeFrom: varchar("search_code_from", { length: 255 }),
	searchCodeTo: varchar("search_code_to", { length: 255 }),
	searchOrder: int("search_order"),
	description: varchar({ length: 255 }).notNull(),
	parentId: bigint("parent_id", { mode: "number" }),
	code: varchar({ length: 16 }),
	logicalLocationId: bigint("logical_location_id", { mode: "number" }),
	level: varchar({ length: 255 }),
	coordinateX: decimal("coordinate_x", { precision: 19, scale: 15 }),
	coordinateY: decimal("coordinate_y", { precision: 19, scale: 15 }),
	branchType: varchar("branch_type", { length: 256 }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "geo_location_id"}),
]);

export const geoLocationLogical = mysqlTable("geo_location_logical", {
	geoLocationId: bigint("geo_location_id", { mode: "number" }).notNull(),
	logicalLocationId: bigint("logical_location_id", { mode: "number" }).notNull(),
});

export const globalAuthority = mysqlTable("global_authority", {
	name: varchar({ length: 50 }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.name], name: "global_authority_name"}),
]);

export const globalTenant = mysqlTable("global_tenant", {
	id: bigint({ mode: "number" }).notNull(),
	name: varchar({ length: 100 }).notNull(),
	description: varchar({ length: 256 }).notNull(),
	phone: varchar({ length: 256 }),
	email: varchar({ length: 256 }),
	address: varchar({ length: 256 }),
	status: varchar({ length: 32 }),
	notes: text(),
	createdBy: varchar("created_by", { length: 50 }),
	createdDate: datetime("created_date", { mode: 'string'}),
	lastModifiedBy: varchar("last_modified_by", { length: 50 }),
	lastModifiedDate: datetime("last_modified_date", { mode: 'string'}),
	code: varchar({ length: 255 }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "global_tenant_id"}),
	unique("tenant_code_uk").on(table.code),
	unique("tenant_name_uk").on(table.name),
]);

export const globalUser = mysqlTable("global_user", {
	id: bigint({ mode: "number" }).notNull(),
	login: varchar({ length: 50 }).notNull(),
	passwordHash: varchar("password_hash", { length: 60 }).notNull(),
	firstName: varchar("first_name", { length: 50 }),
	lastName: varchar("last_name", { length: 50 }),
	email: varchar({ length: 254 }),
	imageUrl: varchar("image_url", { length: 256 }),
	activated: tinyint().notNull(),
	langKey: varchar("lang_key", { length: 6 }),
	activationKey: varchar("activation_key", { length: 20 }),
	resetKey: varchar("reset_key", { length: 20 }),
	createdBy: varchar("created_by", { length: 50 }).notNull(),
	createdDate: datetime("created_date", { mode: 'string'}),
	resetDate: datetime("reset_date", { mode: 'string'}),
	lastModifiedBy: varchar("last_modified_by", { length: 50 }),
	lastModifiedDate: datetime("last_modified_date", { mode: 'string'}),
	tenantAdmin: tinyint("tenant_admin"),
	tenantId: bigint("tenant_id", { mode: "number" }),
	enabled: tinyint().notNull(),
	tempPassword: varchar("temp_password", { length: 255 }),
	phone: varchar({ length: 255 }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "global_user_id"}),
]);

export const globalUserAuthority = mysqlTable("global_user_authority", {
	userId: bigint("user_id", { mode: "number" }).notNull(),
	authorityName: varchar("authority_name", { length: 50 }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.userId, table.authorityName], name: "global_user_authority_user_id_authority_name"}),
]);

export const indicator = mysqlTable("indicator", {
	id: bigint({ mode: "number" }).notNull(),
	name: varchar({ length: 255 }),
	description: varchar({ length: 255 }),
	expectedValue: decimal("expected_value", { precision: 13, scale: 6 }),
	formula: varchar({ length: 255 }),
	eligiblePlan: tinyint("eligible_plan").default(1).notNull(),
	exclusive: tinyint().notNull(),
	parentQuestionId: bigint("parent_question_id", { mode: "number" }),
	widgetName: varchar("widget_name", { length: 255 }),
	source: varchar({ length: 64 }),
	formulaConfig: varchar("formula_config", { length: 255 }),
	alias: varchar({ length: 255 }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "indicator_id"}),
]);

export const indicatorCriticalMoment = mysqlTable("indicator_critical_moment", {
	indicatorId: bigint("indicator_id", { mode: "number" }),
	criticalMomentId: bigint("critical_moment_id", { mode: "number" }),
});

export const indicatorLocation = mysqlTable("indicator_location", {
	id: bigint({ mode: "number" }).notNull(),
	indicatorId: bigint("indicator_id", { mode: "number" }).notNull(),
	logicalLocationId: bigint("logical_location_id", { mode: "number" }).notNull(),
	expectedValue: decimal("expected_value", { precision: 13, scale: 6 }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "indicator_location_id"}),
]);

export const indicatorQuestion = mysqlTable("indicator_question", {
	indicatorId: bigint("indicator_id", { mode: "number" }),
	questionId: bigint("question_id", { mode: "number" }),
});

export const jhiPersistentAuditEvent = mysqlTable("jhi_persistent_audit_event", {
	eventId: bigint("event_id", { mode: "number" }).notNull(),
	principal: varchar({ length: 50 }).notNull(),
	eventDate: datetime("event_date", { mode: 'string'}),
	eventType: varchar("event_type", { length: 255 }),
},
(table) => [
	primaryKey({ columns: [table.eventId], name: "jhi_persistent_audit_event_event_id"}),
]);

export const jhiPersistentAuditEvtData = mysqlTable("jhi_persistent_audit_evt_data", {
	eventId: bigint("event_id", { mode: "number" }).notNull(),
	name: varchar({ length: 150 }).notNull(),
	value: varchar({ length: 255 }),
},
(table) => [
	primaryKey({ columns: [table.eventId, table.name], name: "jhi_persistent_audit_evt_data_event_id_name"}),
]);

export const limetropyUser = mysqlTable("limetropy_user", {
	id: bigint({ mode: "number" }).notNull(),
	externalCode: varchar("external_code", { length: 255 }),
	geoLocationId: bigint("geo_location_id", { mode: "number" }),
	logicalLocationId: bigint("logical_location_id", { mode: "number" }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "limetropy_user_id"}),
]);

export const logicalLocation = mysqlTable("logical_location", {
	id: bigint({ mode: "number" }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	searchCodeFrom: varchar("search_code_from", { length: 255 }),
	searchCodeTo: varchar("search_code_to", { length: 255 }),
	searchOrder: int("search_order"),
	description: varchar({ length: 255 }).notNull(),
	parentId: bigint("parent_id", { mode: "number" }),
	code: varchar({ length: 16 }),
	brand: tinyint().default(1).notNull(),
	level: varchar({ length: 255 }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "logical_location_id"}),
]);

export const notification = mysqlTable("notification", {
	id: bigint({ mode: "number" }).notNull(),
	version: int(),
	token: varchar({ length: 255 }),
	sentAt: datetime("sent_at", { mode: 'string'}),
	createdAt: datetime("created_at", { mode: 'string'}),
	updatedAt: datetime("updated_at", { mode: 'string'}),
	expiredAt: datetime("expired_at", { mode: 'string'}),
	surveyResponseId: bigint("survey_response_id", { mode: "number" }),
	notificationNumber: int("notification_number"),
	sendError: varchar("send_error", { length: 255 }),
	trackingId: varchar("tracking_id", { length: 255 }),
	trackingStatus: int("tracking_status"),
	trackingSentAt: datetime("tracking_sent_at", { mode: 'string'}),
	trackingRequestedAt: datetime("tracking_requested_at", { mode: 'string'}),
	notificationType: varchar("notification_type", { length: 32 }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "notification_id"}),
]);

export const precalcValues = mysqlTable("precalc_values", {
	id: bigint({ mode: "number" }).notNull(),
	filterKey: varchar("filter_key", { length: 2048 }),
	dateRangeKey: varchar("date_range_key", { length: 256 }),
	indicatorName: varchar("indicator_name", { length: 255 }),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	dateFrom: date("date_from", { mode: 'string' }),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	dateTo: date("date_to", { mode: 'string' }),
	values: json(),
	partial: tinyint().notNull(),
	updatedAt: datetime("updated_at", { mode: 'string'}),
},
(table) => [
	primaryKey({ columns: [table.id], name: "precalc_values_id"}),
]);

export const question = mysqlTable("question", {
	id: bigint({ mode: "number" }).notNull(),
	name: varchar({ length: 255 }),
	description: varchar({ length: 255 }),
	questionText: varchar("question_text", { length: 255 }),
	questionType: varchar("question_type", { length: 255 }),
	defaultValue: varchar("default_value", { length: 255 }),
	multiple: tinyint(),
	criticalMomentId: bigint("critical_moment_id", { mode: "number" }),
	questionTypeParams: varchar("question_type_params", { length: 255 }),
	questionCondition: varchar("question_condition", { length: 255 }),
	questionOptionsId: bigint("question_options_id", { mode: "number" }),
	mandatory: tinyint(),
	questionTextEnglish: varchar("question_text_english", { length: 255 }),
	uiConfig: json("ui_config"),
	customPropIndex: smallint("custom_prop_index"),
	origin: varchar({ length: 64 }),
	userSurveyFilter: tinyint("user_survey_filter"),
	userAlertFilter: tinyint("user_alert_filter"),
	parentSurveyId: bigint("parent_survey_id", { mode: "number" }),
	collectionType: varchar("collection_type", { length: 64 }),
	questionFormat: varchar("question_format", { length: 64 }),
	alias: varchar({ length: 255 }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "question_id"}),
]);

export const questionOptions = mysqlTable("question_options", {
	id: bigint({ mode: "number" }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: varchar({ length: 255 }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "question_options_id"}),
]);

export const questionOptionsValue = mysqlTable("question_options_value", {
	id: bigint({ mode: "number" }).notNull(),
	value: varchar({ length: 255 }).notNull(),
	questionOptionsId: bigint("question_options_id", { mode: "number" }).notNull(),
	spanishText: varchar("spanish_text", { length: 255 }),
	englishText: varchar("english_text", { length: 255 }),
	criticalMomentId: bigint("critical_moment_id", { mode: "number" }),
	updatedAt: datetime("updated_at", { mode: 'string'}),
},
(table) => [
	primaryKey({ columns: [table.id], name: "question_options_value_id"}),
]);

export const questionResponse = mysqlTable("question_response", {
	id: bigint({ mode: "number" }).notNull(),
	textAnswer: varchar("text_answer", { length: 255 }),
	numberAnswer: int("number_answer"),
	surveyResponseId: bigint("survey_response_id", { mode: "number" }),
	questionId: bigint("question_id", { mode: "number" }),
	createdAt: datetime("created_at", { mode: 'string'}),
	decimalAnswer: decimal("decimal_answer", { precision: 13, scale: 6 }),
	criticalMomentId: bigint("critical_moment_id", { mode: "number" }),
	commentAnswer: text("comment_answer"),
	exclusiveIndicatorId: bigint("exclusive_indicator_id", { mode: "number" }),
	referenceAnswer: bigint("reference_answer", { mode: "number" }),
	uiOrder: smallint("ui_order"),
	textAnswerLlm: varchar("text_answer_llm", { length: 1024 }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "question_response_id"}),
]);

export const sentimentCategory = mysqlTable("sentiment_category", {
	id: bigint({ mode: "number" }).notNull(),
	name: varchar({ length: 256 }),
	description: varchar({ length: 255 }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "sentiment_category_id"}),
]);

export const sentimentCategoryTag = mysqlTable("sentiment_category_tag", {
	sentimentCategoryId: bigint("sentiment_category_id", { mode: "number" }).notNull(),
	sentimentTagId: bigint("sentiment_tag_id", { mode: "number" }).notNull(),
});

export const sentimentSynonym = mysqlTable("sentiment_synonym", {
	sentimentTagId: bigint("sentiment_tag_id", { mode: "number" }),
	synonym: varchar({ length: 255 }),
});

export const sentimentTag = mysqlTable("sentiment_tag", {
	id: bigint({ mode: "number" }).notNull(),
	name: varchar({ length: 256 }).notNull(),
	description: varchar({ length: 255 }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "sentiment_tag_id"}),
]);

export const sentimentTagAttribute = mysqlTable("sentiment_tag_attribute", {
	sentimentTagId: bigint("sentiment_tag_id", { mode: "number" }).notNull(),
	tagAttributeId: bigint("tag_attribute_id", { mode: "number" }).notNull(),
});

export const survey = mysqlTable("survey", {
	id: bigint({ mode: "number" }).notNull(),
	name: varchar({ length: 255 }),
	description: varchar({ length: 255 }),
	createdAt: datetime("created_at", { mode: 'string'}),
	lastModifiedBy: varchar("last_modified_by", { length: 255 }),
	createdBy: varchar("created_by", { length: 255 }),
	lastModifiedAt: datetime("last_modified_at", { mode: 'string'}),
	criticalMomentId: bigint("critical_moment_id", { mode: "number" }),
	uiConfig: json("ui_config"),
	configurationUi: text("configuration_ui"),
	surveyStyleId: bigint("survey_style_id", { mode: "number" }),
	alias: varchar({ length: 256 }),
	status: varchar({ length: 255 }),
	brand: varchar({ length: 255 }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "survey_id"}),
]);

export const surveyQuestion = mysqlTable("survey_question", {
	questionsId: bigint("questions_id", { mode: "number" }).notNull(),
	surveysId: bigint("surveys_id", { mode: "number" }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.surveysId, table.questionsId], name: "survey_question_surveys_id_questions_id"}),
]);

export const surveyResponse = mysqlTable("survey_response", {
	id: bigint({ mode: "number" }).notNull(),
	customerName: varchar("customer_name", { length: 255 }),
	customerLastname: varchar("customer_lastname", { length: 255 }),
	customerEmail: varchar("customer_email", { length: 255 }),
	createdAt: datetime("created_at", { mode: 'string'}),
	surveyId: bigint("survey_id", { mode: "number" }),
	geoLocationId: bigint("geo_location_id", { mode: "number" }),
	logicalLocationId: bigint("logical_location_id", { mode: "number" }),
	geoLocationCode: varchar("geo_location_code", { length: 255 }),
	logicalLocationCode: varchar("logical_location_code", { length: 255 }),
	clusterId: bigint("cluster_id", { mode: "number" }),
	channelId: bigint("channel_id", { mode: "number" }),
	startedAt: datetime("started_at", { mode: 'string'}),
	answeredAt: datetime("answered_at", { mode: 'string'}),
	status: varchar({ length: 255 }),
	criticalMomentId: bigint("critical_moment_id", { mode: "number" }),
	rawResponse: text("raw_response"),
	customerIp: varchar("customer_ip", { length: 255 }),
	customerDevice: varchar("customer_device", { length: 255 }),
	customerServiceCode: varchar("customer_service_code", { length: 255 }),
	surveyType: varchar("survey_type", { length: 50 }),
	origin: varchar({ length: 32 }),
	prizeCode: varchar("prize_code", { length: 255 }),
	customerLanguage: varchar("customer_language", { length: 64 }),
	customerServiceTime: datetime("customer_service_time", { mode: 'string'}),
	customerServiceTicket: varchar("customer_service_ticket", { length: 255 }),
	customerPhoneNumber: varchar("customer_phone_number", { length: 255 }),
	customerEmailRescue: varchar("customer_email_rescue", { length: 255 }),
	customerNameRescue: varchar("customer_name_rescue", { length: 255 }),
	customerLastnameRescue: varchar("customer_lastname_rescue", { length: 255 }),
	customerPhoneNumberRescue: varchar("customer_phone_number_rescue", { length: 255 }),
	customProp0: varchar("custom_prop_0", { length: 255 }),
	customProp1: varchar("custom_prop_1", { length: 255 }),
	customProp2: varchar("custom_prop_2", { length: 255 }),
	customProp3: varchar("custom_prop_3", { length: 255 }),
	customProp4: varchar("custom_prop_4", { length: 255 }),
	importFileName: varchar("import_file_name", { length: 255 }),
	surveyCode: varchar("survey_code", { length: 255 }),
	criticalMomentCode: varchar("critical_moment_code", { length: 255 }),
	campaign: varchar({ length: 255 }),
	alertType: varchar("alert_type", { length: 255 }),
	context: json(),
	addressState: varchar("address_state", { length: 255 }),
	addressDistrict1: varchar("address_district_1", { length: 255 }),
	addressDistrict2: varchar("address_district_2", { length: 255 }),
	addressCity: varchar("address_city", { length: 255 }),
	addressZip: varchar("address_zip", { length: 255 }),
	coreNotificationId: bigint("core_notification_id", { mode: "number" }),
	coreResponseType: varchar("core_response_type", { length: 100 }),
	coreWorkflow: varchar("core_workflow", { length: 128 }),
	customerCode: varchar("customer_code", { length: 255 }),
	trackingId: varchar("tracking_id", { length: 255 }),
	trackingStatus: varchar("tracking_status", { length: 255 }),
	trackingReceivedAt: datetime("tracking_received_at", { mode: 'string'}),
	trackingEventAt: datetime("tracking_event_at", { mode: 'string'}),
	trackingError: varchar("tracking_error", { length: 255 }),
	trackingDetail: varchar("tracking_detail", { length: 2000 }),
	mlDistanceToCluster: decimal("ml_distance_to_cluster", { precision: 7, scale: 6 }),
	mlCluster: varchar("ml_cluster", { length: 255 }),
	clientMode: varchar("client_mode", { length: 255 }),
	fraudScore: decimal("fraud_score", { precision: 10, scale: 4 }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "survey_response_id"}),
]);

export const surveyResponseCluster = mysqlTable("survey_response_cluster", {
	id: bigint({ mode: "number" }).notNull(),
	description: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	centroidId: bigint("centroid_id", { mode: "number" }),
	mlOutput: varchar("ml_output", { length: 2048 }).notNull(),
	surveyResponsePartitionId: bigint("survey_response_partition_id", { mode: "number" }),
	mlInput: varchar("ml_input", { length: 2048 }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "survey_response_cluster_id"}),
]);

export const surveyResponseClusterItem = mysqlTable("survey_response_cluster_item", {
	id: bigint({ mode: "number" }).notNull(),
	surveyResponseClusterId: bigint("survey_response_cluster_id", { mode: "number" }),
	surveyResponseId: bigint("survey_response_id", { mode: "number" }),
	clusterIndex: bigint("cluster_index", { mode: "number" }),
	distanceToCluster: decimal("distance-to_cluster", { precision: 7, scale: 6 }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "survey_response_cluster_item_id"}),
]);

export const surveyResponseDataset = mysqlTable("survey_response_dataset", {
	id: bigint({ mode: "number" }).notNull(),
	description: varchar({ length: 255 }).notNull(),
	createdAt: datetime("created_at", { mode: 'string'}).notNull(),
	mlTarget: varchar("ml_target", { length: 255 }).notNull(),
	mlInput: varchar("ml_input", { length: 2048 }).notNull(),
	mlOutput: varchar("ml_output", { length: 2048 }),
	dimensions: json(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "survey_response_dataset_id"}),
]);

export const surveyResponseDatasetItem = mysqlTable("survey_response_dataset_item", {
	surveyResponseDatasetId: bigint("survey_response_dataset_id", { mode: "number" }).notNull(),
	surveyResponseId: bigint("survey_response_id", { mode: "number" }),
	datasetIndex: bigint("dataset_index", { mode: "number" }).notNull(),
	mlInput: varchar("ml_input", { length: 2048 }).notNull(),
	mlOutput: varchar("ml_output", { length: 2048 }),
	numberResult: decimal("number_result", { precision: 7, scale: 6 }),
	textResult: varchar("text_result", { length: 255 }),
},
(table) => [
	primaryKey({ columns: [table.surveyResponseDatasetId, table.datasetIndex], name: "survey_response_dataset_item_survey_response_dataset_id_dataset_index"}),
]);

export const surveyResponseFile = mysqlTable("survey_response_file", {
	id: bigint({ mode: "number" }).notNull(),
	createdAt: datetime("created_at", { mode: 'string'}),
	fileName: varchar("file_name", { length: 1024 }),
	token: varchar({ length: 1024 }),
	url: varchar({ length: 2048 }).notNull(),
	urlExpiration: datetime("url_expiration", { mode: 'string'}),
},
(table) => [
	primaryKey({ columns: [table.id], name: "survey_response_file_id"}),
]);

export const surveyResponsePartition = mysqlTable("survey_response_partition", {
	id: bigint({ mode: "number" }).notNull(),
	description: varchar({ length: 255 }).notNull(),
	createdAt: datetime("created_at", { mode: 'string'}).notNull(),
	mlOutput: varchar("ml_output", { length: 2048 }).notNull(),
	surveyResponseDatasetId: bigint("survey_response_dataset_id", { mode: "number" }),
	active: tinyint().notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "survey_response_partition_id"}),
]);

export const surveyStyle = mysqlTable("survey_style", {
	id: bigint({ mode: "number" }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	configuration: text(),
	customCss: text("custom_css"),
	useCustomcss: tinyint("use_customcss"),
},
(table) => [
	primaryKey({ columns: [table.id], name: "survey_style_id"}),
]);

export const tagAttribute = mysqlTable("tag_attribute", {
	id: bigint({ mode: "number" }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: varchar({ length: 255 }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "tag_attribute_id"}),
]);

export const tenantUser = mysqlTable("tenant_user", {
	id: bigint({ mode: "number" }).notNull(),
	globalId: bigint("global_id", { mode: "number" }),
	tenantId: bigint("tenant_id", { mode: "number" }),
	login: varchar({ length: 50 }).notNull(),
	passwordHash: varchar("password_hash", { length: 60 }),
	firstName: varchar("first_name", { length: 50 }),
	lastName: varchar("last_name", { length: 50 }),
	email: varchar({ length: 254 }),
	imageUrl: varchar("image_url", { length: 256 }),
	activated: tinyint().notNull(),
	langKey: varchar("lang_key", { length: 6 }),
	activationKey: varchar("activation_key", { length: 20 }),
	resetKey: varchar("reset_key", { length: 20 }),
	createdBy: varchar("created_by", { length: 50 }).notNull(),
	createdDate: datetime("created_date", { mode: 'string'}),
	resetDate: datetime("reset_date", { mode: 'string'}),
	lastModifiedBy: varchar("last_modified_by", { length: 50 }),
	lastModifiedDate: datetime("last_modified_date", { mode: 'string'}),
	externalCode: varchar("external_code", { length: 255 }),
	externalRole: varchar("external_role", { length: 255 }),
	managerId: bigint("manager_id", { mode: "number" }),
	alertReceiver: tinyint("alert_receiver"),
	deviceToken: varchar("device_token", { length: 256 }),
	config: json(),
	phone: varchar({ length: 255 }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "tenant_user_id"}),
]);

export const tmGeoNewCode20221020 = mysqlTable("tm_geo_new_code_2022_10_20", {
	name: varchar({ length: 255 }),
	codeOld: varchar("code_old", { length: 255 }),
	description: varchar({ length: 255 }),
	level: varchar({ length: 255 }),
	codeNew: varchar("code_new", { length: 255 }),
});

export const tmpGeoBackup20221020 = mysqlTable("tmp_geo_backup_2022_10_20", {
	id: bigint({ mode: "number" }),
	name: varchar({ length: 255 }),
	searchCodeFrom: varchar("search_code_from", { length: 255 }),
	searchCodeTo: varchar("search_code_to", { length: 255 }),
	searchOrder: int("search_order"),
	description: varchar({ length: 255 }),
	parentId: bigint("parent_id", { mode: "number" }),
	code: varchar({ length: 16 }),
	logicalLocationId: bigint("logical_location_id", { mode: "number" }),
	level: varchar({ length: 255 }),
});

export const tmpGeoCode20221011 = mysqlTable("tmp_geo_code_2022_10_11", {
	iamsaCode: varchar("iamsa_code", { length: 255 }),
	name: varchar({ length: 255 }),
});

export const tmpGeoDup20221020 = mysqlTable("tmp_geo_dup_2022_10_20", {
	codeOld: varchar("code_old", { length: 255 }),
	description: varchar({ length: 255 }),
	codeNew: varchar("code_new", { length: 255 }),
});

export const tmpGeoNewCodeTrash20221020 = mysqlTable("tmp_geo_new_code_trash_2022_10_20", {
	codeOld: varchar("code_old", { length: 255 }),
	codeNew: varchar("code_new", { length: 255 }),
});

export const tmpMapGeoGho = mysqlTable("tmp_map_geo_gho", {
	geoLocationId: bigint("geo_location_id", { mode: "number" }),
	code: varchar({ length: 16 }),
	id: bigint({ mode: "number" }),
	logicalLocationId: bigint("logical_location_id", { mode: "number" }),
});

export const userAlertType = mysqlTable("user_alert_type", {
	userId: bigint("user_id", { mode: "number" }).notNull(),
	alertType: varchar("alert_type", { length: 64 }),
});

export const userCriticalMoment = mysqlTable("user_critical_moment", {
	userId: bigint("user_id", { mode: "number" }),
	criticalMomentId: bigint("critical_moment_id", { mode: "number" }),
});

export const userGeoLocation = mysqlTable("user_geo_location", {
	userId: bigint("user_id", { mode: "number" }),
	geoLocationId: bigint("geo_location_id", { mode: "number" }),
});

export const userLogLocation = mysqlTable("user_log_location", {
	userId: bigint("user_id", { mode: "number" }),
	logicalLocationId: bigint("logical_location_id", { mode: "number" }),
});

export const userProfile = mysqlTable("user_profile", {
	id: bigint({ mode: "number" }).notNull(),
	config: json(),
	name: varchar({ length: 100 }).notNull(),
	description: varchar({ length: 256 }).notNull(),
	level: varchar({ length: 255 }),
	actionPlanReceiver: tinyint("action_plan_receiver").default(0),
	alertReceiverType: varchar("alert_receiver_type", { length: 64 }),
	alertChannelType: varchar("alert_channel_type", { length: 64 }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "user_profile_id"}),
]);

export const userProfileAppNotification = mysqlTable("user_profile_app_notification", {
	userProfileId: bigint("user_profile_id", { mode: "number" }).notNull(),
	notificationType: varchar("notification_type", { length: 64 }),
});

export const userResponseValue = mysqlTable("user_response_value", {
	id: bigint({ mode: "number" }).notNull(),
	userId: bigint("user_id", { mode: "number" }),
	questionId: bigint("question_id", { mode: "number" }),
	value: varchar({ length: 255 }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "user_response_value_id"}),
]);

export const userSentimentCategory = mysqlTable("user_sentiment_category", {
	userId: bigint("user_id", { mode: "number" }).notNull(),
	sentimentCategoryId: bigint("sentiment_category_id", { mode: "number" }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.userId, table.sentimentCategoryId], name: "user_sentiment_category_user_id_sentiment_category_id"}),
]);

export const userUiProfile = mysqlTable("user_ui_profile", {
	userId: bigint("user_id", { mode: "number" }),
	userProfileId: bigint("user_profile_id", { mode: "number" }),
});
