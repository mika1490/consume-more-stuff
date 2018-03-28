import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import CategoryListItem from '../../components/CategoryListItem';
import ConnectedAddEditItemForm from '../AddEditItemForm';

class CategoryList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayAddForm: false,
      redirectToImage: false,
      search: ``
    };
  }

  componentDidMount() {
    window.addEventListener(`scroll`, this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener(`scroll`, this.handleScroll);
  }

  displayAddForm(event) {
    this.setState({
      displayAddForm: true
    });
  }

  hideAddForm(event) {
    setTimeout(() => {
      this.setState({
        displayAddForm: false,
      });
    }, 500);
    document.getElementById(`add_edit_item_form`).className += ` fadeout`;
  }

  handleRedirectAfterAdd(id) {
    this.setState({ redirectToImage: id });
  }

  updateSearch(event) {
    this.setState({
      search: event.target.value
    });
  }

  reset() {
    this.setState({
      search: ``
    });
  }

  handleScroll() {
    const header = document.getElementById(`category_header`);
    const fader = document.getElementById(`fade_out`);
    const height = window.innerHeight;
    const scrollPosition = window.scrollY;

    fader.style.opacity = 1 - (height - scrollPosition) / height;

    if (scrollPosition >= height && !header.className.includes(`sticky`)) {
      header.className += ` sticky`;
    }

    if (scrollPosition < height) {
      header.className = `category_header`;
    }
  }

  render() {
    if (this.state.redirectToImage) {
      return <Redirect to={`/items/${this.state.redirectToImage}`} />
    }

    const currentCategory = this.props.match.params.category;
    const aboutParagraph = `We are a curator of design, taste and style in the luxury lifestyle market, offering furniture, lighting, art, jewelry and scarves. Our collection of timeless, updated classics provide a unique point of view and an unmatched combination of inspired design and unparalleled quality.`;
    
    if (!this.props.categories.includes(currentCategory)) {
      return <Redirect to='/' />;
    }
    
    const items = this.props.items.filter(item => item.category === currentCategory)
    .filter(item => {
      return item.title.indexOf(this.state.search) !== -1 || item.description.indexOf(this.state.search) !== -1
    });
    const url = `https://s3-us-west-1.amazonaws.com/consume.more.stuff.image.bucket/${currentCategory}.jpg`;


    return (
      <div className='category_list_container'>
        {this.state.displayAddForm && <div className="form-bg" id='add_edit_item_form'>
          <ConnectedAddEditItemForm 
            hideForm={this.hideAddForm.bind(this)} 
            redirectAfterAdd={this.handleRedirectAfterAdd.bind(this)} 
            currentCategory={currentCategory}
          /></div>}
        <div id='main_image'
          className='category_main_image'
          style={{ backgroundImage: `url(${url})` }}>
        </div>
        <div id='fade_out' className='fade_out'></div>
        <div className='category_spacer'>
          <div className='category_information_container'>
            <h2>{currentCategory}</h2>
            <p>{aboutParagraph}</p>
          </div>
        </div>
        <div id='category_header' className='category_header'>
          <span className='all_items_button' onClick={this.reset.bind(this)}>all items</span>
          {localStorage.getItem(`user_id`) && <span className='add_item_button' onClick={this.displayAddForm.bind(this)}>add item</span>}
          <input className='search_bar' type='text' placeholder={`Search through ${currentCategory}...`} value={this.state.search} onChange={this.updateSearch.bind(this)} />
        </div>
        <div className='category_list_items_container'>
          {items.map(item =>
            <CategoryListItem key={item.id} item={item} />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    items: state.items.items,
    categories: state.items.categories,
  }
}

const mapDispatchToProps = dispatch => {
  return {
  }
}

const ConnectedCategoryList = connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoryList);

export default ConnectedCategoryList;