build:
	aws cloudformation package \
		--template-file template.yml \
		--output-template-file template.packaged.yml \
		--s3-bucket ${ARTIFACT_BUCKET}

ci-setup:
	cd ci && $(MAKE) ci-setup
