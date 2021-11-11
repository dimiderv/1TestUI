import React, {useEffect, useState} from 'react';
// import {Link} from 'react-router-dom';
import Error from '../Templates/Error';
//import PrintAssets from '../Templates/PrintAssets';


function DeleteBuyRequest(props) {

    
    let back;//link to go back to home page 
    if (props.org==="org2"){
        back="/retailerFrontPage";
    }else{
        back="/supermarketFrontPage";
    }

    const [items, setItems] = useState([]);

    useEffect( () => {

        const fetchItems = async () => {
            const orgLink="/";
            let temp;
            
            if (props.org==="org2"){
                temp="retailerFrontPage/deleteBuyRequest";
                // back="/retailerFrontPage";
            }else{
                temp="supermarketFrontPage/deleteBuyRequest";
            // back="/supermarketFrontPage";
            }
            
            const data = await fetch(orgLink+temp);
            const items = await data.json();
            setItems(items);
        };

        fetchItems();
    }, [props]);




    


    var count = Object.keys(items).length;
    console.log("this is the length ",count," this is the type of items ", typeof items, " length of items.id",items.ID)
    console.log("this is the size of count",count,items)
    if(items.success==="true"){
        return(
            
            
            <Error message="Buy request deleted successfully." backlink={back} />
            
            
        );
    }

    return(
        <div>
            
            <Error message="Couldn't delete buy request. You are not the buyer." backlink={back} />
        </div>
    );




}

export default DeleteBuyRequest;