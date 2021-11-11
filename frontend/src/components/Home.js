import React from 'react';
import farmerImage from '../images/farmers.jpg';
import retailerImage from '../images/retailers.jpg';
import supermarketImage from '../images/supermarket.jpg';
import slide from "../images/slide-mountains.jpg"
function Home() {
    return(
        <section>
            <div class="carousel" id="mainSlide">
                <div class="carousel-inner">
                <img class="w-100 d-block"src={slide} alt=""/>
                </div>
            </div>
            <div className="container-fluid">
                <h1 className="mt-5">This is my Project On Hyperledger</h1>
                <p>This site was created using Node JS and React.</p>
            </div>
            <div class="container-fluid p-5">
                <h1 class="bg-light p-5" id="projectAnchor">Here are the users</h1>
            
                {/* <!-- cards --> */}
                <div class="card-deck">
                    <div class="card">
                    <img class="card-img-top" src={farmerImage} alt="" />
                    <div class="card-body">
                        <h6 class="card-title">Farmer</h6>
                        <p class="card-text ">User the app as a farmer</p>
                        <p class="text-center"><a href="/farmerFrontPage" class="btn btn-small btn-primary" >Log In</a></p>
                    </div>
                </div>

                <div class="card">
                    <img class="card-img-top" src={retailerImage} alt=""/>
                    <div class="card-body">
                        <h6 class="card-title">Retailer</h6>
                        <p class="card-text ">Use App as retailer</p>
                        <p class="text-center"><a href="/retailerFrontPage" class="btn btn-small btn-primary">Log In</a></p>
                    </div>
                </div>

                    <div class="card">
                        <img class="card-img-top" src={supermarketImage} alt=""/>
                        <div class="card-body">
                            <h6 class="card-title">SuperMarket</h6>
                            <p class="card-text ">Use the App as a supermarket employee</p>
                            <p class="text-center"><a href="/supermarketFrontPage" class="btn btn-small btn-primary">Log In</a></p>
                        </div>
                    </div>
                </div> 
            </div> 
        </section>
    );
}

export default Home;