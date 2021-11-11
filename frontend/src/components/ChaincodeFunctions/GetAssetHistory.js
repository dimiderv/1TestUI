import React, {useEffect, useState} from 'react';
// import {Link} from 'react-router-dom';
import Error from '../Templates/Error';
import PrintHistory from '../Templates/PrintHistory';


function GetAssetHistory(props) {
    
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
            temp="farmerFrontPage/getAssetHistory";
            }else if (props.org==="org2"){
                temp="retailerFrontPage/getAssetHistory";
            }else{
                temp="supermarketFrontPage/getAssetHistory";
            }
            
            const data = await fetch(orgLink+temp);
            const items = await data.json();
            setItems(items);
        };


        fetchItems();
    }, [props]); //dont understand this error

    




    

    var count = Object.keys(items).length;
    console.log("ITEMS,",count,items,"ITEMS[0]",items[0],"ITEMS.RECORD",items)
    //this covers the case were we have only one asset
    if(count===1){
        return(
            <div className="mx-auto container-fluid p-5">
                <div className="d-block p-5">
                    <h3>This is the current asset </h3>
                </div>      
                <section>
                  
                        <PrintHistory ID={items[0].record.ID} color={items[0].record.color} weight={items[0].record.weight} owner={items[0].record.owner} creator={items[0].record.creator} expirationDate={items[0].record.expirationDate} txId={items[0].txId} timestamp={items[0].timestamp}  />
                    
                </section> 
                <hr />
                <div>
                    <p class="text-center d-block"><a href={back} class="btn btn-small btn-primary" >Go back</a></p>
                </div>
               
            </div>
        );
    }else if (count){
       
            return(
                <div className="mx-auto container-fluid p-5">
                    <div className="d-block p-5">
                        <h3>These are the assets </h3>
                    </div>      
                    <section>
                        { 
                        items.map(item => (
                            <PrintHistory ID={item.record.ID} color={item.record.color} weight={item.record.weight} owner={item.record.owner} creator={item.record.creator} expirationDate={item.record.expirationDate} txId={item.txId} timestamp={item.timestamp}/>
                        ))
                        }
                    </section> 
                    <hr />
                    <div>
                        <p class="text-center d-block"><a href={back} class="btn btn-small btn-primary" >Go back</a></p>
                    </div>
                   
                </div>
            );
      
    }

    return(
        <Error message="Something went wrong . Couldn't find asset History" backlink={back} />
    );



}

export default GetAssetHistory;