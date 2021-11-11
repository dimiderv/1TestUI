//import React, {useEffect, useState} from 'react';
// import {Link} from 'react-router-dom';
import farming1 from '../images/farming1.jpg'
import fruits from '../images/fruits.jpg'
function FarmerFrontPage() {
    // useEffect( () => {
    //     fetchItems();
    // }, []);

    // const [items, setItems] = useState([]);

    // const fetchItems = async () => {
    //     const data = await fetch('/farmerFrontPage');
    //     const items = await data.json();
        

    //     setItems(items);
    // };

    return(
        <section>

            {/* <!-- Slider --> */}
            <div class="carousel slide" id="mainSlide">
                <div class="carousel-inner mx-auto text-center">
                    <div class="carousel-item active ">
                        <img class="mw-100  mx-auto mh-50 d-block"src={farming1} alt=""/>
                    </div>

                    <div class="carousel-item">
                        <img class="mw-150 mx-auto mh-150 d-block"src={fruits} alt=""/>
                    </div>
                    <a class="carousel-control-prev" href="#mainSlide" role="button" data-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="sr-only">Previous</span>
                    </a>
                    <a class="carousel-control-next" href="#mainSlide" role="button" data-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="sr-only">Next</span>
                    </a>
                </div>
            </div>

            
            {/* <!-- Content --> */}
            <div class="container-fluid p-5">
                <h1 class="bg-light p-5" id="projectAnchor">Transactions </h1>
                
                {/* <!-- cards --> */}
                <div class="card-deck">

                    <div class="card">
                        <img class="card-img-top" src="./images/projects-macbook-stats.jpg" alt=""/>
                        <div class="card-body">
                            <h6 class="card-title">Initialize Ledger</h6>
                            <p class="card-text ">For the purpose of this App populate the Ledger</p>

                        </div>
                        <p class="text-center"><a href="/initLedger" class="btn btn-small btn-primary" >Initialize Ledger</a></p>
                    </div>

                    <div class="card">
                        <img class="card-img-top" src="./images/projects-macbook-stats.jpg" alt=""/>
                        <div class="card-body">
                            <h6 class="card-title">Create Asset</h6>
                            <p class="card-text ">Create an asset that you harvested</p>
   
                        </div>
                        <p class="text-center"><a href="/createAsset" class="btn btn-small btn-primary" >Create</a></p>
                    </div>
                    <div class="card ">
                        <img class="card-img-top" src="./images/projects-macbook-stats.jpg" alt=""/>
                        <div class="card-body">
                            <h6 class="card-title">Update Asset</h6>
                            <p class="card-text ">Upadate an asset</p>

                        </div>
                        <p class="text-center"><a href="/farmerFrontPage/updateAsset" class="btn btn-small btn-primary" >Update</a></p>
                    </div>
                    <div class="card ">
                        <img class="card-img-top" src="./images/projects-macbook-stats.jpg" alt=""/>
                        <div class="card-body">
                            <h6 class="card-title">Delete Asset</h6>
                            <p class="card-text ">Delete an asset</p>

                        </div>
                        <p class="text-center"><a href="/farmerFrontPage/deleteAsset" class="btn btn-small btn-primary" >Delete</a></p>
                    </div>


                    <div class="card">
                        <img class="card-img-top" src="./images/projects-macbook-stats.jpg" alt=""/>
                        <div class="card-body">
                            <h6 class="card-title">Set Price for an asset</h6>
                            <p class="card-text ">Sets the price for the asset on owners implicit collection</p>

                        </div>
                        <p class="text-center"><a href="/farmerFrontPage/setPrice" class="btn btn-small btn-primary" >Set Price</a></p>
                    </div>

                    <div class="card bg-danger">
                        <img class="card-img-top" src="./images/projects-robodog.jpg" alt=""/>
                        <div class="card-body">
                            <h6 class="card-title">Transfer Asset</h6>
                            <p class="card-text ">You can Transfer Asset</p>
 
                        </div>
                        <p class="text-center"><a href="/farmerFrontPage/transferRequestedAsset" class="btn btn-small btn-primary" >Transfer asset</a></p>
                    </div>
                    
                </div> 
                
            </div> 
            <div class="container-fluid p-5">
                <h1 class="bg-light p-5" id="queriesAnchor">Queries</h1>
                
                {/* <!-- cards --> */}
                <div class="card-deck">

                   
                    <div class="card ">
                        <img class="card-img-top " src="./images/projects-macbook-stats.jpg" alt=""/>
                        <div class="card-body">
                            <h6 class="card-title">Search Asset</h6>
                            <p class="card-text ">See if an asset Exists</p>

                        </div>
                        <p class="text-center"><a href="/farmerFrontPage/assetExists" class="btn btn-small btn-primary" >Search asset</a></p>
                    </div>
                    <div class="card">
                        <img class="card-img-top" src="./images/projects-coding-sunset.jpg" alt=""/>
                        <div class="card-body">
                            <h6 class="card-title">Read Asset Details</h6>
                            <p class="card-text ">You can read the details of available asset</p>

                        </div>
                        <p class="text-center"><a href="/farmerFrontPage/readAsset" class="btn btn-small btn-primary">Read Asset</a></p>
                    </div>

                    <div class="card bg-danger">
                        <img class="card-img-top" src="./images/projects-robodog.jpg" alt=""/>
                        <div class="card-body">
                            <h6 class="card-title">Read buy request</h6>
                            <p class="card-text ">You can Read buy request from Retailers</p>

                        </div>
                        <p class="text-center"><a href="/farmerFrontPage/readBuyRequest" class="btn btn-small btn-primary" >Read Request</a></p>
                    </div>
                    <div class="card ">
                        <img class="card-img-top" src="./images/projects-robodog.jpg" alt=""/>
                        <div class="card-body">
                            <h6 class="card-title">Asset History</h6>
                            <p class="card-text ">You can Read asset history</p>

                        </div>
                        <p class="text-center"><a href="/farmerFrontPage/getAssetHistory" class="btn btn-small btn-primary" >Get Asset History</a></p>
                    </div>
                    <div class="card">
                        <img class="card-img-top" src="./images/projects-robodog.jpg" alt=""/>
                        <div class="card-body">
                            <h6 class="card-title">Available Products</h6>
                            <p class="card-text ">Here are the Available Products</p>

                        </div>
                        <p class="text-center"><a href="/farmerFrontPage/getAllAssets" class="btn btn-small btn-primary" >More info</a></p>
                    </div>

                    
                </div> 
                
            </div> 
            
        </section>
    );
}

export default FarmerFrontPage;