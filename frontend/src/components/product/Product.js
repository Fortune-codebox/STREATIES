 import React from 'react';

 import {Link} from 'react-router-dom'
 import './product.css'
 
 const Product = ({product, col}) => {
   return (
    <div className={`col-sm-12 col-md-6 col-lg-${col} my-3`}>
    <div className="card p-3  productDiv">
        <img
        className="card-img-top mx-auto"
        alt="No Internet"
        src={product.images[0].url}
        />
        <div className="card-body d-flex flex-column">
        <p className="card-title">
            <Link to={`/product/${product._id}`}>{product.name.length > 33 ? product.name.substring(0,33)  + `...` : product.name.substring(0,33)} </Link>
        </p>
        <span style={{fontSize: '11px'}}><small>{`Category: ${product.category.name}`}</small></span>
        <div className="ratings mt-0">
            <div className="rating-outer">
            <div className="rating-inner" style={{width: `${(product.ratings / 5) * 100}%`}}></div>
            </div>
            <span id="no_of_reviews"><small>({product.numOfReviews} Reviews)</small></span>
        </div>
        <p className="card-text">${product.price}</p>
        <Link to={`/product/${product._id}`} id="view_btn" className="btn button-shadow">View Details</Link>
        </div>
    </div>
    </div>
   )
 }
 
 export default Product
 