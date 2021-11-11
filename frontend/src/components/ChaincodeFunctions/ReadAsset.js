import React, {useEffect, useState} from 'react';
// import {Link} from 'react-router-dom';
import Error from '../Templates/Error';
import PrintAssets from '../Templates/PrintAssets';


function ReadAsset(props) {

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
            temp="farmerFrontPage/readAsset";
            //back="/farmerFrontPage"; //assigning values like this doesnt work
            }else if (props.org==="org2"){
                temp="retailerFrontPage/readAsset";
                // back="/retailerFrontPage";
            }else{
                temp="supermarketFrontPage/readAsset";
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
    if(items.ID){
        return(
            <div className="mx-auto container-fluid p-5">
                <div className="d-block p-5">
                    <h3>This is the assets </h3>
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
        <Error message="Couldn't read asset.Make sure the asset exists and that the ID was typed in correctly."backlink={back} />
    );

    //show only if assets are available
    //maybe i can do it with react ex <GoBack props="/frontpge" />
    // if(items.length){
    //     return(
    //         <div className="mx-auto container-fluid p-5">
    //             <div className="d-block p-5">
    //                 <h3>These are the assets </h3>
    //             </div>      
    //             <section>
    //                 { 
    //                 items.map(item => (
    //                     <PrintAssets ID={item.ID} color={item.color} weight={item.weight} owner={item.owner} creator={item.creator} expirationDate={item.expirationDate} />
    //                 ))
    //                 }
    //             </section> 
    //             <hr />
    //             <div>
    //                 <p class="text-center d-block"><a href="/farmerFrontPage" class="btn btn-small btn-primary" >Go back</a></p>
    //             </div>
               
    //         </div>
    //     );
    // }

    // return(
    //     <Error backlink="farmerFrontPage" />
    // );
    


}

export default ReadAsset;