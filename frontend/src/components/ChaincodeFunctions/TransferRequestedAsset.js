import React, {useEffect, useState} from 'react';
// import {Link} from 'react-router-dom';
import Error from '../Templates/Error';
import PrintAssets from '../Templates/PrintAssets';


function TransferRequestedAsset(props) {


    let back;//link to go back to home page 
    if(props.org==="org1"){
       back="/farmerFrontPage"; //assigning values like this doesnt work
    }else if (props.org==="org2"){
        back="/retailerFrontPage";
    }else{
        back="/supermarketFrontPage";
    }


    const [items, setItems] = useState([]);
    useEffect( () => {
        const fetchItems = async () => {
            const orgLink="/";
            let temp;
            
            if(props.org==="org1"){
            temp="farmerFrontPage/transferRequestedAsset";
            //back="/farmerFrontPage"; //assigning values like this doesnt work
            }else if (props.org==="org2"){
                temp="retailerFrontPage/transferRequestedAsset";
                // back="/retailerFrontPage";
            }else{
                temp="supermarketFrontPage/transferRequestedAsset";
            // back="/supermarketFrontPage";
            }
            
            const data = await fetch(orgLink+temp);
            const items = await data.json();
            setItems(items);
        };

        fetchItems();
    }, [props]);

   

    




    //show only if assets are available
    //maybe i can do it with react ex <GoBack props="/frontpge" />
    var count = Object.keys(items).length;
    console.log("this is the length ",count," this is the type of items ", typeof items, " length of items.id",items.ID)
    console.log("this is the size of count",count)
    

    if(items.ID){
        return(
            <div className="mx-auto container-fluid p-5">
                <div className="d-block p-5">
                    <h3>Successfully transfered {items.ID} to {items.owner}.New asset details are: </h3>
                </div>      
                <section>
                  
                        <PrintAssets ID={items.ID} color={items.color} weight={items.weight} owner={items.owner} creator={items.creator} expirationDate={items.expirationDate} />
                    
                </section> 
                <hr />
                <div>
                    <p class="text-center d-block"><a href={back} class="btn btn-small btn-primary" >Go back</a></p>
                </div>
               
            </div>
        );
    }

    return(
        <Error message="Something went wrong ." backlink="/farmerFrontPage" />
    );



}
 export default TransferRequestedAsset;