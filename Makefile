
build:
	@echo "Building site..."
	ng build --optimization 
	@echo "Finished started!"


deploy:
	@echo "Deploy hosting"
	ng build --optimization --aot
	firebase deploy --only hosting


functions:
	@echo "Deploy functions"
	firebase deploy --only functions



start:
	@echo "start web app"
	ng serve --watch=false --no-hmr


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


gen:
	@echo "prisma generate"
	pnpm run gen

## ng generate component acct-drop-down  --flat --inline-template=true --inline-style=true

