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
const { response } = require('express');

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
let assetID = "asset100"//req.body.id;
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
router.post('/postUpdateAsset', async function  (req,res) {
    console.log("post Update of asset works");
    try {

        const newAsset=req.body.assetID;
        const newColor=req.body.color;
        const newWeight=parseInt(req.body.weight);
        const org=req.body.org;
        let  gatewayOrg;
        let networkOrg;
        let contractOrg;
        let mspOrg;
        console.log(newAsset,newColor,newWeight,org==="org1");
        if(org==="org1"){
            gatewayOrg = await initContractFromOrg1Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg1;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection] });
        
        }else if (org==="org2"){
            gatewayOrg = await initContractFromOrg2Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg2;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection, sharedCollectionOrg2Org3] });
        }else if(org==="org3"){

            gatewayOrg = await initContractFromOrg3Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg3;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [sharedCollectionOrg2Org3] });

        
        }else{
            console.log("No org was given. Can't connect to any profiles");
            res.end( Buffer.from(
                JSON.stringify(
                    {
                        errorCLI:"error",
                        errorMessage:"No org was given. Can't connect to any profiles",
                        errorStatus:404
    
                    })));
        }

        statefulTxn = contractOrg.createTransaction('UpdateAsset');
        statefulTxn.setEndorsingOrganizations(mspOrg);
        result = await statefulTxn.submit(newAsset,newColor,newWeight);
        console.log(`Asset was updated`);
        result = await contractOrg.evaluateTransaction('ReadAsset',newAsset);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.end(result);
       

        gatewayOrg.disconnect;
    } catch (error) {
        console.error(`Failed to Update Asset : ${error}`);
        // res.end(Buffer.from(error));
       
        res.end( Buffer.from(
            JSON.stringify(
                {
                    errorCLI:"error",
                    errorMessage:error.responses[0].response.message,
                    errorStatus:error.responses[0].response.status 
    
                })));
    }
}
);



/**Delete Asset  */
router.post('/postDeleteAsset', async function  (req,res) {

   


    console.log("post delete of asset works");
    try {
    
        const assetToDelete=req.body.assetID;
        const org=req.body.org;
        let  gatewayOrg;
        let networkOrg;
        let contractOrg;
        let mspOrg;
        console.log(assetToDelete,org);
        if(org==="org1"){
            gatewayOrg = await initContractFromOrg1Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg1;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection] });
        
        }else if (org==="org2"){
            gatewayOrg = await initContractFromOrg2Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg2;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection, sharedCollectionOrg2Org3] });
        }else if(org==="org3"){

            gatewayOrg = await initContractFromOrg3Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg3;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [sharedCollectionOrg2Org3] });

            
        }else{
            console.log("No org was given. Can't connect to any profiles");
            res.end( Buffer.from(
                JSON.stringify(
                    {
                        errorCLI:"error",
                        errorMessage:"No org was given. Can't connect to any profiles",
                        errorStatus:404
    
                    })));
        }
        let temp,objSent;
        temp={
            success:"",
            exists:"",
            owner:""
        }
        result = await contractOrg.evaluateTransaction('AssetExists',assetToDelete);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        if(result.toString()==="true"){
            statefulTxn = contractOrg.createTransaction('DeleteAsset');
            statefulTxn.setEndorsingOrganizations(mspOrg);
            result = await statefulTxn.submit(assetToDelete);
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
        
        
        
        
       

        gatewayOrg.disconnect;
    } catch (error) {
        console.error(`Failed to delete transaction: ${error}`);
        res.end( Buffer.from(
            JSON.stringify(
                {
                    errorCLI:"error",
                    errorMessage:error.responses[0].response.message,
                    errorStatus:error.responses[0].response.status 
    
                })));
    }
}
);



