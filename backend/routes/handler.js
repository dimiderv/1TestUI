const express = require('express');
const router = express.Router();


// Setting for Hyperledger Fabric
const { Wallets, Gateway } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin,registerAndEnrollFarmer, registerAndEnrollRetailer } = require('../../../app/CAUtil')
const { buildCCPOrg1, buildWallet, buildCCPOrg2,buildCCPOrg3 } = require('../../../app/AppUtil');
const { rootCertificates } = require('tls');

//Chaincode and Users parameters
const channelName = 'mychannel';
const chaincodeName = 'try';
const mspOrg1 = 'Org1MSP';
const mspOrg2 = 'Org2MSP';
const mspOrg3 = 'Org3MSP';

let org1UserId = 'Farmer';
let org2UserId = 'Retailer';
let org3UserId = 'Client';
const assetCollection = 'assetCollection';
const sharedCollectionOrg2Org3 = 'assetCollection23';
org1UserId+="b";
org2UserId+="b";
org3UserId+="b";

/* Helper Function to connect users to network */

async function initContractFromOrg1Identity() {
    console.log('\n--> Fabric client user & Gateway init: Using Org1 identity to Org1 Peer');
    // build an in memory object with the network configuration (also known as a connection profile)
    const ccpOrg1 = buildCCPOrg1();

    // build an instance of the fabric ca services client based on
    // the information in the network configuration
    const caOrg1Client = buildCAClient(FabricCAServices, ccpOrg1, 'ca.org1.example.com');

    // setup the wallet to cache the credentials of the application user, on the app server locally
    const walletPathOrg1 = path.join(__dirname, 'wallet/org1');
    const walletOrg1 = await buildWallet(Wallets, walletPathOrg1);

    // in a real application this would be done on an administrative flow, and only once
    // stores admin identity in local wallet, if needed
    await enrollAdmin(caOrg1Client, walletOrg1, mspOrg1);
    // register & enroll application user with CA, which is used as client identify to make chaincode calls
    // and stores app user identity in local wallet
    // In a real application this would be done only when a new user was required to be added
    // and would be part of an administrative flow
    await registerAndEnrollFarmer(caOrg1Client, walletOrg1, mspOrg1, org1UserId, 'org1.department1');

    try {
        // Create a new gateway for connecting to Org's peer node.
        const gatewayOrg1 = new Gateway();
        //connect using Discovery enabled
        await gatewayOrg1.connect(ccpOrg1,
            { wallet: walletOrg1, identity: org1UserId, discovery: { enabled: true, asLocalhost: true } });

        return gatewayOrg1;
    } catch (error) {
        console.error(`Error in connecting to gateway: ${error}`);
        process.exit(1);
    }
}

async function initContractFromOrg2Identity() {
    console.log('\n--> Fabric client user & Gateway init: Using Org2 identity to Org2 Peer');
    const ccpOrg2 = buildCCPOrg2();
    const caOrg2Client = buildCAClient(FabricCAServices, ccpOrg2, 'ca.org2.example.com');

    const walletPathOrg2 = path.join(__dirname, 'wallet/org2');
    const walletOrg2 = await buildWallet(Wallets, walletPathOrg2);

    await enrollAdmin(caOrg2Client, walletOrg2, mspOrg2);
    await registerAndEnrollRetailer(caOrg2Client, walletOrg2, mspOrg2, org2UserId, 'org2.department1');

    try {
        // Create a new gateway for connecting to Org's peer node.
        const gatewayOrg2 = new Gateway();
        await gatewayOrg2.connect(ccpOrg2,
            { wallet: walletOrg2, identity: org2UserId, discovery: { enabled: true, asLocalhost: true } });

        return gatewayOrg2;
    } catch (error) {
        console.error(`Error in connecting to gateway: ${error}`);
        process.exit(1);
    }
}

async function initContractFromOrg3Identity() {
    console.log('\n--> Fabric client user & Gateway init: Using Org3 identity to Org3 Peer');
    // build an in memory object with the network configuration (also known as a connection profile)
    const ccpOrg3 = buildCCPOrg3();

 
    const caOrg3Client = buildCAClient(FabricCAServices, ccpOrg3, 'ca.org3.example.com');

    const walletPathOrg3 = path.join(__dirname, 'wallet/org3');
    const walletOrg3 = await buildWallet(Wallets, walletPathOrg3);


    await enrollAdmin(caOrg3Client, walletOrg3, mspOrg3);

    await registerAndEnrollUser(caOrg3Client, walletOrg3, mspOrg3, org3UserId, 'org3.department1');

    try {
        // Create a new gateway for connecting to Org's peer node.
        const gatewayOrg3 = new Gateway();
        //connect using Discovery enabled
        await gatewayOrg3.connect(ccpOrg3,
            { wallet: walletOrg3, identity: org3UserId, discovery: { enabled: true, asLocalhost: true } });

        return gatewayOrg3;
    } catch (error) {
        console.error(`Error in connecting to gateway: ${error}`);
        process.exit(1);
    }
}



let statefulTxn;
let tmapData;
let result;
let assetID = "asset1"//req.body.id;
let weight = 100//req.body.weight;
let color = "red"//req.body.color;
let newColor="i changed the color";
let newWeight= 99999;
let randomNumber=1;
/* Get and post methods for the app */

/**Create Asset and Init Ledger can  be used only from farmer side */

router.get('/initLedger', async (req, res) => {



    try {


        /** ******* Fabric client init: Using Org1 identity to Org1 Peer ********** */
        const gatewayOrg1 = await initContractFromOrg1Identity();
        const networkOrg1 = await gatewayOrg1.getNetwork(channelName);
        const contractOrg1 = networkOrg1.getContract(chaincodeName);
        contractOrg1.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection] });


        statefulTxn = contractOrg1.createTransaction('InitLedger');
        statefulTxn.setEndorsingOrganizations(mspOrg1);
        result = await statefulTxn.submit();
        console.log(" World State was populated successfully !");
        result = await contractOrg1.evaluateTransaction('GetAllAssets')//'asset1');
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.end(result);

        //res.end();
        // Disconnect from the gateway.
        gatewayOrg1.disconnect;
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }

});


