import React, {useEffect, useState} from 'react';
// import {Link} from 'react-router-dom';
import Error from './Templates/Error';
import PrintAssets from './Templates/PrintAssets';


function Input() {
    useEffect( () => {
        fetchItems();
    }, []);

    const [items, setItems] = useState([]);

    const fetchItems = async () => {
        const data = await fetch('/showPost');
        const items = await data.json();
        setItems(items);
    };


    //show only if assets are available
    //maybe i can do it with react ex <GoBack props="/frontpge" />
    var count = Object.keys(items).length;
    console.log("this is the length ",count," this is the type of items ", typeof items, " length of items.id",items.ID)
    console.log("this is the size of count",count)
    

    return(
        <div className="container justify-content-center p-5 ">
            <h1 className="mt-5">CreateAsset</h1>
            <form method="POST" class="border d-block p-20 pr-2"  action="/newAsset">
                <div class="form-group w-25 mx-auto">
                    <label for="assetID" class="col-form-label mx-auto">Asset ID</label>
                    {/* col-xs-3 */}
                    <div class="col-sm-10 w-10 mx-auto">
                    <input type="text" class="form-control " id="assetID" placeholder="asset#"/>
                    </div>
                </div>

              
                <div class="form-group w-25 mx-auto">
                    <label for="color" class="col-form-label mx-auto">Color </label>
                    <div class="col-sm-10 mx-auto">
                    <input type="text" class="form-control" id="color" placeholder="color"/>
                    </div>
                </div>
                <div class="form-group w-25 mx-auto">
                    <label for="color" class="col-form-label mx-auto">Weight</label>
                    <div class="col-sm-10 mx-auto">
                    <input type="number" class="form-control" id="weight" placeholder="weight"/>
                    </div>
                </div>


                <div class="form-group row d-block">
                    <div class="col-sm-12">
                        <button type="submit" value="Send" class="btn btn-primary">Create</button>
                    </div>
                </div>
            </form>

            <div>
                {items.ID ? (
                    <div className="mx-auto container-fluid p-5">
                        <div className="d-block p-5">
                            <h3>You created {items.ID} with the following details: </h3>
                        </div>      
                        <section>
                        
                                <PrintAssets ID={items.ID} color={items.color} weight={items.weight} owner={items.owner} creator={items.creator} expirationDate={items.expirationDate} />
                            
                        </section> 
                        <hr />
                        <div>
                            <p class="text-center d-block"><a href="/farmerFrontPage" class="btn btn-small btn-primary" >Go back</a></p>
                        </div>
                    
                    </div>
                    ) : (
                        <Error message="Something went wrong . The asset couldn't be created.Make sure ID of asset doesn't exist already."backlink="farmerFrontPage" />
                    )
                }
            </div>

        </div>
    );



}

export default Input;








    // if(items.ID){
    //     return(
    //         <div className="mx-auto container-fluid p-5">
    //             <div className="d-block p-5">
    //                 <h3>successfully created {items.ID} </h3>
    //             </div>      
    //             <section>
                  
    //                     <PrintAssets ID={items.ID} color={items.color} weight={items.weight} owner={items.owner} creator={items.creator} expirationDate={items.expirationDate} />
                    
    //             </section> 
    //             <hr />
    //             <div>
    //                 <p class="text-center d-block"><a href="/farmerFrontPage" class="btn btn-small btn-primary" >Go back</a></p>
    //             </div>
               
    //         </div>
    //     );
    // }

    // return(
    //     <Error message="Something went wrong . The asset couldn't be created.Make sure ID of asset doesn't exist already." backlink="/farmerFrontPage" />
    // );