/**Asset Exists  */
router.post('/postAssetExists', async function  (req,res) {

    try {

        const assetToSearch=req.body.assetID;
        const org=req.body.org;
        let  gatewayOrg;
        let networkOrg;
        let contractOrg;
        let mspOrg;
        console.log(assetToSearch,org);
        if(org==="org1"){
            gatewayOrg = await initContractFromOrg1Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg1;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection] });
        
        }else if (org==="org2"){
            gatewayOrg = await initContractFromOrg2Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg2;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection, sharedCollectionOrg2Org3] });
        }else if(org==="org3"){

            gatewayOrg = await initContractFromOrg3Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg3;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [sharedCollectionOrg2Org3] });

            
        }else{
            console.log("No org was given. Can't connect to any profiles");
            res.end( Buffer.from(
                JSON.stringify(
                    {
                        errorCLI:"error",
                        errorMessage:"No org was given. Can't connect to any profiles",
                        errorStatus:404
    
                    })));
        }


        statefulTxn = contractOrg.createTransaction('AssetExists');
        statefulTxn.setEndorsingOrganizations(mspOrg);
        result = await statefulTxn.submit(assetToSearch);
        console.log(`Asset exists : `,result);
        let flag=(result.toString()==="true");
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        //might have to delete
        
        if(flag){
            result = await contractOrg.evaluateTransaction('ReadAsset',assetToSearch)//'asset1');
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            //the asset can be read
            res.end(result);
        }else{
            res.end( Buffer.from(
                JSON.stringify(
                    {
                        errorCLI:"error",
                        errorMessage:"Asset doesn't exist",
                        errorStatus:404
    
                    })));
        }
        
       

        gatewayOrg.disconnect;
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        
        res.end( Buffer.from(
            JSON.stringify(
                {
                    serverError:"Some error occured with status: ",
                    errorMessage:" The asset doesn't exist.",
                    errorStatus:500,
                    errorTemp:error

                })));
        // process.exit(1);
    }
}
);





/** Read asset for all orgs */

router.post('/postReadAsset', async function  (req,res) {
console.log("post read works")
    try {


        const assetToRead=req.body.assetID;
        const org=req.body.org;
        let  gatewayOrg;
        let networkOrg;
        let contractOrg;
        let mspOrg;
        console.log(assetToRead,org);
        if(org==="org1"){
            gatewayOrg = await initContractFromOrg1Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg1;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection] });
        
        }else if (org==="org2"){
            gatewayOrg = await initContractFromOrg2Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg2;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection, sharedCollectionOrg2Org3] });
        }else if(org==="org3"){

            gatewayOrg = await initContractFromOrg3Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg3;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [sharedCollectionOrg2Org3] });

            
        }else{
            console.log("No org was given. Can't connect to any profiles");
            res.end( Buffer.from(
                JSON.stringify(
                    {
                        errorCLI:"error",
                        errorMessage:"No org was given. Can't connect to any profiles",
                        errorStatus:404
    
                    })));
        }


        result = await contractOrg.evaluateTransaction('ReadAsset',assetToRead)//'asset1');
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.end(result.toString());//.toString()
        // Disconnect from the gateway.
        gatewayOrg.disconnect;
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.end( Buffer.from(
            JSON.stringify(
                {
                    serverError:"Some error occured with status: ",
                    errorMessage:" The asset doesn't exist.",
                    errorStatus:500,
                    errorTemp:error

                })));
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
router.post('/postGetAssetHistory',async function (req,res){
    try {


        const assetToRead=req.body.assetID;
        const org=req.body.org;
        let  gatewayOrg;
        let networkOrg;
        let contractOrg;
        let mspOrg;
        console.log(assetToRead,org);
        if(org==="org1"){
            gatewayOrg = await initContractFromOrg1Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg1;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection] });
        
        }else if (org==="org2"){
            gatewayOrg = await initContractFromOrg2Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg2;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection, sharedCollectionOrg2Org3] });
        }else if(org==="org3"){

            gatewayOrg = await initContractFromOrg3Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg3;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [sharedCollectionOrg2Org3] });

            
        }else{
            console.log("No org was given. Can't connect to any profiles");
            res.end( Buffer.from(
                JSON.stringify(
                    {
                        errorCLI:"error",
                        errorMessage:"No org was given. Can't connect to any profiles",
                        errorStatus:404
    
                    })));
        }


        result = await contractOrg.evaluateTransaction('GetAssetHistory',assetToRead);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        console.log(result.length);
        if(result.length===0){
            res.end(
                Buffer.from(
                    JSON.stringify(
                        {
                            empty:"true",
                            message:"Not found"
                        }
                    )
                )
            )
        }
        res.end(result.toString());//.toString()
        
        // Disconnect from the gateway.
        gatewayOrg.disconnect;
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.end( Buffer.from(
            JSON.stringify(
                {
                    serverError:"Some error occured with status: ",
                    errorMessage:" Server Unavailable",
                    errorStatus:500,
                    errorTemp:error

                })));
    }
});




