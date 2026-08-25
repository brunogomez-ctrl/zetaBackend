-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `action_plan` (
	`id` bigint NOT NULL,
	`description` varchar(255),
	`created_at` datetime,
	`created_by` varchar(255),
	`finalized_at` datetime,
	`finalized_by` varchar(255),
	`action_plan_status` varchar(255),
	`initial_indicator_value` decimal(10,2),
	`final_indicator_value` decimal(10,2),
	`geo_location_id` bigint,
	`logical_location_id` bigint,
	`geo_location_code` varchar(255),
	`logical_location_code` varchar(255),
	`indicator_id` bigint,
	`action_plan_template_id` bigint,
	`critical_moment_id` bigint,
	`critical_moment_code` varchar(255),
	`initial_survey_count` bigint,
	`final_survey_count` bigint,
	`tag` varchar(256),
	`action_plan_target` varchar(64),
	`library_status` varchar(32),
	CONSTRAINT `action_plan_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `action_plan_activity` (
	`id` bigint NOT NULL,
	`description` varchar(4096),
	`created_at` datetime,
	`created_by` varchar(255),
	`progress` decimal(10,2),
	`action_plan_id` bigint,
	`date_from` datetime,
	`date_to` datetime,
	`responsable` varchar(255),
	`support` varchar(255),
	`status` varchar(32),
	`last_modified_at` datetime,
	`last_modified_by` varchar(254),
	`responsable_mail` varchar(254),
	CONSTRAINT `action_plan_activity_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `action_plan_activity_comment` (
	`id` bigint NOT NULL,
	`created_at` datetime NOT NULL,
	`created_by` varchar(255),
	`created_by_name` varchar(255),
	`text` text NOT NULL,
	`action_plan_activity_id` bigint NOT NULL,
	CONSTRAINT `action_plan_activity_comment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `action_plan_activity_evidence` (
	`id` bigint NOT NULL,
	`created_at` datetime,
	`name` varchar(255),
	`type` varchar(255),
	`file` longblob,
	`action_plan_activity_id` bigint NOT NULL,
	`created_by` varchar(255),
	CONSTRAINT `action_plan_activity_evidence_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `action_plan_cause` (
	`id` bigint NOT NULL,
	`priority` int,
	`cause` varchar(1024),
	`problem` varchar(1024),
	`action_plan_id` bigint NOT NULL,
	CONSTRAINT `action_plan_cause_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `action_plan_log` (
	`id` bigint NOT NULL,
	`created_at` datetime NOT NULL,
	`user_login` varchar(255) NOT NULL,
	`user_email` varchar(255) NOT NULL,
	`event` varchar(255) NOT NULL,
	`description` varchar(1024) NOT NULL,
	`action_plan_id` bigint NOT NULL,
	CONSTRAINT `action_plan_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `action_plan_template` (
	`id` bigint NOT NULL,
	`name` varchar(255),
	`description` varchar(255),
	`indicator_id` bigint,
	`critical_moment_id` bigint,
	CONSTRAINT `action_plan_template_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `action_plan_template_activity` (
	`id` bigint NOT NULL,
	`description` varchar(4096),
	`action_plan_template_id` bigint,
	CONSTRAINT `action_plan_template_activity_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `alert` (
	`id` bigint NOT NULL,
	`name` varchar(255),
	`description` varchar(255),
	`created_at` datetime,
	`alert_status` varchar(255),
	`limetropy_user_id` bigint,
	`survey_response_id` bigint,
	`trigger_response_id` bigint,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`updated_at` datetime,
	`survey_response_comment` text,
	`alert_type` varchar(32),
	`human_survey` text,
	`first_updated_at` datetime,
	`first_updated_by` varchar(255),
	`finalized_at` datetime,
	CONSTRAINT `alert_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `alert_comment` (
	`id` bigint NOT NULL,
	`created_at` datetime NOT NULL,
	`created_by` varchar(255),
	`alert_id` bigint,
	`text` text,
	CONSTRAINT `alert_comment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `alert_evidence` (
	`id` bigint NOT NULL,
	`created_at` datetime NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` varchar(255) NOT NULL,
	`file` longblob NOT NULL,
	`alert_id` bigint NOT NULL,
	CONSTRAINT `alert_evidence_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `brand_question` (
	`id` bigint NOT NULL,
	`question_id` bigint NOT NULL,
	`logical_location_id` bigint NOT NULL,
	`description` varchar(255),
	`question_text` varchar(255),
	`question_text_english` varchar(255),
	`question_options_id` bigint,
	`mandatory` tinyint(1),
	`question_condition` varchar(255),
	CONSTRAINT `brand_question_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `channel` (
	`id` bigint NOT NULL,
	`name` varchar(255),
	`description` varchar(255),
	CONSTRAINT `channel_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cluster` (
	`id` bigint NOT NULL,
	`name` varchar(255),
	`description` varchar(255),
	`active` tinyint(1),
	`code` varchar(16),
	CONSTRAINT `cluster_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `config_property` (
	`id` bigint NOT NULL,
	`key` varchar(255) NOT NULL,
	`simple_value` varchar(255),
	`object_value` text,
	CONSTRAINT `config_property_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `critical_moment` (
	`id` bigint NOT NULL,
	`name` varchar(255),
	`description` varchar(255),
	`search_code_from` varchar(255),
	`search_code_to` varchar(255),
	`search_order` int,
	`parent_id` bigint,
	`code` varchar(16),
	`configuration_ui` text,
	`dashboard_id` bigint,
	`priority` int,
	`logical_location_id` bigint,
	`tags` varchar(1024),
	`parent_survey_id` bigint,
	CONSTRAINT `critical_moment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dashboard` (
	`id` bigint NOT NULL,
	`title` varchar(100) NOT NULL,
	`description` varchar(256) NOT NULL,
	`config` json,
	CONSTRAINT `dashboard_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `databasechangelog` (
	`id` varchar(255) NOT NULL,
	`author` varchar(255) NOT NULL,
	`filename` varchar(255) NOT NULL,
	`dateexecuted` datetime NOT NULL,
	`orderexecuted` int NOT NULL,
	`exectype` varchar(10) NOT NULL,
	`md5sum` varchar(35),
	`description` varchar(255),
	`comments` varchar(255),
	`tag` varchar(255),
	`liquibase` varchar(20),
	`contexts` varchar(255),
	`labels` varchar(255),
	`deployment_id` varchar(10)
);
--> statement-breakpoint
CREATE TABLE `databasechangeloglock` (
	`id` int NOT NULL,
	`locked` tinyint(1) NOT NULL,
	`lockgranted` datetime,
	`lockedby` varchar(255),
	CONSTRAINT `databasechangeloglock_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dynamic_report` (
	`id` bigint NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` varchar(255),
	`dynamic_report` text NOT NULL,
	CONSTRAINT `dynamic_report_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `geo_location` (
	`id` bigint NOT NULL,
	`name` varchar(255) NOT NULL,
	`search_code_from` varchar(255),
	`search_code_to` varchar(255),
	`search_order` int,
	`description` varchar(255) NOT NULL,
	`parent_id` bigint,
	`code` varchar(16),
	`logical_location_id` bigint,
	`level` varchar(255),
	`coordinate_x` decimal(19,15),
	`coordinate_y` decimal(19,15),
	`branch_type` varchar(256),
	CONSTRAINT `geo_location_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `geo_location_logical` (
	`geo_location_id` bigint NOT NULL,
	`logical_location_id` bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE `global_authority` (
	`name` varchar(50) NOT NULL,
	CONSTRAINT `global_authority_name` PRIMARY KEY(`name`)
);
--> statement-breakpoint
CREATE TABLE `global_tenant` (
	`id` bigint NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` varchar(256) NOT NULL,
	`phone` varchar(256),
	`email` varchar(256),
	`address` varchar(256),
	`status` varchar(32),
	`notes` text,
	`created_by` varchar(50),
	`created_date` datetime,
	`last_modified_by` varchar(50),
	`last_modified_date` datetime,
	`code` varchar(255) NOT NULL,
	CONSTRAINT `global_tenant_id` PRIMARY KEY(`id`),
	CONSTRAINT `tenant_code_uk` UNIQUE(`code`),
	CONSTRAINT `tenant_name_uk` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `global_user` (
	`id` bigint NOT NULL,
	`login` varchar(50) NOT NULL,
	`password_hash` varchar(60) NOT NULL,
	`first_name` varchar(50),
	`last_name` varchar(50),
	`email` varchar(254),
	`image_url` varchar(256),
	`activated` tinyint(1) NOT NULL,
	`lang_key` varchar(6),
	`activation_key` varchar(20),
	`reset_key` varchar(20),
	`created_by` varchar(50) NOT NULL,
	`created_date` datetime,
	`reset_date` datetime,
	`last_modified_by` varchar(50),
	`last_modified_date` datetime,
	`tenant_admin` tinyint(1),
	`tenant_id` bigint,
	`enabled` tinyint(1) NOT NULL,
	`temp_password` varchar(255),
	`phone` varchar(255),
	CONSTRAINT `global_user_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `global_user_authority` (
	`user_id` bigint NOT NULL,
	`authority_name` varchar(50) NOT NULL,
	CONSTRAINT `global_user_authority_user_id_authority_name` PRIMARY KEY(`user_id`,`authority_name`)
);
--> statement-breakpoint
CREATE TABLE `indicator` (
	`id` bigint NOT NULL,
	`name` varchar(255),
	`description` varchar(255),
	`expected_value` decimal(13,6),
	`formula` varchar(255),
	`eligible_plan` tinyint(1) NOT NULL DEFAULT 1,
	`exclusive` tinyint(1) NOT NULL,
	`parent_question_id` bigint,
	`widget_name` varchar(255),
	`source` varchar(64),
	`formula_config` varchar(255),
	`alias` varchar(255),
	CONSTRAINT `indicator_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `indicator_critical_moment` (
	`indicator_id` bigint,
	`critical_moment_id` bigint
);
--> statement-breakpoint
CREATE TABLE `indicator_location` (
	`id` bigint NOT NULL,
	`indicator_id` bigint NOT NULL,
	`logical_location_id` bigint NOT NULL,
	`expected_value` decimal(13,6),
	CONSTRAINT `indicator_location_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `indicator_question` (
	`indicator_id` bigint,
	`question_id` bigint
);
--> statement-breakpoint
CREATE TABLE `jhi_persistent_audit_event` (
	`event_id` bigint NOT NULL,
	`principal` varchar(50) NOT NULL,
	`event_date` datetime,
	`event_type` varchar(255),
	CONSTRAINT `jhi_persistent_audit_event_event_id` PRIMARY KEY(`event_id`)
);
--> statement-breakpoint
CREATE TABLE `jhi_persistent_audit_evt_data` (
	`event_id` bigint NOT NULL,
	`name` varchar(150) NOT NULL,
	`value` varchar(255),
	CONSTRAINT `jhi_persistent_audit_evt_data_event_id_name` PRIMARY KEY(`event_id`,`name`)
);
--> statement-breakpoint
CREATE TABLE `limetropy_user` (
	`id` bigint NOT NULL,
	`external_code` varchar(255),
	`geo_location_id` bigint,
	`logical_location_id` bigint,
	CONSTRAINT `limetropy_user_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `logical_location` (
	`id` bigint NOT NULL,
	`name` varchar(255) NOT NULL,
	`search_code_from` varchar(255),
	`search_code_to` varchar(255),
	`search_order` int,
	`description` varchar(255) NOT NULL,
	`parent_id` bigint,
	`code` varchar(16),
	`brand` tinyint(1) NOT NULL DEFAULT 1,
	`level` varchar(255),
	CONSTRAINT `logical_location_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notification` (
	`id` bigint NOT NULL,
	`version` int,
	`token` varchar(255),
	`sent_at` datetime,
	`created_at` datetime,
	`updated_at` datetime,
	`expired_at` datetime,
	`survey_response_id` bigint,
	`notification_number` int,
	`send_error` varchar(255),
	`tracking_id` varchar(255),
	`tracking_status` int,
	`tracking_sent_at` datetime,
	`tracking_requested_at` datetime,
	`notification_type` varchar(32),
	CONSTRAINT `notification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `precalc_values` (
	`id` bigint NOT NULL,
	`filter_key` varchar(2048),
	`date_range_key` varchar(256),
	`indicator_name` varchar(255),
	`date_from` date,
	`date_to` date,
	`values` json,
	`partial` tinyint(1) NOT NULL,
	`updated_at` datetime,
	CONSTRAINT `precalc_values_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `question` (
	`id` bigint NOT NULL,
	`name` varchar(255),
	`description` varchar(255),
	`question_text` varchar(255),
	`question_type` varchar(255),
	`default_value` varchar(255),
	`multiple` tinyint(1),
	`critical_moment_id` bigint,
	`question_type_params` varchar(255),
	`question_condition` varchar(255),
	`question_options_id` bigint,
	`mandatory` tinyint(1),
	`question_text_english` varchar(255),
	`ui_config` json,
	`custom_prop_index` smallint,
	`origin` varchar(64),
	`user_survey_filter` tinyint(1),
	`user_alert_filter` tinyint(1),
	`parent_survey_id` bigint,
	`collection_type` varchar(64),
	`question_format` varchar(64),
	`alias` varchar(255),
	CONSTRAINT `question_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `question_options` (
	`id` bigint NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` varchar(255),
	CONSTRAINT `question_options_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `question_options_value` (
	`id` bigint NOT NULL,
	`value` varchar(255) NOT NULL,
	`question_options_id` bigint NOT NULL,
	`spanish_text` varchar(255),
	`english_text` varchar(255),
	`critical_moment_id` bigint,
	`updated_at` datetime,
	CONSTRAINT `question_options_value_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `question_response` (
	`id` bigint NOT NULL,
	`text_answer` varchar(255),
	`number_answer` int,
	`survey_response_id` bigint,
	`question_id` bigint,
	`created_at` datetime,
	`decimal_answer` decimal(13,6),
	`critical_moment_id` bigint,
	`comment_answer` text,
	`exclusive_indicator_id` bigint,
	`reference_answer` bigint,
	`ui_order` smallint,
	`text_answer_llm` varchar(1024),
	CONSTRAINT `question_response_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sentiment_category` (
	`id` bigint NOT NULL,
	`name` varchar(256),
	`description` varchar(255),
	CONSTRAINT `sentiment_category_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sentiment_category_tag` (
	`sentiment_category_id` bigint NOT NULL,
	`sentiment_tag_id` bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sentiment_synonym` (
	`sentiment_tag_id` bigint,
	`synonym` varchar(255)
);
--> statement-breakpoint
CREATE TABLE `sentiment_tag` (
	`id` bigint NOT NULL,
	`name` varchar(256) NOT NULL,
	`description` varchar(255),
	CONSTRAINT `sentiment_tag_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sentiment_tag_attribute` (
	`sentiment_tag_id` bigint NOT NULL,
	`tag_attribute_id` bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE `survey` (
	`id` bigint NOT NULL,
	`name` varchar(255),
	`description` varchar(255),
	`created_at` datetime,
	`last_modified_by` varchar(255),
	`created_by` varchar(255),
	`last_modified_at` datetime,
	`critical_moment_id` bigint,
	`ui_config` json,
	`configuration_ui` text,
	`survey_style_id` bigint,
	`alias` varchar(256),
	`status` varchar(255),
	`brand` varchar(255),
	CONSTRAINT `survey_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `survey_question` (
	`questions_id` bigint NOT NULL,
	`surveys_id` bigint NOT NULL,
	CONSTRAINT `survey_question_surveys_id_questions_id` PRIMARY KEY(`surveys_id`,`questions_id`)
);
--> statement-breakpoint
CREATE TABLE `survey_response` (
	`id` bigint NOT NULL,
	`customer_name` varchar(255),
	`customer_lastname` varchar(255),
	`customer_email` varchar(255),
	`created_at` datetime,
	`survey_id` bigint,
	`geo_location_id` bigint,
	`logical_location_id` bigint,
	`geo_location_code` varchar(255),
	`logical_location_code` varchar(255),
	`cluster_id` bigint,
	`channel_id` bigint,
	`started_at` datetime,
	`answered_at` datetime,
	`status` varchar(255),
	`critical_moment_id` bigint,
	`raw_response` text,
	`customer_ip` varchar(255),
	`customer_device` varchar(255),
	`customer_service_code` varchar(255),
	`survey_type` varchar(50),
	`origin` varchar(32),
	`prize_code` varchar(255),
	`customer_language` varchar(64),
	`customer_service_time` datetime,
	`customer_service_ticket` varchar(255),
	`customer_phone_number` varchar(255),
	`customer_email_rescue` varchar(255),
	`customer_name_rescue` varchar(255),
	`customer_lastname_rescue` varchar(255),
	`customer_phone_number_rescue` varchar(255),
	`custom_prop_0` varchar(255),
	`custom_prop_1` varchar(255),
	`custom_prop_2` varchar(255),
	`custom_prop_3` varchar(255),
	`custom_prop_4` varchar(255),
	`import_file_name` varchar(255),
	`survey_code` varchar(255),
	`critical_moment_code` varchar(255),
	`campaign` varchar(255),
	`alert_type` varchar(255),
	`context` json,
	`address_state` varchar(255),
	`address_district_1` varchar(255),
	`address_district_2` varchar(255),
	`address_city` varchar(255),
	`address_zip` varchar(255),
	`core_notification_id` bigint,
	`core_response_type` varchar(100),
	`core_workflow` varchar(128),
	`customer_code` varchar(255),
	`tracking_id` varchar(255),
	`tracking_status` varchar(255),
	`tracking_received_at` datetime,
	`tracking_event_at` datetime,
	`tracking_error` varchar(255),
	`tracking_detail` varchar(2000),
	`ml_distance_to_cluster` decimal(7,6),
	`ml_cluster` varchar(255),
	`client_mode` varchar(255),
	`fraud_score` decimal(10,4),
	CONSTRAINT `survey_response_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `survey_response_cluster` (
	`id` bigint NOT NULL,
	`description` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`centroid_id` bigint,
	`ml_output` varchar(2048) NOT NULL,
	`survey_response_partition_id` bigint,
	`ml_input` varchar(2048),
	CONSTRAINT `survey_response_cluster_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `survey_response_cluster_item` (
	`id` bigint NOT NULL,
	`survey_response_cluster_id` bigint,
	`survey_response_id` bigint,
	`cluster_index` bigint,
	`distance-to_cluster` decimal(7,6),
	CONSTRAINT `survey_response_cluster_item_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `survey_response_dataset` (
	`id` bigint NOT NULL,
	`description` varchar(255) NOT NULL,
	`created_at` datetime NOT NULL,
	`ml_target` varchar(255) NOT NULL,
	`ml_input` varchar(2048) NOT NULL,
	`ml_output` varchar(2048),
	`dimensions` json,
	CONSTRAINT `survey_response_dataset_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `survey_response_dataset_item` (
	`survey_response_dataset_id` bigint NOT NULL,
	`survey_response_id` bigint,
	`dataset_index` bigint NOT NULL,
	`ml_input` varchar(2048) NOT NULL,
	`ml_output` varchar(2048),
	`number_result` decimal(7,6),
	`text_result` varchar(255),
	CONSTRAINT `survey_response_dataset_item_survey_response_dataset_id_dataset_index` PRIMARY KEY(`survey_response_dataset_id`,`dataset_index`)
);
--> statement-breakpoint
CREATE TABLE `survey_response_file` (
	`id` bigint NOT NULL,
	`created_at` datetime,
	`file_name` varchar(1024),
	`token` varchar(1024),
	`url` varchar(2048) NOT NULL,
	`url_expiration` datetime,
	CONSTRAINT `survey_response_file_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `survey_response_partition` (
	`id` bigint NOT NULL,
	`description` varchar(255) NOT NULL,
	`created_at` datetime NOT NULL,
	`ml_output` varchar(2048) NOT NULL,
	`survey_response_dataset_id` bigint,
	`active` tinyint(1) NOT NULL,
	CONSTRAINT `survey_response_partition_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `survey_style` (
	`id` bigint NOT NULL,
	`name` varchar(255) NOT NULL,
	`configuration` text,
	`custom_css` text,
	`use_customcss` tinyint(1),
	CONSTRAINT `survey_style_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tag_attribute` (
	`id` bigint NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` varchar(255),
	CONSTRAINT `tag_attribute_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tenant_user` (
	`id` bigint NOT NULL,
	`global_id` bigint,
	`tenant_id` bigint,
	`login` varchar(50) NOT NULL,
	`password_hash` varchar(60),
	`first_name` varchar(50),
	`last_name` varchar(50),
	`email` varchar(254),
	`image_url` varchar(256),
	`activated` tinyint(1) NOT NULL,
	`lang_key` varchar(6),
	`activation_key` varchar(20),
	`reset_key` varchar(20),
	`created_by` varchar(50) NOT NULL,
	`created_date` datetime,
	`reset_date` datetime,
	`last_modified_by` varchar(50),
	`last_modified_date` datetime,
	`external_code` varchar(255),
	`external_role` varchar(255),
	`manager_id` bigint,
	`alert_receiver` tinyint(1),
	`device_token` varchar(256),
	`config` json,
	`phone` varchar(255),
	CONSTRAINT `tenant_user_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tm_geo_new_code_2022_10_20` (
	`name` varchar(255),
	`code_old` varchar(255),
	`description` varchar(255),
	`level` varchar(255),
	`code_new` varchar(255)
);
--> statement-breakpoint
CREATE TABLE `tmp_geo_backup_2022_10_20` (
	`id` bigint,
	`name` varchar(255),
	`search_code_from` varchar(255),
	`search_code_to` varchar(255),
	`search_order` int,
	`description` varchar(255),
	`parent_id` bigint,
	`code` varchar(16),
	`logical_location_id` bigint,
	`level` varchar(255)
);
--> statement-breakpoint
CREATE TABLE `tmp_geo_code_2022_10_11` (
	`iamsa_code` varchar(255),
	`name` varchar(255)
);
--> statement-breakpoint
CREATE TABLE `tmp_geo_dup_2022_10_20` (
	`code_old` varchar(255),
	`description` varchar(255),
	`code_new` varchar(255)
);
--> statement-breakpoint
CREATE TABLE `tmp_geo_new_code_trash_2022_10_20` (
	`code_old` varchar(255),
	`code_new` varchar(255)
);
--> statement-breakpoint
CREATE TABLE `tmp_map_geo_gho` (
	`geo_location_id` bigint,
	`code` varchar(16),
	`id` bigint,
	`logical_location_id` bigint
);
--> statement-breakpoint
CREATE TABLE `user_alert_type` (
	`user_id` bigint NOT NULL,
	`alert_type` varchar(64)
);
--> statement-breakpoint
CREATE TABLE `user_critical_moment` (
	`user_id` bigint,
	`critical_moment_id` bigint
);
--> statement-breakpoint
CREATE TABLE `user_geo_location` (
	`user_id` bigint,
	`geo_location_id` bigint
);
--> statement-breakpoint
CREATE TABLE `user_log_location` (
	`user_id` bigint,
	`logical_location_id` bigint
);
--> statement-breakpoint
CREATE TABLE `user_profile` (
	`id` bigint NOT NULL,
	`config` json,
	`name` varchar(100) NOT NULL,
	`description` varchar(256) NOT NULL,
	`level` varchar(255),
	`action_plan_receiver` tinyint(1) DEFAULT 0,
	`alert_receiver_type` varchar(64),
	`alert_channel_type` varchar(64),
	CONSTRAINT `user_profile_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_profile_app_notification` (
	`user_profile_id` bigint NOT NULL,
	`notification_type` varchar(64)
);
--> statement-breakpoint
CREATE TABLE `user_response_value` (
	`id` bigint NOT NULL,
	`user_id` bigint,
	`question_id` bigint,
	`value` varchar(255),
	CONSTRAINT `user_response_value_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_sentiment_category` (
	`user_id` bigint NOT NULL,
	`sentiment_category_id` bigint NOT NULL,
	CONSTRAINT `user_sentiment_category_user_id_sentiment_category_id` PRIMARY KEY(`user_id`,`sentiment_category_id`)
);
--> statement-breakpoint
CREATE TABLE `user_ui_profile` (
	`user_id` bigint,
	`user_profile_id` bigint
);

*/