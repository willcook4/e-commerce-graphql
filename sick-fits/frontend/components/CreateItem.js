import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';

import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';


const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $image: String
    $price: Int!
    $largeImage: String
    ) {
      createItem (
        title: $title
        description: $description
        price: $price 
        image: $image
        largeImage: $largeImage
      ) {
        id
      }
  }
`;

class CreateItem extends Component {
  state = {
    // title: '',
    // description: '',
    // image: '',
    // largeImage: '',
    // price: 0
    title: 'Cool Shoes',
    description: 'I love those shoes',
    image: 'dog.jpg',
    largeImage: 'large-dog.jpg',
    price: 1000
  };

  handleChange = (e) => {
    const  { name, type, value } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({[name]: val});
  } 


  uploadFile = async(e) => {
    console.log('uploading file...')
    const files = e.target.files;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'sickfits');

    const resp = await fetch('https://api.cloudinary.com/v1_1/ds9ilvxm8/image/upload', { method: 'POST', body: data })
    const file = await resp.json();
    console.log('file: ', file)
    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url
    });
  }

  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
      {(createItem, { loading, error }) => (
        <Form onSubmit={async (e) => {
          // Stop the form from submitting
          e.preventDefault();
          // Call the mutation
          const resp = await createItem();
          // Direct the user to the single item page
          console.log(resp)
          Router.push({
            pathname: '/item',
            query: { id: resp.data.createItem.id }
          })
        }}>
          <h2>Sell an Item.</h2>
          <Error error={error} />

          <fieldset disabled={loading} aria-busy={loading}>
            <label htmlFor='file'>
              Image
              <input
                type="file"
                id="file"
                name="file"
                placeholder="Upload an image"
                required
                onChange={this.uploadFile} />
            </label>

            {this.state.image && <img width='200' src={this.state.image} alt="Upload preview" />}

            <label htmlFor='title'>
              Title
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Title"
                required
                value={this.state.title}
                onChange={this.handleChange} />
            </label>

            <label htmlFor='price'>
              Price
              <input
                type="text"
                id="price"
                name="price"
                placeholder="Price"
                required
                value={this.state.price}
                onChange={this.handleChange} />
            </label>

            <label htmlFor='description'>
              Price
              <textarea
                id="description"
                name="description"
                placeholder="Enter A Description"
                required
                value={this.state.description}
                onChange={this.handleChange} />
            </label>

            <button type='submit'>Submit</button>
          </fieldset>
        </Form>
       )}
       </Mutation>
    );
  }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };
 