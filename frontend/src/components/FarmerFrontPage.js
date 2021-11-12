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
            <div className="carousel slide" id="mainSlide">
                <div className="carousel-inner mx-auto text-center">
                    <div className="carousel-item active ">
                        <img className="mw-100  mx-auto mh-50 d-block"src={farming1} alt=""/>
                    </div>

                    <div className="carousel-item">
                        <img className="mw-150 mx-auto mh-150 d-block"src={fruits} alt=""/>
                    </div>
                    <a className="carousel-control-prev" href="#mainSlide" role="button" data-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="sr-only">Previous</span>
                    </a>
                    <a className="carousel-control-next" href="#mainSlide" role="button" data-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="sr-only">Next</span>
                    </a>
                </div>
            </div>

            
            {/* <!-- Content --> */}
            <div className="container-fluid p-5">
                <h1 className="bg-light p-5" id="projectAnchor">Transactions </h1>
                
                {/* <!-- cards --> */}
                <div className="card-deck">

                    <div className="card">
                        <img className="card-img-top" src="./images/projects-macbook-stats.jpg" alt=""/>
                        <div className="card-body">
                            <h6 className="card-title">Initialize Ledger</h6>
                            <p className="card-text ">For the purpose of this App populate the Ledger</p>

                        </div>
                        <p className="text-center"><a href="/initLedger" className="btn btn-small btn-primary" >Initialize Ledger</a></p>
                    </div>

                    <div className="card">
                        <img className="card-img-top" src="./images/projects-macbook-stats.jpg" alt=""/>
                        <div className="card-body">
                            <h6 className="card-title">Create Asset</h6>
                            <p className="card-text ">Create an asset that you harvested</p>
   
                        </div>
                        <p className="text-center"><a href="/createAsset" className="btn btn-small btn-primary" >Create</a></p>
                    </div>
                    <div className="card ">
                        <img className="card-img-top" src="./images/projects-macbook-stats.jpg" alt=""/>
                        <div className="card-body">
                            <h6 className="card-title">Update Asset</h6>
                            <p className="card-text ">Upadate an asset</p>

                        </div>
                        <p className="text-center"><a href="/farmerFrontPage/updateAsset" className="btn btn-small btn-primary" >Update</a></p>
                    </div>
                    <div className="card ">
                        <img className="card-img-top" src="./images/projects-macbook-stats.jpg" alt=""/>
                        <div className="card-body">
                            <h6 className="card-title">Delete Asset</h6>
                            <p className="card-text ">Delete an asset</p>

                        </div>
                        <p className="text-center"><a href="/farmerFrontPage/deleteAsset" className="btn btn-small btn-primary" >Delete</a></p>
                    </div>


                    <div className="card">
                        <img className="card-img-top" src="./images/projects-macbook-stats.jpg" alt=""/>
                        <div className="card-body">
                            <h6 className="card-title">Set Price for an asset</h6>
                            <p className="card-text ">Sets the price for the asset on owners implicit collection</p>

                        </div>
                        <p className="text-center"><a href="/farmerFrontPage/setPrice" className="btn btn-small btn-primary" >Set Price</a></p>
                    </div>

                    <div className="card bg-danger">
                        <img className="card-img-top" src="./images/projects-robodog.jpg" alt=""/>
                        <div className="card-body">
                            <h6 className="card-title">Transfer Asset</h6>
                            <p className="card-text ">You can Transfer Asset</p>
 
                        </div>
                        <p className="text-center"><a href="/farmerFrontPage/transferRequestedAsset" className="btn btn-small btn-primary" >Transfer asset</a></p>
                    </div>
                    
                </div> 
                
            </div> 
            <div className="container-fluid p-5">
                <h1 className="bg-light p-5" id="queriesAnchor">Queries</h1>
                
                {/* <!-- cards --> */}
                <div className="card-deck">

                   
                    <div className="card ">
                        <img className="card-img-top " src="./images/projects-macbook-stats.jpg" alt=""/>
                        <div className="card-body">
                            <h6 className="card-title">Search Asset</h6>
                            <p className="card-text ">See if an asset Exists</p>

                        </div>
                        <p className="text-center"><a href="/farmerFrontPage/assetExists" className="btn btn-small btn-primary" >Search asset</a></p>
                    </div>
                    <div className="card">
                        <img className="card-img-top" src="./images/projects-coding-sunset.jpg" alt=""/>
                        <div className="card-body">
                            <h6 className="card-title">Read Asset Details</h6>
                            <p className="card-text ">You can read the details of available asset</p>

                        </div>
                        <p className="text-center"><a href="/farmerFrontPage/readAsset" className="btn btn-small btn-primary">Read Asset</a></p>
                    </div>

                    <div className="card bg-danger">
                        <img className="card-img-top" src="./images/projects-robodog.jpg" alt=""/>
                        <div className="card-body">
                            <h6 className="card-title">Read buy request</h6>
                            <p className="card-text ">You can Read buy request from Retailers</p>

                        </div>
                        <p className="text-center"><a href="/farmerFrontPage/readBuyRequest" className="btn btn-small btn-primary" >Read Request</a></p>
                    </div>
                    <div className="card ">
                        <img className="card-img-top" src="./images/projects-robodog.jpg" alt=""/>
                        <div className="card-body">
                            <h6 className="card-title">Asset History</h6>
                            <p className="card-text ">You can Read asset history</p>

                        </div>
                        <p className="text-center"><a href="/farmerFrontPage/getAssetHistory" className="btn btn-small btn-primary" >Get Asset History</a></p>
                    </div>
                    <div className="card">
                        <img className="card-img-top" src="./images/projects-robodog.jpg" alt=""/>
                        <div className="card-body">
                            <h6 className="card-title">Available Products</h6>
                            <p className="card-text ">Here are the Available Products</p>

                        </div>
                        <p className="text-center"><a href="/farmerFrontPage/getAllAssets" className="btn btn-small btn-primary" >More info</a></p>
                    </div>

                    
                </div> 
                
            </div> 
            
        </section>
    );
}

export default FarmerFrontPage;