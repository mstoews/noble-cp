.PHONY: help
help:
	@echo "make build - Build the site"
	@echo "make deploy - Deploy the site"
	@echo "make functions - Deploy the functions"
	@echo "make start - Start the web app"
	@echo "make open - Open the web app"
	@echo "make add - Add to git and push to v18 -- required comment='your comment'"
	@echo "make push - Push to git"
	@echo "make help - Show this help message"

.PHONY: build
build:
	@echo "Building site..."
	ng build --optimization 
	@echo "Finished started!"


.PHONY: deploy
deploy:
	@echo "Deploy hosting"
	ng build --optimization --aot
	firebase deploy --only hosting


.PHONY: functions
functions:
	@echo "Deploy functions"
	firebase deploy --only functions


.PHONY: start
start:
	@echo "start web app"
	ng serve --watch=false 


.PHONY: open
open:
	@echo "start web app"
	ng serve -o


.PHONY: add
add:	
	@echo "push to git\n" 
	git add . 
	@echo "update\n" 
	git commit -m '$(comment)' 
	@echo "push to v18\n" 
	git push origin v18 --force 
	
.PHONY: push
push:
	@echo "push"
	git push origin main


