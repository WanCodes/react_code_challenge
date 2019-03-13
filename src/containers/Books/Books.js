import React, { Component } from 'react';
import axios from 'axios';

class Books extends Component {

    state = {
        books: [],
        searchTerm:""
    }

    componentDidMount() {
        this.loadData();
    }

    loadData(){
        axios.get('https://jsonplaceholder.typicode.com/posts').then(res => {
            console.log(res);
            this.setState({books: res.data});
        })
    }
    
    onSearch = (event) => {
        this.setState({searchTerm: event.target.value});
    }

    render() {
        let bookList = null;
        bookList = this.state.books.filter(book => book.title.includes(this.state.searchTerm)).map(book => {
            return <li key={book.id}>{book.title}</li>
        })

        return (
            <div>
                <input value={this.state.searchTerm} onChange={this.onSearch}/>
                <ul>
                    {bookList}
                </ul>
            </div>
        );
    }
}

export default Books;