 import React, { Fragment, useState, useEffect } from 'react';
 import MetaData from './layout/MetaData';
 import Pagination from 'react-js-pagination';
 import { useParams } from "react-router-dom";
 
 import Product from './product/Product'

 import {useDispatch, useSelector} from 'react-redux'
 import {getProducts} from '../actions/productActions'
 import {getCategories, getSubCategories} from '../actions/categoryActions'
 import Loader from './layout/Loader'
 import {useAlert} from 'react-alert';
 import Slider from 'rc-slider'
 import 'rc-slider/assets/index.css';

import AOS from "aos";
import "aos/dist/aos.css";
AOS.init({duration: 2000});


 const { createSliderWithTooltip } = Slider;
 const Range = createSliderWithTooltip(Slider.Range);
 
 const Home = () => {

    const {categories} = useSelector(state => state.categories)
    const {subCategories} = useSelector(state => state.subCategories)

    const [currentPage, setCurrenPage] = useState(1);
    const [price, setPrice] = useState([1, 1000]);
    const [category, setCategory] = useState('')
    const [subCategory, setSubCategory] = useState('');
    const [rating, setRating] = useState(0)


    
    const alert = useAlert();
    const dispatch = useDispatch();
    const {keyword} = useParams()

    const {loading, products, error, productsCount, resPerPage, filteredProductsCount} = useSelector(state => state.products)
    

    useEffect(() => {
        if(error) {
           return alert.error(error)
        } 

        dispatch(getProducts(currentPage, keyword, price, category, subCategory, rating))
        dispatch(getCategories())
        dispatch(getSubCategories())

    },[dispatch, alert, error, currentPage, keyword, price, category, subCategory, rating])

    function setCurrentPageNo (pageNumber) {
        setCurrenPage(pageNumber)
    }

    let count = productsCount;
    if(keyword) {
        count = filteredProductsCount
    }

   return (
     <Fragment>

         {loading ? <Loader /> : (
             <Fragment>
                 <MetaData title={'Buy Best Products Online'} />
                <h3 id="products_heading">Latest Products</h3>

                <section data-aos="fade-up" id="products" className="container mt-5">
                <div className="row">

                    {keyword ? (
                        <Fragment>
                            <div className='col-6 col-md-3 mt-2 mb-5'>

                            <div className="my-shadow search-sidebar">
                                        <p className="mb-3">
                                            Ratings
                                        </p>
                                        <ul className="pl-0">
                                            {[5,4,3,2,1].map(star => (
                                                 <li 
                                                 style={{cursor: 'pointer', listStyleType: 'none'}}
                                                 key={star}
                                                 onClick={() => setRating(star)}
                                                 >
                                                   <div className="rating-outer">
                                                       <div className="rating-inner"
                                                       style={{
                                                           width:  `${star * 20}%`
                                                       }}
                                                       >

                                                       </div>
                                                   </div>
                                                 </li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    <hr />

                                    <div className="my-shadow search-sidebar">
                                        <p className="mb-3">
                                            Categories
                                        </p>
                                        <ul className="pl-0">
                                            {categories && categories.map(category => (
                                                 <li 
                                                 style={{cursor: 'pointer', listStyleType: 'none'}}
                                                 key={category._id}
                                                 onClick={() => setCategory(category._id)}
                                                 >
                                                    <small>
                                                    {category.name}
                                                    </small> 
                                                 </li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    <hr />

                                    <div className="mt-2 my-shadow search-sidebar">
                                        <p className="mb-3">
                                            SubCategories
                                        </p>
                                        <ul className="pl-0">
                                            {subCategories && subCategories.map(subCategory => (
                                                 <li 
                                                 style={{cursor: 'pointer', listStyleType: 'none'}}
                                                 key={subCategory._id}
                                                 onClick={() => setSubCategory(subCategory._id)}
                                                 >
                                                   <small>
                                                   {subCategory.name}
                                                   </small> 
                                                 </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <hr />

                                   

                                    
                                <div className="mt-5">
                                    <Range
                                       marks={{
                                           1: `$1`,
                                           1000: `$1000`
                                       }}
                                       min={1}
                                       max={1000}
                                       defaultValue={[1, 1000]}
                                       tipFormatter={value => `$${value}`}
                                       tipProps={{
                                           placement: "top",
                                           visible: true
                                       }}
                                       value={price}
                                       onChange={price => setPrice(price)}
                                    />
                                     </div>
                                    <hr className='my-5' />

                                    
                                    
                               
                            </div>
                            
                            <div className="col-6 col-md-9"> 
                                    <div className="row">
                                         {
                                              products && products.map(product => {
                                                return <Product key={product._id} product={product} col={4} />
                            
                                                })
                                         }
                                    </div>
                            </div>

                        </Fragment>
                    ): (
                        products && products.map(product => {
                            return <Product key={product._id} product={product} col={3} />
        
                            })
                    )}

                    
                    
                
                </div>
                </section>
               {resPerPage <= count && (
                   <div className="d-flex justify-content-center mt-5 ">
                <small >
                    <Pagination
                    activePage={currentPage}
                    itemsCountPerPage={resPerPage}
                    totalItemsCount = {productsCount}
                    onChange={setCurrentPageNo}
                    nextPageText={'next >>'}
                    prevPageText={'<< prev'}
                    firstPageText={'first'}
                    lastPageText={'last'}
                    itemClass="page-item my-shadow"
                    linkClass="page-link"
                   />
                </small>
                 
           </div>
               )}
                
                 
             </Fragment>
         ) }
        
</Fragment >
   )
 }
 
 export default Home
 