/* Set Price For Asset*/
// For now only org1 and org2 can do it
router.post('/postSetPrice',async function (req,res){
    try{
        
        const assetToSell=req.body.assetID;
        const priceToSell=parseInt(req.body.price);//need integer for it
        const tradeId=req.body.tradeID;
        const org=req.body.org;
        let  gatewayOrg;
        let networkOrg;
        let contractOrg;
        let mspOrg;
        console.log(assetToSell,org,priceToSell,tradeId);
        if(org==="org1"){
            gatewayOrg = await initContractFromOrg1Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg1;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection] });
        
        }else if (org==="org2"){
            gatewayOrg = await initContractFromOrg2Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg2;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection, sharedCollectionOrg2Org3] });
         //}else if(org==="org3"){

        //     gatewayOrg = await initContractFromOrg3Identity();
        //     networkOrg = await gatewayOrg.getNetwork(channelName);
        //     contractOrg = networkOrg.getContract(chaincodeName);
        //     mspOrg=mspOrg3;
        //     contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [sharedCollectionOrg2Org3] });

            
        }else{
            console.log("No org was given. Can't connect to any profiles");
            res.end( Buffer.from(
                JSON.stringify(
                    {
                        errorCLI:"error",
                        errorMessage:"No org was given. Can't connect to any profiles",
                        errorStatus:404
    
                    })));
        }
        
            // Agree to a sell by Org1
        const asset_price = {
            asset_id: assetToSell,
            price: priceToSell,
            trade_id: tradeId
        };
        const asset_price_string =  Buffer.from(JSON.stringify(asset_price));
        console.log(`--> Submit Transaction: setPrice, ${assetToSell} as ${org} - endorsed by ${org}`);
        let response={
            setPrice:"",
            getSalesPrice:""
        }
        transaction = contractOrg.createTransaction('SetPrice');
        transaction.setEndorsingOrganizations(mspOrg);
        transaction.setTransient({
            asset_price:asset_price_string
        });
        await transaction.submit(assetToSell);
        console.log(`*** Result: committed, ${org} has agreed to sell asset ${assetToSell} for ${priceToSell}`);
        response.setPrice="success";

        console.log('\n--> Evaluate Transaction: GetAssetSalesPrice ' + assetToSell);
        result = await contractOrg.evaluateTransaction('GetAssetSalesPrice', assetToSell);
        response.getSalesPrice="success";
        console.log(result)
        res.end(result)
    }catch(error){
        console.error(`Failed to evaluate transaction: ${error}`);
        res.end( Buffer.from(
            JSON.stringify(
                {
                    errorCLI:"error",
                    errorMessage:"Couldn't complete transaction.",
                    errorStatus:500

                })));
    }

});







function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

/* Request To Buy asset only Org2 and Org3 can do this,might have to add client case to buy from supermarket */