router.post('/createAssetData', async (req, res) => {


    try {
        
        const newAsset=req.body.assetID;
        const newColor=req.body.color;
        const newWeight=parseInt(req.body.weight);
        console.log(newAsset,newColor,newWeight);
        /** ******* Fabric client init: Using Org1 identity to Org1 Peer ********** */
        const gatewayOrg1 = await initContractFromOrg1Identity();
        const networkOrg1 = await gatewayOrg1.getNetwork(channelName);
        const contractOrg1 = networkOrg1.getContract(chaincodeName);
        contractOrg1.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection] });


        statefulTxn = contractOrg1.createTransaction('CreateAsset');
        statefulTxn.setEndorsingOrganizations(mspOrg1);
        result = await statefulTxn.submit(newAsset,newColor,newWeight);
        console.log(" Asset Was created. Public details should be present !");
        result = await contractOrg1.evaluateTransaction('ReadAsset',newAsset)//'asset1');
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.end(result);
        

        //res.end();
        // Disconnect from the gateway.
        gatewayOrg1.disconnect;
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
       
        res.end( Buffer.from(
            JSON.stringify(
                {
                    errorCLI:"error",
                    errorMessage:error.responses[0].response.message,
                    errorStatus:error.responses[0].response.status

                })));
        //process.exit(1);
    }
    

});



/**Update Asset  */
router.get('/farmerFrontPage/updateAsset', async function  (req,res) {

    try {


        /** ******* Fabric client init: Using Org1 identity to Org1 Peer ********** */
        const gatewayOrg1 = await initContractFromOrg1Identity();
        const networkOrg1 = await gatewayOrg1.getNetwork(channelName);
        const contractOrg1 = networkOrg1.getContract(chaincodeName);
        contractOrg1.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection] });


        statefulTxn = contractOrg1.createTransaction('UpdateAsset');
        statefulTxn.setEndorsingOrganizations(mspOrg1);
        result = await statefulTxn.submit(assetID,newColor,newWeight);
        console.log(`Asset was updated`);
        result = await contractOrg1.evaluateTransaction('ReadAsset',assetID)//'asset1');
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.end(result);
       

        gatewayOrg1.disconnect;
    } catch (error) {
        console.error(`Failed to Update Asset : ${error}`);
        res.end();
    }
}
);
router.get('/retailerFrontPage/updateAsset', async function  (req,res) {

    try {


        /** ~~~~~~~ Fabric client init: Using Org2 identity to Org2 Peer ~~~~~~~ */
        const gatewayOrg2 = await initContractFromOrg2Identity();
        const networkOrg2 = await gatewayOrg2.getNetwork(channelName);
        const contractOrg2 = networkOrg2.getContract(chaincodeName);
        contractOrg2.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection, sharedCollectionOrg2Org3] });


        statefulTxn = contractOrg2.createTransaction('UpdateAsset');
        statefulTxn.setEndorsingOrganizations(mspOrg2);
        result = await statefulTxn.submit(assetID,newColor,newWeight);
        console.log(`Asset was updated`);
        result = await contractOrg2.evaluateTransaction('ReadAsset',assetID)//'asset1');
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.end(result);
        // Disconnect from the gateway.
        gatewayOrg2.disconnect;
    } catch (error) {
        console.error(`Failed to Update Asset : ${error}`);
        res.end();
        // process.exit(1);
    }
}
);
router.get('/supermarketFrontPage/updateAsset', async function  (req,res) {

    try {


        /** ~~~~~~~ Fabric client init: Using Org3 identity to Org3 Peer ~~~~~~~ */
        const gatewayOrg3 = await initContractFromOrg3Identity();
        const networkOrg3 = await gatewayOrg3.getNetwork(channelName);
        const contractOrg3 = networkOrg3.getContract(chaincodeName);
        contractOrg3.addDiscoveryInterest({ name: chaincodeName, collectionNames: [sharedCollectionOrg2Org3] });

        statefulTxn = contractOrg3.createTransaction('UpdateAsset');
        statefulTxn.setEndorsingOrganizations(mspOrg3);
        result = await statefulTxn.submit(assetID,newColor,newWeight);
        console.log(`Asset was updated`);
        result = await contractOrg3.evaluateTransaction('ReadAsset',assetID)//'asset1');
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.end(result);
        // Disconnect from the gateway.
        gatewayOrg3.disconnect;
    } catch (error) {
        console.error(`Failed to Update Asset : ${error}`);
        res.end();
        // process.exit(1);
    }
}
);


