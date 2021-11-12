import React from 'react';
import farmerImage from '../images/farmers.jpg';
import retailerImage from '../images/retailers.jpg';
import supermarketImage from '../images/supermarket.jpg';
import slide from "../images/slide-mountains.jpg"
function Home() {
    return(
        <section>
            <div className="carousel" id="mainSlide">
                <div className="carousel-inner">
                <img className="w-100 d-block"src={slide} alt=""/>
                </div>
            </div>
            <div className="container-fluid">
                <h1 className="mt-5">This is my Project On Hyperledger</h1>
                <p>This site was created using Node JS and React.</p>
            </div>
            <div className="container-fluid p-5">
                <h1 className="bg-light p-5" id="projectAnchor">Here are the users</h1>
            
                {/* <!-- cards --> */}
                <div className="card-deck">
                    <div className="card">
                    <img className="card-img-top" src={farmerImage} alt="" />
                    <div className="card-body">
                        <h6 className="card-title">Farmer</h6>
                        <p className="card-text ">User the app as a farmer</p>
                        <p className="text-center"><a href="/farmerFrontPage" className="btn btn-small btn-primary" >Log In</a></p>
                    </div>
                </div>

                <div className="card">
                    <img className="card-img-top" src={retailerImage} alt=""/>
                    <div className="card-body">
                        <h6 className="card-title">Retailer</h6>
                        <p className="card-text ">Use App as retailer</p>
                        <p className="text-center"><a href="/retailerFrontPage" className="btn btn-small btn-primary">Log In</a></p>
                    </div>
                </div>

                    <div className="card">
                        <img className="card-img-top" src={supermarketImage} alt=""/>
                        <div className="card-body">
                            <h6 className="card-title">SuperMarket</h6>
                            <p className="card-text ">Use the App as a supermarket employee</p>
                            <p className="text-center"><a href="/supermarketFrontPage" className="btn btn-small btn-primary">Log In</a></p>
                        </div>
                    </div>
                </div> 
            </div> 
        </section>
    );
}

export default Home;