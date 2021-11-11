function PrintAssets(props) {

    
    return(
        <div className="container-fluid p-3 w-50">
            <div className="card-deck">
                <div className="card">
                    <div className="card-body p-1">
                        <h6 className="card-title">{props.ID}</h6>
                        <p className="card-text">{props.color}</p>
                        <p className="card-text"><i>weight {props.weight}</i></p>
                        <p className="card-text"><i>Owner  {props.owner}</i></p>
                        <p className="card-text"><i>Creator {props.creator}</i></p>
                        <p className="card-text"><i>Expires {props.expirationDate}</i></p>
                    </div>
                </div>
            </div>
        </div>

    );


}

export default PrintAssets;