/**Delete Asset  */
router.get('/farmerFrontPage/deleteAsset', async function  (req,res) {

    try {


        /** ******* Fabric client init: Using Org1 identity to Org1 Peer ********** */
        const gatewayOrg1 = await initContractFromOrg1Identity();
        const networkOrg1 = await gatewayOrg1.getNetwork(channelName);
        const contractOrg1 = networkOrg1.getContract(chaincodeName);
        contractOrg1.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection] });
        let temp,objSent;
        temp={
            success:"",
            exists:"",
            owner:""
        }
        result = await contractOrg1.evaluateTransaction('AssetExists',assetID);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        if(result.toString()==="true"){
            statefulTxn = contractOrg1.createTransaction('DeleteAsset');
            statefulTxn.setEndorsingOrganizations(mspOrg1);
            result = await statefulTxn.submit(assetID);
            console.log(`Asset was deleted`);
            temp.success="true";
            objSent=Buffer.from(JSON.stringify(temp))
            res.end(objSent);
        }else{
            temp.exists="false";
            objSent=Buffer.from(JSON.stringify(temp))
            res.end(objSent);
        }
        //returns false if it doesnt exist
        
        
        
        
       

        gatewayOrg1.disconnect;
    } catch (error) {
        console.error(`Failed to delete transaction: ${error}`);
        res.end(temp);
        // process.exit(1);
    }
}
);
router.get('/retailerFrontPage/deleteAsset', async function  (req,res) {

    try {


        /** ~~~~~~~ Fabric client init: Using Org2 identity to Org2 Peer ~~~~~~~ */
        const gatewayOrg2 = await initContractFromOrg2Identity();
        const networkOrg2 = await gatewayOrg2.getNetwork(channelName);
        const contractOrg2 = networkOrg2.getContract(chaincodeName);
        contractOrg2.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection, sharedCollectionOrg2Org3] });


        let temp,objSent;
        temp={
            success:"",
            exists:"",
            owner:""
        }
        result = await contractOrg2.evaluateTransaction('AssetExists',assetID);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        if(result.toString()==="true"){
            statefulTxn = contractOrg2.createTransaction('DeleteAsset');
            statefulTxn.setEndorsingOrganizations(mspOrg2);
            result = await statefulTxn.submit(assetID);
            console.log(`Asset was deleted`);
            temp.success="true";
            objSent=Buffer.from(JSON.stringify(temp))
            res.end(objSent);
        }else{
            temp.exists="false";
            objSent=Buffer.from(JSON.stringify(temp))
            res.end(objSent);
        }
        // Disconnect from the gateway.
        gatewayOrg2.disconnect;
    } catch (error) {
        console.error(`Failed to Delete Asset : ${error}`);
        res.end();
        // process.exit(1);
    }
}
);
router.get('/supermarketFrontPage/deleteAsset', async function  (req,res) {

    try {


        /** ~~~~~~~ Fabric client init: Using Org3 identity to Org3 Peer ~~~~~~~ */
        const gatewayOrg3 = await initContractFromOrg3Identity();
        const networkOrg3 = await gatewayOrg3.getNetwork(channelName);
        const contractOrg3 = networkOrg3.getContract(chaincodeName);
        contractOrg3.addDiscoveryInterest({ name: chaincodeName, collectionNames: [ sharedCollectionOrg2Org3] });

        let temp,objSent;
        temp={
            success:"",
            exists:"",
            owner:""
        }
        result = await contractOrg3.evaluateTransaction('AssetExists',assetID);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        if(result.toString()==="true"){
            statefulTxn = contractOrg3.createTransaction('DeleteAsset');
            statefulTxn.setEndorsingOrganizations(mspOrg3);
            result = await statefulTxn.submit(assetID);
            console.log(`Asset was deleted`);
            temp.success="true";
            objSent=Buffer.from(JSON.stringify(temp))
            res.end(objSent);
        }else{
            temp.exists="false";
            objSent=Buffer.from(JSON.stringify(temp))
            res.end(objSent);
        }
        // Disconnect from the gateway.
        gatewayOrg3.disconnect;
    } catch (error) {
        console.error(`Failed to Delete Asset : ${error}`);
        res.end();
        // process.exit(1);
    }
}
);

/**Asset Exists  */
router.get('/farmerFrontPage/assetExists', async function  (req,res) {

    try {


        /** ******* Fabric client init: Using Org1 identity to Org1 Peer ********** */
        const gatewayOrg1 = await initContractFromOrg1Identity(org1UserId);
        const networkOrg1 = await gatewayOrg1.getNetwork(channelName);
        const contractOrg1 = networkOrg1.getContract(chaincodeName);
        contractOrg1.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection] });


        statefulTxn = contractOrg1.createTransaction('AssetExists');
        statefulTxn.setEndorsingOrganizations(mspOrg1);
        result = await statefulTxn.submit(assetID);
        console.log(`Asset exists : `,result);
        let flag=(result.toString()==="true");
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        //might have to delete
        if(flag){
            result = await contractOrg1.evaluateTransaction('ReadAsset',assetID)//'asset1');
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            //the asset can be read
            res.end(result);
        }else{
            res.end(result);
        }
        
       

        gatewayOrg1.disconnect;
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.end();
        // process.exit(1);
    }
}
);
router.get('/retailerFrontPage/assetExists', async function  (req,res) {

    try {


        /** ~~~~~~~ Fabric client init: Using Org2 identity to Org2 Peer ~~~~~~~ */
        const gatewayOrg2 = await initContractFromOrg2Identity();
        const networkOrg2 = await gatewayOrg2.getNetwork(channelName);
        const contractOrg2 = networkOrg2.getContract(chaincodeName);
        contractOrg2.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection, sharedCollectionOrg2Org3] });


        statefulTxn = contractOrg2.createTransaction('AssetExists');
        statefulTxn.setEndorsingOrganizations(mspOrg2);
        result = await statefulTxn.submit(assetID);
        console.log(`Asset exists : `,result);
        //might have to delete
        let flag=(result.toString()==="true");
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        //might have to delete
        if(flag){
            result = await contractOrg2.evaluateTransaction('ReadAsset',assetID)//'asset1');
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            //the asset can be read
            res.end(result);
        }else{
            res.end(result);
        }
        // Disconnect from the gateway.
        gatewayOrg2.disconnect;
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.end();
        // process.exit(1);
    }
}
);
router.get('/supermarketFrontPage/assetExists', async function  (req,res) {

    try {


        /** ~~~~~~~ Fabric client init: Using Org3 identity to Org3 Peer ~~~~~~~ */
        const gatewayOrg3 = await initContractFromOrg3Identity();
        const networkOrg3 = await gatewayOrg3.getNetwork(channelName);
        const contractOrg3 = networkOrg3.getContract(chaincodeName);
        contractOrg3.addDiscoveryInterest({ name: chaincodeName, collectionNames: [ sharedCollectionOrg2Org3] });

        statefulTxn = contractOrg3.createTransaction('AssetExists');
        statefulTxn.setEndorsingOrganizations(mspOrg3);
        result = await statefulTxn.submit(assetID);
        console.log(`Asset exists : `,result);
        //might have to delete
        let flag=(result.toString()==="true");
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        //might have to delete
        if(flag){
            result = await contractOrg3.evaluateTransaction('ReadAsset',assetID)//'asset1');
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            //the asset can be read
            res.end(result);
        }else{
            res.end(result);
        }
        // Disconnect from the gateway.
        gatewayOrg3.disconnect;
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.end();
        // process.exit(1);
    }
}
);

