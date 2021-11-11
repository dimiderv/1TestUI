import React, {useEffect, useState} from 'react';
// import {Link} from 'react-router-dom';
import Error from '../Templates/Error';
import PrintBuyRequest from '../Templates/PrintBuyRequest';


function RequestToBuy(props) {

    
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
                temp="retailerFrontPage/requestToBuy";
                // back="/retailerFrontPage";
            }else{
                temp="supermarketFrontPage/requestToBuy";
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
    console.log("this is the size of count",count)
    if(items.assetID){
        return(
            <div className="mx-auto container-fluid p-5">
                <div className="d-block p-5">
                    <h3> Your buy request details: </h3>
                </div>      
                <section>
                  
                        <PrintBuyRequest assetID={items.assetID} buyerID={items.buyerID}/>
                    
                </section> 
                <hr />
                <div>
                    <p class="text-center d-block"><a href={back} class="btn btn-small btn-primary" >Go back</a></p>
                </div>
               
            </div>
        );
    }

    return(
        <Error message="Something went wrong.Request to Buy couldn't be submitted."backlink={back} />
    );


    


}

export default RequestToBuy;