// router.get('/retailerFrontPage/updateAsset', async function  (req,res) {

//     try {


//         /** ~~~~~~~ Fabric client init: Using Org2 identity to Org2 Peer ~~~~~~~ */
//         const gatewayOrg2 = await initContractFromOrg2Identity();
//         const networkOrg2 = await gatewayOrg2.getNetwork(channelName);
//         const contractOrg2 = networkOrg2.getContract(chaincodeName);
//         contractOrg2.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection, sharedCollectionOrg2Org3] });


//         statefulTxn = contractOrg2.createTransaction('UpdateAsset');
//         statefulTxn.setEndorsingOrganizations(mspOrg2);
//         result = await statefulTxn.submit(assetID,newColor,newWeight);
//         console.log(`Asset was updated`);
//         result = await contractOrg2.evaluateTransaction('ReadAsset',assetID)//'asset1');
//         console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
//         res.end(result);
//         // Disconnect from the gateway.
//         gatewayOrg2.disconnect;
//     } catch (error) {
//         console.error(`Failed to Update Asset : ${error}`);
//         res.end();
//         // process.exit(1);
//     }
// }
// );


// router.get('/retailerFrontPage/deleteAsset', async function  (req,res) {

//     try {


//         /** ~~~~~~~ Fabric client init: Using Org2 identity to Org2 Peer ~~~~~~~ */
//         const gatewayOrg2 = await initContractFromOrg2Identity();
//         const networkOrg2 = await gatewayOrg2.getNetwork(channelName);
//         const contractOrg2 = networkOrg2.getContract(chaincodeName);
//         contractOrg2.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection, sharedCollectionOrg2Org3] });


//         let temp,objSent;
//         temp={
//             success:"",
//             exists:"",
//             owner:""
//         }
//         result = await contractOrg2.evaluateTransaction('AssetExists',assetID);
//         console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
//         if(result.toString()==="true"){
//             statefulTxn = contractOrg2.createTransaction('DeleteAsset');
//             statefulTxn.setEndorsingOrganizations(mspOrg2);
//             result = await statefulTxn.submit(assetID);
//             console.log(`Asset was deleted`);
//             temp.success="true";
//             objSent=Buffer.from(JSON.stringify(temp))
//             res.end(objSent);
//         }else{
//             temp.exists="false";
//             objSent=Buffer.from(JSON.stringify(temp))
//             res.end(objSent);
//         }
//         // Disconnect from the gateway.
//         gatewayOrg2.disconnect;
//     } catch (error) {
//         console.error(`Failed to Delete Asset : ${error}`);
//         //res.end();
//         res.end( Buffer.from(
//             JSON.stringify(
//                 {
//                     errorCLI:"error",
//                     errorMessage:error.responses[0].response.message,
//                     errorStatus:error.responses[0].response.status 
    
//                 })));
//         // process.exit(1);
//     }
// }
// );


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
)



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
        await transaction.submit(assetID);
        console.log("passed first transaction");
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