import React, {useEffect, useState} from 'react';
// import {Link} from 'react-router-dom';
import Error from '../Templates/Error';
import PrintBidPrice from '../Templates/PrintBidPrice'


function AgreeToBuy(props) {

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
            temp="farmerFrontPage/agreeToBuy";
            //back="/farmerFrontPage"; //assigning values like this doesnt work
            }else if (props.org==="org2"){
                temp="retailerFrontPage/agreeToBuy";
                // back="/retailerFrontPage";
            }else{
                temp="supermarketFrontPage/agreeToBuy";
            // back="/supermarketFrontPage";
            }
            
            const data = await fetch(orgLink+temp);
            const items = await data.json();
            setItems(items);
        };
        


        fetchItems();
    }, [props.org]);

    const [items, setItems] = useState([]);





    var count = Object.keys(items).length;
    console.log("this is the length ",count," this is the type of items ", typeof items, " length of items.id",items.ID)
    console.log("this is the size of count",count)
    if(items.asset_id){
        return(
            <div className="mx-auto container-fluid p-5">
                <div className="d-block p-5">
                    <h3>You agreed to buy {items.asset_id}: </h3>
                </div>      
                <section>
                  
                        <PrintBidPrice ID={items.asset_id} price={items.price} tradeID={items.trade_id} />
                    
                </section> 
                <hr />
                <div>
                    <p class="text-center d-block"><a href={back} class="btn btn-small btn-primary" >Go back</a></p>
                </div>
               
            </div>
        );
    }

    return(
        <Error message="Something went wrong. Couldn't agree to buy asset."backlink={back} />
    );


    


}

export default AgreeToBuy;