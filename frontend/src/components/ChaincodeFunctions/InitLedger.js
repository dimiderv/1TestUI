import React, {useEffect, useState} from 'react';
// import {Link} from 'react-router-dom';
import Error from '../Templates/Error';
import PrintAssets from '../Templates/PrintAssets';


function InitLedger() {
    useEffect( () => {
        fetchItems();
    }, []);

    const [items, setItems] = useState([]);

    const fetchItems = async () => {
        const data = await fetch('/initLedger');
        const items = await data.json();
        setItems(items);
    };


    //show only if assets are available
    //maybe i can do it with react ex <GoBack props="/frontpge" />
    var count = Object.keys(items).length;
    console.log("this is the length ",count," this is the type of items ", typeof items, " length of items.id",items.ID)
    console.log("this is the size of count",count)
    if(count){
        return(
            <div className="mx-auto container-fluid p-5">
                <div className="d-block p-5">
                    <h3>Init Ledger was called.The assets added are:</h3>
                    
                </div>      
                <div className="d-flex align-items-center 
                  justify-content-center flex-wrap p-2 m-2 ">
                        { 
                        items.map(item => (
                            <PrintAssets ID={item.ID} color={item.color} weight={item.weight} owner={item.owner} creator={item.creator} expirationDate={item.expirationDate} />
                        ))
                        }
                    </div>
                <hr />
                <div>
                    <p className="text-center d-block"><a href="/farmerFrontPage" className="btn btn-small btn-primary" >Go back</a></p>
                </div>
               
            </div>
        );
    }

    return(
        <Error message="Something went wrong . Ledger could not be initialized" backlink="farmerFrontPage" />
    );
    


}

export default InitLedger;