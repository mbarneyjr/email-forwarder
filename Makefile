MAKEFLAGS=--warn-undefined-variables

APPLICATION_NAME=email-forwarder
STACK_NAME ?= ${APPLICATION_NAME}-$(ENVIRONMENT_NAME)

.PHONY: deploy

deploy:
	sam deploy \
		--region ${AWS_REGION} \
		--stack-name ${STACK_NAME} \
		--template template.yml \
		--s3-bucket ${ARTIFACT_BUCKET} \
		--s3-prefix ${ARTIFACT_PREFIX} \
		--no-fail-on-empty-changeset \
		--capabilities CAPABILITY_IAM \
		--parameter-overrides \
			ApplicationName='"${APPLICATION_NAME}"' \
			EnvironmentName='"${ENVIRONMENT_NAME}"' \
			FromAddress='"${FROM_ADDRESS}"' \
			ToAddress='"${TO_ADDRESS}"' \
		--tags \
			ApplicationName=${APPLICATION_NAME} \
			EnvironmentName=${ENVIRONMENT_NAME}
