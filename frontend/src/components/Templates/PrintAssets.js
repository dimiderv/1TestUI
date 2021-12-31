function PrintAssets(props) {

    
    // return(
    //     <div className="container-fluid p-3 w-50">
    //         <div className="card-deck">
    //             <div className="card">
    //                 <div className="card-body p-1">
    //                     <h6 className="card-title">{props.ID}</h6>
    //                     <p className="card-text">{props.color}</p>
    //                     <p className="card-text"><i>weight {props.weight}</i></p>
    //                     <p className="card-text"><i>Owner  {props.owner}</i></p>
    //                     <p className="card-text"><i>Creator {props.creator}</i></p>
    //                     <p className="card-text"><i>Expires {props.expirationDate}</i></p>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>

    // );
    return(
    <div className="card p-1 m-2  " style={{width:23+"em"}}>
        <div className="col-sm">
            <div className="card-body ">
                <h4 className="card-header mb-2"> {props.ID} </h4>
                <p className="card-text "> Color : {props.color}. </p>
                <p className="card-text"> Weight (Kg) : {props.weight}. </p>
                <p className="card-text"> Owner : {props.owner}. </p>
                <p className="card-text "> Creator : {props.creator}. </p>
                <p className="card-text"> Exiration : {props.expirationDate}. </p>
                <button className="btn btn-primary"> View </button>
            </div>
        </div>
    </div>
    )


}

export default PrintAssets;