ci-pipeline:
	aws cloudformation deploy \
		--stack-name email-forwarder-ci-pipeline \
		--region ${AWS_REGION} \
		--template-file pipeline.yml \
		--capabilities CAPABILITY_NAMED_IAM \
		--parameter-overrides \
				GitHubOAuthToken=${GITHUB_TOKEN} \
				GitHubAccountName=${GITHUB_OWNER} \
				GitHubRepositoryName=${GITHUB_REPO}

upload-config:
	zip config.zip ../config.local/* -j
	aws s3 cp config.zip s3://ci-config-email-forwarder-${ACCOUNT_ID}-${AWS_REGION}/config.zip

download-config:
	aws s3 cp s3://ci-config-antiope-email-forwarder-${ACCOUNT_ID}-${AWS_REGION}/config.zip config.zip
	unzip config.zip -d config.local/

ci-setup: ci-pipeline upload-config
