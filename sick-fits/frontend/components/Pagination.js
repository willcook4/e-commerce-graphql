import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Head from 'next/head';
import Link from 'next/link';

import { perPage } from '../config';
import PaginationStyles from './styles/PaginationStyles';

const PAGIANTION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`

const Pagination = (props) => (
  <Query query={PAGIANTION_QUERY}>
    {({data, loading, error}) => {
      // if(error) 
      if(loading) return <p>...Loading</p>
      const count = data.itemsConnection.aggregate.count
      const pages = Math.ceil(count / perPage)
      const currentPage = props.page
      
      return (
        <PaginationStyles data-test='pagination'>
          <Head>
            <title>Sick Fits! - Page {currentPage} of {pages}</title>
          </Head>
          <Link
            prefetch
            href={{
              pathname: 'items',
              query: {
                page: currentPage - 1
              }
            }}>
            <a
              className="prev"
              aria-disabled={currentPage <= 1}
            >← Prev</a>
          </Link>
          <p>Page {currentPage} of 
          <span className='total-pages'>{ pages }</span>!</p>
          <p>Count {count} Items Total</p>
          <Link
            prefetch
            href={{
              pathname: 'items',
              query: {
                page: currentPage + 1
              }
            }}>
            <a
              className="next"
              aria-disabled={currentPage >= pages}
            >Next →</a>
          </Link>
        </PaginationStyles>
      )
    }} 
  </Query>
)

export default Pagination;
export { PAGIANTION_QUERY };