/** Read asset for all orgs */

router.get('/farmerFrontPage/readAsset', async function  (req,res) {

    try {


        /** ******* Fabric client init: Using Org1 identity to Org1 Peer ********** */
        const gatewayOrg1 = await initContractFromOrg1Identity(org1UserId);
        const networkOrg1 = await gatewayOrg1.getNetwork(channelName);
        const contractOrg1 = networkOrg1.getContract(chaincodeName);
        contractOrg1.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection] });


        result = await contractOrg1.evaluateTransaction('ReadAsset',assetID)//'asset1');
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.end(result.toString());//.toString()
        // Disconnect from the gateway.
        gatewayOrg1.disconnect;
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.end();
        // process.exit(1);
    }
}
);
router.get('/retailerFrontPage/readAsset', async function  (req,res) {

    try {


        /** ~~~~~~~ Fabric client init: Using Org2 identity to Org2 Peer ~~~~~~~ */
        const gatewayOrg2 = await initContractFromOrg2Identity();
        const networkOrg2 = await gatewayOrg2.getNetwork(channelName);
        const contractOrg2 = networkOrg2.getContract(chaincodeName);
        contractOrg2.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection, sharedCollectionOrg2Org3] });


        result = await contractOrg2.evaluateTransaction('ReadAsset',assetID)//'asset2');
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.end(result.toString());//.toString()
        // Disconnect from the gateway.
        gatewayOrg2.disconnect;
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.end();
        // process.exit(1);
    }
}
);
router.get('/supermarketFrontPage/readAsset', async function  (req,res) {

    try {


        /** ~~~~~~~ Fabric client init: Using Org3 identity to Org3 Peer ~~~~~~~ */
        const gatewayOrg3 = await initContractFromOrg3Identity();
        const networkOrg3 = await gatewayOrg3.getNetwork(channelName);
        const contractOrg3 = networkOrg3.getContract(chaincodeName);
        contractOrg3.addDiscoveryInterest({ name: chaincodeName, collectionNames: [ sharedCollectionOrg2Org3] });

        result = await contractOrg3.evaluateTransaction('ReadAsset',assetID)//'asset3');
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.end(result.toString());//.toString()
        // Disconnect from the gateway.
        gatewayOrg3.disconnect;
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.end();
        // process.exit(1);
    }
}
);

/*Get all assets */
router.get('/farmerFrontPage/getAllAssets', async function  (req,res) {

    try {


        /** ******* Fabric client init: Using Org1 identity to Org1 Peer ********** */
        const gatewayOrg1 = await initContractFromOrg1Identity();
        const networkOrg1 = await gatewayOrg1.getNetwork(channelName);
        const contractOrg1 = networkOrg1.getContract(chaincodeName);
        contractOrg1.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection] });


        result = await contractOrg1.evaluateTransaction('GetAllAssets')
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.end(result);//.toString()
        // Disconnect from the gateway.
        gatewayOrg1.disconnect;
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.end();
        // process.exit(1);
    }
}
);
router.get('/retailerFrontPage/getAllAssets', async function  (req,res) {

    try {


        /** ~~~~~~~ Fabric client init: Using Org2 identity to Org2 Peer ~~~~~~~ */
        const gatewayOrg2 = await initContractFromOrg2Identity();
        const networkOrg2 = await gatewayOrg2.getNetwork(channelName);
        const contractOrg2 = networkOrg2.getContract(chaincodeName);
        contractOrg2.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection, sharedCollectionOrg2Org3] });
        

        result = await contractOrg2.evaluateTransaction('GetAllAssets')
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.end(result);//.toString()
        // Disconnect from the gateway.
        gatewayOrg2.disconnect;
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.end();
        // process.exit(1);
    }
}
);
router.get('/supermarketFrontPage/getAllAssets', async function  (req,res) {

    try {


        /** ~~~~~~~ Fabric client init: Using Org3 identity to Org3 Peer ~~~~~~~ */
        const gatewayOrg3 = await initContractFromOrg3Identity();
        const networkOrg3 = await gatewayOrg3.getNetwork(channelName);
        const contractOrg3 = networkOrg3.getContract(chaincodeName);
        contractOrg3.addDiscoveryInterest({ name: chaincodeName, collectionNames: [sharedCollectionOrg2Org3] });


        result = await contractOrg3.evaluateTransaction('GetAllAssets')
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.end(result);//.toString()
        // Disconnect from the gateway.
        gatewayOrg3.disconnect;
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.end();
        // process.exit(1);
    }
}
);

/* Get Asset History */
router.get('/farmerFrontPage/getAssetHistory',async function (req,res){
    try{

        /** ******* Fabric client init: Using Org1 identity to Org1 Peer ********** */
        const gatewayOrg1 = await initContractFromOrg1Identity();
        const networkOrg1 = await gatewayOrg1.getNetwork(channelName);
        const contractOrg1 = networkOrg1.getContract(chaincodeName);
        contractOrg1.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection] });
        console.log('\n--> Evaluate Transaction: GetAssetHistory, get the history of ',assetID);
        result = await contractOrg1.evaluateTransaction('GetAssetHistory', assetID);
        console.log(`*** Result: ${(result.toString())}`);
        res.end(result)
    }catch(error){
        console.error(`Failed to evaluate transaction: ${error}`);
        res.end();
    }

});

