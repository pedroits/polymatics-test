import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { fetchProducts, setPageInfo } from '../slices/product';

import styles from './ProductList.module.css';

export function ProductList() {
    const productResponse = useSelector(state => state.products.productResponse);
    const loading = useSelector(state => state.products.loading);
    const dispatch = useDispatch();

    const [count, setCount] = useState([]);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [])

    useEffect(() => {
        if(productResponse?.products){
            setCount([...new Set(count.concat(productResponse?.products?.map(p => p.id)))])
        }
    }, [productResponse])

    return (
        <div>
            <div className={styles.row}>
                { productResponse?.prevPage && <button className={styles.button} aria-label="Previous Page" onClick={() => dispatch(setPageInfo(productResponse?.prevPage))}>
                    Prev Page
                </button>}
                { productResponse?.nextPage &&
                <button className={styles.button} aria-label="Next Page" onClick={() => dispatch(setPageInfo(productResponse?.nextPage))}>
                    Next Page
                </button>}
            </div>

            <div className={styles.row}>
                {!loading
                ? <span>Total Unique Products Fetched: {count.length}</span>
                : <span>Loading...</span>
                }
            </div>

            {productResponse?.products &&
            <div className={styles.row}>
                <table className={styles.table}>
                    <tr className={styles.tr}>
                        <th className={styles.th}>ID</th>
                        <th className={styles.th}>Title</th>
                        <th className={styles.th}>Vendor</th>
                        <th className={styles.th}>Variants</th>
                    </tr>
                    {productResponse?.products?.map(p =>{
                        return (
                            <tr className={styles.tr}>
                                <td className={styles.th}>{p.id}</td>
                                <td className={styles.th}>{p.title}</td>
                                <td className={styles.th}>{p.vendor}</td>
                                <td className={styles.th}>{p.variants.map(v => v.title).join(' / ')}</td>
                            </tr>
                        )
                    })}
                </table>
            </div>}
        </div>
    );
}
