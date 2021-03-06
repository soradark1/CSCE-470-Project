import React from 'react';
import '../styles/NavigationBar.scss';
import { Link, Redirect } from 'react-router-dom';
import {findDOMNode} from 'react-dom';
//https://gist.github.com/wassname/6bd1d58a31afbf960cbd35e3fc92be5a

export default class NavigationBar extends React.Component {
  constructor(props) {
    super(props);

  }


  getTitles(docs){
    let titles = []
    for (var i = 0; i < docs.length; i++) {
      titles.push(docs[i].title[0]);
    }
    return titles;
  }
  getIds(docs){
    let ids = []
    for (var i = 0; i < docs.length; i++) {
      ids.push(docs[i].id);
    }
    return ids;
  }
    
  getSummary(docs){
      let summary = ""
      summary = docs[0].summary[0]
      
      return summary;
  }


  updateURL(event){
    event.preventDefault()
    var query = findDOMNode(this.refs.searchBar).value.trim();
    this.props.setQuery(query); //http://localhost:8983/solr/ps4_games/select?fl=title,id&q=title:Kingdom
    var url = 'http://localhost:8983/solr/ps4_games/select?fl=title,summary,id&q=title:' + this.props.formatQuery(query) + '&rows=10'

    fetch(url)
     .then((response) => response.json())
     .then((responseJson) => {
       //console.log( responseJson.response.docs);
       this.props.setMyJSON(responseJson.response.docs);
       let titles = this.getTitles(this.props.myjson);
       let summary = this.getSummary(this.props.myjson);
       this.props.setSummary(summary);
       this.props.setTitles(titles);
       let ids = this.getIds(this.props.myjson);
       this.props.setDocIDs(ids);
       this.props.history.push(`/recommendation`)
       return responseJson
     })
     .catch((error) => {
        console.error(error);
      });
  }







  render() {
    return (
      <div>
      {console.log("Nav Props",this.props)}
        <input
          ref="searchBar"
          type="text"
          placeholder="Search for recommendation"
        />
        <button onClick={this.updateURL.bind(this)}>
          Search
        </button>
      </div>
    );
  }
}