router.get('/retailerFrontPage/getAssetHistory',async function (req,res){
    try{

        /** ******* Fabric client init: Using Org1 identity to Org1 Peer ********** */
        const gatewayOrg2 = await initContractFromOrg2Identity();
        const networkOrg2 = await gatewayOrg2.getNetwork(channelName);
        const contractOrg2 = networkOrg2.getContract(chaincodeName);
        contractOrg2.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection,sharedCollectionOrg2Org3] });
        console.log('\n--> Evaluate Transaction: GetAssetHistory, get the history of ',assetID);
        result = await contractOrg2.evaluateTransaction('GetAssetHistory', assetID);
        console.log(`*** Result: ${(result.toString())}`);
        res.end(result)
    }catch(error){
        console.error(`Failed to evaluate transaction: ${error}`);
        res.end();
    }

});

router.get('/supermarketFrontPage/getAssetHistory',async function (req,res){
    try{

        /** ******* Fabric client init: Using Org1 identity to Org1 Peer ********** */
        const gatewayOrg3 = await initContractFromOrg3Identity();
        const networkOrg3 = await gatewayOrg3.getNetwork(channelName);
        const contractOrg3 = networkOrg3.getContract(chaincodeName);
        contractOrg3.addDiscoveryInterest({ name: chaincodeName, collectionNames: [sharedCollectionOrg2Org3] });
        console.log('\n--> Evaluate Transaction: GetAssetHistory, get the history of ',assetID);
        result = await contractOrg3.evaluateTransaction('GetAssetHistory', assetID);
        console.log(`*** Result: ${(result.toString())}`);
        res.end(result)
    }catch(error){
        console.error(`Failed to evaluate transaction: ${error}`);
        res.end();
    }

});

/* Set Price For Asset*/
router.get('/farmerFrontPage/setPrice',async function (req,res){
    try{
        
        /** ******* Fabric client init: Using Org1 identity to Org1 Peer ********** */
        const gatewayOrg1 = await initContractFromOrg1Identity(org1UserId);
        const networkOrg1 = await gatewayOrg1.getNetwork(channelName);
        const contractOrg1 = networkOrg1.getContract(chaincodeName);
        contractOrg1.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection] });
        console.log("=========Here Org1 agrees to sell ",assetID)
        
            // Agree to a sell by Org1
        const asset_price = {
            asset_id: assetID,
            price: 110,
            trade_id: randomNumber.toString()
        };
        const asset_price_string =  Buffer.from(JSON.stringify(asset_price));
        console.log(`--> Submit Transaction: setPrice, ${assetID} as Org1 - endorsed by Org1`);
        transaction = contractOrg1.createTransaction('SetPrice');
        transaction.setEndorsingOrganizations(mspOrg1);
        transaction.setTransient({
            asset_price:asset_price_string
        });
        await transaction.submit(assetID);
        console.log(`*** Result: committed, Org1 has agreed to sell asset ${assetID} for 110`);

        console.log('\n--> Evaluate Transaction: GetAssetSalesPrice ' + assetID);
        result = await contractOrg1.evaluateTransaction('GetAssetSalesPrice', assetID);
        console.log(result)
        res.end(result)
    }catch(error){
        console.error(`Failed to evaluate transaction: ${error}`);
        res.end();
    }

});

router.get('/retailerFrontPage/setPrice',async function (req,res){
    try{
        
        /** ******* Fabric client init: Using Org1 identity to Org1 Peer ********** */
        const gatewayOrg2 = await initContractFromOrg2Identity();
        const networkOrg2 = await gatewayOrg2.getNetwork(channelName);
        const contractOrg2 = networkOrg2.getContract(chaincodeName);
        contractOrg2.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection,sharedCollectionOrg2Org3] });
        console.log("=========Here Org2 agrees to sell ",assetID)
        
            // Agree to a sell by Org2
        const asset_price = {
            asset_id: assetID,
            price: 110,
            trade_id: randomNumber.toString()
        };
        const asset_price_string =  Buffer.from(JSON.stringify(asset_price));
        console.log(`--> Submit Transaction: setPrice, ${assetID} as Org1 - endorsed by Org1`);
        transaction = contractOrg2.createTransaction('SetPrice');
        transaction.setEndorsingOrganizations(mspOrg2);
        transaction.setTransient({
            asset_price:asset_price_string
        });
        await transaction.submit(assetID);
        console.log(`*** Result: committed, Org2 has agreed to sell asset ${assetID} for 110`);

        console.log('\n--> Evaluate Transaction: GetAssetSalesPrice ' + assetID);
        result = await contractOrg2.evaluateTransaction('GetAssetSalesPrice', assetID);
        console.log(result)
        res.end(result)
    }catch(error){
        console.error(`Failed to evaluate transaction: ${error}`);
        res.end();
    }

});
router.get('/supermarketFrontPage/setPrice',async function (req,res){
    try{
        
        /** ******* Fabric client init: Using Org1 identity to Org1 Peer ********** */
        const gatewayOrg3 = await initContractFromOrg3Identity();
        const networkOrg3 = await gatewayOrg3.getNetwork(channelName);
        const contractOrg3 = networkOrg3.getContract(chaincodeName);
        contractOrg3.addDiscoveryInterest({ name: chaincodeName, collectionNames: [sharedCollectionOrg2Org3] });
        console.log("=========Here Org1 agrees to sell ",assetID)
        
            // Agree to a sell by Org1
        const asset_price = {
            asset_id: assetID,
            price: 110,
            trade_id: randomNumber.toString()
        };
        const asset_price_string =  Buffer.from(JSON.stringify(asset_price));
        console.log(`--> Submit Transaction: setPrice, ${assetID} as Org1 - endorsed by Org1`);
        transaction = contractOrg3.createTransaction('SetPrice');
        transaction.setEndorsingOrganizations(mspOrg3);
        transaction.setTransient({
            asset_price:asset_price_string
        });
        await transaction.submit(assetID);
        console.log(`*** Result: committed, Org1 has agreed to sell asset ${assetID} for 110`);

        console.log('\n--> Evaluate Transaction: GetAssetSalesPrice ' + assetID);
        result = await contractOrg3.evaluateTransaction('GetAssetSalesPrice', assetID);
        console.log(result)
        res.end(result)
    }catch(error){
        console.error(`Failed to evaluate transaction: ${error}`);
        res.end();
    }

});




