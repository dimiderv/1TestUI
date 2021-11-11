//import React, {useEffect, useState} from 'react';
// import {Link} from 'react-router-dom';
import corn from '../images/corn.png'

import fruits from '../images/fruits.jpg'
 function RetailerFrontPage() {
//     useEffect( () => {
//         fetchItems();
//     }, []);

//     const [items, setItems] = useState([]);

//     const fetchItems = async () => {
//         const data = await fetch('/retailerFrontPage');
//         const items = await data.json();
        

//         setItems(items);
//     };

    return(
        <section>

            {/* <!-- Slider --> */}
            <div class="carousel slide" id="mainSlide">
                <div class="carousel-inner">
                    <div class="carousel-item active">
                        <img class="w-100 d-block"src={corn} alt=""/>
                    </div>
                    <div class="carousel-item">
                        <img class="w-100 d-block"src={fruits} alt=""/>
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



                    <div class="card ">
                        <img class="card-img-top" src="./images/projects-macbook-stats.jpg" alt=""/>
                        <div class="card-body">
                            <h6 class="card-title">Update Asset</h6>
                            <p class="card-text ">Update an asset</p>

                        </div>
                        <p class="text-center"><a href="/retailerFrontPage/updateAsset" class="btn btn-small btn-primary" >Update</a></p>
                    </div>
                    <div class="card">
                        <img class="card-img-top" src="./images/projects-macbook-stats.jpg" alt=""/>
                        <div class="card-body">
                            <h6 class="card-title">Delete Asset</h6>
                            <p class="card-text ">Delete an asset</p>

                        </div>
                        <p class="text-center"><a href="/retailerFrontPage/deleteAsset" class="btn btn-small btn-primary" >Delete</a></p>
                    </div>
                    <div class="card">
                        <img class="card-img-top" src="./images/projects-macbook-stats.jpg" alt=""/>
                        <div class="card-body">
                            <h6 class="card-title">Delete Buy Request</h6>
                            <p class="card-text ">Delete the buy Request after asset transfer.Otherwise you delete the request and Farmer can't see it</p>

                        </div>
                        <p class="text-center"><a href="/retailerFrontPage/deleteBuyRequest" class="btn btn-small btn-primary" >Delete Buy Request</a></p>
                    </div>
                    <div class="card ">
                        <img class="card-img-top" src="./images/projects-macbook-stats.jpg" alt=""/>
                        <div class="card-body">
                            <h6 class="card-title">Request to Buy</h6>
                            <p class="card-text ">Request to Buy and asset from Farmers Org</p>

                        </div>
                        <p class="text-center"><a href="/retailerFrontPage/requestToBuy" class="btn btn-small btn-primary" >RequestToBuy</a></p>
                    </div>
                    <div class="card ">
                        <img class="card-img-top" src="./images/projects-macbook-stats.jpg" alt=""/>
                        <div class="card-body">
                            <h6 class="card-title">Agree to Buy</h6>
                            <p class="card-text ">Agree on price and buy asset from Farmers Org</p>

                        </div>
                        <p class="text-center"><a href="/retailerFrontPage/agreeToBuy" class="btn btn-small btn-primary" >Agree To Buy</a></p>
                    </div>
                    <div class="card bg-danger">
                        <img class="card-img-top" src="./images/projects-macbook-stats.jpg" alt=""/>
                        <div class="card-body">
                            <h6 class="card-title">Set Price for an asset</h6>
                            <p class="card-text ">Sets the price for the asset on owners implicit collection</p>

                        </div>
                        <p class="text-center"><a href="/retailerFrontPage/setPrice" class="btn btn-small btn-primary" >Set Price</a></p>
                    </div>

                    <div class="card bg-danger">
                        <img class="card-img-top" src="./images/projects-robodog.jpg" alt=""/>
                        <div class="card-body">
                            <h6 class="card-title">Transfer Asset</h6>
                            <p class="card-text ">You can Transfer Asset</p>
 
                        </div>
                        <p class="text-center"><a href="/retailerFrontPage/transferRequestedAsset" class="btn btn-small btn-primary" >Transfer asset</a></p>
                    </div>
                    
                </div> 
                
            </div> 
            <div class="container-fluid p-5">
                <h1 class="bg-light p-5" id="queriesAnchor">Queries</h1>
                
                {/* <!-- cards --> */}
                <div class="card-deck">

                   
                    <div class="card bg-danger">
                        <img class="card-img-top " src="./images/projects-macbook-stats.jpg" alt=""/>
                        <div class="card-body">
                            <h6 class="card-title">Search Asset</h6>
                            <p class="card-text ">See if an asset Exists</p>

                        </div>
                        <p class="text-center"><a href="/retailerFrontPage/assetExists" class="btn btn-small btn-primary" >Search asset</a></p>
                    </div>
                    <div class="card">
                        <img class="card-img-top" src="./images/projects-coding-sunset.jpg" alt=""/>
                        <div class="card-body">
                            <h6 class="card-title">Read Asset Details</h6>
                            <p class="card-text ">You can read the details of available asset</p>

                        </div>
                        <p class="text-center"><a href="/retailerFrontPage/readAsset" class="btn btn-small btn-primary">Read Asset</a></p>
                    </div>

                    <div class="card bg-danger">
                        <img class="card-img-top" src="./images/projects-robodog.jpg" alt=""/>
                        <div class="card-body">
                            <h6 class="card-title">Read buy request</h6>
                            <p class="card-text ">You can Read buy request from SuperMarket</p>

                        </div>
                        <p class="text-center"><a href="/retailerFrontPage/readBuyRequest" class="btn btn-small btn-primary" >Read Request</a></p>
                    </div>
                    <div class="card bg-danger">
                        <img class="card-img-top" src="./images/projects-robodog.jpg" alt=""/>
                        <div class="card-body">
                            <h6 class="card-title">Asset History</h6>
                            <p class="card-text ">You can Read asset history</p>

                        </div>
                        <p class="text-center"><a href="/retailerFrontPage/getAssetHistory" class="btn btn-small btn-primary" >Get Asset History</a></p>
                    </div>
                    <div class="card">
                        <img class="card-img-top" src="./images/projects-robodog.jpg" alt=""/>
                        <div class="card-body">
                            <h6 class="card-title">Available Products</h6>
                            <p class="card-text ">Here are the Available Products</p>

                        </div>
                        <p class="text-center"><a href="/retailerFrontPage/getAllAssets" class="btn btn-small btn-primary" >More info</a></p>
                    </div>

                    
                </div> 

                    
            </div> 
            
            
        </section>
    );
}

export default RetailerFrontPage;