import React, {useEffect, useState} from 'react';
// import {Link} from 'react-router-dom';
import Error from '../Templates/Error';
//import PrintAssets from '../Templates/PrintAssets';


function DeleteAsset(props) {

    let back;//link to go back to home page 
    if(props.org==="org1"){
       back="/farmerFrontPage"; //assigning values like this doesnt work
    }else if (props.org==="org2"){
        back="/retailerFrontPage";
    }else{
        back="/supermarketFrontPage";
    }


  //  const [items, setItems] = useState([]);

    const [formInputID,setFormInputID]=useState('');
    const [postReply, setPostReply] = useState([]);

    useEffect( () => {     
        
 
        fetchPostReply();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function fetchPostReply ()  {


        const formData={
            assetID:formInputID,
            org:props.org
        }
      
       
        const options={
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(formData)
        };  
        
        //cant fetch any data if everythign is not in place
        if(formData.assetID !=="" ){
            //setPostReply([]);
            const response = await fetch('/postDeleteAsset',options);
            const json = await response.json();
            setPostReply(json); 
            console.log(json);
        }
 
        

    };


    


    return(
        <div className="container justify-content-center p-5 ">
            <h1 className="mt-5">Delete Asset</h1>
        
            <div className="form-group w-25 mx-auto">
                <label htmlFor="assetID" className="col-form-label mx-auto">Asset ID {formInputID}</label>
                {/* col-xs-3 */}
                <div className="col-sm-10 w-10 mx-auto">
                <input type="text" className="form-control " required onChange={e=>setFormInputID(e.target.value)} id="assetID" placeholder="asset#"/>
                </div>
            </div>
    
            <div className="form-group row d-block">
                <div className="col-sm-12">
                    <button type="submit" value="Send" onClick={fetchPostReply} className="btn btn-primary">Delete</button>
                    {/* onClickCapture also worked */}
                </div>
            </div>
        
    
            <div>
                {postReply.success==="true" ? (
                    
                        <Error message="Asset was deleted successfully." backlink={back} />
                ) : postReply.errorCLI?(
                        <Error message={" Error with status "+postReply.errorStatus+". "+postReply.errorMessage[0].toUpperCase()+postReply.errorMessage.slice(1)+"."}backlink={back} />
                ):postReply.exists==="false"?(
                        <Error message="Asset doesn't exist." backlink={back} />
                ):(
                        <Error message="Plese enter assetID to continue or go back" backlink={back} />
                )
                
                }
            </div>
    
        </div>
    );

    // if(items.success==="true"){
    //     return(
            
            
    //         <Error message="Asset deleted successfully." backlink={back} />
            
            
    //     );
    // }else if(items.exists==="false"){
    //     return(
    //         <Error message="Asset does not exist.Make sure the ID is correct" backlink={back} />
    //     );
        
    // }

    // return(
    //     <div>
            
    //         <Error message="Couldn't delete asset. Not the owner." backlink={back} />
    //     </div>
    // );




}

export default DeleteAsset;