router.post('/postRequestToBuy',async function (req,res) {

    try{

        const assetToBuy=req.body.assetID;
        const org=req.body.org;
        let  gatewayOrg;
        let networkOrg;
        let contractOrg;
        let mspOrg;
        let flag=true;
        console.log(assetToBuy,org);
        // if(org==="org1"){
        //     gatewayOrg = await initContractFromOrg1Identity();
        //     networkOrg = await gatewayOrg.getNetwork(channelName);
        //     contractOrg = networkOrg.getContract(chaincodeName);
        //     mspOrg=mspOrg1;
        //     contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection] });
        
        //}else 
        if (org==="org2"){
            gatewayOrg = await initContractFromOrg2Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg2;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection, sharedCollectionOrg2Org3] });
        }else if(org==="org3"){
            flag=false;
            gatewayOrg = await initContractFromOrg3Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg3;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [sharedCollectionOrg2Org3] });

            
        }else{
            console.log("No org was given. Can't connect to any profiles");
            res.end( Buffer.from(
                JSON.stringify(
                    {
                        errorCLI:"error",
                        errorMessage:"No org was given. Can't connect to any profiles",
                        errorStatus:404
    
                    })));
        }
        result = await contractOrg.evaluateTransaction('AssetExists',assetToBuy);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        if(result.toString()==="true"){
            //make request to buy it,might have to do this before org1 sets price
            transaction = contractOrg.createTransaction('RequestToBuy');
            transaction.setEndorsingOrganizations(mspOrg);
            await transaction.submit(assetToBuy);
            console.log("passed first transaction");
            
            //we are going to read the submitted request from user and since
            // its Org2 reading its' own buy request
            if(flag){
                result = await contractOrg.evaluateTransaction('ReadRequestToBuy', assetToBuy,assetCollection);
            }else{
                            result = await contractOrg.evaluateTransaction('ReadRequestToBuy', assetToBuy,sharedCollectionOrg2Org3);
            }

            console.log(result.toString())
            res.end(result)
        }else{
            res.end( Buffer.from(
                JSON.stringify(
                    {
                        serverError:"Error occured with status: ",
                        errorMessage:" Asset does not exist.",
                        errorStatus:500
                        
    
                    })));
        }

    
    }catch(error){
        console.error(`failed to create buy request ${error}`);
        res.end( Buffer.from(
            JSON.stringify(
                {
                    serverError:"Error occured with status: ",
                    errorMessage:" Server Unavailable",
                    errorStatus:500,
                    errorTemp:error

                })));
    }

});




/** Read Buy Request ,might have to add relation of client and supermarket,
 * Only org1 and org2 can do this
*/
router.post('/postReadBuyRequest',async function (req,res) {
    try{

        const assetToReadBuyRequest=req.body.assetID;
        const org=req.body.org;
        let  gatewayOrg;
        let networkOrg;
        let contractOrg;
        let mspOrg;
        //Console log of parameters
        console.log(assetToReadBuyRequest,org);
        if(org==="org1"){
            gatewayOrg = await initContractFromOrg1Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg1;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection] });
            result = await contractOrg.evaluateTransaction('ReadRequestToBuy', assetToReadBuyRequest,assetCollection);
        }else if (org==="org2"){
            gatewayOrg = await initContractFromOrg2Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg2;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection, sharedCollectionOrg2Org3] });
            result = await contractOrg.evaluateTransaction('ReadRequestToBuy', assetToReadBuyRequest,sharedCollectionOrg2Org3);
         //}else if(org==="org3"){

        //     gatewayOrg = await initContractFromOrg3Identity();
        //     networkOrg = await gatewayOrg.getNetwork(channelName);
        //     contractOrg = networkOrg.getContract(chaincodeName);
        //     mspOrg=mspOrg3;
        //     contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [sharedCollectionOrg2Org3] });

            
        }else{
            console.log("No org was given. Can't connect to any profiles");
            res.end( Buffer.from(
                JSON.stringify(
                    {
                        errorCLI:"error",
                        errorMessage:"No org was given. Can't connect to any profiles",
                        errorStatus:404
    
                    })));
        }
        console.log('\n~~~~~~~~~~~~~~~ Reading Request To Buy ');
        console.log(result.toString())
        res.end(result)
    
    }catch(error){
        console.error(`failed to read buy request ${error}`);
        res.end( Buffer.from(
            JSON.stringify(
                {
                    serverError:"error",
                    errorMessage:"Cannot read buy request.",
                    errorStatus:404

                })));
    }

});



