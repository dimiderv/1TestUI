import React, {useEffect, useState} from 'react';
// import {Link} from 'react-router-dom';
import Error from '../Templates/Error';
import PrintAssets from '../Templates/PrintAssets';


function GetAllAssets(props) {

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
            temp="farmerFrontPage/getAllAssets";
            }else if (props.org==="org2"){
                temp="retailerFrontPage/getAllAssets";
            }else{
                temp="supermarketFrontPage/getAllAssets";
            }
            
            const data = await fetch(orgLink+temp);
            const items = await data.json();
            setItems(items);
        };

        fetchItems();
    }, [props]); //dont understand this error

    




    

    var count = Object.keys(items).length;
    //this covers the case were we have only one asset
    if(items.ID){
        return(
            <div className="mx-auto container-fluid p-5">
                <div className="d-block p-5">
                    <h3>This is the current asset </h3>
                </div>      
                <section>
                  
                        <PrintAssets ID={items.ID} color={items.color} weight={items.weight} owner={items.owner} creator={items.creator} expirationDate={items.expirationDate} />
                    
                </section> 
                <hr />
                <div>
                    <p className="text-center d-block"><a href={back} className="btn btn-small btn-primary" >Go back</a></p>
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
                            <PrintAssets ID={item.ID} color={item.color} weight={item.weight} owner={item.owner} creator={item.creator} expirationDate={item.expirationDate} />
                        ))
                        }
                    </section> 
                    <hr />
                    <div>
                        <p className="text-center d-block"><a href={back} className="btn btn-small btn-primary" >Go back</a></p>
                    </div>
                   
                </div>
            );
      
    }

    return(
        <Error message="Something went wrong . Couldn't read all assets available" backlink={back} />
    );



}

export default GetAllAssets;