function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

/* Request To Buy asset only Org2 and Org3 can do this,might have to add client case to buy from supermarket */

router.get('/retailerFrontPage/requestToBuy',async function (req,res) {

    try{

        const gatewayOrg2 = await initContractFromOrg2Identity();
        const networkOrg2 = await gatewayOrg2.getNetwork(channelName);
        const contractOrg2 = networkOrg2.getContract(chaincodeName);
        contractOrg2.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection,sharedCollectionOrg2Org3] });

        console.log('\n~~~~~~~~~~~~~~~~ As Org2 Client ~~~~~~~~~~~~~~~~');
        console.log('\n~~~~~~~~~~~~~~~ We need to request to buy asset ~~~~~~~~~~~~~~~~');
        //make request to buy it,might have to do this before org1 sets price
        transaction = contractOrg2.createTransaction('RequestToBuy');
        transaction.setEndorsingOrganizations(mspOrg2);
        transaction.submit(assetID);
        
        //we are going to read the submitted request from user and since
        // its Org2 reading its' own buy request
        result = await contractOrg2.evaluateTransaction('ReadRequestToBuy', assetID,assetCollection);
        console.log(result.toString())
        res.end(result)
    
    }catch(error){
        console.error(`failed to create buy request ${error}`);
        res.end();
    }

});

router.get('/supermarketFrontPage/requestToBuy',async function (req,res) {
    try{

        const gatewayOrg3 = await initContractFromOrg3Identity();
        const networkOrg3 = await gatewayOrg3.getNetwork(channelName);
        const contractOrg3 = networkOrg3.getContract(chaincodeName);
        contractOrg3.addDiscoveryInterest({ name: chaincodeName, collectionNames: [sharedCollectionOrg2Org3] });

        console.log('\n~~~~~~~~~~~~~~~~ As Org3 Client ~~~~~~~~~~~~~~~~');
        console.log('\n~~~~~~~~~~~~~~~ We need to request to buy asset ~~~~~~~~~~~~~~~~');
        //make request to buy it,might have to do this before org1 sets price
        transaction = contractOrg3.createTransaction('RequestToBuy');
        transaction.setEndorsingOrganizations(mspOrg3);
        transaction.submit(assetID);
        
        //we are going to read the submitted request from user and since
        // its Org3 reading its' own buy request
        result = await contractOrg3.evaluateTransaction('ReadRequestToBuy', assetID,sharedCollectionOrg2Org3);
        console.log(result.toString())
        res.end(result)
    
    }catch(error){
        console.error(`failed to create buy request ${error}`);
        res.end();
    }

});


/** Read Buy Request ,might have to add relation of client and supermarket*/
router.get('/farmerFrontPage/readBuyRequest',async function (req,res) {
    try{

        const gatewayOrg1 = await initContractFromOrg1Identity();
        const networkOrg1 = await gatewayOrg1.getNetwork(channelName);
        const contractOrg1 = networkOrg1.getContract(chaincodeName);
        contractOrg1.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection] });

        console.log('\n~~~~~~~~~~~~~~~~ As Org1 Client ~~~~~~~~~~~~~~~~');
        console.log('\n~~~~~~~~~~~~~~~ Reading Request To Buy ');

        result = await contractOrg1.evaluateTransaction('ReadRequestToBuy', assetID,assetCollection);
        console.log(result.toString())
        res.end(result)
    
    }catch(error){
        console.error(`failed to read buy request ${error}`);
        res.end();
    }

});

router.get('/retailerFrontPage/readBuyRequest',async function (req,res) {

    try{

        const gatewayOrg2 = await initContractFromOrg2Identity();
        const networkOrg2 = await gatewayOrg2.getNetwork(channelName);
        const contractOrg2 = networkOrg2.getContract(chaincodeName);
        contractOrg2.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection,sharedCollectionOrg2Org3] });

        console.log('\n~~~~~~~~~~~~~~~~ As Org2 Client ~~~~~~~~~~~~~~~~');
        console.log('\n~~~~~~~~~~~~~~~ We need to request to buy asset ~~~~~~~~~~~~~~~~');

        result = await contractOrg2.evaluateTransaction('ReadRequestToBuy', assetID,sharedCollectionOrg2Org3);
        console.log(result.toString())
        res.end(result)
    
    }catch(error){
        console.error(`failed to create buy request ${error}`);
        res.end();
    }

});

