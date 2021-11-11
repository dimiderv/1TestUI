# Web UI for HLF App

This is currently going to be implemented for 3Orgs_Network which has 3 organizations with a peer each. The chaincode deployment is going to be from scenario 2 were org shared collection between them to keep their data private.



The chaincode that's going to be deployed is of scenario2 were the orgs 
have shared collections between them and each org has it's own implicit collection.

## Command to deploy chaincode

		./network.sh deployCC -ccn try -ccp ../2ndScenario/ -ccl go -ccep "OR('Org1MSP.peer','Org2MSP.peer','Org3MSP.peer')" -cccg ../2ndScenario/collections_config.json


Im going to include code from the sharedCollection.js on the app folder.

Front End and backend is located on folder WebUI.

In the app folder there are 2 working apps. 
 1. appOrg3.js where orgs use a shared collection to put buy requests
 2. sharedCollection.js where orgs use shared collections between them