/**Agree To Buy can be done only from Org2 and 3, client not implemented yet */
router.post('/postAgreeToBuy',async function (req,res) {
    
    try{
        
        const assetToBuy=req.body.assetID;
        const priceToAgree=parseInt(req.body.price);//need integer for it
        const tradeId=req.body.tradeID;
        const org=req.body.org;
        let  gatewayOrg;
        let networkOrg;
        let contractOrg;
        let mspOrg;
        console.log(assetToBuy,priceToAgree,tradeId,org);
        // if(org==="org1"){
        //     gatewayOrg = await initContractFromOrg1Identity();
        //     networkOrg = await gatewayOrg.getNetwork(channelName);
        //     contractOrg = networkOrg.getContract(chaincodeName);
        //     mspOrg=mspOrg1;
        //     contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection] });
        
        //}else 
        if (org==="org2"){
            gatewayOrg = await initContractFromOrg2Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg2;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection, sharedCollectionOrg2Org3] });
        }else if(org==="org3"){

            gatewayOrg = await initContractFromOrg3Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg3;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [sharedCollectionOrg2Org3] });

            
        }else{
            console.log("No org was given. Can't connect to any profiles");
            res.end( Buffer.from(
                JSON.stringify(
                    {
                        errorCLI:"error",
                        errorMessage:"No org was given. Can't connect to any profiles",
                        errorStatus:404
    
                    })));
        }


        console.log(`===========Here we are going to AgreeToBuy as ${org}===================`);
        // Agree to a buy by Org2
		const asset_price = {
			asset_id: assetToBuy,
			price: priceToAgree,
			trade_id: tradeId
		};
		const asset_price_string = JSON.stringify(asset_price);
		console.log(`--> Submit Transaction: AgreeToBuy, ${assetToBuy} as ${org} - endorsed by  ${org}`);
		transaction = contractOrg.createTransaction('AgreeToBuy');
		transaction.setEndorsingOrganizations(mspOrg);//mspOrg1
		transaction.setTransient({
			asset_price: Buffer.from(asset_price_string)
		});
		await transaction.submit(assetToBuy);
		console.log(`*** Result: committed, ${org} has agreed to buy asset ${assetToBuy} for ${priceToAgree}`);


        console.log('\n--> Evaluate Transaction: GetAssetBidPrice ' + assetToBuy);
        result = await contractOrg.evaluateTransaction('GetAssetBidPrice', assetToBuy);
        console.log(result)
        res.end(result);

    }catch(error){
        console.error(`Couldnt tranfer requested asset ${error}`);
        res.end( Buffer.from(
            JSON.stringify(
                {
                    serverError:"error",
                    errorMessage:"Cannot read buy request.",
                    errorStatus:404

                })));
    }
}

);




/** Transfer Requested asset. It's available only for Farmers and retailers. Client supermarket not implemented yet */