/**Agree To Buy can be done only from Org2 and 3, client not implemented yet */
router.get('/retailerFrontPage/agreeToBuy',async function (req,res) {
    
    try{
        
        const gatewayOrg2 = await initContractFromOrg2Identity();
        const networkOrg2 = await gatewayOrg2.getNetwork(channelName);
        const contractOrg2 = networkOrg2.getContract(chaincodeName);
        contractOrg2.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection,sharedCollectionOrg2Org3] });
        console.log("===========Here we are going to AgreeToBuy as Org2===================");
        // Agree to a buy by Org2
		const asset_price = {
			asset_id: assetID,
			price: 110,
			trade_id: randomNumber.toString()
		};
		const asset_price_string = JSON.stringify(asset_price);
		console.log(`--> Submit Transaction: AgreeToBuy, ${assetID} as Org2 - endorsed by Org2`);
		transaction = contractOrg2.createTransaction('AgreeToBuy');
		transaction.setEndorsingOrganizations(mspOrg2);//mspOrg1
		transaction.setTransient({
			asset_price: Buffer.from(asset_price_string)
		});
		await transaction.submit(assetID);
		console.log(`*** Result: committed, Org2 has agreed to buy asset ${assetID} for 110`);


        console.log('\n--> Evaluate Transaction: GetAssetBidPrice ' + assetID);
        result = await contractOrg2.evaluateTransaction('GetAssetBidPrice', assetID);
        console.log(result)
        res.end(result);

    }catch(error){
        console.error(`Couldnt tranfer requested asset ${error}`);
        res.end();
    }
}

);

router.get('/supermarketFrontPage/agreeToBuy',async function (req,res) {
    
    try{
        
        const gatewayOrg3 = await initContractFromOrg3Identity();
        const networkOrg3 = await gatewayOrg3.getNetwork(channelName);
        const contractOrg3 = networkOrg3.getContract(chaincodeName);
        contractOrg3.addDiscoveryInterest({ name: chaincodeName, collectionNames: [sharedCollectionOrg2Org3] });
        console.log("===========Here we are going to AgreeToBuy as Org3===================");
        // Agree to a buy by Org3
		const asset_price = {
			asset_id: assetID,
			price: 110,
			trade_id: randomNumber.toString()
		};
		const asset_price_string = JSON.stringify(asset_price);
		console.log(`--> Submit Transaction: AgreeToBuy, ${assetID} as Org3 - endorsed by Org3`);
		transaction = contractOrg3.createTransaction('AgreeToBuy');
		transaction.setEndorsingOrganizations(mspOrg3);//mspOrg1
		transaction.setTransient({
			asset_price: Buffer.from(asset_price_string)
		});
		await transaction.submit(assetID);
		console.log(`*** Result: committed, Org3 has agreed to buy asset ${assetID} for 110`);


        console.log('\n--> Evaluate Transaction: GetAssetBidPrice ' + assetID);
        result = await contractOrg3.evaluateTransaction('GetAssetBidPrice', assetID);
        console.log(result)
        res.end(result);

    }catch(error){
        console.error(`Couldnt tranfer requested asset ${error}`);
        res.end();
    }
}

);


/** Transfer Requested asset. It's available only for Farmers and retailers. Client supermarket not implemented yet */

router.get('/farmerFrontPage/transferRequestedAsset',async function (req,res) {
    
    try{
        let buyerDetails = { assetID: assetID, buyerMSP: mspOrg2 };
        const gatewayOrg1 = await initContractFromOrg1Identity();
        const networkOrg1 = await gatewayOrg1.getNetwork(channelName);
        const contractOrg1 = networkOrg1.getContract(chaincodeName);
        contractOrg1.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection] });

        console.log('\n--> Submit Transaction: TransferRequestedAsset ' + assetID);
        statefulTxn = contractOrg1.createTransaction('TransferRequestedAsset');
        let tmapData = Buffer.from(JSON.stringify(buyerDetails));
        statefulTxn.setEndorsingOrganizations(mspOrg1);
        statefulTxn.setTransient({
            asset_owner: tmapData
        });
        result = await statefulTxn.submit();

        console.log('\n--> We are going to read privateAssetAfter after transfer to org2');
        result = await contractOrg1.evaluateTransaction('ReadAsset', assetID);
        console.log(`*** Result: ${(result.toString())}`);
        res.end(result);

    }catch(error){
        console.error(`Couldnt tranfer requested asset ${error}`);
        res.end();
    }
}

);

router.get('/retailerFrontPage/transferRequestedAsset',async function (req,res) {
    
    try{
        let buyerDetails = { assetID: assetID, buyerMSP: mspOrg3 };
        const gatewayOrg2 = await initContractFromOrg2Identity();
        const networkOrg2 = await gatewayOrg2.getNetwork(channelName);
        const contractOrg2 = networkOrg2.getContract(chaincodeName);
        contractOrg2.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection] });

        console.log('\n--> Submit Transaction: TransferRequestedAsset ' + assetID);
        statefulTxn = contractOrg2.createTransaction('TransferRequestedAsset');
        let tmapData = Buffer.from(JSON.stringify(buyerDetails));
        statefulTxn.setEndorsingOrganizations(mspOrg2);
        statefulTxn.setTransient({
            asset_owner: tmapData
        });
        result = await statefulTxn.submit();

        console.log('\n--> We are going to read privateAssetAfter after transfer to org3');
        result = await contractOrg2.evaluateTransaction('ReadAsset', assetID);
        console.log(`*** Result: ${(result.toString())}`);
        res.end(result);

    }catch(error){
        console.error(`Couldnt tranfer requested asset ${error}`);
        res.end();
    }
}

);

/**Delete Buy Request */
router.get('/retailerFrontPage/deleteBuyRequest',async function (req,res) {
    
    try{
        
        const gatewayOrg2 = await initContractFromOrg2Identity();
        const networkOrg2 = await gatewayOrg2.getNetwork(channelName);
        const contractOrg2 = networkOrg2.getContract(chaincodeName);
        contractOrg2.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection] });
        let temp,objSent;
        console.log('\n--> Submit Transaction: DeleteBuyRequest ' + assetID);
        statefulTxn = contractOrg2.createTransaction('DeleteBuyRequest');
        statefulTxn.setEndorsingOrganizations(mspOrg2);
        result = await statefulTxn.submit(assetID,assetCollection);
        temp={
            success:"true"
        }
        // result = await contractOrg2.evaluateTransaction('ReadRequestToBuy', assetID,assetCollection);
        // console.log(`*** Result: ${(result.toString())}`);
        console.log("successfully delete buiy request");
        objSent=Buffer.from(JSON.stringify(temp))
        res.end(objSent);
        

    }catch(error){
        console.error(`Couldnt delete buy request ${error}`);
        res.end();
    }
}

);

