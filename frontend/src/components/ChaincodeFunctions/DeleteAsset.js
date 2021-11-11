import React, {useEffect, useState} from 'react';
// import {Link} from 'react-router-dom';
import Error from '../Templates/Error';
//import PrintAssets from '../Templates/PrintAssets';


function DeleteAsset(props) {

    let back;//link to go back to home page 
    if(props.org==="org1"){
       back="/farmerFrontPage"; //assigning values like this doesnt work
    }else if (props.org==="org2"){
        back="/retailerFrontPage";
    }else{
        back="/supermarketFrontPage";
    }

    useEffect( () => {


        const fetchItems = async () => {
            const orgLink="/";
            let temp;
            
            if(props.org==="org1"){
            temp="farmerFrontPage/deleteAsset";
            //back="/farmerFrontPage"; //assigning values like this doesnt work
            }else if (props.org==="org2"){
                temp="retailerFrontPage/deleteAsset";
                // back="/retailerFrontPage";
            }else{
                temp="supermarketFrontPage/deleteAsset";
            // back="/supermarketFrontPage";
            }
            
            const data = await fetch(orgLink+temp);
            const items = await data.json();
            setItems(items);
        };

        fetchItems();
    }, [props]);

    const [items, setItems] = useState([]);


    


    var count = Object.keys(items).length;
    console.log("this is the length ",count," this is the type of items ", typeof items, " length of items.id",items.ID)
    console.log("this is the size of count",count,items)
    if(items.success==="true"){
        return(
            
            
            <Error message="Asset deleted successfully." backlink={back} />
            
            
        );
    }else if(items.exists==="false"){
        return(
            <Error message="Asset does not exist.Make sure the ID is correct" backlink={back} />
        );
        
    }

    return(
        <div>
            
            <Error message="Couldn't delete asset. Not the owner." backlink={back} />
        </div>
    );




}

export default DeleteAsset;