router.post('/postTransferRequestedAsset',async function (req,res) {
    
    try{
        const assetToTransfer=req.body.assetID;
        const org=req.body.org;
        const buyerMSP=req.body.buyerMSP;
        let buyerDetails = { assetID: assetToTransfer, buyerMSP: buyerMSP };
        let  gatewayOrg;
        let networkOrg;
        let contractOrg;
        let mspOrg;
        console.log(assetToTransfer,org,buyerDetails);
        if(org==="org1"){
            gatewayOrg = await initContractFromOrg1Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg1;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection] });
        
        }else if (org==="org2"){
            gatewayOrg = await initContractFromOrg2Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg2;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection, sharedCollectionOrg2Org3] });
         //}else if(org==="org3"){

        //     gatewayOrg = await initContractFromOrg3Identity();
        //     networkOrg = await gatewayOrg.getNetwork(channelName);
        //     contractOrg = networkOrg.getContract(chaincodeName);
        //     mspOrg=mspOrg3;
        //     contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [sharedCollectionOrg2Org3] });

            
        }else{
            console.log("No org was given. Can't connect to any profiles");
            res.end( Buffer.from(
                JSON.stringify(
                    {
                        errorCLI:"error",
                        errorMessage:"No org was given. Can't connect to any profiles",
                        errorStatus:404
    
                    })));
        }

        console.log('\n--> Submit Transaction: TransferRequestedAsset ' + assetToTransfer);
        statefulTxn = contractOrg.createTransaction('TransferRequestedAsset');
        let tmapData = Buffer.from(JSON.stringify(buyerDetails));
        statefulTxn.setEndorsingOrganizations(mspOrg);
        statefulTxn.setTransient({
            asset_owner: tmapData
        });
        result = await statefulTxn.submit();

        console.log(`\n--> We are going to read privateAssetAfter after transfer to ${buyerMSP}`);
        result = await contractOrg.evaluateTransaction('ReadAsset', assetToTransfer);
        console.log(`*** Result: ${(result.toString())}`);
        res.end(result);

    }catch(error){
        //better error handling !!!!
        //better messages
        console.error(`Couldnt tranfer requested asset ${error}`);
        res.end( Buffer.from(
            JSON.stringify(
                {
                    errorCLI:"error",
                    errorMessage:error.responses[0].response.message,
                    errorStatus:error.responses[0].response.status

                })));
    }
}

);



/**Delete Buy Request */
router.post('/postDeleteBuyRequest',async function (req,res) {
    
    try{
        
        const assetToDeleteBuyRequest=req.body.assetID;
        const org=req.body.org;
        let  gatewayOrg;
        let networkOrg;
        let contractOrg;
        let mspOrg;
        console.log(assetToBuy,org);
        // if(org==="org1"){
        //     gatewayOrg = await initContractFromOrg1Identity();
        //     networkOrg = await gatewayOrg.getNetwork(channelName);
        //     contractOrg = networkOrg.getContract(chaincodeName);
        //     mspOrg=mspOrg1;
        //     contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection] });
        
        //}else 
        if (org==="org2"){
            gatewayOrg = await initContractFromOrg2Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg2;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection, sharedCollectionOrg2Org3] });
            console.log('\n--> Submit Transaction: DeleteBuyRequest ' + assetToDeleteBuyRequest);
            statefulTxn = contractOrg.createTransaction('DeleteBuyRequest');
            statefulTxn.setEndorsingOrganizations(mspOrg);
            result = await statefulTxn.submit(assetToDeleteBuyRequest,assetCollection);
        }else if(org==="org3"){

            gatewayOrg = await initContractFromOrg3Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg3;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [sharedCollectionOrg2Org3] });
            console.log('\n--> Submit Transaction: DeleteBuyRequest ' + assetToDeleteBuyRequest);
            statefulTxn = contractOrg.createTransaction('DeleteBuyRequest');
            statefulTxn.setEndorsingOrganizations(mspOrg);
            result = await statefulTxn.submit(assetToDeleteBuyRequest,sharedCollectionOrg2Org3);

            
        }else{
            console.log("No org was given. Can't connect to any profiles");
            res.end( Buffer.from(
                JSON.stringify(
                    {
                        errorCLI:"error",
                        errorMessage:"No org was given. Can't connect to any profiles",
                        errorStatus:404
    
                    })));
        }



        let temp,objSent;
        // console.log('\n--> Submit Transaction: DeleteBuyRequest ' + assetID);
        // statefulTxn = contractOrg.createTransaction('DeleteBuyRequest');
        // statefulTxn.setEndorsingOrganizations(mspOrg);
        // result = await statefulTxn.submit(assetID,assetCollection);
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
        res.end( Buffer.from(
            JSON.stringify(
                {
                    serverError:"error",
                    errorMessage:"Cannot Delete buy request.",
                    errorStatus:404

                })));
    }
        // res.end( Buffer.from(
        //     JSON.stringify(
        //         {
        //             errorCLI:"error",
        //             errorMessage:error.responses[0].response.message,
        //             errorStatus:error.responses[0].response.status

        //         })));
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