router.get('/supermarketFrontPage/deleteBuyRequest',async function (req,res) {
    
    try{
        
        const gatewayOrg3 = await initContractFromOrg3Identity();
        const networkOrg3 = await gatewayOrg3.getNetwork(channelName);
        const contractOrg3 = networkOrg3.getContract(chaincodeName);
        contractOrg3.addDiscoveryInterest({ name: chaincodeName, collectionNames: [sharedCollectionOrg2Org3] });
        let temp,objSent;
        console.log('\n--> Submit Transaction: DeleteBuyRequest ' + assetID);
        statefulTxn = contractOrg3.createTransaction('DeleteBuyRequest');
        statefulTxn.setEndorsingOrganizations(mspOrg3);
        result = await statefulTxn.submit(assetID,sharedCollectionOrg2Org3);
        temp={
            success:"true"
        }
        // result = await contractOrg2.evaluateTransaction('ReadRequestToBuy', assetID,assetCollection);
        // console.log(`*** Result: ${(result.toString())}`);
        console.log("successfully delete buiy request");
        objSent=Buffer.from(JSON.stringify(temp))
        res.end(objSent);

    }catch(error){
        console.error(`Couldnt delete buy request ${error}`);
        res.end();
    }
}

);




/**======================================================================== */
router.post('/addTweet', async (req, res) => {
    const userTweet = req.body.tweetInput;
   
    const user = Schemas.Users;
    const userId = await user.findOne({username:'eaglefang'}).exec();
   
    const newTweet= new Schemas.Tweets({
        tweet: userTweet,
        user:userId._id
    })

    try{
        await newTweet.save(async(err,newTweetResults)=>{
            if(err){res.end('error saving');}
            res.redirect('/tweets');
            res.end();
        })
    }catch(err){
        console.log(err);
        res.redirect('/tweets');
        res.end();
    }

});

module.exports = router;

//const Schemas=require('../models/Schemas.js');
/* Adduser 
router.get ('/addUser',async (req,res)=>{
    const user= {username:'eaglefang',fullname:'Sensei Johnny'};
    const newUser = new Schemas.Users(user);


    try{
        await newUser.save( async(err,newUserResult) =>{
            console.log('New user created');//cmd
            res.end('New user created');//screen
        })
    }catch(err){
        console.log(err);
        res.end('User not added!');
    }

})
*/

    // router.get('/tweets',async (req, res) => {
    //     const tweets = Schemas.Tweets;
    
    //    // const userTweets = await tweets.find({},(err,tweetData)=>{
    //     const userTweets = await tweets.find({}).populate("user").exec((err,tweetData)=>{//SELECT FROM TABLE JOIN a on b 
    
        
    //         if(err)throw err;
    //         if(tweetData){
    //             //console.log('this is the tweet data without stringify',tweetData);
    //             //console.log("\n this is the data afte stringyfy",JSON.stringify(tweetData))
    //             res.end(JSON.stringify(tweetData));
    //         }else{
    //             res.end();
    //         }
    //     })
    
    //     // This was a try to just print some data on the tweets page
    //     // const userTweets = await tweets.find({}).populate("user").exec((err,tweetData)=>{//SELECT FROM TABLE JOIN a on b 
    
        
    //     //     if(err)throw err;
    //     //     if(tweetData){
    //     //         //console.log('this is the tweet data without stringify',tweetData);
    //     //         //console.log("\n this is the data afte stringyfy",JSON.stringify(tweetData))
    //     //         res.end(JSON.stringify([ { 
    //     //         tweet: 'Malaka',
    //     //         user:
    //     //          { 
    //     //            username: 'eaglefang',
    //     //            fullname: 'Sensei Johnny',
    //     //         }}]
    //     //        ));
    //     //     }else{
    //     //         res.end();
    //     //     }
    //     // })
    
    // });



    //Initial code

    // router.get('/readAsset', async function  (req,res) {

    //     try {
    //         // load the network configuration theoretically path.resolve(__dirname, 'connection-org1.json'); should be working
    //         const ccpPath = path.resolve(__dirname,'..','..','..',  '..', '3Orgs_Network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
    //         const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    //         // Create a new file system based wallet for managing identities.
    //         const currentPath=path.resolve(__dirname,'..','..','..','app');
    //         const walletPath = path.join(currentPath, 'wallet/org1');
            
    //         const wallet = await Wallets.newFileSystemWallet(walletPath);
    //         console.log(`Wallet path: ${walletPath}`);
    
    //         // Check to see if we've already enrolled the user.
    //         const identity = await wallet.get('Farmerb');
    //         if (!identity) {
    //             console.log('An identity for the user "appUser" does not exist in the wallet');
    //             console.log('Run the registerUser.js application before retrying');
    //             return;
    //         }
    
    //         // Create a new gateway for connecting to our peer node.
    //         const gateway = new Gateway();
    //         await gateway.connect(ccp, { wallet, identity: 'Farmerb', discovery: { enabled: true, asLocalhost: true } });
    
    //         // Get the network (channel) our contract is deployed to.
    //         const network = await gateway.getNetwork('mychannel');
    
    //         // Get the contract from the network.
    //         const contract = network.getContract('try');
    
    //         // Evaluate the specified transaction.
    //         // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
    //         // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
    //         const result = await contract.evaluateTransaction('GetAllAssets')//'asset1');
    //         console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
    //         res.end(result.toString());
    //         // Disconnect from the gateway.
    //         await gateway.disconnect;
    //     } catch (error) {
    //         console.error(`Failed to evaluate transaction: ${error}`);
    //         process.exit(1);
    //     }
    // }
    // );