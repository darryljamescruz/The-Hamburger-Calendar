# Team-Hamburger

**Status Badge:** [![CI Testing](https://github.com/siyche/Team-Hamburger/actions/workflows/ci-testing.yml/badge.svg)](https://github.com/siyche/Team-Hamburger/actions/workflows/ci-testing.yml)

**Tech Spec Document:**
https://docs.google.com/document/d/1Fz2-bfkzLIIPGZ4-d8aPm8EmG54CU7LEYFt8FAtgBU0/edit?usp=sharing

**Deployment URL:**
https://hamburgers-calendar-h0cpb6f7bbczfyae.westus2-01.azurewebsites.net/

**UI Prototyping:** 
https://www.figma.com/design/RsnEo5BwDszqFhOEGhyLjq/Calendar-Draft?node-id=0-1&t=U7Q0zdARQcLMbMq3-1

**Style Guide:** 
- All code should follow the Airbnb JavaScript style guide, detailed here: https://airbnb.io/javascript/react/
- Prettier should be added to each contributer's IDE as per the following instructions: https://www.digitalocean.com/community/tutorials/how-to-format-code-with-prettier-in-visual-studio-code

**Diagrams:** 
- All diagrams can be found in the tech spec document (linked above). 

**Environmental Variables:**
Environmental variables must be set directly in Azure (or chosen host), and in a .env file for local purposes: 
- TOKEN_SECRET: any value works; used for login/sign-up purposes
- APP_PASSWORD: app password of reminder email account
- MONGO_URI: used to implement MongoDB database 

**Commands:**
- `npm run dev` runs locally from backend directory
- `npm test` runs tests locally from backend directory (make sure app is already running)
- `npx cypress open` opens the Cypress application when executed from the root directory
- `npx cypress run` runs Cypress when executed from the root directory, though this can also be done in the Cypress application 

**CI/CD:**
CI/CD utilizes Github Actions and Microsoft Azure. All processes are automatic—pushing a change to origin/main will reflect on the deployed site after it is verified. 
